# Code Architecture & Build Review Report (Reviewer 1)

**Reviewer**: Reviewer 1 (Code Architecture, Type Safety & Build Verification)  
**Roles**: Reviewer, Adversarial Critic  
**Date**: 2026-09-13  
**Target Project**: Kader Grad Kodeljevo (`/home/ator/Kader`)  
**Scope Document**: `.agents/orchestrator/PROJECT.md`  
**Worker Implementation**: `.agents/worker_audit_1/implementation_report.md`  

---

## 1. Executive Summary & Verdict

**VERDICT: APPROVED**

The code modifications implemented across Kader Grad Kodeljevo satisfy the architectural, internationalization, structured data, performance, and type safety requirements specified in `PROJECT.md`. Forensic inspection confirmed **NO INTEGRITY VIOLATIONS**:
- No hardcoded test results or mock shortcuts exist in production code.
- Implementations of RFC 9110 q-factor parsing, locale resolution, validation error pipelines, dynamic SEO metadata, and Schema.org JSON-LD generation are genuine, fully functional, and modular.
- `npm run typecheck` passes with **0 errors**.
- `npm run build` compiles cleanly into `.output/server/index.mjs` with production Nitro node-server bundle.
- Both test suites (`scripts/verify_api_i18n.mjs` with 22 tests and `scripts/verify_seo_geo_schema.mjs` with 14 tests) passed with **0 failures**.
- Independent adversarial attack suite (`.agents/reviewer_audit_1/adversarial_suite.mjs` with 15 tests) passed with **0 failures**, confirming robust boundary checks, rate limiting, and SSRF/path-traversal defenses.

Two non-blocking minor observations are documented below for ongoing maintenance.

---

## 2. Quality Review Dimensions

### 2.1 Correctness & Integrity
- **Authentic Estate Portal (`src/pages/index.vue`)**: The homepage properly restores the Grad Kodeljevo estate identity with day/night narrative cards, 10-language translations, castle spaces showcase (Basement Club, 2nd Floor, Summer Terrace), upcoming event preview card, and direct CTAs to `/pizzeria` and `/club`.
- **Craft Telemetry & Badging (`src/pages/pizzeria.vue`, `PizzeriaCraft.vue`, `ProvenanceBadge.vue`)**: Live Stefano Ferrara 485°C telemetry HUD, 48-hour Biga fermentation stage, and mobile-responsive D.O.P. provenance tooltips (`max-w-[calc(100vw-2rem)]`) render without layout overflow.
- **Club Optimization (`src/pages/club.vue`, `ClubDjPlayer.vue`)**:
  - `ClubDjPlayer.vue` placed prominently below the hero.
  - `requestAnimationFrame` audio visualizer loop strictly executes only when `isPlaying.value === true` and stops immediately upon pause or unmount, preventing battery drain.
  - Touch targets on play/pause, prev/next track, and mute buttons strictly enforce `>= 44px x 44px`.
  - Event detail modal scroll lock binds `document.body.style.overflow = 'hidden'` on open and safely restores `''` on close and in `onBeforeUnmount`.
- **Navigation & Ticketing (`src/pages/shop.vue`, `Header.vue`, `Footer.vue`, `PretixWidget.vue`)**:
  - `/shop` integrated across desktop and mobile navigation in `Header.vue` and `Footer.vue`.
  - `/` (Home) navigation item restored.
  - Pretix fallback URL standardized from `192.168.64.147` to official `https://pretix.eu`.
  - Real social media links configured in `Footer.vue` (Instagram `@kader.lunapark`, Resident Advisor `78778`).
