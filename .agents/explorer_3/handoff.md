# Handoff Report: Navigation, Routing, and Build/Test Verification Architecture

**Agent**: Explorer 3  
**Date**: 2026-09-12  
**Target Milestone**: M1 Exploration & Architecture Mapping / M4 Verification  
**Status**: COMPLETE (Hard Handoff)  
**Associated Analysis**: `/home/ator/Kader/.agents/explorer_3/analysis.md`

---

## 1. Observation

Direct observations from inspection of the codebase:

### 1.1 Navigation Links & References to `/events` and `/club`
- **`src/components/Header.vue`**:
  - Desktop nav links (lines 13–14):
    ```vue
    13: <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.club') }}</NuxtLink>
    14: <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.events') }}</NuxtLink>
    ```
  - Mobile nav links (lines 61–62):
    ```vue
    61: <NuxtLink to="/club" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.club') }}</NuxtLink>
    62: <NuxtLink to="/events" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.events') }}</NuxtLink>
    ```
  - Language selector dropdown (lines 28–30): Iterates over `localeLabels`:
    ```vue
    28: <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-zinc-900 text-white py-1">
    29:   {{ info.flag }} {{ key.toUpperCase() }}
    30: </option>
    ```
- **`src/components/Footer.vue`**:
  - Quick links (lines 23–24):
    ```vue
    23: <li><NuxtLink to="/club" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.club') }}</NuxtLink></li>
    24: <li><NuxtLink to="/events" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.events') }}</NuxtLink></li>
    ```
- **`src/pages/index.vue`**:
  - Hero CTAs (lines 40 & 46): Line 40 links `to="/events"` (`t('home.heroCtaEventsClub')`) and Line 46 links `to="/club"` (`t('home.heroCtaAboutClub')`).
  - Night Card CTA (line 103): Links `to="/events"` (`t('home.nightCta')`).
- **`src/public/sitemap.xml`**:
  - Line 16: `<loc>https://www.kader.si/club</loc>`
  - Line 22: `<loc>https://www.kader.si/events</loc>`
- **`src/pages/admin/events/index.vue`**:
  - Line 6: Editorial text references `prikaz na kader.si/events`.
- **`src/pages/buyouts.vue`**:
  - Line 158: Already links `to="/club"`.

### 1.2 Route Redirection & Nuxt Config
- **`nuxt.config.ts`**:
  - Currently contains no `routeRules` redirects.
  - Alternate language link tags (lines 31–38) include `sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, and `x-default`. Missing `pl`, `cs`, and `es`.
- **`src/pages/events.vue`**:
  - Currently renders full standalone page (431 lines) fetching `/api/ra-events`.

### 1.3 Baseline Verification Status & Dictionary Metrics
- **`src/composables/useLocale.ts`**:
  - Baseline leaf keys in `sl`: exactly **938 keys**.
  - Current locales: `sl`, `en`, `de`, `fr`, `it`, `sr`, `nl` (all 7 have 100% key parity with 0 missing, 0 extra, and 0 empty strings).
  - Parameterized keys: Exactly 8 keys containing `{param}` or `{{param}}`:
    - `home.visitP` (`{{food}}`, `{{table}}`)
    - `home.viewFullSizeAria` (`{{label}}`)
    - `buyouts.upTo` (`{{n}}`)
    - `buyouts.thankYou` (`{{name}}`)
    - `buyouts.inquiryMessagePrefill` (`{{tier}}`, `{{guests}}`)
    - `lightbox.showImageAria` (`{{n}}`, `{{label}}`)
    - `lightbox.thumbnailAria` (`{{n}}`, `{{label}}`)
    - `craft.phaseBadge` (`{{n}}`)
- **Build Commands Execution**:
  - Command: `npm run typecheck`  
    Result: **Type check passed in 8324ms (0 errors)**
  - Command: `npm run build`  
    Result: **Nitro server built in 1461ms, build complete in ~15s (0 errors)**

---

## 2. Logic Chain

1. **Navigation Consolidation Logic**:
   - Observations in 1.1 show that both `Header.vue` and `Footer.vue` contain adjacent `<NuxtLink to="/club">` and `<NuxtLink to="/events">` elements.
   - When `/events` functionality is merged into `/club`, retaining two navigation entries that both navigate to `/club` creates confusing duplication and cluttered UI.
   - Consolidating these into a single link pointing to `/club` labeled "Klub & Dogodki" (e.g. `t('nav.clubEvents')` or updating `t('nav.club')`) reduces desktop header items from 5 to 4, improving responsive layout on narrow screens while maintaining complete semantic clarity.
   - Direct links in `index.vue` (lines 40 and 103) should be updated directly to `to="/club"` to eliminate unnecessary redirect round-trips for internal visitors.
   - The XML sitemap (`sitemap.xml`) must not list URLs that return redirects; removing `https://www.kader.si/events` prevents crawler indexing errors.

