# Changes Implemented in Milestone 3: Merge /events into /club Page & Simplify Club Sections

## 1. `src/pages/club.vue`
- **Removed Detailed Sound System Section**: Deleted the Klipsch La Scala audio section and specs toggle table. Removed unused script state `showSpecs` and `specs`.
- **Removed The Floors 01/02 Section**: Deleted Floor 01 Basement and Floor 02 Ground Level sections (`siteImages.club_floor1_bg`, `siteImages.club_floor2_bg`, `club.floorsTitle`, `club.exploreSpaces`, `club.floor01Title`, `club.floor02Title`).
- **Retained Club Culture / Safety & Door Rules / FAQ**: Preserved the full 6-pillar Berlin door policy accordion (`photo`, `dress`, `age`, `safer`, `payment`, `sound`) with subtitles `club.doorPolicySub` ("Ljubljanska klubska kultura, svoboda in varnost") and title `club.doorPolicyTitle` ("Pravila na vratih & Pogosta vprašanja"), complete with smooth CSS Grid 0fr->1fr expansion, accessible ARIA attributes, and reactive accordion toggles.
- **Embedded Complete Interactive Events Experience**:
  - **Live Countdown Banner**: Real-time countdown engine computing days, hours, minutes, seconds down to the next upcoming night with 1000ms interval and unmount cleanup.
  - **Category Filter Tabs**: Added reactive filter buttons for All Events (`events.allEvents`), Club (`events.filterClub`), Live (`events.filterLive`), and Pizzeria (`events.filterPizzeria`).
  - **Upcoming RA Events Grid**: Responsive 3-column dark techno grid featuring flyer imagery, genre tags, formatted event dates, free admission badges, artist lineup tags, start/end times, details CTA, and direct RA links.
  - **Interactive Event Detail Modal**: Integrated `<Teleport to="body">` with `<PretixWidget>` ticket purchasing, Olaii button fallback, direct checkout fallback, Free Admission badges, closed event notices, ESC key dismiss listener, and backdrop click handler.
  - **Past Events Archive**: Rendered collapsible past events archive list with flyer thumbnails, event title, artists list, and date formatting.
  - **Structured Data Schema**: Configured JSON-LD schema markup with `@graph` incorporating `NightClub` and `EventSeries` metadata.

## 2. `nuxt.config.ts`
- Added Nitro `routeRules` with HTTP 301 redirect from `/events` to `/club`:
  ```ts
  routeRules: {
    '/events': { redirect: { to: '/club', statusCode: 301 } }
  },
  ```

## 3. `src/pages/events.vue`
- Replaced the standalone page with an SSR/client route redirect stub that preserves query and hash parameters:
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

## 4. `src/components/Header.vue`
- Consolidated desktop navigation from separate "Klub" and "Dogodki" links to a single unified link:
  `<NuxtLink to="/club" ...>{{ t('nav.club') }} &amp; {{ t('nav.events') }}</NuxtLink>`
- Consolidated mobile navigation drawer to the single unified link to `/club`.
- Removed all redundant `to="/events"` navigation links.

## 5. `src/components/Footer.vue`
- Removed redundant `to="/events"` quicklink.
- Consolidated the club link to point to `/club` with label `{{ t('nav.club') }} &amp; {{ t('nav.events') }}`.

## 6. `src/pages/index.vue`
- Updated Hero CTA from `to="/events"` to `to="/club"`.
- Updated Club Night Section CTA from `to="/events"` to `to="/club"`.

## 7. `src/public/sitemap.xml`
- Removed the `<url>` entry for `https://www.kader.si/events` to prevent search engine indexing of redirecting endpoints.

## 8. `scripts/verify_club_consolidation.mjs`
- Implemented comprehensive automated test suite verifying:
  - Absence of Floors and Sound System sections.
  - Retention of Culture, Safety, and Door Rules FAQ.
  - Presence of countdown banner, category filters, events grid, detail modal with PretixWidget, and past archive.
  - Dual-tier 301 redirection configuration.
  - Clean navigation links in Header, Footer, Homepage, and Sitemap.
- Passed all 17 automated checks with zero errors.