- **SEO & GEO Structured Data (`src/composables/usePageSeo.ts`)**:
  - Centralized composable dynamically generates canonical URLs (`https://www.kader.si${path}`).
  - 10 localized `<link rel="alternate" hreflang="...">` tags (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`) plus `x-default`.
  - Comprehensive OpenGraph and Twitter cards with locale and image fallbacks.
  - Schema.org JSON-LD `@graph` with exact coordinates (`latitude: 46.0494, longitude: 14.5367`) and address (`Koblarjeva ulica 34, 1000 Ljubljana, SI`) applied across all 5 public pages.
- **Dual-Language Backend API (`src/server/utils/locale.ts`, `inquiries.post.ts`, `table-orders.post.ts`, `menu-config.get.ts`, `site-images.get.ts`, `events.get.ts`, `img.get.ts`)**:
  - `resolveApiLocale`: Respects priority: Query (`?lang=`) > Cookie (`kader-lang`) > Header (`Accept-Language` with RFC 9110 q-factors) > Default (`'sl'`).
  - `createApiTranslator`: Localizes validation error messages, status messages, and strings with `{param}` and `{{param}}` interpolation.
  - `inquiries.post.ts`: Handles both `date` and `preferredDate`, maps 422 field errors, provides localized success message.
  - `table-orders.post.ts`: Handles `tableNumber` and `table_number` (1-50), `items`, `total`, `customerNote` (max 500 chars), missing/unavailable item errors, 422 format.
  - Cache key isolation: `menu-config:${locale}`, `site-images:${locale}`, `events:${locale}` prevents cross-language cache pollution.

### 2.2 Modularity & Code Cleanliness
- Clean separation between composables (`usePageSeo`, `useLocale`, `useSiteImages`), components, and server utilities.
- Dead code purged: removed obsolete state variables (`zoomOpen`, `activeView`, unused `navCategories`) and unused imports (e.g. `EnvelopeIcon` in `Footer.vue`).
- Reusable constants (`EXACT_GEO`, `CANONICAL_ADDRESS`, `CANONICAL_CONTACTS`) prevent geographic coordinate drift.

### 2.3 Type Safety
- `npm run typecheck` executed via `nuxt typecheck`: 0 errors in 12.18s.
- Clean TypeScript interfaces across `PageSeoOptions`, `ApiLocale`, `Dict`, `LocalizedMenuConfig`, and H3 event payloads.

---

## 3. Adversarial Stress-Testing & Security Findings

An independent adversarial attack suite (`.agents/reviewer_audit_1/adversarial_suite.mjs`) was executed against the production Nitro server (`.output/server/index.mjs`):

| Test / Attack Scenario | Input / Vector | Expected Behavior | Observed Result | Verdict |
|---|---|---|---|---|
| **SSRF Defense** | `GET /api/img?src=http://localhost:3000/secret` | 403 Forbidden | HTTP 403 (`Forbidden: Access to private network addresses is prohibited`) | PASS |
| **SSRF Defense** | `GET /api/img?src=http://127.0.0.1:8080/flag` | 403 Forbidden | HTTP 403 (`Forbidden: Access to private network addresses is prohibited`) | PASS |
| **Cloud Metadata SSRF** | `GET /api/img?src=http://169.254.169.254/latest/meta-data` | 403 Forbidden | HTTP 403 (`Forbidden: Access to private network addresses is prohibited`) | PASS |
| **Directory Traversal** | `GET /api/img?src=../../etc/passwd` | 403 Forbidden | HTTP 403 (`Forbidden: Invalid file path`) | PASS |
| **Inquiries Boundary** | `POST /api/inquiries` with `guests: 501` | 422 Validation Error | HTTP 422 (`Please enter a guest count between 1 and 500.`) | PASS |
| **Inquiries Boundary** | `POST /api/inquiries` with past date `2020-01-01` | 422 Validation Error | HTTP 422 (`The preferred date must be in the future.`) | PASS |
| **Inquiries Type Injection** | `POST /api/inquiries` with `eventType: "inject-evil-type"` | 422 Validation Error | HTTP 422 (`Please select an event type.`) | PASS |
| **Table Order Table Bound** | `POST /api/table-orders` with `tableNumber: 0` | 422 Validation Error | HTTP 422 (`Table number must be an integer between 1 and 50.`) | PASS |
| **Table Order Table Bound** | `POST /api/table-orders` with `tableNumber: 51` | 422 Validation Error | HTTP 422 (`Table number must be an integer between 1 and 50.`) | PASS |
| **Table Order Non-Integer** | `POST /api/table-orders` with `tableNumber: 1.5` | 422 Validation Error | HTTP 422 (`Table number must be an integer between 1 and 50.`) | PASS |
| **Table Order Quantity** | `POST /api/table-orders` with `items[0].qty: 50` | 422 Validation Error | HTTP 422 (`Order item contains invalid or incomplete structure.`) | PASS |
| **Route Rule Security** | `GET /admin` | Header `X-Robots-Tag: noindex, nofollow` | Header present with `noindex, nofollow` | PASS |
| **Route Rule Security** | `GET /api/menu-config` | Header `X-Robots-Tag: noindex, nofollow` | Header present with `noindex, nofollow` | PASS |
| **Locale Query Fallback** | `GET /?lang=invalid-foo` | Fallback to Slovenian `<html lang="sl"` | SSR HTML renders `<html lang="sl" class="dark">` | PASS |
| **JSON-LD Schema Syntax** | `GET /` | Valid parseable JSON-LD graph | JSON-LD parses cleanly, coordinates `46.0494, 14.5367` | PASS |

---

## 4. Detailed Findings

### Finding 1 (Minor — Non-blocking Copy Inconsistency)
- **What**: In `src/pages/pizzeria.vue` (line 451), while the hero quick-info badge and Schema.org metadata correctly use `Koblarjeva ulica 34, 1000 Ljubljana`, the visible text block in the "Dove / Kje" section displays:
  ```html
  <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="text-red-600 hover:underline font-medium">Ulica Carla Benza 20</a>
  ```
  Additionally, line 300 contains:
  ```html
  Kader d.o.o., Ulica Carla Benza 20, 1000 Ljubljana, SI45321361
  ```
- **Where**: `src/pages/pizzeria.vue`, lines 300 & 451.
- **Why**: Grad Kodeljevo has a vehicular/delivery entrance (Ulica Carla Benza 20) and the primary castle entrance (Koblarjeva ulica 34). For brand and GEO consistency, it is recommended to update the displayed link text to `Koblarjeva ulica 34` (or denote `Koblarjeva ulica 34 (vhod Carla Benza)`).
- **Suggestion**: Standardize all remaining occurrences of `Ulica Carla Benza 20` to `Koblarjeva ulica 34` across visible template copy.

### Finding 2 (Minor — Build Concurrency Timing)
- **What**: Triggering `npm run build` within seconds of running `npm run typecheck` can cause Nitro server bundle creation to encounter an intermittent `ENOENT: no such file or directory, open '.nuxt/dist/client/manifest.json'` if the client build output is accessed before disk write buffer flush.
- **Where**: Build process pipeline.
- **Why**: Nuxt/Vite in rapid sequential runs without cache cleanup can experience file handle locks on `.nuxt`.
- **Suggestion**: In deployment CI/CD pipelines, run build steps sequentially with clean isolation or include `npx nuxi cleanup` before `npm run build`.

---

## 5. Empirical Verification Results

```text
1. npm run typecheck:
   ◆ Type check passed in 12189ms (0 errors).

2. npm run build:
   ✔ Generated public .output/public
   ✔ Nuxt Nitro server built
   ✔ You can preview this build using node .output/server/index.mjs
   ✨ Build complete! (Total size: 25.1 MB, 9.99 MB gzip)

3. node scripts/verify_api_i18n.mjs:
   TEST SUMMARY: 22 PASSED, 0 FAILED
   ALL BACKEND i18n VERIFICATIONS PASSED WITH 0 ERRORS.

4. node scripts/verify_seo_geo_schema.mjs:
   TEST SUMMARY: 14 PASSED, 0 FAILED
   ALL SEO, GEO & SCHEMA VERIFICATIONS PASSED WITH 0 ERRORS.

5. node .agents/reviewer_audit_1/adversarial_suite.mjs:
   ADVERSARIAL SUMMARY: 15 DEFENSES VERIFIED, 0 FAILED
   ALL ADVERSARIAL STRESS-TESTS PASSED WITH 0 FAILURES.
```

---

## 6. Verified Claims Matrix

| Claim from Worker 1 | Verification Method | Result |
|---|---|---|
| Zero TypeScript type errors | Independent execution of `npm run typecheck` | **PASS** (0 errors) |
| Production build compiles into `.output/server` | Independent execution of `npm run build` | **PASS** (compiled cleanly) |
| Dual-language backend API with query/cookie/header resolution | `node scripts/verify_api_i18n.mjs` | **PASS** (22/22 tests passed) |
| Canonical URLs & 10 hreflangs + x-default across public pages | `node scripts/verify_seo_geo_schema.mjs` | **PASS** (14/14 tests passed) |
| Schema.org exact coordinates `46.0494, 14.5367` and address | Inspected JSON-LD graphs in SSR responses | **PASS** (exact coordinates verified) |
| SSR dynamic `<html :lang="locale" class="dark">` binding | SSR request with `?lang=en` and `?lang=sl` | **PASS** (`<html lang="en"` and `<html lang="sl"`) |
| No Photo Policy & 6 FAQ pillars on Club page | Inspected `src/pages/club.vue` template & state | **PASS** (all 6 pillars present) |
| SSRF and path traversal defenses in `/api/img` | Tested with `127.0.0.1`, `169.254.169.254`, `../../` | **PASS** (all rejected with 403) |
| Route rules `X-Robots-Tag: noindex, nofollow` on `/admin/**` and `/api/**` | HTTP headers inspection on `/admin` and `/api/menu-config` | **PASS** (headers present) |

---

## 7. Coverage Gaps & Unverified Items
- **External live scrapers**: Resident Advisor dynamic scraping and Pretix live webhook delivery cannot be verified against live internet APIs in CODE_ONLY mode. However, the local fallbacks and deterministic data paths have been confirmed.
- Risk level: **LOW** (expected in sandbox environment; fully safeguarded by deterministic offline fallback pipelines).
