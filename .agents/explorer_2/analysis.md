# Architectural Analysis: Club & Events Consolidation (/club)

**Date**: 2026-09-12  
**Author**: Explorer 2  
**Scope**: `/home/ator/Kader/src/pages/club.vue`, `/home/ator/Kader/src/pages/events.vue`, routing, Pretix integration, navigation dependencies.

---

## 1. Executive Summary

This investigation establishes the structural blueprint for consolidating Kader's club venue presentation and live events experience into a unified, high-converting, and cohesive destination at `/club`. 

Currently:
- `src/pages/club.vue` (692 lines) features an immersive hero, venue statement, DJ player, standalone Floors 01/02 showcase, Klipsch La Scala audio specs, Berlin door policy & FAQ accordion, basic upcoming nights cards (linking externally to RA), and private hire CTA.
- `src/pages/events.vue` (431 lines) houses the full interactive events system: upcoming RA event grid, interactive event detail modal with embedded Pretix ticket checkout (`<PretixWidget>`), multi-provider ticketing fallbacks (Olaii, Free Admission, RA), and past events archive.

By removing the redundant standalone **Floors 01/02** and **Sound System (Klipsch)** sections from `/club.vue`, embedding the rich **interactive event grid, detail modal, Pretix widget, and past archive** directly into `/club`, and retaining the **Club Culture / Safety & Door Rules FAQ**, we create an all-in-one club experience. A clean 301 redirect from `/events` to `/club` ensures zero link degradation.

---

## 2. Deep-Dive Inspection: `src/pages/club.vue`

### Section Map & Disposition

| # | Section Description | Template Line Range | Status | Rationale |
|---|---------------------|---------------------|--------|-----------|
| 1 | **Immersive Hero** | Lines 4–35 | **RETAIN** | Features `club_hero_bg`, live sound & venue status pill ("CLUB KADER · LIVE SOUND & VENUE"), location, and tagline. |
| 2 | **Venue Statement (Editorial)** | Lines 38–70 | **RETAIN** | Historic baroque castle context, modern sound energy, and 3-column overview (01 Klet, 02 Pritličje, 03 Grajski vrt). |
| 3 | **Inline DJ Audio Player** | Lines 72–74 | **RETAIN** | `<ClubDjPlayer />` component providing audio streaming cuts directly on page. |
| 4 | **The Floors (01 Basement & 02 Ground Level)** | Lines 76–149 | **REMOVE** | Outdated floor-by-floor marketing cards. |
| 5 | **Sound Systems (Klipsch La Scala & Specs)** | Lines 152–189 | **REMOVE** | Standalone audio specs table (`showSpecs`, `specs`). Sound culture is already represented in DJ player, hero pill, and FAQ. |
| 6 | **Club Culture / Safety & Door Rules FAQ** | Lines 191–270 | **RETAIN** | Core identity section: Subtitle `doorPolicySub` ("Ljubljanska klubska kultura, svoboda in varnost") + Title `doorPolicyTitle` ("Pravila na vratih & Pogosta vprašanja"). |
| 7 | **Upcoming Nights (Basic RA Cards & Countdown)** | Lines 272–414 | **UPGRADE** | Replace current external-only cards with the full interactive experience from `events.vue` (modal + Pretix + past archive), while preserving the live countdown banner. |
| 8 | **Private Events & Venue Takeover** | Lines 416–429 | **RETAIN** | Direct booking CTA linking to `/buyouts`. |

---

### Sections to Remove (Detailed Line Numbers & Template Structure)

#### 1. The Floors Section (Lines 76–149)
```vue
<!-- ===== The Floors ===== -->
<section class="py-16 md:py-24 px-4 bg-gradient-to-b from-kader-black to-[#1a0506]">
  <div class="max-w-6xl mx-auto">
    <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('club.exploreSpaces') }}</p>
    <h2 class="text-3xl md:text-5xl font-black text-center mb-14 uppercase">{{ t('club.floorsTitle') }}</h2>

    <!-- FLOOR 01: BASEMENT (Lines 81-113) -->
    <!-- Image siteImages.club_floor1_bg, label 01, floor01Title, floor01Desc, tags -->

    <!-- FLOOR 02: GROUND LEVEL (Lines 115-147) -->
    <!-- Image siteImages.club_floor2_bg, label 02, floor02Title, floor02Desc, tags -->
  </div>
</section>
```
*Exact boundaries*: Line 76 (`<section class="py-16 md:py-24...`) to Line 149 (`</section>`). Total 74 lines.  
*Asset cleanup*: References `siteImages.club_floor1_bg` and `siteImages.club_floor2_bg`.