2. **Dual-Tier Redirection Logic**:
   - Direct HTTP visits (bookmarks, QR codes, search engine crawlers, social links) need an immediate HTTP 301 response to preserve link equity and avoid page hydration latency. Nitro `routeRules: { '/events': { redirect: { to: '/club', statusCode: 301 } } }` achieves this at the server/h3 engine level.
   - Internal SPA transitions (client-side router navigation, browser back/forward buttons) require a route component stub in `src/pages/events.vue` with `definePageMeta({ middleware: [(to) => navigateTo({ path: '/club', query: to.query, hash: to.hash }, { redirectCode: 301 })] })` to prevent 404s and preserve query parameters.
   - Global middleware (`.global.ts`) is unnecessary and would impose unnecessary branching overhead on every route transition.

3. **Verification Architecture Logic**:
   - Validating 10 languages across 938 keys (9,380 total data points) manually is error-prone and slow.
   - By creating `scripts/verify_i18n_parity.mjs` using `jiti`, we can import `useLocale.ts` directly in Node.js without a full Nuxt build step, auditing all 9,380 leaf keys, checking for empty strings, validating placeholder parameter preservation, and ensuring genuine non-fallback translations in <500ms.
   - By creating `scripts/verify_club_consolidation.mjs`, we can statically audit `club.vue`, `events.vue`, `nuxt.config.ts`, `Header.vue`, and `Footer.vue` to confirm that Sound System and Floors sections are completely absent, Culture/Safety and Door Rules FAQ are retained, the events modal with `<PretixWidget>` is present, and `/events` redirects cleanly.
   - Running `npm run typecheck` and `npm run build` after these scripts provides final end-to-end confirmation of zero runtime or bundle compilation regressions.

---

## 3. Caveats

- **External Query Parameters**: In the redirect stub, `to.query` must be explicitly forwarded so any marketing or referral tags (e.g., `?utm_source=...` or `?event=...`) are preserved when redirected to `/club`.
- **Legacy Browser Caches**: Because HTTP 301 is aggressively cached by browsers, once deployed, client browsers will remember `/events` -> `/club`. Any future reversal would require a cache-busting mechanism; this is standard and desirable for permanent consolidation.
- **Sitemap Indexing**: `sitemap.xml` is a static file in `src/public/sitemap.xml` (prerendered by Nitro). Removing `/events` from `sitemap.xml` ensures Google Search Console does not flag redirecting sitemap URLs.

---

## 4. Conclusion

1. **Navigation**: In `Header.vue` and `Footer.vue`, remove the redundant `/events` navigation item and update the `/club` item to "Klub & Dogodki" (`t('nav.clubEvents')` or `t('nav.club')`). Update `index.vue` CTAs to `to="/club"` and clean `sitemap.xml`.
2. **Redirection**: Implement dual-tier 301 redirect:
   - Nitro `routeRules` in `nuxt.config.ts`: `'/events': { redirect: { to: '/club', statusCode: 301 } }`
   - Page stub in `src/pages/events.vue`: `navigateTo({ path: '/club', query: to.query }, { redirectCode: 301 })`
3. **Verification**: Implement two automated validation scripts:
   - `scripts/verify_i18n_parity.mjs` (10-language 100% key parity & placeholder audit)
   - `scripts/verify_club_consolidation.mjs` (section audit & redirect validation)
4. **Final Gate**: Require both audit scripts to pass with zero errors, followed by `npm run typecheck` and `npm run build`.

The complete script implementations and before/after code snippets are documented in `/home/ator/Kader/.agents/explorer_3/analysis.md`.

---

## 5. Verification Method

To independently verify the navigation, routing, and verification architecture:

1. **Run Prototype i18n Parity Audit**:
   ```bash
   node .agents/explorer_3/verify_i18n_prototype.mjs
   ```
   *Expected result*: `All current locales verified successfully!` (938 keys, 100% parity across all currently active locales).

2. **Run Club Consolidation & Architecture Inspector**:
   ```bash
   node .agents/explorer_3/verify_club_consolidation_prototype.mjs
   ```
   *Expected result*: Displays current vs target architectural delta report.

3. **Execute TypeScript Static Type Checking**:
   ```bash
   npm run typecheck
   ```
   *Expected result*: `Type check passed` with zero errors.

4. **Execute Production Build**:
   ```bash
   npm run build
   ```
   *Expected result*: `Build complete!` generating `.output/server/index.mjs`.

5. **Post-Implementation Invalidation Conditions**:
   - If `verify_i18n_parity.mjs` reports missing keys in `pl`, `cs`, or `es`, ensure all 938 leaf keys were accurately ported.
   - If `verify_club_consolidation.mjs` fails, ensure `siteImages.club_sound_system` and `siteImages.club_floor1_bg` were removed and `PretixWidget` was integrated into `club.vue`.
   - If `npm run typecheck` fails, ensure any new props or emitted events in `club.vue` adhere to TypeScript contracts.
