# Handoff Report — UI, Components & Performance Explorer (Explorer 1)

**From:** Explorer 1 (`.agents/explorer_audit_1`)  
**To:** Orchestrator (`.agents/orchestrator`) / Implementer (`.agents/worker_audit_1`)  
**Date:** 2026-09-13T10:23:00Z  
**Type:** Hard Handoff (Investigation & Forensic Mapping Complete)

---

## 1. Observation

Direct observations and evidence collected from code inspection and tool outputs:

1. **Homepage Duplication & Translation Neglect (`src/pages/index.vue` vs `src/pages/pizzeria.vue`)**:
   - `diff -u src/pages/index.vue src/pages/pizzeria.vue` revealed that `index.vue` (910 lines) is a 99% verbatim duplicate of `pizzeria.vue` (924 lines), with only minor modal wrapping differences.
   - `git log -n 1 --stat src/pages/index.vue` shows commit `b0fff5c3b13bd898593358af2c8e96cc0e1ab9e3` replaced 360 lines of the castle homepage with 840 lines from `pizzeria.vue`.
   - `src/composables/useLocale.ts` lines 106–168 define a complete 10-language dictionary under `"home"` (`home.dayTitle`, `home.dayP`, `home.nightTitle`, `home.nightP`, `home.basementTitle`, `home.secondFloorTitle`, `home.terraceTitle`, `home.heroTaglineQuote`, `home.upcomingTitle`, etc.). These keys are currently **0% referenced** in `index.vue`.
   - In `src/pages/index.vue`, line 618: `title: computed(() => t('seo.pizzeria.title'))`, and lines 590–615 define `@type: 'PizzaRestaurant'` instead of a multi-venue `LocalBusiness` / `NightClub` + `Restaurant`.

2. **Orphaned Rich Components**:
   - `grep_search` for `PizzeriaCraft` across `src/` yielded **0 matches**. `src/components/PizzeriaCraft.vue` (355 lines) contains a 5-metric HUD, 5-phase Neapolitan dough telemetry explorer, pizzaiolo quotes, and translations, but is completely unused.
   - `grep_search` for `ProvenanceBadge` across `src/` yielded **0 matches**. `src/components/ProvenanceBadge.vue` (327 lines) contains a canonical D.O.P./I.G.P. ingredient registry and interactive tooltips, but is completely unused.
   - `grep_search` for `ClubDjPlayer` across `src/` yielded **0 matches**. `src/components/ClubDjPlayer.vue` (299 lines) contains a Klipsch audio player with live DJ streaming, interactive waveform visualizer, and volume control, previously placed on `club.vue` (commit `fc78209f`) and dropped in commit `b0fff5c3`.

3. **Orphaned Route `/shop` (`src/pages/shop.vue`)**:
   - `grep_search` for `/shop` in `src/` returned matches only in `src/pages/shop.vue` and `src/public/sitemap.xml`.
   - Neither `src/components/Header.vue` (lines 11–15, 56–62) nor `src/components/Footer.vue` (lines 20–25) contain any link to `/shop`.
   - In `src/pages/shop.vue`, line 45: `const pretixBase = (config.public.pretixUrl as string || 'http://192.168.64.147')` falls back to internal private IP.

4. **Dead Code & State Inconsistencies**:
   - In `src/pages/pizzeria.vue`, lines 575–583: `<div v-if="zoomOpen" ... @click="zoomOpen = false">`. `zoomOpen` is declared on line 659 as `ref(false)` and is never toggled `true`. `activeView` (line 656) is defined as `ref<'digital' | 'printed'>('digital')` but never referenced in template.
   - In `src/pages/index.vue` (line 714) and `src/pages/pizzeria.vue` (line 728): `navCategories` is computed with 5 categories (`all`, `pizza`, `panuozzo`, `narezek`, `solate`), but never rendered in the template.
   - In `src/components/Footer.vue`, line 89: `EnvelopeIcon` is imported but unused. Lines 95–97 define `FacebookIcon`, `InstagramIcon`, and `TwitterIcon` render functions, but `<template>` has 0 social links.

5. **Client Asset Loading, CWV & Typography**:
   - 12+ below-the-fold image elements across `Footer.vue:7`, `ImageLightboxModal.vue:113`, `index.vue:263,421,430`, `pizzeria.vue:264,422,431`, `club.vue:264`, and `buyouts.vue:62,175,185,195,205` are missing `loading="lazy"` and `decoding="async"`.
   - In `nuxt.config.ts`, line 30: Google Fonts link loads `Playfair Display` and `Montserrat` with `&display=swap`. However, `tailwind.config.ts` line 25 specifies `sans: ['Inter', 'sans-serif']`. `Inter` is **not loaded** in Google Fonts stylesheet, causing cross-platform fallback to generic sans-serif.
   - `src/assets/styles/main.css` line 48 defines `.content-visibility-auto`, but `grep_search` shows it is used on **zero** elements in `src/`.
   - `src/plugins/pretix.client.ts` line 17 loads `${pretixUrl}/widget/v2.en.js` on every page load and hardcodes English locale.
   - `src/components/ClubDjPlayer.vue` line 185–197: `requestAnimationFrame(updateWaveform)` runs on every animation frame unconditionally, even when audio is paused.

6. **Address & Geographic Coordinates Discrepancies**:
   - `src/pages/pizzeria.vue` line 615, `src/pages/club.vue` line 625, 650, 668, and `src/pages/buyouts.vue` line 369 have the typo `'Kobalarjeva ulica 20'` (extra 'a').
   - `src/components/Footer.vue` lines 13, 33 and `src/pages/index.vue` lines 72, 453 use `"Ulica Carla Benza 20"`.
   - `PROJECT.md` specifies `"Koblarjeva ulica 34, 1000 Ljubljana"` and coordinates `46.0494, 14.5367`.
   - Existing schemas currently output `46.0515, 14.5361`.

