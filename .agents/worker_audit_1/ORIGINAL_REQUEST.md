## 2026-09-13T10:23:32Z
You are Worker 1 (Full-Stack Implementation Worker) for Kader.
Your working directory is /home/ator/Kader/.agents/worker_audit_1.
Create your BRIEFING.md and progress.md in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT
hardcode test results, create dummy/facade implementations, or
circumvent the intended task. A Forensic Auditor will independently
verify your work. Integrity violations WILL be detected and your
work WILL be rejected.

Context and Specifications:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- Plan: /home/ator/Kader/.agents/orchestrator/plan.md
- Explorer 1 Audit (UI/Perf): /home/ator/Kader/.agents/explorer_audit_1/ui_performance_audit.md
- Explorer 2 Audit (SEO/GEO): /home/ator/Kader/.agents/explorer_audit_2/seo_geo_schema_plan.md
- Explorer 3 Audit (Backend i18n): /home/ator/Kader/.agents/explorer_audit_3/backend_i18n_plan.md

Your Task is to execute the complete implementation of R1, R2, R3, and R4:

### 1. R1: Comprehensive UI, Pages, Components & Bug Fixes
1. Restore `src/pages/index.vue` to its authentic Grad Kodeljevo estate portal identity:
   - Castle hero with dual day (Bistro) / night (Club) narrative.
   - Wire up the comprehensive 10-language `home.*` translations (`home.dayTitle`, `home.dayP`, `home.nightTitle`, `home.nightP`, `home.basementTitle`, `home.terraceTitle`, `home.heroTaglineQuote`, etc.).
   - Include upcoming club event card preview and castle spaces showcase.
   - Wire dual CTAs pointing to `/pizzeria` and `/club`.
2. Polish `src/pages/pizzeria.vue`:
   - Integrate `src/components/PizzeriaCraft.vue` (interactive craft telemetry HUD).
   - Integrate `src/components/ProvenanceBadge.vue` for D.O.P. ingredient certifications.
   - Clean up dead state (`zoomOpen`, `activeView`, phantom lightbox, unused `navCategories`).
   - Fix address to `Koblarjeva ulica 34`.
3. Polish `src/pages/club.vue`:
   - Wire `src/components/ClubDjPlayer.vue` directly beneath the hero section.
   - Optimize `ClubDjPlayer.vue` so `requestAnimationFrame` loop only runs when `isPlaying.value` is true, and ensure touch targets >= 44px.
   - Fix event modal body scroll lock on open and clean up on unmount.
   - Fix address to `Koblarjeva ulica 34`.
4. Connect `/shop`:
   - Add `/shop` link to `Header.vue` (desktop and mobile) and `Footer.vue`.
   - Add `/` (Home) text link to desktop navigation in `Header.vue`.
   - Fix fallback in `src/pages/shop.vue` and `src/components/PretixWidget.vue` from `192.168.64.147` to `https://pretix.eu`.
5. Polish `src/components/Footer.vue`:
   - Render real social media links: Instagram (`https://www.instagram.com/kader.lunapark/`) and Resident Advisor (`https://ra.co/clubs/78778`).
   - Remove unused import `EnvelopeIcon`.
   - Update responsive grid to `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`.
   - Update address to `Koblarjeva ulica 34, 1000 Ljubljana`.

