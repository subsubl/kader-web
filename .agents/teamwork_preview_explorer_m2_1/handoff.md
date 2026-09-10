# Handoff Report: High-Performance API Caching & Optimization Strategy

**Author**: Explorer 1 (`teamwork_preview_explorer_m2_1`)  
**Target Recipient**: Orchestrator / Implementer  
**Milestone**: Milestone 2 — High-Performance API Caching & Optimization  
**Date**: 2026-09-10  

---

## 1. Observation

1. **Nitro Environment & `defineCachedEventHandler` Limitations**:
   - In `node_modules/nitropack/dist/runtime/internal/cache.mjs` lines 267–282:
     ```javascript
     const cacheControl = [];
     if (opts.swr) {
       if (opts.maxAge) {
         cacheControl.push(`s-maxage=${opts.maxAge}`);
       }
       if (opts.staleMaxAge) {
         cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
       } else {
         cacheControl.push("stale-while-revalidate");
       }
     } else if (opts.maxAge) {
       cacheControl.push(`max-age=${opts.maxAge}`);
     }
     if (cacheControl.length > 0) {
       headers["cache-control"] = cacheControl.join(", ");
     }
     ```
     When `swr` is configured in Nitro, `cache-control` header is forcibly set to `s-maxage=..., stale-while-revalidate=...`, omitting `public` and `max-age`. Furthermore, line 281 overwrites any existing `cache-control` header set in the inner handler.
   - Storage keys in `node_modules/nitropack/dist/runtime/internal/cache.mjs` lines 29 and 143 use internal path hashes (`_hashedPath = ${pathname}.${hash(_path)}`), preventing direct programmatic invalidation of specific route caches from admin handlers without inspecting or purging unstorage internals.

2. **Current API Endpoints Lack Caching and Resilience**:
   - `src/server/api/site-images.get.ts`: Lines 35–45 read `.data/site_images.json` using synchronous `fs.existsSync` and `fs.readFileSync` on every client request; no `Cache-Control` or `ETag` headers are set.
   - `src/server/api/events.get.ts`: Lines 8–23 perform a live database query to Supabase on every request. On error, line 19 throws `createError({ statusCode: 500, statusMessage: 'Could not load events.' })`. If Supabase is down or credentials are unconfigured, visitors receive an unhandled HTTP 500 error.
   - `src/server/api/menu-config.get.ts`: Queries Supabase `site_settings` on every request without caching, though it implements a fallback catch block at line 32.
   - `src/server/api/ra-events.get.ts`: Synchronously calls `getSyncedRaEvents(scope)` without HTTP caching or conditional GET handling.

3. **TypeScript Compilation Errors**:
   - Executing `npm run typecheck` produced verbatim:
     ```
     Found 26 errors in 16 files.
     Errors Files
          1 src/server/api/admin/calendar-notes.delete.ts:3
          1 src/server/api/admin/calendar-notes.get.ts:3
          1 src/server/api/admin/calendar-notes.post.ts:3
          1 src/server/api/admin/kitchen.get.ts:1
          1 src/server/api/admin/kitchen.patch.ts:1
          4 src/server/api/admin/pnl-export.get.ts:1
          3 src/server/api/admin/pnl.get.ts:1
          3 src/server/api/admin/pnl.post.ts:1
          4 src/server/api/admin/promoters.get.ts:56
          1 src/server/api/admin/tasks-toggle.patch.ts:3
          1 src/server/api/admin/tasks.delete.ts:3
          1 src/server/api/admin/tasks.get.ts:3
          1 src/server/api/admin/tasks.post.ts:3
          1 src/server/api/admin/team-role.patch.ts:3
          1 src/server/api/admin/team.post.ts:3
          1 src/server/api/table-orders.post.ts:1
     Type check failed in 7328ms.
     ```
   - In 15 of the files, `getQuery`, `readBody`, `defineEventHandler`, `setResponseHeader`, and `setResponseStatus` are mistakenly imported from `'#imports'`, which only exposes client Vue composables.
   - In `src/server/api/admin/promoters.get.ts` lines 47–87, the query references non-existent column `rate` on `promoter_commission_rates`, whereas `src/types/database.ts` line 108 defines the column as `rate_per_checkin`.

---

## 2. Logic Chain

1. **Why an explicit helper in `src/server/utils/cache.ts` is required over Nitro routeRules / `defineCachedEventHandler`**:
   - Observation 1 proves that Nitro's `defineCachedEventHandler` overwrites `cache-control` with `s-maxage` instead of `public, max-age` whenever SWR is enabled, failing the contract defined in `PROJECT.md`.
   - Observation 1 also proves that Nitro's internal storage keys are hashed with internal salt/path hashes, making programmatic invalidation from admin endpoints (`admin/site-images.put`, `admin/menu-config.put`, etc.) fragile and prone to desynchronization.
   - Therefore, creating an in-memory caching engine (`src/server/utils/cache.ts`) with deterministic ETag generation, RFC 7232 conditional GET support (304), single-flight deduplication, and direct `invalidateCache(key)` is the only approach that satisfies all requirements.

