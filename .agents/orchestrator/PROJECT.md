# Project: Kader Full-Site Audit, SEO/GEO Optimization & Dual-Language Backend

## Architecture
- Framework: Nuxt 3 (SSR + Vue 3 + TypeScript + TailwindCSS)
- Internationalization (UI & Backend):
  - UI Locale system: `src/composables/useLocale.ts` supporting 10 languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`).
    - Enhanced with `useRoute().query.lang` support on SSR initialization.
  - Backend API Localization: Dual-language (`sl` Slovenian & `en` English) support across endpoints in `src/server/api/`.
    - `src/server/utils/locale.ts`: Language preference resolved via `?lang=sl|en` query parameter > cookie `kader-lang` > `Accept-Language` header (RFC 9110 q-factors) > default `'sl'`.
    - Localized validation error messages, status responses, and notes.
    - Endpoints: `inquiries.post.ts`, `table-orders.post.ts`, `menu-config.get.ts`, and related API handlers.
    - Cache isolation: cache keys include locale (e.g. `menu-config:${locale}`).
- SEO & GEO Structured Data:
  - Centralized composable: `src/composables/usePageSeo.ts`
  - Page titles, meta descriptions, OpenGraph (`og:image`, `og:title`, `og:description`), Twitter cards, hreflang annotations (10 locales per route + x-default), canonical URLs across all public routes:
    - `/` (Home / Grad Kodeljevo estate portal)
    - `/pizzeria` (Gourmet Pizza & Italian dining)
    - `/club` (Electronic music club & events)
    - `/buyouts` (Private venue hire & corporate buyouts)
    - `/shop` (Merchandise & official products)
  - Schema.org JSON-LD Structured Data:
    - Types: `Restaurant`, `NightClub`, `Event`, `LocalBusiness` / `EventVenue`, `Store`
    - Geographic coordinates: Latitude `46.0494`, Longitude `14.5367` (Grad Kodeljevo, Koblarjeva ulica 34, 1000 Ljubljana, Slovenia).
    - Opening hours, contact info, address, priceRange, cuisine/music, amenities.
- Performance & Frontend Quality:
  - Responsive design across mobile (<640px), tablet (640-1024px), desktop (>1024px).
  - Navigation integrity: Header and Footer link `/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`.
  - Component integration: `PizzeriaCraft.vue` & `ProvenanceBadge.vue` in `/pizzeria`, `ClubDjPlayer.vue` in `/club`.
  - Asset loading optimization: image lazy-loading (`loading="lazy"`, `decoding="async"`), font display optimization (`font-display: swap` with `Inter` in Google Fonts), responsive image sizes.
- Verification & Test Suite:
  - `npm run typecheck` (0 errors)
  - `npm run build` (clean Nitro production SSR bundle in `.output/server`)
  - Automated API verification script testing both `lang=sl` and `lang=en` for validation errors and responses.
  - Automated JSON-LD structured data verification script confirming valid schema syntax, schemas (`Restaurant`, `NightClub`, `Event`, `LocalBusiness`), and exact GEO coordinates (`46.0494, 14.5367`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1-M4 | Previous i18n & Club Consolidation | i18n pl/cs/es expansion and club/events consolidation | none | DONE |
| M5 | Comprehensive Site Exploration | Audit all pages, UI, SEO/GEO structured data, backend APIs, performance | none | DONE |
| M6 | Implementation: UI, SEO/GEO, Backend i18n & Performance | Implement all bug fixes, SEO tags, JSON-LD, backend sl/en i18n, asset optimization | M5 | DONE |
| M7 | Multi-Dimensional Verification & Integrity Audit | Reviewers, Challengers, and Forensic Auditor verification | M6 | DONE |

## Interface Contracts
### Backend API Localization (`src/server/utils/locale.ts`)
- Helper: `resolveApiLocale(event)` -> `'sl' | 'en'`
  - Query parameter `?lang=sl|en`
  - Cookie `kader-lang`
  - Header `Accept-Language` (RFC 9110 parsing)
  - Default: `'sl'`
- Helper: `createApiTranslator(event)` -> `{ locale, dict, t, throwValidationError }`
- Localized error messages for `inquiries.post.ts`:
  - Required fields: name, email, phone, eventType, date, guests
  - Return errors under both `date` and `preferredDate`
  - `throw createError({ statusCode: 422, statusMessage, data: { errors } })`
- Localized error messages for `table-orders.post.ts`:
  - Required fields: tableNumber / table_number (1-50), items (non-empty), total, customerNote (<= 500)
  - `throw createError({ statusCode: 422, statusMessage, data: { errors } })`
- Localized responses for `menu-config.get.ts`:
  - Cache key: `menu-config:${locale}`
  - Returns `locale`, `title`, `vatNote`, `kitchenHoursNote`, `allergensNote`, `menuImage`
### Schema.org JSON-LD Contract
- Structured data rendered via `src/composables/usePageSeo.ts`
- Canonical domain: `https://www.kader.si`
- Coordinates: Latitude `46.0494`, Longitude `14.5367`
- Address: `Koblarjeva ulica 34, 1000 Ljubljana, SI`