#### 2. Sound System Section ("Klipsch La Scala") (Lines 151–189)
```vue
<!-- ===== Sound systems ===== -->
<section class="py-20 md:py-28 px-4 content-visibility-auto">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.theSound') }}</p>
        <h2 class="text-3xl md:text-5xl font-black leading-tight mb-6">{{ t('club.soundTitle') }}</h2>
        <div class="text-kader-cream/80 text-lg space-y-4 leading-relaxed max-w-xl">
          <p>{{ t('club.soundP1') }}</p>
          <p v-html="t('club.soundP2')"></p>
        </div>
        <button @click="showSpecs = !showSpecs" ...>{{ showSpecs ? t('club.hideSpecs') : t('club.viewSpecs') }}</button>
      </div>
      <div class="bg-white/[0.03] border border-kader-cream/10 rounded-2xl p-8">
        <img :src="getOptImg(siteImages.club_sound_system, 800, 80)" ... />
        <div v-if="showSpecs" class="space-y-3 text-sm">
          <div v-for="spec in specs" :key="spec.label" ...>...</div>
        </div>
        <p v-else ...>{{ t('club.tapReveal') }}</p>
      </div>
    </div>
  </div>
</section>
```
*Exact boundaries*: Line 151 (`<!-- ===== Sound systems ===== -->`) to Line 189 (`</section>`). Total 39 lines.  
*Script cleanup*:
- Remove `const showSpecs = ref(false)` (Line 563).
- Remove `const specs = computed(() => [...])` (Lines 501–508).

---

### Sections to Retain (Detailed Line Numbers & Template Structure)

#### 1. Club Culture / Safety & Door Rules FAQ (Lines 191–270)
```vue
<!-- ===== Berlin Door Policy & Venue FAQ Accordion ===== -->
<section class="py-20 md:py-28 px-4 bg-gradient-to-b from-[#120506] to-kader-black">
  <div class="max-w-4xl mx-auto">
    <!-- Section Header (Lines 195-202) -->
    <div class="text-center mb-16">
      <p class="text-xs uppercase tracking-[0.35em] text-kader-red font-semibold mb-3">
        {{ t('club.doorPolicySub') }} <!-- "Ljubljanska klubska kultura, svoboda in varnost" -->
      </p>
      <h2 class="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
        {{ t('club.doorPolicyTitle') }} <!-- "Pravila na vratih & Pogosta vprašanja" -->
      </h2>
      <div class="w-16 h-1 bg-kader-red mx-auto mt-4 rounded-full"></div>
    </div>

    <!-- Interactive Accordion List (Lines 206-268) -->
    <div class="space-y-4">
      <div v-for="(item, idx) in faqItems" :key="item.id" ...>
        <button type="button" @click="toggleFaq(idx)" ...>
          <!-- 01..06 Index, Badge, Title, Animated Chevron -->
        </button>
        <div :id="'faq-content-' + idx" ...>
          <!-- Highlight badge + Content paragraph -->
        </div>
      </div>
    </div>
  </div>
</section>
```
*Associated Script State to Retain*:
- `openFaqIndex = ref<number | null>(0)` (Line 511)
- `toggleFaq(idx: number)` (Lines 512–514)
- `faqItems = computed(() => [...])` (Lines 516–559):
  1. `photo`: No Photo Policy ("Prepoved fotografiranja in snemanja", Badge: "NALEPKA NA KAMERI · STICKER ON CAMERA")
  2. `dress`: Dress Code ("Pravila oblačenja", Badge: "COME AS YOU ARE")
  3. `age`: Age Limit 18+ ("Starostna omejitev & Fizični dokumenti", Badge: "18+ STRIKTNO")
  4. `safer`: Awareness Team ("Varnejši prostori & Ekipa za ozaveščanje", Badge: "NE POMENI NE · AWARENESS ON SITE")
  5. `payment`: Payments & Wardrobe ("Plačevanje & Varovana garderoba", Badge: "BREZSTIČNO & GOTOVINA")
  6. `sound`: Sound & Ear Protection ("Zvočni sistem Klipsch & Zaščita sluha", Badge: "BREZPLAČNI ČEPKI")

---

## 3. Deep-Dive Inspection: `src/pages/events.vue`

### Feature & State Matrix

