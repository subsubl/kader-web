# Deep Backend Architecture & Caching Audit Report (Milestone 1)

**Date**: 2026-09-10  
**Authors**: Orchestrator (synthesized from Explorers 1, 2, and 3)  
**Status**: Milestone 1 Complete  

---

## Executive Summary
A comprehensive audit across all Nitro server API endpoints (`src/server/api/*`), data persistence mechanisms (`.data/*.json` and Supabase integration), and the Sharp image optimization pipeline (`/api/img`) revealed significant latency bottlenecks, lack of HTTP caching, severe concurrency race conditions, and event loop blocking risks. 

Empirical testing confirmed that **zero public JSON endpoints set `Cache-Control` or `ETag` headers**, conditional `If-None-Match` requests are ignored (never returning `304 Not Modified`), and disk writes are non-atomic (`O_TRUNC`), risking file truncation and JSON syntax errors during concurrent access. Furthermore, background sync operations are executed inline during client HTTP requests without single-flight deduplication.

Resolving these issues in Milestone 2 will achieve the target latency of `< 50ms` for cached requests and `< 100ms` for uncached requests while ensuring 100% data integrity and zero regressions.

---

## 1. Nitro Server API Endpoints Audit (Explorer 1 Synthesis)

### 1.1 Missing Cache Headers & Conditional GET Support
- **Endpoints Examined**: `/api/site-images`, `/api/events`, `/api/ra-events`, `/api/menu-config`.
- **Finding**: None of these endpoints set `Cache-Control` or `ETag` headers. In empirical tests on the built Nitro production server:
  - `GET /api/site-images` -> HTTP 200, `cacheControl: null`, `etag: null`.
  - `GET /api/menu-config` -> HTTP 200, `cacheControl: null`, `etag: null`.
  - `GET /api/ra-events` -> HTTP 200, `cacheControl: null`, `etag: null`.
  - Passing `If-None-Match` returns full HTTP 200 payloads instead of `304 Not Modified`.

### 1.2 Event Loop Blocking & Un-cached Database Hops
- `/api/site-images.get.ts` executes synchronous `fs.existsSync` and `fs.readFileSync` on every request.
- `/api/events.get.ts` and `/api/menu-config.get.ts` issue remote database calls to Supabase on every single incoming request without in-memory caching or fallback mechanisms.
- If Supabase is unreachable or unconfigured, `/api/events` throws a hard HTTP 500 error instead of serving cached/stale data.

### 1.3 TypeScript Compilation Issues
- `npm run typecheck` surfaced 26 errors across 16 admin files caused by importing `getQuery`, `readBody`, `defineEventHandler`, and `setResponseHeader` from `'#imports'` instead of `'h3'`.

---

## 2. Data Persistence & Concurrency Audit (Explorer 2 Synthesis)

### 2.1 Direct Non-Atomic File Writes (`O_TRUNC` Hazard)
- `admin/site-images.put.ts` and `raSyncEngine.ts` write to `.data/site_images.json` and `.data/ra_events_store.json` using `fs.writeFileSync`.
- Calling `fs.writeFileSync` opens files with `O_TRUNC`, immediately truncating them to 0 bytes before writing. Concurrent read requests encountering this state throw `SyntaxError: Unexpected end of JSON input`.

### 2.2 Inline External Sync & Thundering Herd
- When 10 minutes elapse, incoming requests to `GET /api/ra-events` synchronously trigger `syncRaEventsEngine()`.
- `syncRaEventsEngine()` executes 8+ external GraphQL queries to `ra.co`, downloads flyers, and writes to disk, stalling client requests for 10 to 30+ seconds.
- Without promise deduplication, concurrent visitors generate a massive burst of redundant GraphQL requests (thundering herd), causing rate limits, extreme latency spikes, and disk thrashing.

### 2.3 Lost Updates & Data Desynchronization
- In `raSyncEngine.ts`, `syncRaEventsEngine()` captures a store snapshot at $T_0$ and flushes at $T_{30}$. Any custom events added by admins during that 30-second window are completely wiped out.
- `admin/ra-events.put.ts` updates Supabase but fails to update `.data/ra_events_store.json`, meaning public users reading the local store never see admin updates.
- Redundant Supabase auth checks in `middleware/admin.ts` and individual handlers add 150–320ms of dead network latency per admin request.

