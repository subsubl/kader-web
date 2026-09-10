## 2026-09-10T14:39:35Z

You are Explorer 1 for Milestone 2 (Archetype: teamwork_preview_explorer).
Your working directory is: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
Audit Report: /home/ator/Kader/.agents/orchestrator/audit_report.md
Original user request: /home/ator/Kader/.agents/ORIGINAL_REQUEST.md

Your Task:
Design the implementation strategy for High-Performance API Caching & Optimization for:
- `/api/site-images`
- `/api/events`
- `/api/ra-events`
- `/api/menu-config`

Investigate and produce detailed, concrete specifications for the Worker:
1. Review the Nitro environment and determine the best caching approach:
   - Evaluate using Nitro's `defineCachedEventHandler` / Nitro route rules vs. an explicit in-memory cache helper (`src/server/utils/cache.ts`).
   - Note: We need deterministic ETag generation, Cache-Control headers, and HTTP 304 Not Modified support on `If-None-Match`.
   - Consider programmatic cache invalidation when admin endpoints mutate data (`admin/site-images.put`, `admin/menu-config.put`, `admin/events.post`, etc.).
2. Detail the exact header values for each route:
   - `/api/site-images`: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
   - `/api/menu-config`: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
   - `/api/ra-events`: `Cache-Control: public, max-age=120, stale-while-revalidate=600`
   - `/api/events`: `Cache-Control: public, max-age=60, stale-while-revalidate=300`
3. Design graceful error handling for `/api/events` so missing/unreachable Supabase returns cached/fallback data rather than unhandled 500.
4. Specify fixes for the 26 TypeScript import errors in admin endpoints (from `#imports` to `h3`) to keep `npm run typecheck` clean.

Requirements:
- Do NOT write or modify production code.
- Write your detailed strategy to: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/analysis.md
- Write your handoff report to: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/handoff.md
- Update progress in: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1/progress.md
- Send a completion message back to orchestrator when done.
