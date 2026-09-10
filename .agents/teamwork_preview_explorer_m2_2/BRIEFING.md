# BRIEFING — 2026-09-10T14:43:00Z

## Mission
Design implementation strategy for Safe Concurrent File I/O & Persistence Optimizations (Milestone 2).

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: explorer, investigator, synthesizer
- Working directory: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2
- Original parent: d0a02bf2-52c0-48c3-b670-adceefe53d0c
- Milestone: Milestone 2

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify production code
- Network restricted to CODE_ONLY
- Output strategy to analysis.md and handoff.md in working directory
- Keep progress.md updated with timestamps

## Current Parent
- Conversation ID: d0a02bf2-52c0-48c3-b670-adceefe53d0c
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `src/server/utils/raSyncEngine.ts`
  - `src/server/api/site-images.get.ts`
  - `src/server/api/admin/site-images.put.ts`
  - `src/server/api/admin/site-images-upload.post.ts`
  - `src/server/api/admin/ra-events.put.ts`
  - `src/server/api/admin/events.post.ts`
  - `src/server/api/admin/events.delete.ts`
  - `src/server/api/admin/sync-ra.post.ts`
  - `src/server/api/ra-events.get.ts`
  - `src/server/api/img.get.ts`
  - `.data/site_images.json`, `.data/ra_events_store.json`
- **Key findings**:
  - `fs.writeFileSync` in `site-images.put.ts` and `raSyncEngine.ts` opens with `O_TRUNC`, causing 0-byte file truncation during concurrent reads.
  - `site-images.get.ts` and `raSyncEngine.ts` perform synchronous disk reads on every request.
  - `getSyncedRaEvents` synchronously executes 8+ external GraphQL requests on visitor requests when stale, hanging client requests for 10-30 seconds.
  - `syncRaEventsEngine` has no mutex, causing thundering herds and duplicate GraphQL floods under concurrency.
  - `syncRaEventsEngine` takes snapshot at $T_0$ and overwrites disk at $T_{30}$, destroying custom events added during sync (lost updates bug).
  - `admin/ra-events.put.ts` updates Supabase but completely neglects `.data/ra_events_store.json`, preventing ticket widget URLs from appearing to visitors.
- **Unexplored areas**:
  - None within Milestone 2 scope. All file I/O, caching, and persistence mechanisms fully analyzed.

## Key Decisions Made
- Designed `src/server/utils/fileStore.ts` with `atomicWriteJson`, `atomicWriteJsonSync`, `atomicWriteBuffer`, `readJson`, `readJsonSync`, fsync, POSIX rename in same directory, and write-through in-memory caching.
- Designed complete decoupling of `getSyncedRaEvents`: returns local data immediately (< 1ms) and triggers background sync.
- Designed single-flight promise coalescing (`isRaSyncing()`, `activeSyncPromise`) to eliminate duplicate queries and thundering herds.
- Designed late-binding atomic store merge right before disk write to mathematically eliminate lost updates of custom events.
- Designed dual persistence for `admin/ra-events.put.ts` updating both local store via `updateRaEventPretix` and Supabase.

## Artifact Index
- ORIGINAL_REQUEST.md — Incoming task details
- progress.md — Activity log and heartbeat
- analysis.md — Full implementation design with exact code blueprints
- handoff.md — 5-component handoff report