---

## 3. Sharp Image Optimization Pipeline Audit (Explorer 3 Synthesis)

### 3.1 Missing ETags & 304 Not Modified
- `src/server/api/img.get.ts` sets `Cache-Control: public, max-age=31536000, immutable`, but never generates an `ETag` or `Last-Modified` header, never checks `If-None-Match`, and never returns `304 Not Modified`.
- Every image request forces a full disk read and body transmission even when client/CDN caches are valid.

### 3.2 Cache Key Invalidation Flaw
- The disk cache key in `.data/img-cache` is MD5(`${src}_w${width}_q${quality}_f${targetFormat}`). It completely ignores source file modification time (`mtime`) and size.
- When an image in `public/` or an uploaded asset is updated, the cached file is never invalidated, serving stale images indefinitely.

### 3.3 Memory Spikes & CPU Bottlenecks
- Empirical load testing revealed that 20 concurrent WebP transformations cause a **+180.78 MB RSS spike** in native libvips memory.
- Default AVIF encoding at effort 4 consumes **~2,045 ms** of CPU time per image. Tuning to effort 2 drops transformation time to **~300 ms** (6.5x speedup, 85% CPU reduction) with negligible quality loss.
- Non-atomic file writes directly to `.data/img-cache` risk serving truncated/corrupted image bytes to concurrent requests.

---

## 4. Milestone 2 Implementation Roadmap

1. **High-Performance In-Memory & SWR Caching Layer**:
   - Implement `src/server/utils/cache.ts` providing in-memory caching with configurable TTL and Stale-While-Revalidate (SWR).
   - Alternatively/additionally, leverage Nitro's native `defineCachedEventHandler` / `routeRules` where appropriate.
   - Enforce explicit `Cache-Control` headers:
     - `/api/site-images`: `public, max-age=3600, stale-while-revalidate=86400`
     - `/api/menu-config`: `public, max-age=3600, stale-while-revalidate=86400`
     - `/api/events`: `public, max-age=60, stale-while-revalidate=300`
     - `/api/ra-events`: `public, max-age=120, stale-while-revalidate=600`
     - `/api/img`: `public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`
   - Compute fast deterministic ETags (e.g. SHA-1 / FNV-1a or crypto hash) and handle `If-None-Match` to return `304 Not Modified` with 0 body bytes.
   - Wire cache invalidation triggers into admin mutation endpoints (`admin/site-images.put`, `admin/menu-config.put`, `admin/events.post`, `admin/events.delete`, etc.).

2. **Atomic Safe File I/O for `.data/*.json`**:
   - Implement `atomicWriteJson(filePath, data)` using a temporary file (`.tmp.PID.random`) and atomic POSIX `rename`.
   - Prevent race conditions and eliminate 0-byte truncation risks.
   - Keep an in-memory cache of parsed store files to minimize disk reads.

3. **Decouple RA Sync & Single-Flight Mutex**:
   - Remove synchronous `syncRaEventsEngine()` from the incoming visitor request path in `getSyncedRaEvents()`. Always return local store data immediately.
   - Introduce single-flight promise coalescing (`isSyncing` mutex / promise memoization) so only one sync runs at any time.
   - Merge custom events atomically during sync so admin edits are never overwritten.
   - Update `admin/ra-events.put.ts` to update `.data/ra_events_store.json` in addition to Supabase.

4. **Optimized Sharp Image Pipeline (`/api/img`)**:
   - Add ETag generation (`W/"<cacheKey>-<mtime>"`) and evaluate `If-None-Match` to immediately return `304 Not Modified`.
   - Implement single-flight request coalescing for in-flight image transformations to eliminate cache stampedes.
   - Use atomic write (`.tmp` + rename) for `.data/img-cache`.
   - Serve cached image files via stream (`sendStream(event, fs.createReadStream(...))`) or efficient buffer to eliminate redundant memory copying.
   - Optimize AVIF encoding settings (`effort: 2`) to eliminate the 2-second CPU hang.
   - Support `url` alias for `src`, height `h`, and fit modes, with strict sanitization (`NaN` protection, URL validation).

5. **Typecheck Fixes**:
   - Fix imports from `#imports` to `h3` in all 16 affected admin route handlers to restore clean `npm run typecheck`.