2. **Why `/api/events` error handling must be redesigned**:
   - Observation 2 demonstrates that any Supabase network blip, slow connection, or credential issue results in a 500 fatal exception on `/api/events`.
   - By routing `/api/events` through `handleCachedJsonRequest` with a fallback default (`[]`), any upstream error will first attempt to serve stale cached events; if no cache exists, it safely returns `[]` (HTTP 200) instead of throwing 500, preserving uptime.

3. **Why fixing the 16 admin files resolves 100% of TypeScript compilation errors**:
   - Observation 3 shows that all 26 errors stem from importing Nitro/H3 request primitives from `#imports` instead of `h3`, plus the `rate` -> `rate_per_checkin` schema mismatch in `promoters.get.ts`.
   - Updating the import statements to `'h3'` and fixing the column property on `promoters.get.ts` completely eliminates all 26 errors.

---

## 3. Caveats

- **Process Memory Scope**: In-memory caching runs within the Node.js server process. If running in a multi-process cluster (e.g. PM2 cluster mode), each process holds its own memory cache. However, since cache TTLs are short (60s to 3600s) and admin mutations typically route to the same instance or can invoke shared invalidation, this is standard and highly performant for this deployment.
- **Upstream Sync Latency**: The RA sync engine (`raSyncEngine.ts`) should be decoupled from the visitor request thread (addressed by Explorer 2) to ensure `/api/ra-events` always reads cached memory/local store data immediately without waiting on RA GraphQL.

---

## 4. Conclusion

1. Implement `src/server/utils/cache.ts` providing:
   - In-memory cache map with `maxAge` and `staleWhileRevalidate`.
   - Single-flight promise coalescing (`singleFlight`).
   - Fast deterministic SHA-1 ETag generation (`"${hash}"`).
   - RFC 7232 compliant conditional check (`isEtagMatch` and `send304`).
   - Programmatic invalidation helper `invalidateCache(keyOrPrefix)`.
2. Refactor the 4 endpoints (`/api/site-images`, `/api/menu-config`, `/api/ra-events`, `/api/events`) to use `handleCachedJsonRequest` with their exact contract headers and fallbacks.
3. Wire `invalidateCache` into all admin mutation endpoints (`admin/site-images.put`, `admin/menu-config.put`, `admin/events.post`, `admin/events.delete`, `admin/ra-events.put`, `admin/sync-ra.post`).
4. Apply the verbatim import and property fixes across the 16 admin files to achieve a clean `npm run typecheck`.

---

## 5. Verification Method

1. **Typecheck Verification**:
   ```bash
   npm run typecheck
   ```
   *Pass criteria*: Exit code 0, 0 errors.

2. **HTTP Header & ETag Verification**:
   ```bash
   # Test site-images
   curl -s -i http://localhost:3000/api/site-images | grep -E -i "cache-control|etag"
   # Expect:
   # cache-control: public, max-age=3600, stale-while-revalidate=86400
   # etag: "<16-char-sha1>"

   # Test conditional GET 304
   ETAG=$(curl -s -i http://localhost:3000/api/site-images | grep -i "etag:" | awk '{print $2}' | tr -d '\r')
   curl -s -i -H "If-None-Match: $ETAG" http://localhost:3000/api/site-images | head -n 1
   # Expect:
   # HTTP/1.1 304 Not Modified
   ```

3. **Programmatic Invalidation Verification**:
   ```bash
   # 1. Fetch current ETag
   ETAG1=$(curl -s -i http://localhost:3000/api/site-images | grep -i "etag:" | awk '{print $2}' | tr -d '\r')
   # 2. Mutate via admin endpoint
   curl -s -X PUT http://localhost:3000/api/admin/site-images -H "Content-Type: application/json" -d '{"home_hero_bg": "/hero-bg-v2.jpg"}'
   # 3. Fetch again
   ETAG2=$(curl -s -i http://localhost:3000/api/site-images | grep -i "etag:" | awk '{print $2}' | tr -d '\r')
   # Expect: ETAG1 != ETAG2
   ```

4. **Events Fallback Verification**:
   - Stop Supabase or supply dummy invalid credentials in `.env`.
   - Request `GET /api/events`.
   - *Pass criteria*: HTTP status 200 with `[]` or cached events, never HTTP 500.
