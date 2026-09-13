# Project: Kader i18n & Club/Events Consolidation

## Architecture
- Framework: Nuxt 3 (SSR + Vue 3 + TypeScript + TailwindCSS)
- Internationalization: `src/composables/useLocale.ts`
  - Current supported locales: `sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`
  - Target locales: add `pl`, `cs`, `es` (total 10 locales)
  - Dictionary structure: nested objects flattened with dot-notation cache, dual interpolation `{param}` & `{{param}}`
  - Integration points:
    - `src/composables/useLocale.ts` (SUPPORTED_LOCALES, Locale type, localeLabels, dictionary definitions, flatDictionaries)
    - `src/components/Header.vue` (language selector dropdown, flags, labels)
    - `nuxt.config.ts` (hreflang meta tags for SEO alternate links)
- Club & Events Architecture:
  - `src/pages/club.vue`: Currently has hero, culture/safety, sound system ("Klipsch La Scala"), floors 01/02, door rules & FAQ.
  - `src/pages/events.vue`: Contains upcoming RA events grid, event detail modal with ticket purchase/Pretix integration, past events archive, category filters, calendar view.
  - Requirement: Merge interactive events experience into `/club`, remove sound system and floors sections, retain culture/safety and door rules/FAQ.
  - Navigation / Routing: Clean redirect `/events` -> `/club`, update links in `Header.vue` and `Footer.vue` to point to `/club` seamlessly.
- Verification & Test Suite:
  - Automated verification: `npm run typecheck`, `npm run build`, dictionary key parity audit (all 10 languages matching exactly 100%), club page rendering & route redirect verification.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Exploration & Architecture Mapping | Inspect useLocale.ts keys, Header.vue, nuxt.config.ts, club.vue, events.vue, Pretix/ticket modal dependencies | none | DONE |
| M2 | R1: i18n Expansion (pl, cs, es) | Full dictionary generation for ~938 leaf keys with 100% key parity, useLocale.ts update, Header.vue & nuxt.config.ts updates | M1 | DONE |
| M3 | R2: Merge /events into /club | Remove sound/floors, integrate interactive events grid, detail modal, past archive, update Header/Footer nav & redirect | M1 | DONE |
| M4 | R3: Verification & Auditing | Run typecheck, production build, key parity validator script, visual/component rendering audit, forensic integrity checks | M2, M3 | DONE |

## Interface Contracts
### useLocale.ts ↔ Components
- `SUPPORTED_LOCALES`: `['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es'] as const`
- `localeLabels`: Record<Locale, { label: string; name: string; native: string; flag: string }>
- `flatDictionaries`: Record<Locale, Record<string, string>> with identical key sets across all 10 locales.
### /club page ↔ Event components / state
- Events grid, detail modal, ticket integration, filter tabs, past archive must render without errors.
- Redirect `/events` -> `/club` (SSR 301/302 redirect via route middleware or page redirect).
