# Original User Request

## Initial Request — 2026-09-12T09:16:40Z

Expand Kader's multi-language internationalization system to support Polish (`pl`), Czech (`cs`), and Spanish (`es`) across all UI strings, and merge the `/events` page functionality directly into the `/club` page while simplifying venue sections.

Working directory: `/home/ator/Kader`
Integrity mode: development

## Requirements

### R1. Expand i18n to Polish (pl), Czech (cs), and Spanish (es)
- Add `pl` (Polish), `cs` (Czech), and `es` (Spanish) to `SUPPORTED_LOCALES`, `Locale` type, and `localeLabels` in `src/composables/useLocale.ts`.
- Provide full, natural, accurate translation dictionaries for all ~938 leaf keys in Polish, Czech, and Spanish with 100% key parity across all 10 supported languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`).
- Update `Header.vue` language selector and `nuxt.config.ts` `hreflang` alternate meta tags to include `pl`, `cs`, and `es`.

### R2. Merge /events into /club Page & Simplify Club Sections
- On `src/pages/club.vue`:
  - Remove the detailed Sound System ("Klipsch La Scala") and Floors 01/02 sections as requested.
  - Retain the Club Culture / Safety ("Ljubljanska klubska kultura, svoboda in varnost") and Door Rules & FAQ ("Pravila na vratih & Pogosta vprašanja") sections.
  - Embed the complete interactive Events experience from `/events` (Upcoming RA Events grid, event detail modal with ticket purchase/Pretix integration, and past events archive) into `/club`.
- Set up a clean redirect from `/events` to `/club` or update navigation links in `Header.vue` and `Footer.vue` so "Klub & Dogodki" (Club & Events) seamlessly points to `/club`.

### R3. Automated Verification & Build Integrity
- Ensure type safety, reactive language switching, and SSR build compatibility.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` compiles cleanly into production Nitro SSR bundle (`.output/server`).
- [ ] Dictionary audit confirms 100% key parity across all 10 languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`) with zero missing/fallback keys.
- [ ] `/club` page successfully renders upcoming & past events, door rules, and FAQ, with sound system/floors sections removed.

## Follow-up — 2026-09-13T10:16:49Z

Full-site audit and optimization across all pages (UI, SEO, GEO structured data, performance) and implementation of dual-language (`sl` Slovenian & `en` English) support across backend API endpoints.

Working directory: `/home/ator/Kader`
Integrity mode: development

## Requirements

### R1. Comprehensive Page, UI & Bug Audit
- Thoroughly inspect all public pages (`/`, `/pizzeria`, `/club`, `/buyouts`) and shared components.
- Fix any remaining layout inconsistencies, broken links, spacing issues, or responsive glitches across mobile and desktop breakpoints.

### R2. SEO & GEO Structured Data Optimization
- Audit and refine all page title tags, meta descriptions, OpenGraph meta (`og:image`, `og:title`, `og:description`), Twitter cards, hreflang annotations, and canonical URLs.
- Implement rich Schema.org JSON-LD structured data for `Restaurant`, `NightClub`, `Event`, and `LocalBusiness` featuring precise GEO coordinates (`46.0494, 14.5367` for Grad Kodeljevo, Ljubljana, Slovenia).

### R3. Backend Dual-Language Support (`sl` & `en`)
- Refactor backend API handlers (`src/server/api/inquiries.post.ts`, `src/server/api/table-orders.post.ts`, `src/server/api/menu-config.get.ts`, etc.) to accept language preferences via `?lang=sl|en` query parameter or `Accept-Language` header.
- Provide localized validation error messages, status responses, and notes in both Slovenian (`sl`) and English (`en`).

### R4. Performance & Build Verification
- Optimize client asset loading, image lazy-loading, and font display.
- Ensure `npm run typecheck` passes with 0 errors and `npm run build` compiles into a clean production Nitro SSR bundle.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` compiles successfully into `.output/server`.
- [ ] API verification: `/api/inquiries` and `/api/table-orders` return localized validation errors matching `lang=en` and `lang=sl`.
- [ ] Structured data validation: HTML head renders valid JSON-LD schemas with GEO coordinates (`46.0494, 14.5367`).

