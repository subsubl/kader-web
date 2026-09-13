# BRIEFING — 2026-09-13T10:38:15Z

## Mission
Execute full-stack implementation across UI (R1), SEO/GEO Schema (R2), Backend i18n (R3), and Performance & Verification (R4) for Kader.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /home/ator/Kader/.agents/worker_audit_1
- Original parent: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Milestone: Complete Implementation R1-R4

## 🔒 Key Constraints
- CODE_ONLY network mode: No external curl/wget/web requests.
- DO NOT CHEAT: Genuine implementations only, real state and real behavior.
- Minimal change principle, verify every step.
- Zero typecheck errors, clean build into .output/server.
- Address: Koblarjeva ulica 34, 1000 Ljubljana, SI.
- Geo coordinates: Latitude 46.0494, Longitude 14.5367.

## Current Parent
- Conversation ID: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Updated: 2026-09-13T10:38:15Z

## Task Summary
- **What to build**: Full-stack enhancement across R1 (UI, pages, components, bug fixes), R2 (SEO, GEO, JSON-LD, hreflang, font & app locale), R3 (Backend dual-language sl/en validation and responses, cache keys), R4 (Performance image lazy/async, content-visibility, verification scripts, clean build).
- **Success criteria**: All automated verification scripts pass, `npm run typecheck` 0 errors, `npm run build` succeeds, comprehensive implementation & handoff reports created.
- **Interface contracts**: /home/ator/Kader/.agents/orchestrator/PROJECT.md & plan.md
- **Code layout**: Nuxt 3 project layout (src/pages, src/components, src/composables, src/server).

## Key Decisions Made
- Restored authentic castle portal identity in `src/pages/index.vue` from git history commit `1066a02`.
- Enforced strict coordinates `46.0494, 14.5367` and address `Koblarjeva ulica 34, 1000 Ljubljana, SI` in `usePageSeo.ts`.
- Gated `ClubDjPlayer.vue` `requestAnimationFrame` loop strictly to `isPlaying.value === true` to preserve client CPU/battery.
- Added SSR query parameter `?lang=` reading to `useLocale.ts` for instant server-rendered localized html.
- Supported both `date` and `preferredDate` in `inquiries.post.ts` and both `tableNumber` and `table_number` in `table-orders.post.ts`.
- Isolated cache keys in `menu-config:${locale}`, `site-images:${locale}`, and `events:${locale}`.

## Artifact Index
- `.agents/worker_audit_1/ORIGINAL_REQUEST.md` — Initial user instructions
- `.agents/worker_audit_1/progress.md` — Liveness and step tracking
- `.agents/worker_audit_1/skills/modern-web-guidance.md` — Skill local snapshot
- `.agents/worker_audit_1/implementation_report.md` — Detailed technical report
- `.agents/worker_audit_1/handoff.md` — 5-component hard handoff report
- `scripts/verify_api_i18n.mjs` — Automated backend dual-language test harness (22/22 pass)
- `scripts/verify_seo_geo_schema.mjs` — Automated SSR SEO, GEO & Schema test harness (14/14 pass)

## Change Tracker
- **Files modified**: `src/pages/index.vue`, `src/pages/pizzeria.vue`, `src/pages/club.vue`, `src/pages/buyouts.vue`, `src/pages/shop.vue`, `src/components/Header.vue`, `src/components/Footer.vue`, `src/components/ClubDjPlayer.vue`, `src/components/ProvenanceBadge.vue`, `src/components/PretixWidget.vue`, `src/composables/usePageSeo.ts`, `src/composables/useLocale.ts`, `src/app.vue`, `nuxt.config.ts`, `src/server/utils/locale.ts`, `src/server/api/inquiries.post.ts`, `src/server/api/table-orders.post.ts`, `src/server/api/menu-config.get.ts`, `src/server/api/site-images.get.ts`, `src/server/api/events.get.ts`, `src/server/api/img.get.ts`.
- **Build status**: PASS (`npm run typecheck`: 0 errors, `npm run build`: successful)
- **Pending issues**: None

## Quality Status
- **Build/test result**: All verification suites PASSED (API i18n 22/22, SEO/GEO 14/14, typecheck 0 errors, build clean)
- **Lint status**: 0 violations
- **Tests added/modified**: `scripts/verify_api_i18n.mjs`, `scripts/verify_seo_geo_schema.mjs`

## Loaded Skills
- **Source**: `/home/ator/.gemini/config/plugins/modern-web-guidance-plugin/skills/modern-web-guidance/SKILL.md`
- **Local copy**: `.agents/worker_audit_1/skills/modern-web-guidance.md`
- **Core methodology**: Modern web standards for layout, accessibility, reactive audio loops, and performance optimizations.
