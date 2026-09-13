# Project Orchestration Plan: Kader i18n & Club/Events Consolidation

## Executive Objective
Deliver full requirements from ORIGINAL_REQUEST.md:
1. R1: Expand i18n to Polish (pl), Czech (cs), Spanish (es) across all ~938 leaf keys with 100% key parity, updating useLocale.ts, Header.vue, and nuxt.config.ts.
2. R2: Merge /events into /club page, remove sound system & floors sections, retain culture/safety & door rules/FAQ, embed interactive events experience, update navigation & redirect.
3. R3: Automated verification & build integrity (typecheck, build, 100% dictionary parity audit, club page rendering).

## Phased Workflow & Milestones

### Phase 1: Exploration & Architecture Analysis (M1)
- Dispatch Explorers to analyze:
  - Exact key catalog of existing dictionaries (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`) in `src/composables/useLocale.ts`.
  - Structure and components in `src/pages/club.vue` and `src/pages/events.vue`.
  - Navigation references in `Header.vue`, `Footer.vue`, and any router / middleware files.
  - Test suites and build configuration.
- Outcome: Structured analysis of leaf keys, dictionary extraction/generation strategy, and club page component integration strategy.

### Phase 2: Implementation of R1 - i18n Expansion (M2)
- Worker writes full translations for Polish (`pl`), Czech (`cs`), and Spanish (`es`) matching all leaf keys in `src/composables/useLocale.ts`.
- Worker updates `SUPPORTED_LOCALES`, `Locale`, `localeLabels`, `dictionaries`, `flatDictionaries`.
- Worker updates `src/components/Header.vue` (language dropdown, flags, labels) and `nuxt.config.ts` (`hreflang` alternate links).
- Reviewers and Challengers verify key parity, translation completeness, and absence of hardcoded English/Slovenian fallbacks in new dictionaries.

### Phase 3: Implementation of R2 - Merge /events into /club (M3)
- Worker modifies `src/pages/club.vue`:
  - Removes Sound System ("Klipsch La Scala") and Floors 01/02 sections.
  - Retains Club Culture / Safety and Door Rules & FAQ sections.
  - Embeds interactive Events features: Upcoming RA Events grid, detail modal with ticket purchase/Pretix integration, past events archive, category filters, calendar view.
- Worker implements clean redirect from `/events` to `/club` (e.g., in `src/pages/events.vue` or route middleware) and updates navigation links in `Header.vue`, `Footer.vue`, and anywhere else linking to `/events`.
- Reviewers and Challengers verify UI rendering, interaction flows, and routing.

### Phase 4: Full Verification, Hardening & Audit (M4)
- Worker / Tester runs:
  - `npm run typecheck`
  - `npm run build`
  - Dictionary parity test script verifying all 10 locales have identical key sets.
  - Headless/rendering test checking `/club` page sections and `/events` redirect.
- Forensic Auditor (`teamwork_preview_auditor`) performs integrity check (no dummy translations, no hardcoded bypasses).
- Final review gate and report to Sentinel.
