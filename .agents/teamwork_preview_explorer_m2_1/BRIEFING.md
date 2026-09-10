# BRIEFING — 2026-09-10T14:43:35Z

## Mission
Design the implementation strategy for High-Performance API Caching & Optimization for Kader endpoints and admin TS fixes.

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: explorer
- Working directory: /home/ator/Kader/.agents/teamwork_preview_explorer_m2_1
- Original parent: d0a02bf2-52c0-48c3-b670-adceefe53d0c
- Milestone: Milestone 2: High-Performance API Caching & Optimization

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Write all findings to analysis.md and handoff.md in own directory
- No modifications to source code
- CODE_ONLY network mode

## Current Parent
- Conversation ID: d0a02bf2-52c0-48c3-b670-adceefe53d0c
- Updated: 2026-09-10T14:43:35Z

## Investigation State
- **Explored paths**:
  - `node_modules/nitropack/dist/runtime/internal/cache.mjs`
  - `node_modules/h3/dist/index.mjs`
  - `src/server/api/site-images.get.ts`, `src/server/api/menu-config.get.ts`, `src/server/api/ra-events.get.ts`, `src/server/api/events.get.ts`
  - Admin endpoints in `src/server/api/admin/*`
  - Database types in `src/types/database.ts`
- **Key findings**:
  - Nitro's `defineCachedEventHandler` forcibly sets `s-maxage=...` when SWR is true, stripping `public` and `max-age`, violating route contract. Custom helper `src/server/utils/cache.ts` provides complete header compliance and instant programmatic invalidation.
  - All 26 TypeScript errors isolated: 15 files importing H3 functions from `#imports` and 1 file (`promoters.get.ts`) referencing column `rate` instead of `rate_per_checkin`.
  - `/api/events` redesigned with graceful fallback hierarchy so missing/unreachable Supabase never causes a 500 fatal crash.
- **Unexplored areas**: None for this investigation scope.

## Key Decisions Made
- Recommended explicit in-memory cache helper `src/server/utils/cache.ts` over Nitro's `defineCachedEventHandler`.
- Defined single-flight promise coalescing and RFC 7232 normalized ETag matching.
- Documented verbatim replacements for all 16 files with TS errors.

## Artifact Index
- ORIGINAL_REQUEST.md — Original dispatch request
- BRIEFING.md — Persistent context & situational awareness
- progress.md — Liveness heartbeat and progress tracking
- analysis.md — Detailed caching & optimization strategy specification
- handoff.md — 5-component handoff report for orchestrator/implementer
