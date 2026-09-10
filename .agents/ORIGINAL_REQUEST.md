# Original User Request

## 2026-09-10T14:32:25Z

Research and optimize the Kader Nuxt 3 / Nitro backend architecture, API caching, response latency, and database query efficiency for peak production performance.

Working directory: /home/ator/Kader
Integrity mode: development

## Requirements

### R1. Deep Backend Architecture & Caching Audit
Analyze all Nitro server endpoints (`/api/*`), data persistence (`.data/` JSON stores & Supabase integration), and the Sharp image optimization pipeline (`/api/img`). Identify latency bottlenecks, un-cached read paths, and concurrency issues.

### R2. High-Performance API Caching & Optimization Implementation
Implement backend enhancements:
- Add memory/ETag/Stale-While-Revalidate caching for static and semi-static API routes (`/api/site-images`, `/api/events`, `/api/ra-events`, `/api/menu-config`).
- Optimize the Sharp image processing pipeline with stream caching and HTTP conditional GETs (304 Not Modified).
- Refactor file I/O operations on `.data/*.json` to prevent race conditions and disk I/O bottlenecks.

### R3. Automated Verification & Benchmark Suite
Create an automated test script to benchmark response latency (target: < 50ms for cached responses, < 100ms for uncached), verify Cache-Control headers, and ensure 100% API correctness.

## Acceptance Criteria

### API Caching & Performance
- [ ] Semi-static endpoints (`/api/site-images`, `/api/events`, `/api/ra-events`, `/api/menu-config`) return `Cache-Control` headers and respond in < 50ms on subsequent calls.
- [ ] Image optimization endpoint (`/api/img`) correctly handles ETag / `If-None-Match` requests returning 304 Not Modified when unchanged.
- [ ] All public endpoints remain fully functional with zero breaking changes to existing frontend components.

### Quality & Verification
- [ ] Automated verification script executes cleanly and passes all performance and correctness assertions.
- [ ] Full application build (`npm run build`) finishes with 0 errors.

## 2026-09-10T15:05:18Z

Redesign and elevate the Kader frontend (`index.vue`, `pizzeria.vue`, `club.vue`, `buyouts.vue`) to match the standards of top world-class Pizzerias (50 Top Pizza) and iconic Berlin Techno Clubs (Berghain, Tresor, Watergate, RSO).

Working directory: /home/ator/Kader
Integrity mode: development

## Requirements

### R1. Interactive Day/Night Mode Switcher & Home Page Elevation
- Build an interactive Day (Pizzeria Bistro) vs Night (Dance Club) ambient mode toggle on `index.vue` that smoothly shifts lighting, color accents, and featured content.
- Implement an interactive Image Lightbox modal for the "KADER V SLIKAH" gallery allowing full-screen photo viewing.

### R2. World-Class Neapolitan Pizzeria Showcase (`pizzeria.vue`)
- Add **Ingredient Provenance Badges** (San Marzano DOP, Fior di Latte, 48h Fermentation) to pizza menu items.
- Create an interactive **Table Reservation & Takeaway Quick-Modal** triggering directly from the menu.
- Add a "Pizzeria Craft & Oven" interactive feature section showcasing artisanal dough preparation.

### R3. Berlin Club & Nightlife Experience (`club.vue`)
- Implement a floating/embedded **DJ Mix & Sound Preview Player** with play/pause and track controls.
- Enhance the Resident Advisor (RA) lineup cards with artist tags, event countdown timers, and direct ticket purchase CTAs.
- Add an interactive **Door Policy & Venue FAQ Accordion**.

### R4. Verification & Build Integrity
- Ensure all new components build cleanly without TypeScript or Vue errors.
- Test across mobile, tablet, and desktop viewports to ensure 100% responsive design.

## Acceptance Criteria

### Features & UI Standards
- [ ] Home page features a functional Day/Night ambient mode toggle.
- [ ] Gallery images expand into a full-screen lightbox modal upon clicking.
- [ ] Pizzeria page includes ingredient badges and table reservation/takeaway modal.
- [ ] Club page includes an interactive DJ set player, RA ticket links, and door policy accordion.
- [ ] 100% responsive layout across all screen sizes.

### Build & Quality
- [ ] Full application build (`npm run build`) completes with 0 errors.

