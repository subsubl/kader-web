# BRIEFING — 2026-09-13T10:18:40Z

## Mission
Audit and design comprehensive dual-language (sl & en) support across backend API endpoints in Kader.

## 🔒 My Identity
- Archetype: explorer
- Roles: Backend Dual-Language API Explorer
- Working directory: /home/ator/Kader/.agents/explorer_audit_3
- Original parent: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Milestone: Audit and Backend i18n Architecture Design

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Backend endpoints must support sl (default) and en via query param `?lang=` or `Accept-Language` header
- Full TypeScript type-safety with Nitro H3 event handling
- Write findings to backend_i18n_plan.md and handoff.md

## Current Parent
- Conversation ID: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Updated: 2026-09-13T10:22:30Z

## Investigation State
- **Explored paths**:
  - `src/server/api/inquiries.post.ts`
  - `src/server/api/table-orders.post.ts`
  - `src/server/api/menu-config.get.ts`
  - `src/server/api/events.get.ts`
  - `src/server/api/ra-events.get.ts`
  - `src/server/api/site-images.get.ts`
  - `src/server/api/img.get.ts`
  - `src/server/utils/cache.ts`
  - `src/server/utils/rateLimit.ts`
  - `src/server/utils/microgramm.ts`
  - `src/server/utils/supabase.ts`
  - `src/composables/useLocale.ts`
  - `src/pages/buyouts.vue`
  - `src/pages/pizzeria.vue`
- **Key findings**:
  - Complete backend dual-language architecture designed in `backend_i18n_plan.md`.
  - Locale resolution priority: 1) `?lang=sl|en`, 2) cookie `kader-lang`, 3) `Accept-Language`, 4) default `sl`.
  - Found and documented discrepancies in `table-orders.post.ts` (currently uses `setResponseStatus(422)` instead of standard `createError`, snake_case vs camelCase fields) and `inquiries.post.ts` (`errors.preferredDate` vs frontend `errors.date`).
  - Solved cache pollution risk by defining locale-aware cache keys (`menu-config:${locale}`, `site-images:${locale}`, `events:${locale}`).
  - Validated baseline typecheck (`npm run typecheck`: passed 0 errors) and build (`npm run build`: passed).
- **Unexplored areas**: None. Audit and design complete.

## Key Decisions Made
- Designed `src/server/utils/locale.ts` with typed helpers: `resolveApiLocale(event)`, `createApiTranslator(event)`, and full `sl`/`en` dictionaries.
- Standardized all API error responses on Nuxt Nitro H3 `throw createError({ statusCode: 422, statusMessage, data: { errors } })`.
- Formatted validation outputs to include both camelCase (`tableNumber`) and snake_case (`table_number`), plus both `date` and `preferredDate` for maximum consumer compatibility.
- Prefix matching in `invalidateCache` confirmed to support locale-prefixed keys cleanly.

## Artifact Index
- `/home/ator/Kader/.agents/explorer_audit_3/ORIGINAL_REQUEST.md` — Original prompt and requirements
- `/home/ator/Kader/.agents/explorer_audit_3/progress.md` — Progress tracker and heartbeat
- `/home/ator/Kader/.agents/explorer_audit_3/BRIEFING.md` — Agent briefing and state
- `/home/ator/Kader/.agents/explorer_audit_3/backend_i18n_plan.md` — Complete backend i18n architecture and refactoring blueprints
- `/home/ator/Kader/.agents/explorer_audit_3/handoff.md` — Forensic handoff report

