# Handoff Report: Challenger 2 — Empirical Adversarial Verification of Club & Events Consolidation

**Agent**: Challenger 2 (critic, specialist)  
**Date**: 2026-09-12  
**Task**: Adversarial verification and stress testing of Club & Events consolidation, redirection, navigation links, and SSR compatibility  
**Status**: COMPLETE (Hard Handoff)  
**Artifacts Generated**:
- Challenge Report: `/home/ator/Kader/.agents/challenger_2/challenge.md`
- Adversarial Test Suite: `/home/ator/Kader/.agents/challenger_2/stress_test_club.mjs`
- Live SSR Test Suite: `/home/ator/Kader/.agents/challenger_2/test_ssr_server.mjs`
- Briefing & State: `/home/ator/Kader/.agents/challenger_2/BRIEFING.md`
- Progress Log: `/home/ator/Kader/.agents/challenger_2/progress.md`

---

## 1. Observation

Direct empirical observations, command executions, and exact code quotes:

### 1.1 Pruning of Floors 01/02 & Sound System Specs
- File: `/home/ator/Kader/src/pages/club.vue`
- Floors markers: Zero occurrences of `club.floorsTitle`, `club.exploreSpaces`, `club.floor01Title`, `club.floor02Title`, `siteImages.club_floor1_bg`, or `siteImages.club_floor2_bg`.
- Sound system markers: Zero occurrences of `club.theSound`, `club.soundTitle`, `club_sound_system`, `showSpecs`, or `specs` computed state.
- Live SSR check: HTTP response for `GET /club` produced 186,753 bytes with zero matches for `Klipsch La Scala Audio Architecture`, `Max Continuous SPL`, or `club.floorsTitle`.

### 1.2 Retention of Club Culture / Safety & Door Rules FAQ Accordion
- File: `/home/ator/Kader/src/pages/club.vue`, lines 303–381 & 628–677.
- Header texts: `club.doorPolicySub` ("Ljubljanska klubska kultura, svoboda in varnost") and `club.doorPolicyTitle` ("Pravila na vratih & Pogosta vprašanja").
- Six pillars confirmed: `photo`, `dress`, `age`, `safer`, `payment`, `sound`.
- Accessibility bindings: `:aria-expanded="openFaqIndex === idx"`, `:aria-controls="'faq-content-' + idx"`.
- Animation style: `:style="{ gridTemplateRows: openFaqIndex === idx ? '1fr' : '0fr' }"`.
- Toggle logic: `openFaqIndex.value = openFaqIndex.value === idx ? null : idx`.

### 1.3 Interactive Events Experience Integration
- File: `/home/ator/Kader/src/pages/club.vue`, lines 75–300, 398–507, 680–847.
- Countdown banner: Displays `countdown.days`, `countdown.hours`, `countdown.minutes`, `countdown.seconds`. Interval starts in `onMounted()` and is explicitly cleaned up in `onBeforeUnmount()` via `clearInterval(countdownInterval)`.
- Event card grid: Renders flyer (`event.flyer_url || fallbackImage`), genres, date badge (`listDate(event)`), cost/free admission badge, lineup tags, start/end time, details modal trigger, and external Resident Advisor link (`event.ra_url`).
- Teleported detail modal: `<Teleport to="body">` with `<PretixWidget>`, Olaii direct checkout fallback, Free Admission badge, closed event notice, ESC keydown dismissal (`handleKeydown`), and backdrop click handler (`@click.self="closeModal"`).
- Past events archive: Collapsible archive rendered with flyer thumbnails, event title, artists, and formatted date label (`pastDateLabel`).
- JSON-LD Structured Data: Configured with `@graph` incorporating `NightClub` (`@id: https://www.kader.si/club#club`) and `EventSeries` (`@id: https://www.kader.si/club#events`).

### 1.4 Dual-Tier 301 Redirection
- Server-side Nitro route rules (`/home/ator/Kader/nuxt.config.ts`, lines 46–48):
  ```ts
  routeRules: {
    '/events': { redirect: { to: '/club', statusCode: 301 } }
  },
  ```
- Client/SSR route stub (`/home/ator/Kader/src/pages/events.vue`, lines 1–11):
  ```vue
  <script setup lang="ts">
  definePageMeta({
    middleware: [
      (to) => {
        return navigateTo(
          { path: '/club', query: to.query, hash: to.hash },
          { redirectCode: 301 }
        )
      }
    ]
  })
  </script>
  ```
- Live HTTP verification (`test_ssr_server.mjs` against Nitro server):
  * `GET /events` -> HTTP 301, `Location: /club`
  * `GET /events/` -> HTTP 301, `Location: /club`
  * `GET /events?tag=techno` -> HTTP 301, `Location: /club?tag=techno`
  * `GET /events?a=1&b=2` -> HTTP 301, `Location: /club?a=1&b=2`

### 1.5 Navigation Links Cleanliness
- `src/components/Header.vue`: Lines 13 and 60 link to `/club` with `{{ t('nav.club') }} &amp; {{ t('nav.events') }}`. Zero links to `/events`.
- `src/components/Footer.vue`: Line 23 links to `/club` with `{{ t('nav.club') }} &amp; {{ t('nav.events') }}`. Zero links to `/events`.
- `src/pages/index.vue`: Hero CTA and Club Night CTA point to `/club`. Zero links to `/events`.
- `src/public/sitemap.xml`: Contains `<loc>https://www.kader.si/club</loc>`. Zero entries for `/events`.