| Feature | Implementation Mechanism | Dependencies |
|---------|--------------------------|--------------|
| **Upcoming Events Data Loading** | `loadEvents()` calling `/api/ra-events?scope=upcoming` via `$fetch<RaEvent[]>` | `h3` cached route `/api/ra-events.get.ts`, `raSyncEngine.ts` |
| **Past Events Archive Loading** | `loadPastEvents()` calling `/api/ra-events?scope=past` via `$fetch<RaEvent[]>` | `raSyncEngine.ts` past events cache |
| **Card Grid View** | 3-column responsive card grid (`md:grid-cols-2 lg:grid-cols-3 gap-6`), aspect-[4/3] flyer, genre badge, date badge, free/price badge, artists, time | `@click="openModal(event)"`, `@error="onImageError"` |
| **Event Detail Modal** | `<Teleport to="body">`, ESC key listener (`handleKeydown`), click-outside close (`@click.self="closeModal"`) | `selectedEvent = ref<RaEvent \| null>(null)` |
| **Pretix Checkout Widget** | `<PretixWidget :event="selectedEvent.pretix_event_url \|\| selectedEvent.ticket_url"` | `src/components/PretixWidget.vue`, `src/plugins/pretix.client.ts` |
| **Ticketing Fallback System** | Conditional rendering: Free Admission badge, Olaii checkout button, or direct RA ticket link | `selectedEvent.ticket_provider`, `selectedEvent.cost` |
| **Past Events Archive List** | Compact list with thumbnails, formatted dates, click opens modal with concluded badge | `isPastEvent(selectedEvent)` helper, `pastEvents` array |
| **Structured Data (SEO)** | Schema.org `EventSeries` + nested `EventScheduled` array | `useHead()`, `useSeoMeta()`, `eventsSchema` |

### Key Interface Models

```ts
interface RaEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  cost: number | null
  flyer_url: string | null
  ra_url: string | null
  lineup: string | null
  artists: string[]
  genres: string[]
  pretix_event_url: string | null
  ticket_provider?: string | null
  ticket_url?: string | null
}
```

### Pretix Integration Architecture
1. **Plugin (`src/plugins/pretix.client.ts`)**: Injects `https://pretix.eu/widget/v2.en.js` script tag into `<head>` once per client session.
2. **Component (`src/components/PretixWidget.vue`)**: Renders `<component :is="'pretix-widget'" :event="fullUrl" disable-filters>` upgraded by the Pretix custom element script, and injects the per-event CSS stylesheet (`/widget/v2.css`) via `useHead`.
3. **Modal Integration**: When an event has `ticket_provider === 'pretix'` or `pretix_event_url`, `<PretixWidget>` renders an inline cart & ticket selector directly inside the modal.

---

## 4. Architectural Synthesis: Merging `/events` into `/club`

### Layout Flow Comparison

```
Current club.vue:
[Hero] -> [Venue Statement] -> [DJ Player] -> [Floors 01/02 ❌] -> [Sound System ❌] -> [Culture & Door Rules ✅] -> [Basic Upcoming Nights ⚠️] -> [Private Hire]

Target consolidated club.vue:
[Hero]
  ↓
[Venue Statement (Editorial)]
  ↓
[Inline DJ Audio Player (<ClubDjPlayer />)]
  ↓
[Consolidated Events Experience]
  ├── Section Header (Lineup & Events + RA Club Profile Link)
  ├── Live Event Countdown Banner (Days, Hours, Minutes, Seconds)
  ├── Category / Genre Filter Pills (All, Club/Techno, Live)
  ├── Loading / Error / Empty States
  ├── Upcoming Events Grid (3-Col Clickable Cards)
  └── Past Events Archive (Compact Concluded Events List)
  ↓
[Club Culture, Safety & Door Rules FAQ Accordion]
  ↓
[Private Events & Venue Takeover CTA]
  ↓
[Teleported Event Detail Modal (<Teleport to="body">)]
```

### Key Advantages of This Layout Order
1. **Immediate Venue Context**: Hero + Editorial + DJ Player immediately sets the sonic and physical mood of Grad Kodeljevo.
2. **Primary Conversion Above the Fold**: The live countdown and upcoming events grid are placed high on the page (directly after the audio player), maximizing ticket sales and event attendance.
3. **Natural Flow to Club Rules**: After exploring upcoming club nights, visitors reach the Berlin Door Policy, Dress Code, Awareness Team, and Safety guidelines before arriving at the venue.
4. **Clean Bottom CTA**: Private venue hire and buyout opportunities remain at the foot of the page.

---

## 5. Navigation, Redirection & Cross-Reference Audit

