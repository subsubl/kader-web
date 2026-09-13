# Handoff Report: Club & Events Consolidation Architecture

**Agent**: Explorer 2  
**Date**: 2026-09-12  
**Target Milestone**: M1 Exploration & Architecture Mapping / M3 (R2 Merge /events into /club)  
**Status**: COMPLETE (Hard Handoff)  
**Associated Analysis**: `/home/ator/Kader/.agents/explorer_2/analysis.md`

---

## 1. Observation

Direct observations from inspection of the codebase:

### 1.1 `src/pages/club.vue` (Total 692 lines)
- **Hero section**: lines 4–35, starts with `<section class="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">`, contains status pill `club.statusPill`, location `club.location`, title `Club Kader`, and subtitle `club.heroTagline`.
- **Venue statement section**: lines 38–70, starts with `<section class="py-20 md:py-28 px-4">`, contains `club.theVenue`, `club.venueTitle`, `club.venueP1`, and 3-column stats `club.venueBasement`, `club.venueFloor`, `club.venueGarden`.
- **DJ Player component**: lines 72–74, `<ClubDjPlayer />`.
- **The Floors 01/02 section**:
  - Template range: **lines 76–149**, starts with `<section class="py-16 md:py-24 px-4 bg-gradient-to-b from-kader-black to-[#1a0506]">` and ends at line 149 with `</section>`.
  - Content: Header `club.exploreSpaces` / `club.floorsTitle`, Floor 01 Basement (lines 81–113) with `siteImages.club_floor1_bg` and `club.floor01Title`, Floor 02 Ground Level (lines 115–147) with `siteImages.club_floor2_bg` and `club.floor02Title`.
- **Sound Systems section ("Klipsch La Scala")**:
  - Template range: **lines 151–189**, starts with `<section class="py-20 md:py-28 px-4 content-visibility-auto">` and ends at line 189 with `</section>`.
  - Content: `club.theSound`, `club.soundTitle`, `club.soundP1`, `club.soundP2`, specs toggle button, `siteImages.club_sound_system`, and specs table.
  - Script state: `specs` computed property (lines 501–508) and `showSpecs` ref (line 563).
- **Club Culture / Safety & Door Rules / FAQ section**:
  - Template range: **lines 191–270**, starts with `<section class="py-20 md:py-28 px-4 bg-gradient-to-b from-[#120506] to-kader-black">` and ends at line 270 with `</section>`.
  - Header: Subtitle `{{ t('club.doorPolicySub') }}` ("Ljubljanska klubska kultura, svoboda in varnost") at line 197; Title `{{ t('club.doorPolicyTitle') }}` ("Pravila na vratih & Pogosta vprašanja") at line 200.
  - Interactive accordion list: lines 206–268, with 6 items (`photo`, `dress`, `age`, `safer`, `payment`, `sound`).
  - Script state: `openFaqIndex = ref<number | null>(0)` (line 511), `toggleFaq` (line 512), and `faqItems` (lines 516–559).
- **Upcoming nights section**: lines 273–414, starts with `<section class="py-20 md:py-28 px-4 bg-[#120506]">`, has countdown timer banner (lines 294–330), and basic event cards with direct `<a>` link to Resident Advisor (lines 346–411).
- **Private events / Takeover section**: lines 416–429, `<NuxtLink to="/buyouts">`.

### 1.2 `src/pages/events.vue` (Total 431 lines)
- **Data loading**:
  - `loadEvents()`: calls `$fetch<RaEvent[]>('/api/ra-events?scope=upcoming')` (lines 394–406).
  - `loadPastEvents()`: calls `$fetch<RaEvent[]>('/api/ra-events?scope=past')` (lines 408–417).
  - `normalizeEvent()`: ensures `artists` and `genres` are arrays (lines 423–429).
- **Event card grid**: lines 57–111, responsive 3-column cards (`@click="openModal(event)"`, aspect-[4/3] flyer, genre badge, formatted date, free entry / cost badge, artist line, start/end time, details CTA).
- **Past events archive**: lines 114–150, rendered when `pastEvents.length > 0`, compact list with flyer thumbnails (`w-12 h-12`), date label, and `@click="openModal(event)"`.
- **Event detail modal**:
  - Lines 155–261: `<Teleport to="body">`, fixed backdrop `z-[100]`, `@click.self="closeModal"`, ESC key listener (`handleKeydown` at line 377).
  - Content: flyer image, genre tags, formatted date, location, artist tags, clean sanitized lineup (`cleanLineup(selectedEvent.lineup)`).
  - Pretix integration: lines 220–223, renders `<PretixWidget :event="selectedEvent.pretix_event_url || selectedEvent.ticket_url || ''" />` when `!isPastEvent(selectedEvent) && (selectedEvent.ticket_provider === 'pretix' || selectedEvent.pretix_event_url)`.
  - Dynamic action footer: lines 226–258, renders Free Admission banner, Olaii button (`t('events.buyOnOlaii')`), direct checkout button (`t('events.buyTicket')`), or concluded badge (`t('events.concludedBadge')`).
- **Dependencies**:
  - `src/components/PretixWidget.vue`: Custom element `<pretix-widget>` wrapper, loads per-event CSS via `useHead`.
  - `src/plugins/pretix.client.ts`: Injects `https://pretix.eu/widget/v2.en.js` client script into `<head>`.
  - Translations: `t('events.*')` in `useLocale.ts`.

### 1.3 Routing & Cross-References
- `src/components/Header.vue`: Line 14 and Line 62 link to `/events`.
- `src/components/Footer.vue`: Line 24 links to `/events`.
- `src/pages/index.vue`: Line 40 and Line 103 link to `/events`.
- `src/public/sitemap.xml`: Line 22 specifies `<loc>https://www.kader.si/events</loc>`.
- `nuxt.config.ts`: Does not yet contain `routeRules` for `/events`.
- Project typecheck command: `npm run typecheck` passed cleanly with 0 errors in 8756ms.

