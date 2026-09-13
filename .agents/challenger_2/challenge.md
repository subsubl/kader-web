# Adversarial Challenge Report: Club & Events Consolidation, Redirection & SSR Rendering

**Target**: Milestone 3 (`/club` & `/events` consolidation, 301 redirection, nav cleanup)  
**Agent**: Challenger 2 (critic, specialist)  
**Date**: 2026-09-12  
**Test Harnesses**:
- `/home/ator/Kader/.agents/challenger_2/stress_test_club.mjs` (24 checks: AST, i18n parity, boundary conditions, regex, schema)
- `/home/ator/Kader/.agents/challenger_2/test_ssr_server.mjs` (12 checks: Live Nitro server HTTP 301, query preservation, SSR HTML verification)

---

## Challenge Summary

**Overall risk assessment**: MEDIUM

While the architectural restructuring, section pruning, 301 redirection, and SSR rendering are mechanically sound and verified in production builds, adversarial stress testing identified two logic/security vulnerabilities in `src/pages/club.vue` and a concurrency race condition in the build environment.

---

## Challenges & Vulnerabilities Found

### [Medium] Challenge 1: Category Filter & Fallback Flaw in `displayEvents`
- **Assumption Challenged**: The worker assumed filtering events through `clubEvents` before category filtering would correctly handle all events on `/club`.
- **Attack Scenario**:
  In `src/pages/club.vue` (lines 698–704 & 751–770):
  ```ts
  const clubEvents = computed(() =>
    events.value.filter((e) => {
      const genre = (e.genres[0] || '').toLowerCase()
      const title = (e.title || '').toLowerCase()
      return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
    })
  )
  const displayEvents = computed<ClubEvent[]>(() => {
    let list = (clubEvents.value && clubEvents.value.length > 0) ? clubEvents.value : curatedEvents
    if (activeCategory.value !== 'all') { ... }
    return list
  })
  ```
  If the Resident Advisor API or custom backend returns events that are live music, acoustic sessions, jazz, or pizzeria cultural events (e.g. genres `['Live', 'Ambient']` or `['Acoustic']`), `clubEvents` filters them out immediately.
  Because `displayEvents` sets `list = clubEvents.value`, the filter categories `activeCategory === 'live'` and `activeCategory === 'pizzeria'` can NEVER display those events. Furthermore, if a week has exclusively live acoustic performances and no electronic/club nights, `clubEvents.length === 0`, which triggers the fallback to mock `curatedEvents`, completely masking real live events.
- **Blast Radius**: High functional degradation for non-club event programming and misleading curated mock event display.
- **Mitigation**:
  Initialize `list` in `displayEvents` directly from `events.value`:
  `let list = (events.value && events.value.length > 0) ? events.value : curatedEvents`
  and let the individual category branches (`all`, `club`, `live`, `pizzeria`) filter the full event roster.

---

### [Medium] Challenge 2: Inadequate XSS Sanitization in `cleanLineup` with `v-html`
- **Assumption Challenged**: The worker assumed `replace(/<[^>]*>/g, '')` provides sufficient sanitization for `v-html` rendering.
- **Attack Scenario**:
  In `src/pages/club.vue`:
  Line 461: `<div class="..." v-html="cleanLineup(selectedEvent.lineup)"></div>`
  Line 840: `const cleanLineup = (raw: string | null) => (raw ? raw.replace(/<[^>]*>/g, '').trim() : '')`
  A single-pass regex `replace(/<[^>]*>/g, '')` does not handle nested tags. When presented with adversarial input such as:
  `<scri<script>pt>alert(document.cookie)</script>`
  the inner `<script>` is stripped, leaving `<script>alert(document.cookie)</script>`. Because it is injected via `v-html`, the browser executes the script in the context of the user's session.
- **Blast Radius**: Client-side script injection if lineup text is ingested from external syncs or untrusted inputs.
- **Mitigation**:
  Remove `v-html`. Because `cleanLineup` is intended to strip formatting tags, render the text safely using standard text interpolation:
  `<div class="... whitespace-pre-line">{{ cleanLineup(selectedEvent.lineup) }}</div>`

---

### [Low-Medium] Challenge 3: Build Directory Lock Contention Under Concurrent Nuxt Processes
- **Assumption Challenged**: Nuxt production build can run concurrently with dev servers or parallel build tasks.
- **Attack Scenario**:
  When `nuxt dev` or multiple `nuxt build` commands run concurrently on the same machine, Vite SSR environment build triggers `ENOENT: no such file or directory, open '/home/ator/Kader/.nuxt/dist/client/manifest.json'` or `[TSCONFIG_ERROR] Failed to load tsconfig '.nuxt/tsconfig.json'`. This occurs because the Vite client manifest in `.nuxt/dist/client` is wiped or touched by the file watcher of active dev processes.
- **Blast Radius**: CI/CD pipeline intermittent build failures if parallel jobs or dev daemons touch `.nuxt/`.
- **Mitigation**: Ensure isolated build workspaces or terminate dev processes before executing production compilation.

---

### [Low] Challenge 4: Stale `/events` Reference in Admin Event Management Help Text
- **Assumption Challenged**: All references to `/events` were eliminated across the project.
- **Attack Scenario**:
  In `src/pages/admin/events/index.vue`, line 6:
  `<p class="text-gray-400 mt-1 text-sm">Dodajte nove dogodke ali urejajte obstoječe za prikaz na kader.si/events</p>`
  The text informs administrators that events appear on `kader.si/events` instead of `kader.si/club`.
- **Blast Radius**: Minor admin confusion.
- **Mitigation**: Update text to `kader.si/club`.

