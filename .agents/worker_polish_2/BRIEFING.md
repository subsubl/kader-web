# BRIEFING — 2026-09-13T15:54:10+02:00

## Mission
Implement 5 edge-case polish items across frontend and server locales/APIs, verify with test suite, typecheck and build, and provide full handoff.

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa, specialist
- Working directory: /home/ator/Kader/.agents/worker_polish_2
- Original parent: 77a5f91c-5a62-40ce-83f3-6c6a8a1de936
- Milestone: Polish & Edge-Case Hardening

## 🔒 Key Constraints
- DO NOT CHEAT. All implementations must be genuine.
- Preserve 100% key parity across all 10 locales in `src/composables/useLocale.ts`.
- Replace legacy address "Ulica Carla Benza 20" with canonical "Koblarjeva ulica 34" across all 10 language dictionaries.
- Fix Accept-Language header whitespace trimming in `src/server/utils/locale.ts`.
- Enforce integer validation and range 1-500 on inquiry guests in `src/server/api/inquiries.post.ts`.
- Localize 429 rate limit error in `src/server/utils/rateLimit.ts`.
- Localize image error and isolate inflight cache per locale in `src/server/api/img.get.ts`.
- Run all verifications, typecheck, and build.

## Current Parent
- Conversation ID: 77a5f91c-5a62-40ce-83f3-6c6a8a1de936
- Updated: 2026-09-13T15:54:10+02:00

## Task Summary
- **What to build**: 5 edge-case polish items across `src/composables/useLocale.ts`, `src/pages/pizzeria.vue`, `src/server/utils/locale.ts`, `src/server/api/inquiries.post.ts`, `src/server/utils/rateLimit.ts`, and `src/server/api/img.get.ts`.
- **Success criteria**: All automated verification scripts pass, `npm run typecheck` passes with 0 errors, `npm run build` succeeds, polish report and handoff generated.
- **Interface contracts**: /home/ator/Kader/PROJECT.md
- **Code layout**: /home/ator/Kader/src

## Key Decisions Made
- Replaced 80 occurrences of "Ulica Carla Benza 20" with "Koblarjeva ulica 34" in `src/composables/useLocale.ts`, preserving 938 keys per language across 10 locales.
- Updated `src/pages/pizzeria.vue` line 451 to use "Koblarjeva ulica 34", fully eliminating legacy address occurrences across public routes.
- Updated `src/server/utils/locale.ts` `parseAcceptLanguage` parameter parsing with `.split('=').map(s => s.trim())`.
- Updated `src/server/api/inquiries.post.ts` to strictly validate `!Number.isInteger(guests) || guests < 1 || guests > 500`.
- Localized rate limiting 429 statusMessage in `src/server/utils/rateLimit.ts` via `resolveApiLocale` and `apiMessages`.
- Destructured `locale` in `src/server/api/img.get.ts`, keyed `inflightTransformations` as `${hashKey}:${locale}`, and localized error responses with `t('img.errProcessFailed', ...)`.
- Added unit & integration test suite `scripts/test_polish_edge_cases.mjs` verifying all 5 targets.

## Artifact Index
- /home/ator/Kader/.agents/worker_polish_2/BRIEFING.md — Persistent working memory
- /home/ator/Kader/.agents/worker_polish_2/progress.md — Liveness heartbeat and progress tracking
- /home/ator/Kader/.agents/worker_polish_2/polish_report.md — Detailed verification report
- /home/ator/Kader/.agents/worker_polish_2/handoff.md — 5-component handoff report
- /home/ator/Kader/scripts/test_polish_edge_cases.mjs — Automated verification script for polish items

## Change Tracker
- **Files modified**:
  - `src/composables/useLocale.ts`: Replaced 80 occurrences of "Ulica Carla Benza 20" with canonical "Koblarjeva ulica 34"
  - `src/pages/pizzeria.vue`: Replaced legacy address on line 451 with "Koblarjeva ulica 34"
  - `src/server/utils/locale.ts`: Trimmed parameter key and value in `parseAcceptLanguage`
  - `src/server/api/inquiries.post.ts`: Enforced integer validation on guests (1–500)
  - `src/server/utils/rateLimit.ts`: Localized 429 rate limit error message
  - `src/server/api/img.get.ts`: Localized error statusMessage and isolated inflight cache key per locale
  - `scripts/test_polish_edge_cases.mjs`: Added test suite for the 5 polish items
- **Build status**: Pass (`npm run typecheck` 0 errors, `npm run build` clean build)
- **Pending issues**: None

## Quality Status
- **Build/test result**: All 5 test suites passed with 0 failures:
  - `verify_api_i18n.mjs`: 22/22 PASS
  - `verify_seo_geo_schema.mjs`: 14/14 PASS
  - `test_adversarial_seo.mjs`: 298/298 PASS
  - `test_polish_edge_cases.mjs`: 11/11 PASS
  - `verify_i18n_parity.mjs`: 10/10 locales PASS (938 keys/locale)
- **Lint status**: 0 violations
- **Tests added/modified**: `scripts/test_polish_edge_cases.mjs` (11 assertions covering all 5 items)

## Loaded Skills
None