### 1. HTTP 301 Redirect for `/events` -> `/club`
In `nuxt.config.ts`, add routeRules:
```ts
routeRules: {
  '/events': { redirect: { to: '/club', statusCode: 301 } }
}
```
In `src/pages/events.vue`, replace full template with a lightweight redirect stub to ensure seamless client-side and server-side navigation:
```vue
<script setup lang="ts">
await navigateTo('/club', { redirectCode: 301, replace: true })
</script>
<template>
  <div class="min-h-screen bg-kader-black"></div>
</template>
```

### 2. Navigation Component Updates
- **`src/components/Header.vue`**:
  - Currently has `<NuxtLink to="/club">` and `<NuxtLink to="/events">` in desktop (lines 13–14) and mobile drawer (lines 61–62).
  - Update: Consolidate navigation by removing the redundant `/events` link from the top nav bar (keeping: Pizzeria, Club, Buyouts, Shop). The Club page now contains the full events program.
- **`src/components/Footer.vue`**:
  - Line 24: Remove or update `<NuxtLink to="/events">` so footer quick links don't have duplicate destinations.
- **`src/pages/index.vue`**:
  - Lines 40–44: Hero CTA button `to="/events"` (`t('home.heroCtaEventsClub')`) should update to `to="/club"`.
  - Line 103: Night card CTA button `to="/events"` (`t('home.nightCta')`) should update to `to="/club"`.
- **`src/public/sitemap.xml`**:
  - Line 22: Update/remove `/events` from sitemap to prevent search engine indexing conflicts with the 301 redirect.

---

## 6. Step-by-Step Implementation Plan for Implementer

### Step 1: Interface & State Unification in `club.vue`
- Update `ClubEvent` interface in `club.vue` to adopt all fields from `RaEvent` (`end_time`, `lineup`, `pretix_event_url`, `ticket_provider`, `ticket_url`).
- Add state variables from `events.vue`:
  - `selectedEvent = ref<RaEvent | null>(null)`
  - `pastEvents = ref<RaEvent[]>([])`
  - `pastLoading = ref(true)`
  - `activeGenreFilter = ref('all')`
- Add modal helper functions:
  - `openModal(event: RaEvent)`
  - `closeModal()`
  - `handleKeydown(e: KeyboardEvent)` (attached to `window` on `onMounted`, removed on `onBeforeUnmount`).
  - `cleanLineup(raw: string | null)`
  - `isPastEvent(event: RaEvent | null)`

### Step 2: Remove Floors & Sound System Sections from `club.vue`
- Delete Floors 01/02 section (lines 76–149).
- Delete Sound System section (lines 152–189).
- Remove `showSpecs` ref and `specs` computed property from `<script setup>`.

### Step 3: Embed Events Grid & Past Archive in `club.vue`
- Replace existing basic lineup section (lines 272–414) with:
  1. Section Header: Subtitle `t('events.upcoming')`, Title `t('events.upcomingTitle')` or `t('club.upcomingNights')`, RA Club link button.
  2. Live Event Countdown Banner (preserve existing real-time countdown logic).
  3. Interactive Upcoming Events Grid: cards with `@click="openModal(event)"`, flyer image error fallback, genre badges, date badge, price/free admission badges, artists, start/end time.
  4. Past Events Archive: `v-if="pastEvents.length > 0"`, list format with concluded badges, opening `openModal(event)` in concluded mode.

### Step 4: Add Teleported Event Detail Modal & Pretix Integration
- Add `<Teleport to="body">` block before `</div>` of `club.vue`.
- Incorporate `<PretixWidget>` for Pretix tickets, Olaii button for Olaii tickets, free admission badge for free events, and general ticket checkout button.

### Step 5: Merge Structured Data & Head Metadata
- Merge `NightClub` schema with `EventSeries` or include `event` array in `clubSchema`.

### Step 6: Configure `/events` -> `/club` 301 Redirect
- Configure `routeRules` in `nuxt.config.ts`.
- Replace `src/pages/events.vue` with an SSR redirect stub (`navigateTo('/club', { redirectCode: 301, replace: true })`).

### Step 7: Update Navigation & Internal Links
- Remove redundant `/events` links from `Header.vue` and `Footer.vue`.
- Update CTAs in `index.vue` (lines 40, 103) to point to `/club`.
- Remove `/events` from `src/public/sitemap.xml`.

### Step 8: Build & Typecheck Verification
- Run `npm run typecheck` (`nuxt typecheck`).
- Run `npm run build` (`nuxt build`).
- Verify no runtime errors or broken links.
