## 2026-09-10T14:43:50Z

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You are Worker (Implementer) for Milestone 2 (Archetype: teamwork_preview_worker).
Your working directory is: /home/ator/Kader/.agents/teamwork_preview_worker_m2/
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
Original user request: /home/ator/Kader/.agents/ORIGINAL_REQUEST.md

You have 3 comprehensive Explorer analysis and handoff reports to guide your implementation:
1. API Caching & TypeScript Fixes:
   - Analysis: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/analysis.md
   - Handoff: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/handoff.md
2. Safe File I/O & Concurrency Protection:
   - Analysis: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/analysis.md
   - Handoff: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/handoff.md
3. Sharp Image Optimization Pipeline:
   - Analysis: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_3/analysis.md
   - Handoff: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_3/handoff.md

Your Implementation Tasks:

Task 1: Safe Concurrent File I/O & In-Memory Store Caching
- Create `src/server/utils/fileStore.ts` with `atomicWriteJson`, `atomicWriteJsonSync`, `readJson`, `readJsonSync` using temp-file writes in the same directory, fsync, atomic POSIX rename, directory checking, and write-through in-memory cache (`memoryStoreCache`).
- Refactor `src/server/api/admin/site-images.put.ts` and `src/server/utils/raSyncEngine.ts` to use `atomicWriteJson` / `atomicWriteJsonSync`.
- In `src/server/utils/raSyncEngine.ts`:
  - Make `getSyncedRaEvents()` non-blocking: immediately return local store data (<1ms).
  - Background sync with single-flight mutex (`activeSyncPromise`) to prevent thundering herds and duplicate GraphQL floods to ra.co.
  - Implement late-binding merge in `syncRaEventsEngine()` so custom events from `saveCustomEvent` are never overwritten.
  - Update `src/server/api/admin/ra-events.put.ts` to sync `pretix_event_url` to `.data/ra_events_store.json` as well as Supabase.

Task 2: High-Performance In-Memory API Caching Engine
- Create `src/server/utils/cache.ts` providing in-memory caching with TTL, deterministic SHA-1 ETag generation, RFC 7232 `If-None-Match` conditional handling (returning HTTP 304 Not Modified with 0 body bytes), single-flight request coalescing, and programmatic invalidation (`invalidateCache(pattern)`).
- Wire public routes to use this caching layer:
  - `/api/site-images`: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
  - `/api/menu-config`: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
  - `/api/ra-events`: `Cache-Control: public, max-age=120, stale-while-revalidate=600`
  - `/api/events`: `Cache-Control: public, max-age=60, stale-while-revalidate=300` (with graceful fallback if Supabase is unconfigured/down)
- Wire cache invalidation calls in admin mutation endpoints (`admin/site-images.put.ts`, `admin/menu-config.put.ts`, `admin/events.post.ts`, `admin/events.delete.ts`, `admin/sync-ra.post.ts`).

Task 3: Sharp Image Optimization Pipeline
- Update `src/server/api/img.get.ts`:
  - Deterministic ETag incorporating source image mtime, file size, and transformation parameters (`w`, `h`, `q`, `targetFormat`, `fit`).
  - Conditional GET evaluation: check `If-None-Match` and return `304 Not Modified` with 0 bytes (<1ms).
  - Set standard headers: `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400` and `ETag`.
  - Stream cached images using `sendStream(event, fs.createReadStream(cachedFilePath))` on cache hits.
  - Atomic disk writes to `.data/img-cache` using `.tmp` + rename.
  - Single-flight request coalescing (`Map<string, Promise<Buffer>>`) to prevent cache stampedes.
  - AVIF optimization: tune `effort: 2` (7.5x faster, 86.7% CPU reduction).
  - Parameter parsing & security: support `url` alias for `src`, height `h`, fit modes, `NaN` guards, and SSRF validation.

Task 4: Fix 26 TypeScript Compilation Errors in Admin Endpoints
- In the 16 admin route files identified in M2_1 handoff, change imports of `getQuery`, `readBody`, `defineEventHandler`, `setResponseHeader` from `'#imports'` to `'h3'`.

Task 5: Build & Verification
- Run `npm run typecheck` — MUST pass with 0 errors.
- Run `npm run build` — MUST pass with 0 errors.
- Verify headers and responses on endpoints.

Deliverables:
- Update progress in `/home/ator/Kader/.agents/teamwork_preview_worker_m2/progress.md`
- Write comprehensive handoff report to `/home/ator/Kader/.agents/teamwork_preview_worker_m2/handoff.md`
- Send completion message to orchestrator with summary of changes and verification results.