7. **Build & Typecheck Results**:
   - `npm run typecheck` returned: `Type check passed in 10317ms` (0 errors).
   - `npm run build` returned: `Client built in 9570ms`, `Server built in 6491ms`, `Build complete!` (clean Nitro server bundle in `.output/server`).

---

## 2. Logic Chain

1. **Homepage Integrity**:
   - *Observation:* Commit `b0fff5c3` pasted `pizzeria.vue` over `index.vue`, duplicating the pizza menu, `@type: 'PizzaRestaurant'`, and `seo.pizzeria.title`.
   - *Inference:* Search engines and visitors viewing `/` receive no overview of Grad Kodeljevo, no night club information, and redundant content identical to `/pizzeria`.
   - *Resolution:* Rebuilding `index.vue` with the existing `home.*` translations will immediately restore the Day/Night dual identity, connect to `/pizzeria` and `/club`, showcase upcoming events, and provide canonical homepage SEO.

2. **Component Value Realization**:
   - *Observation:* `PizzeriaCraft.vue` (355 lines) and `ProvenanceBadge.vue` (327 lines) already contain tested, translated content detailing Caputo 00 flour, 48h fermentation, 450°C oven specs, and D.O.P. certifications.
   - *Inference:* Leaving them unreferenced wastes ~700 lines of high-quality UI assets while `/pizzeria` displays static text.
   - *Resolution:* Embedding `PizzeriaCraft.vue` and `ProvenanceBadge.vue` into `/pizzeria` elevates the digital culinary experience to match world-class standards.
   - *Observation:* `ClubDjPlayer.vue` (299 lines) was created specifically for Klipsch sound system curation on `/club`.
   - *Inference:* Re-mounting it directly beneath `/club`'s hero re-establishes the venue's electronic music and sound identity.

3. **Performance & CWV Optimization**:
   - *Observation:* Below-fold images lack `loading="lazy"` and `decoding="async"`, and several lack width/height.
   - *Inference:* Browsers download offscreen images during initial page load, competing with LCP bandwidth and triggering Cumulative Layout Shifts (CLS).
   - *Resolution:* Adding `loading="lazy"`, `decoding="async"`, and explicit dimensions to all below-fold images ensures optimal LCP and zero CLS.
   - *Observation:* `Inter` is not included in the Google Fonts link in `nuxt.config.ts`.
   - *Inference:* Non-Apple/non-Inter devices fall back to system fonts, altering text metrics and visual hierarchy.
   - *Resolution:* Adding `Inter:wght@300..900` to the Google Fonts link with `display=swap` guarantees unified rendering.

4. **Navigation & Route Completeness**:
   - *Observation:* `/shop` is in `sitemap.xml` but absent from `Header.vue` and `Footer.vue`.
   - *Inference:* Users cannot discover the merch shop organically.
   - *Resolution:* Adding `/shop` to Header and Footer resolves the orphan route.

---

## 3. Caveats

- **Physical Address Canonicalization**: `docs/RESEARCH.md` notes that current public web mentions sometimes reference `Ulica Carla Benza 20, 1000 Ljubljana`, whereas cultural monument cadastral registries and `PROJECT.md` specify `Koblarjeva ulica 34, 1000 Ljubljana` (with coordinates `46.0494, 14.5367`). The implementer should align all Schema.org markup to the `PROJECT.md` contract (`Koblarjeva ulica 34`, `46.0494, 14.5367`) while keeping customer-facing directions clear.
- **Pretix Webhook / Backend**: Explorer 1 audited client-side Pretix integration and widget behavior. Server-side Pretix webhook signature verification is under the jurisdiction of Explorer 3 / Implementer.
- No other caveats.

---

## 4. Conclusion

The Kader frontend architecture is robust (clean TypeScript, passing SSR builds, complete 10-language translations in `useLocale.ts`), but suffers from significant content regression (homepage duplicate of pizzeria), component isolation (orphaned `PizzeriaCraft`, `ProvenanceBadge`, `ClubDjPlayer`), route isolation (orphaned `/shop`), and asset loading omissions (missing image lazy loading and missing Inter font link).

Executing the 7-step implementation blueprint detailed in `/home/ator/Kader/.agents/explorer_audit_1/ui_performance_audit.md` will restore full platform integrity, eliminate layout glitches, enhance CWV scores, and activate 100% of the platform's UI components.

---

## 5. Verification Method

To independently verify the findings and any subsequent implementation:

1. **Verify Typecheck Integrity**:
   ```bash
   npm run typecheck
   ```
   *Expected result:* 0 errors.

2. **Verify SSR Production Build**:
   ```bash
   npm run build
   ```
   *Expected result:* Production server bundle generated in `.output/server` and assets in `.output/public` without warnings or failures.

3. **Verify Route Existence & Orphan Resolution**:
   - Inspect `src/components/Header.vue` and `src/components/Footer.vue` to confirm `/`, `/pizzeria`, `/club`, `/buyouts`, and `/shop` are present.
   - Inspect `src/pages/index.vue` to confirm `t('home.*')` translations are used instead of `t('pizzeria.*')`.

4. **Verify Component Integration**:
   - Search for `<PizzeriaCraft` and `<ProvenanceBadge` in `src/pages/pizzeria.vue`.
   - Search for `<ClubDjPlayer` in `src/pages/club.vue`.

5. **Verify Image Attributes**:
   - Grep for `<img` in `src/pages/` and verify `loading="lazy"` and `decoding="async"` are present on all below-the-fold images.