### 2. R2: SEO & GEO Structured Data Optimization
1. Create `src/composables/usePageSeo.ts`:
   - Unified composable using Nuxt 3's built-in `useHead` and `useSeoMeta`.
   - Sets canonical URL for each page (`https://www.kader.si/path`).
   - Generates 10 localized `<link rel="alternate" hreflang="LOCALE" href="https://www.kader.si/path?lang=LOCALE">` tags plus `x-default`.
   - Complete OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`, `og:locale:alternate`, `og:site_name`, `og:type`).
   - Complete Twitter cards (`summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`).
   - Injects Schema.org JSON-LD:
     - `Restaurant` / `PizzaRestaurant` for `/pizzeria`
     - `NightClub` and dynamic `Event` for `/club`
     - `LocalBusiness` / `EventVenue` for `/buyouts` and `/`
     - `Store` for `/shop`
   - Exact GEO coordinates: **Latitude `46.0494`**, **Longitude `14.5367`**.
   - Exact street address: `Koblarjeva ulica 34, 1000 Ljubljana, SI`.
2. Update `nuxt.config.ts`:
   - Remove hardcoded global static hreflangs (lines 31-41) that point all pages to root `/`.
   - Add route rules for `/admin/**` and `/api/**` with `X-Robots-Tag: noindex, nofollow`.
   - Update Google Fonts link to include `Inter` font:
     `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap`
3. Update `src/app.vue`:
   - Dynamically bind `<html :lang="locale" class="dark">`.
4. Update `src/composables/useLocale.ts`:
   - Support `useRoute().query.lang` during SSR so query param switches locale immediately.
5. Apply `usePageSeo` to all public pages (`index.vue`, `pizzeria.vue`, `club.vue`, `buyouts.vue`, `shop.vue`).

### 3. R3: Backend Dual-Language Support (`sl` & `en`)
1. Create `src/server/utils/locale.ts`:
   - `resolveApiLocale(event)`: Query `?lang=sl|en` > cookie `kader-lang` > `Accept-Language` header (RFC 9110 q-factors) > default `'sl'`.
   - Complete dictionaries for `sl` and `en` covering `common`, `inquiries`, `tableOrders`, `menuConfig`, and `img`.
   - `createApiTranslator(event)` with `t(path, params)` and `throwValidationError(errors)`.
2. Refactor `src/server/api/inquiries.post.ts`:
   - Localized validation errors for `name`, `email`, `phone`, `eventType`, `guests`, `date` / `preferredDate`.
   - Support both `date` and `preferredDate` in request body and validation response.
   - Throw standard H3 `createError({ statusCode: 422, statusMessage, data: { errors } })`.
   - Localized success response.
3. Refactor `src/server/api/table-orders.post.ts`:
   - Standardize on H3 `createError({ statusCode: 422, statusMessage, data: { errors } })`.
   - Localized validation errors for `tableNumber` / `table_number` (1-50), `items` (non-empty array), `total` (positive number), `customerNote` (max 500 chars).
   - Localized item missing/unavailable errors.
4. Refactor `src/server/api/menu-config.get.ts`:
   - Localized fields: `locale`, `title`, `vatNote`, `kitchenHoursNote`, `allergensNote`, `currency`.
   - Localize cache key to `menu-config:${locale}` to prevent cross-language cache pollution.
5. Localize cache keys in `site-images.get.ts` (`site-images:${locale}`) and `events.get.ts` (`events:${locale}`).

### 4. R4: Performance & Build Verification
1. Optimize image loading across all pages:
   - Add `loading="lazy"` and `decoding="async"` to all below-the-fold images.
   - Add `decoding="async"` to hero background images.
2. Apply `.content-visibility-auto` to offscreen sections.
3. Create automated test scripts:
   - `scripts/verify_api_i18n.mjs`: Test `/api/inquiries` and `/api/table-orders` with `?lang=sl` and `?lang=en` verifying localized validation error messages.
   - `scripts/verify_seo_geo_schema.mjs`: Test SSR HTML head tags, canonicals, hreflang alternates, JSON-LD schemas, and exact coordinates `46.0494, 14.5367`.
4. Run:
   - `node scripts/verify_api_i18n.mjs`
   - `node scripts/verify_seo_geo_schema.mjs`
   - `npm run typecheck` (must have 0 errors)
   - `npm run build` (must compile cleanly into `.output/server`)

Write your comprehensive implementation and verification report to:
`/home/ator/Kader/.agents/worker_audit_1/implementation_report.md`
Write your handoff report to:
`/home/ator/Kader/.agents/worker_audit_1/handoff.md`

Send a completion message back to parent when done.