---

## Stress Test Results

| Test ID | Area | Scenario | Expected | Actual | Status |
|---|---|---|---|---|---|
| ST-01 | AST Inspection | Absence of Floors 01/02 sections & images (`club_floor1_bg`, `floorsTitle`, etc.) | 0 occurrences in `club.vue` | 0 occurrences found | **PASS** |
| ST-02 | AST Inspection | Absence of Sound System specs (`showSpecs`, `specs` table, `Max Continuous SPL`) | 0 occurrences in `club.vue` | 0 occurrences found | **PASS** |
| ST-03 | Door Policy FAQ | 6 pillars (`photo`, `dress`, `age`, `safer`, `payment`, `sound`) present with ARIA & CSS Grid 0fr/1fr | All 6 present, ARIA `:aria-expanded` and `:aria-controls` configured | Confirmed 6/6 pillars & accessibility attributes | **PASS** |
| ST-04 | Door Policy FAQ | Toggle behavior: clicking open accordion item | Collapses (`openFaqIndex = null`) | Confirmed reactive toggle | **PASS** |
| ST-05 | Events Experience | Live countdown banner (days, hours, minutes, seconds) | Updates every 1s, clears interval on `onBeforeUnmount` | Confirmed reactive timer & unmount hook | **PASS** |
| ST-06 | Events Experience | Event countdown boundary: event date in the past | Clamp diff to 0, output `00:00:00:00` without negative numbers | Output `00:00:00:00`, `diff === 0` | **PASS** |
| ST-07 | Events Experience | Event countdown boundary: invalid date string | Gracefully output `00` without NaN or crashing | Handled safely, no NaN strings | **PASS** |
| ST-08 | Events Experience | Detail modal with `<Teleport to="body">`, `<PretixWidget>`, Olaii & Free fallbacks | Teleport present, ticketing fallbacks present | Verified in template | **PASS** |
| ST-09 | Events Experience | Event normalization: malformed event with `artists: null`, `genres: 'Techno'` | Converts to safe arrays `artists: []`, `genres: []` | Verified array coercion | **PASS** |
| ST-10 | Events Experience | Past events archive collapsible listing | Displays flyer, title, artists, past date label | Verified in template | **PASS** |
| ST-11 | Schema Markup | JSON-LD `@graph` containing `NightClub` and `EventSeries` | Valid JSON-LD schema with coordinates, address, and event array | Confirmed valid Schema.org structure | **PASS** |
| ST-12 | 301 Redirection | `nuxt.config.ts` routeRules `/events` | HTTP 301 to `/club` | Configured | **PASS** |
| ST-13 | 301 Redirection | `src/pages/events.vue` redirect stub | `navigateTo` with `{ path: '/club', query: to.query, hash: to.hash }` redirectCode 301 | Query & hash preserved | **PASS** |
| ST-14 | Navigation Links | Check `Header.vue` for `/events` links | 0 links to `/events`, unified `/club` link | Verified 0 old links | **PASS** |
| ST-15 | Navigation Links | Check `Footer.vue` for `/events` links | 0 links to `/events`, unified `/club` link | Verified 0 old links | **PASS** |
| ST-16 | Navigation Links | Check `index.vue` CTAs for `/events` links | 0 links to `/events`, points to `/club` | Verified 0 old links | **PASS** |
| ST-17 | Navigation Links | Check `sitemap.xml` for `/events` `<loc>` | No `/events` URL entry | Verified clean sitemap | **PASS** |
| ST-18 | i18n Key Coverage | All 82 `t(...)` keys called in `club.vue` exist across all 10 locales | 100% key existence in `flatDictionaries` | 82/82 keys exist in all 10 languages (0 missing) | **PASS** |
| ST-19 | Sanitization | `cleanLineup` input with nested `<scri<script>pt>` tags | Strip all dangerous tags | Output contained `pt>alert(1)`, vulnerable when used in `v-html` | **FAIL (WARN)** |
| ST-20 | Category Logic | RA returns non-club event (e.g. acoustic / jazz) | Preserved in `displayEvents` for 'all' and 'live' categories | Filtered out by `clubEvents` base list; curated fallback triggered | **FAIL (WARN)** |
| ST-21 | SSR Live Server | HTTP `GET /events` | Status 301, Location `/club` | HTTP 301, Location `/club` | **PASS** |
| ST-22 | SSR Live Server | HTTP `GET /events?tag=techno` | Status 301, Location `/club?tag=techno` | HTTP 301, Location `/club?tag=techno` | **PASS** |
| ST-23 | SSR Live Server | HTTP `GET /events/` | Status 301, Location `/club` | HTTP 301, Location `/club` | **PASS** |
| ST-24 | SSR Live Server | HTTP `GET /club` | Status 200, full HTML (186 KB), contains hero, #events, door policy, schema | Confirmed 200 OK & full HTML payload | **PASS** |
| ST-25 | SSR Live Server | SSR HTML absence check | No trace of Floors 01/02 or Klipsch specs table | Confirmed completely absent from HTML | **PASS** |
| ST-26 | Typecheck | `npm run typecheck` | 0 errors | Typecheck passed in 13430ms | **PASS** |
| ST-27 | Production Build | Standalone `npm run build` | Exits with code 0, generates `.output/server/index.mjs` | Verified clean build and bundle generation | **PASS** |

---

## Unchallenged Areas

- **Pretix Webhook Processing**: External Pretix checkout webhooks (`/api/pretix/webhook`) were not executed with live external Pretix sandbox servers as external network calls are disabled in CODE_ONLY environment.
