# Handoff Report: Challenger 2 (Adversarial SEO, GEO & Schema Challenger)
**Agent**: Challenger 2  
**Date**: 2026-09-13  
**Working Directory**: `/home/ator/Kader/.agents/challenger_audit_2`  
**Target Build**: `.output/server/index.mjs`

---

## 1. Observation

1. **Production Build & Spawning**:
   - Spawning `.output/server/index.mjs` with `NODE_ENV=production` binds and answers HTTP requests cleanly on designated ports (e.g. port 3388).
2. **Schema.org Structured Data**:
   - 5 public routes (`/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`) were queried via SSR.
   - All `<script type="application/ld+json">` tags parse cleanly with `JSON.parse()` (0 syntax errors).
   - Across all pages, 8 distinct entities contain a `geo` property (`Kader Grad Kodeljevo`, `Pizzeria Bistro Kader`, `Club Kader Grad Kodeljevo`, dynamic club `Event` places, `Kader Najem Prostora`, `Uradna Trgovina Kader`).
   - Every single `geo` property has exact numeric coordinates: `latitude === 46.0494` and `longitude === 14.5367`.
   - 16 postal address definitions exist across the schemas; all 16 strictly define `streetAddress: "Koblarjeva ulica 34"`, `addressLocality: "Ljubljana"`, `postalCode: "1000"`, `addressCountry: "SI"`.
3. **Absence of Deprecated Identifiers**:
   - Recursive scan of `src/`, `public/`, `nuxt.config.ts`, and `.output/` returned ZERO occurrences of outdated latitude `46.0515`, longitude `14.5361`, or misspelled street name `Kobalarjeva`.
4. **Canonicals and 10 Hreflang Tags**:
   - Every route has exactly 1 canonical tag pointing to `https://www.kader.si${path}` (or `https://www.kader.si` on root).
   - Every route provides exactly 10 alternate hreflang tags (`sl, en, de, fr, it, sr, nl, pl, cs, es`) pointing to `https://www.kader.si${path}?lang=${locale}` plus `x-default`.
   - Subpages (e.g. `/pizzeria`) strictly output `/pizzeria?lang=...` and do NOT inherit `/` from `nuxt.config.ts`.
5. **Dynamic Lang Attribute**:
   - Querying `/?lang=en` returns `<html ... lang="en">`.
   - Querying `/?lang=sl` returns `<html ... lang="sl">`.
   - Tested across all 10 languages and subpages (`/pizzeria?lang=en` -> `lang="en"`, `/club?lang=de` -> `lang="de"`).
   - Uppercase `/?lang=EN` normalizes to `lang="en"`.
   - Invalid locale `/?lang=INVALID` safely defaults to `lang="sl"`.
6. **X-Robots-Tag Route Rules**:
   - `/admin`, `/admin/`, `/admin/login`, `/api`, `/api/`, `/api/menu-config`, and `/api/ra-events` all return header `X-Robots-Tag: noindex, nofollow`.
   - Public pages (`/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`) do NOT return `X-Robots-Tag: noindex`.
7. **Legacy Address Leakage in UI Translations (`useLocale.ts`)**:
   - In `src/composables/useLocale.ts`, keys `visitP`, `legalCompanyLine`, `companyLine`, `address`, `locationLine`, `colLocAddress`, `modalLocation`, and `venueAddress` contain `"Ulica Carla Benza 20"`.
   - Direct SSR query to production server `http://127.0.0.1:3388/` and `http://127.0.0.1:3388/pizzeria` produces 20 occurrences of `"Ulica Carla Benza 20"` in the visible HTML body (e.g. line 290 in `src/pages/index.vue`: `{{ t('home.visitP', ...) }}`).
   - Assertion #298 in `test_adversarial_seo.mjs` failed: `ZERO occurrences of legacy 'Ulica Carla Benza 20' in SSR body HTML across all routes and locales (Found in: /?lang=sl, /?lang=en, /?lang=de, /?lang=fr, /?lang=it...) (expected 0, got 20)`.

---

## 2. Logic Chain

1. Observations 1-6 directly prove that Worker 1 fulfilled the specific requirements for Schema.org JSON-LD generation, exact coordinates (`46.0494, 14.5367`), `usePageSeo.ts` canonical/hreflang tags, dynamic HTML lang binding, and `nuxt.config.ts` route rules.
2. Observation 3 verifies that neither the outdated coordinates nor the misspelled street name `Kobalarjeva` exist anywhere in source code or compiled assets.
3. However, Observation 7 proves that while `usePageSeo.ts` and UI hero badges were updated to `"Koblarjeva ulica 34"`, the underlying translation dictionaries in `src/composables/useLocale.ts` were overlooked during the address migration.
4. Consequently, the live SSR HTML on `/` and `/pizzeria` displays `"Ulica Carla Benza 20"` to human visitors while emitting `"Koblarjeva ulica 34"` in Schema.org structured data.
5. This address conflict poses an empirical SEO and trust defect: search engine validation flags discrepancies between visible body text and structured data, and visitors are exposed to conflicting location instructions.

---

## 3. Caveats

- Testing was performed on the compiled production Nitro SSR bundle (`.output/server/index.mjs`) in a CODE_ONLY local environment. External search engine indexing bots (Googlebot, Bingbot) and external webhook callbacks (live Pretix server) were simulated via standard HTTP client calls.
- Authentication for `/admin` requires live Supabase service keys; testing confirmed `/admin` headers include `noindex, nofollow`, though `/admin` returned 500 due to unconfigured database environment variables.

---

## 4. Conclusion

- **SEO Metadata, GEO Coordinates & Schema.org Specification**: **VERIFIED & COMPLIANT**.
  - All 5 public routes provide valid, error-free Schema.org JSON-LD.
  - GEO coordinates are 100% exact (`46.0494, 14.5367`).
  - Canonicals, 10 hreflangs + x-default, and dynamic HTML lang attributes operate accurately.
  - `X-Robots-Tag: noindex, nofollow` is properly enforced on admin and API routes.
- **Actionable Finding for Implementer**:
  - Perform a global replacement of `"Ulica Carla Benza 20"` with `"Koblarjeva ulica 34"` in `src/composables/useLocale.ts` across all 10 language dictionaries to reconcile visible UI body copy with Schema.org postal address.

---

## 5. Verification Method

To independently reproduce all observations and assertions:

1. Build the production application (if not already built):
   ```bash
   npm run build
   ```
2. Run the independent adversarial test harness:
   ```bash
   node /home/ator/Kader/.agents/challenger_audit_2/test_adversarial_seo.mjs
   ```
3. Check the assertion report:
   - 297 assertions pass cleanly.
   - Assert #298 fails with exact reproduction of `"Ulica Carla Benza 20"` occurrences across `/` and `/pizzeria` in all 10 languages.
4. Inspect the test log file:
   ```bash
   cat /home/ator/Kader/.agents/challenger_audit_2/test_output.log
   ```