### 1.6 Adversarial Findings & Flaws
- **Flaw 1 (Event Category Filtering)**: `displayEvents` in `src/pages/club.vue` (line 752) initializes its event list from `clubEvents` instead of `events.value`. Because `clubEvents` pre-filters by house/techno/electronica/club/dj/night, any live acoustic, ambient, jazz, or pizzeria events returned by the RA API are discarded before `activeCategory` is evaluated. If only non-club events exist, `displayEvents` falls back to mock `curatedEvents`.
- **Flaw 2 (XSS Sanitization)**: `cleanLineup` in `src/pages/club.vue` (line 840) uses a single-pass regex `replace(/<[^>]*>/g, '')` and renders the output via `v-html` (line 461). Tested with nested tags `<scri<script>pt>alert(1)</script>`, producing unescaped `<script>` tags.
- **Flaw 3 (Build Concurrency)**: Running `nuxt dev` or multiple `nuxt build` commands simultaneously in the shared workspace causes race condition errors (`ENOENT: manifest.json`, `TSCONFIG_ERROR`) due to uncoordinated `.nuxt` directory mutations. Standalone builds execute cleanly.
- **Flaw 4 (Admin UI Residual)**: `src/pages/admin/events/index.vue` line 6 still contains the obsolete string `kader.si/events`.

### 1.7 Automated Test & Build Execution
- `npm run typecheck`: Passed in 13430ms with 0 errors.
- `node .agents/challenger_2/stress_test_club.mjs`: 24 checks passed, 2 warnings (Flaw 1 & Flaw 2).
- `node .agents/challenger_2/test_ssr_server.mjs`: 12 checks passed (100%).
- `npm run build`: Verified successful production build generating `.output/server/index.mjs` (385 bytes, full Nitro server).

---

## 2. Logic Chain

1. **Section Pruning Verification (Observation 1.1)**:
   - Automated keyword searching and AST analysis across `src/pages/club.vue` confirm that all former floor specifications and the Klipsch technical specs table were removed.
   - Verification of the SSR HTML output confirms that the compiled server bundle does not render or transmit any of the removed sections, fulfilling Milestone 3 requirements.

2. **Culture/Safety & Door Rules FAQ Integrity (Observation 1.2)**:
   - The 6 pillars are explicitly defined in `faqItems` and mapped in the template.
   - Inspection of ARIA attributes (`aria-expanded`, `aria-controls`) and CSS grid row animations confirms that accessibility and smooth interactive transitions are maintained.

3. **301 Redirection & Canonical SEO Integrity (Observation 1.4 & 1.5)**:
   - Redirection operates at two layers: Nitro route rules intercept incoming server requests and return an immediate HTTP 301; the Vue page middleware intercepts in-app transitions and forwards query parameters and hash fragments.
   - Live HTTP requests confirm that `/events`, `/events/`, and query-bearing URLs (`/events?tag=techno`) are properly redirected to `/club`.
   - The removal of `/events` from `Header.vue`, `Footer.vue`, `index.vue`, and `sitemap.xml` prevents search engine crawlers and site visitors from encountering redirect loops or outdated links.

4. **SSR Production Compatibility (Observation 1.7)**:
   - `nuxt typecheck` passes with zero TypeScript diagnostics.
   - The compiled Nitro server runs successfully in standalone Node.js and renders `/club` with HTTP 200 and complete HTML, confirming SSR compatibility.

5. **Empirical Flaw Identification (Observation 1.6)**:
   - The deduction that `displayEvents` excludes non-club programming was empirically demonstrated by providing mock acoustic events and observing that `clubEvents` discarded them and triggered the mock `curatedEvents` fallback.
   - The regex nested-tag vulnerability was confirmed by passing an attack string into `cleanLineup` and observing tag survival.

---

## 3. Caveats

- **External Pretix Webhooks**: Live incoming webhooks from external Pretix endpoints were not tested with live network webhooks due to CODE_ONLY environment restrictions. Widget rendering and fallback links were verified locally.
- **Admin Event Creation Form**: Backend Supabase table schema for custom events was not altered as part of Milestone 3; only public page consolidation and routing were in scope.

---

## 4. Conclusion

The consolidation of `/events` into `/club`, the removal of Floors 01/02 and Sound System specs, the retention of Culture/Safety and Door Rules FAQ, the 301 redirection, navigation updates, and SSR compatibility are **empirically verified and functional**.

However, two implementation issues should be addressed by the implementer:
1. **Fix `displayEvents` base list**: Change `let list = (clubEvents.value && clubEvents.value.length > 0) ? clubEvents.value : curatedEvents` to `let list = (events.value && events.value.length > 0) ? events.value : curatedEvents` in `src/pages/club.vue` so that non-club/live events can be viewed under the 'All Events' and 'Live' filter tabs.
2. **Eliminate `v-html` on lineup**: Change `v-html="cleanLineup(selectedEvent.lineup)"` to standard text interpolation `{{ cleanLineup(selectedEvent.lineup) }}` to prevent potential XSS injection from untrusted event descriptions.

---

## 5. Verification Method

To independently reproduce and verify all observations:

1. **Run TypeScript Check**:
   ```bash
   npm run typecheck
   ```
2. **Run Independent Adversarial Suite**:
   ```bash
   node /home/ator/Kader/.agents/challenger_2/stress_test_club.mjs
   ```
3. **Run SSR Live Server Test**:
   ```bash
   node /home/ator/Kader/.agents/challenger_2/test_ssr_server.mjs
   ```
4. **Inspect Redirection Manually via Curl**:
   ```bash
   PORT=3088 node .output/server/index.mjs &
   curl -I http://127.0.0.1:3088/events
   curl -I "http://127.0.0.1:3088/events?tag=techno"
   kill %1
   ```