---

## 2. Logic Chain

1. **Section Isolation in `club.vue`**:
   - Observations 1.1 show that Floors 01/02 (lines 76–149) and Sound System (lines 151–189) are completely self-contained `<section>` blocks with no downstream template dependencies.
   - Removing them eliminates 113 lines of template code, plus `showSpecs` and `specs` in `<script setup>`, without affecting the hero, editorial statement, or DJ player.
   - The Club Culture & Safety section is located at lines 191–270 with title `t('club.doorPolicyTitle')` and subtitle `t('club.doorPolicySub')`, matching the requirement to retain culture/safety and door rules/FAQ.

2. **Feature Parity from `events.vue`**:
   - Observations 1.2 demonstrate that `events.vue` contains four key modules: upcoming event grid, past events archive, detail modal with `<PretixWidget>`, and structured data schema.
   - Currently, `club.vue` lines 273–414 only provide basic cards linking out to RA, without any modal, Pretix checkout, Olaii handling, or past event records.
   - By adopting the `RaEvent` interface and merging `events.vue` state (`selectedEvent`, `pastEvents`, `loadPastEvents`, `openModal`, `closeModal`, `cleanLineup`, `isPastEvent`) into `club.vue`, we achieve complete feature parity while maintaining the live countdown timer from `club.vue`.

3. **Placement & Visual Hierarchy**:
   - The optimal layout order for `/club` is:
     1. Immersive Hero
     2. Venue Statement (Baroque castle + electronic sound story)
     3. `<ClubDjPlayer />`
     4. Consolidated Events Experience (Header + Live Countdown Banner + Filter Tabs + Upcoming Grid + Past Events Archive)
     5. Club Culture / Safety & Berlin Door Rules FAQ Accordion
     6. Private Events / Venue Takeovers CTA
     7. Teleported Event Detail Modal (`<Teleport to="body">`)
   - This places high-intent ticket buying opportunities prominently above the fold while keeping essential safety and door guidelines accessible before arriving.

4. **Redirection & Internal Link Integrity**:
   - Observations 1.3 show external URLs and existing components reference `/events`.
   - Setting a 301 redirect in `nuxt.config.ts` (`routeRules: { '/events': { redirect: { to: '/club', statusCode: 301 } } }`) and replacing `events.vue` with an SSR `navigateTo('/club', { redirectCode: 301 })` stub ensures 100% backward compatibility and zero SEO penalty.
   - Updating `Header.vue`, `Footer.vue`, `index.vue`, and `sitemap.xml` cleans up redundant links and ensures all internal navigation points directly to `/club`.

---

## 3. Caveats

- **Curated Fallback Events**: `club.vue` currently maintains a list of `curatedEvents` (lines 576–610) that display when the RA sync returns 0 events. The implementer should decide whether to retain this fallback inside `club.vue` or rely on the empty state pattern from `events.vue` (`t('events.noUpcoming')`). Retaining the curated fallback provides a guaranteed populated grid.
- **Header Navigation Layout**: In `Header.vue`, removing `/events` leaves 4 links: Pizzeria, Club, Buyouts, Shop. Alternatively, the link could be labeled "Club & Events". Both are valid; removing the duplicate link produces a cleaner desktop header.
- **Audio Specs Detail**: Removing the Klipsch specs section removes granular horn/driver dimensions (`specs`), but the Klipsch system and free earplugs remain highlighted in the retained FAQ accordion (item 6) and in the `<ClubDjPlayer />` component.

---

## 4. Conclusion

Consolidating `/events` into `/club` is straightforward, architecturally sound, and low-risk:
1. Delete template lines 76–189 of `club.vue` (Floors & Sound System) and remove unused script refs (`showSpecs`, `specs`).
2. Retain lines 191–270 of `club.vue` (Club Culture / Safety & Door Rules FAQ).
3. Upgrade lines 273–414 with the interactive events grid, countdown banner, past events archive, and teleported detail modal with `<PretixWidget>`.
4. Establish 301 redirects for `/events` -> `/club` in `nuxt.config.ts` and `events.vue`.
5. Update navigation links in `Header.vue`, `Footer.vue`, and `index.vue`.

The complete step-by-step implementation plan is documented in `/home/ator/Kader/.agents/explorer_2/analysis.md`.

---

## 5. Verification Method

To independently verify the architecture and subsequent implementation:

1. **Typecheck Command**:
   ```bash
   npm run typecheck
   ```
   *Expected result*: `Type check passed` with zero TypeScript errors.

2. **Production Build Command**:
   ```bash
   npm run build
   ```
   *Expected result*: Nuxt client and Nitro server build succeed without asset or template compilation errors.

3. **File Inspections**:
   - Inspect `src/pages/club.vue`: Confirm removal of lines 76–189 (Floors and Sound System) and presence of `<PretixWidget>`, `Teleport`, `faqItems`, and `pastEvents`.
   - Inspect `src/pages/events.vue`: Confirm presence of 301 redirect stub (`navigateTo('/club')`).
   - Inspect `nuxt.config.ts`: Confirm `routeRules['/events']` redirect definition.
   - Inspect `src/components/Header.vue` and `src/components/Footer.vue`: Confirm clean navigation links.

4. **Invalidation Conditions**:
   - If `npm run typecheck` fails due to mismatched event properties (`ra_id`, `pretix_event_url`, `artists`, `genres`), verify that the `RaEvent` interface is used uniformly.
   - If the Pretix modal fails to display, verify that `PretixWidget.vue` is resolved and `plugins/pretix.client.ts` is active.
