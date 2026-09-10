## 2026-09-10T14:39:35Z

You are Explorer 2 for Milestone 2 (Archetype: teamwork_preview_explorer).
Your working directory is: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
Audit Report: /home/ator/Kader/.agents/orchestrator/audit_report.md
Original user request: /home/ator/Kader/.agents/ORIGINAL_REQUEST.md

Your Task:
Design the implementation strategy for Safe Concurrent File I/O & Persistence Optimizations:
1. Design `atomicWriteJson(filePath, data)` in `src/server/utils/fileStore.ts` (or similar utility):
   - Write to temporary file in same directory (`${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`), fsync, and atomic POSIX `fs.renameSync` or `fs.promises.rename`.
   - Ensure directory existence check and error handling.
   - Refactor all direct `fs.writeFileSync` calls (`admin/site-images.put.ts`, `raSyncEngine.ts`, etc.) to use this atomic writer.
2. Design in-memory caching for `.data/*.json` stores (`ra_events_store.json`, `site_images.json`) to eliminate repeated synchronous disk I/O.
3. Design decoupling and single-flight concurrency control for `src/server/utils/raSyncEngine.ts`:
   - `getSyncedRaEvents()` must NEVER block on external GraphQL network requests during visitor GET requests; it should return local store data immediately.
   - Introduce `isSyncing` mutex / single-flight promise so concurrent triggers don't duplicate GraphQL queries or thrash disk.
   - Ensure custom events from `saveCustomEvent` are preserved during sync (no lost updates).
   - Ensure `admin/ra-events.put.ts` synchronizes changes to both Supabase and `ra_events_store.json`.

Requirements:
- Do NOT write or modify production code.
- Write your detailed strategy to: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/analysis.md
- Write your handoff report to: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/handoff.md
- Update progress in: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_2/progress.md
- Send a completion message back to orchestrator when done.
