# Project: Kader Frontend Elevation & Redesign

## Architecture
- Framework: Nuxt 3 with Vue 3 (Composition API `<script setup lang="ts">`)
- Styling: Tailwind CSS (@nuxtjs/tailwindcss), Heroicons (@heroicons/vue), custom Masanielli gold & Kader red/cream palettes
- State / Stores: Pinia, VueUse (@vueuse/nuxt), useLocale, useSiteImages
- Media & Audio: Local/remote assets, Sharp image optimization pipeline (`/api/img`), HTML5 Audio API for club DJ preview player
- Pages:
  - `src/pages/index.vue`: Dual Day/Night identity, castle hero, gallery with full-screen lightbox modal
  - `src/pages/pizzeria.vue`: 50 Top Pizza standard, ingredient provenance badges, quick-modal for reservations & takeaway, craft & oven section
  - `src/pages/club.vue`: Berlin club experience (Berghain/Tresor style), floating/embedded DJ mix sound preview player, RA lineup cards with countdowns & ticket CTAs, door policy & FAQ accordion
  - `src/pages/buyouts.vue`: Private hire, inquiry form, showcase
- Global components: `src/components/Header.vue`, `src/components/Footer.vue`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Day/Night Ambient Mode & Gallery Lightbox Modal | Interactive Day (Bistro) vs Night (Club) ambient toggle on `index.vue`, smooth lighting/accent shifts, full-screen image lightbox modal for "Kader V Slikah" | none | DONE |
| 2 | World-Class Neapolitan Pizzeria Showcase | `pizzeria.vue`: Ingredient Provenance Badges (San Marzano DOP, Fior di Latte, 48h Fermentation), quick-modal for table reservations & takeaway orders, artisanal craft & oven feature section | M1 | DONE |
| 3 | Berlin Club & Nightlife Experience | `club.vue`: Floating/embedded DJ mix & sound preview player (play/pause/track controls), enhanced RA lineup cards with artist tags & countdown timers & ticket CTAs, door policy & FAQ accordion | M2 | DONE |
| 4 | Buyouts & Responsive Polish | `buyouts.vue`: Visual elevation, cross-links, mobile/tablet/desktop responsive layout audit | M3 | DONE |
| 5 | Verification, Build Integrity & Forensic Audit | `npm run build` (0 errors), cross-viewport responsiveness, challenger verification, forensic integrity audit | M1-M4 | DONE |

## Interface Contracts & Features
### Day/Night Mode Switcher (`index.vue`)
- Ambient state toggle (Day: warm amber/terracotta/gold bistro lighting, Night: moody red/purple neon club lighting).
- Synchronizes hero badge, dual-messaging highlights, and background glow effects.
- Full-screen lightbox modal: click gallery image -> opens accessible modal with backdrop blur, keyboard ESC close, prev/next navigation, high-res image view.

### Pizzeria Elevation (`pizzeria.vue`)
- Ingredient badges: DOP certified markers (San Marzano D.O.P, Fior di Latte, 48h Fermentacija, Bufala Campana) on pizza menu cards.
- Quick Reservation & Takeaway modal: interactive modal popup with tabs for "Miza (Table)" and "Za S Seboj (Takeaway)", phone quick-dial, date/time/guest count selection, and instant confirmation.
- Craft & Oven section: visual step-by-step dough preparation, hydration metrics, wood-fired oven temperatures (450°C), artisanal heritage.

### Club & Sound Experience (`club.vue`)
- Floating / sticky DJ mix audio player with tracks, play/pause, scrub bar, waveform animation, volume/mute.
- RA lineup cards: dynamic countdown timer to next event, artist tags, direct RA ticket link CTAs with external indicator.
- Door policy & FAQ accordion: expandable FAQ covering dress code, photo policy ("No Photo Policy" sticker aesthetic), age limit, awareness team, payment methods.

## Code Layout
- Pages: `src/pages/`
- Components: `src/components/` (modal components, audio player, badges)
- Composables: `src/composables/`
- Assets: `public/`, `public/images/`
