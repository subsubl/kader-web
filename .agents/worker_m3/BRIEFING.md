# BRIEFING — 2026-09-12T11:37:00Z

## Mission
Merge /events into /club page, simplify club sections (remove Sound System and Floors 01/02, retain Culture/Safety and Door Rules FAQ, embed interactive events grid + modal + Pretix + past archive + JSON-LD), setup 301 redirects, update navigation, and verify with automated script and build.

## 🔒 My Identity
- Archetype: Worker M3
- Roles: implementer, qa, specialist
- Working directory: /home/ator/Kader/.agents/worker_m3
- Original parent: db2f800b-c333-4d3b-a658-9cfa6a7d5ab5
- Milestone: Milestone 3: Merge /events into /club Page & Simplify Club Sections

## 🔒 Key Constraints
- Remove Sound System ("Klipsch La Scala") and Floors 01/02 sections from src/pages/club.vue.
- Retain Club Culture / Safety and Door Rules & FAQ sections on src/pages/club.vue.
- Embed complete interactive Events experience from src/pages/events.vue into /club: upcoming RA events grid, countdown banner, category filter tabs, event detail modal with <Teleport to="body">, <PretixWidget>, Olaii / direct ticketing fallbacks, keyboard ESC/backdrop dismissal, past events archive, JSON-LD structured data.
- Setup 301 redirection from /events to /club in nuxt.config.ts (routeRules) and src/pages/events.vue (clean SSR/client redirect stub with query forwarding).
- Update navigation links in Header.vue ("Klub & Dogodki" or appropriate translation), Footer.vue, index.vue, and sitemap.xml.
- Implement scripts/verify_club_consolidation.mjs and pass all checks.
- Pass npm run typecheck and npm run build with exit code 0.
- Mandatory integrity: No hardcoded test results, no dummy implementations.

## Current Parent
- Conversation ID: db2f800b-c333-4d3b-a658-9cfa6a7d5ab5
- Updated: not yet

## Task Summary
- **What to build**: Full consolidation of events into club.vue, removal of sound/floors, 301 redirection, nav cleanup, verification script.
- **Success criteria**: All automated verification checks pass, typecheck and build pass cleanly.
- **Interface contracts**: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- **Code layout**: Nuxt 3 project structure in /home/ator/Kader

## Key Decisions Made
- Embedded full interactive events system into `src/pages/club.vue` directly below the inline DJ player and before the retained Culture/Safety Door Rules accordion.
- Retained full 6-pillar Berlin door policy in `club.vue` (`photo`, `dress`, `age`, `safer`, `payment`, `sound`) with accessible ARIA tags and smooth CSS grid 0fr->1fr animation.
- Implemented dual-tier 301 redirection: Nitro `routeRules` in `nuxt.config.ts` for direct server-level HTTP redirects, and route middleware stub in `src/pages/events.vue` with `navigateTo({ path: '/club', query: to.query, hash: to.hash }, { redirectCode: 301 })` for client navigation.
- Consolidated navigation in `Header.vue` and `Footer.vue` using `{{ t('nav.club') }} &amp; {{ t('nav.events') }}` to dynamically localize as "Klub & Dogodki" (SL), "Club & Events" (EN), "Club & Evenementen" (NL), etc., across all 10 locales while keeping the 938-leaf key structure intact.
- Created `scripts/verify_club_consolidation.mjs` test harness checking all 17 consolidation criteria.

## Artifact Index
- .agents/worker_m3/ORIGINAL_REQUEST.md — Original user request
- .agents/worker_m3/BRIEFING.md — Persistent working memory
- .agents/worker_m3/progress.md — Liveness heartbeat and progress tracking
- .agents/worker_m3/changes.md — Detailed change log
- .agents/worker_m3/handoff.md — 5-component handoff report
- scripts/verify_club_consolidation.mjs — Automated consolidation verification harness

## Change Tracker
- **Files modified**:
  - `src/pages/club.vue`: Removed Sound System and Floors sections; added complete interactive events grid, detail modal with PretixWidget, countdown, filters, and past archive.
  - `nuxt.config.ts`: Added routeRules with 301 redirect `/events` -> `/club`.
  - `src/pages/events.vue`: Replaced with 301 redirect stub forwarding query and hash parameters.
  - `src/components/Header.vue`: Consolidated desktop and mobile navigation links to `/club`.
  - `src/components/Footer.vue`: Consolidated navigation link to `/club` and removed `/events`.
  - `src/pages/index.vue`: Updated hero and night CTAs to point to `/club`.
  - `src/public/sitemap.xml`: Removed `/events` entry.
  - `scripts/verify_club_consolidation.mjs`: Verification script.
- **Build status**: PASS (`npm run typecheck` 0 errors, `npm run build` 0 errors)
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (Typecheck 7.7s, Nitro build complete 25MB output)
- **Lint status**: 0 violations
- **Tests added/modified**: `scripts/verify_club_consolidation.mjs` (17/17 PASS), `scripts/verify_i18n_parity.mjs` (10/10 locales 100% PASS)

## Loaded Skills
- `modern-web-guidance`: Evaluated and applied best practices for accessible modals (Teleport, ESC handling, backdrop click, aria-label), smooth CSS Grid row height transitions, responsive layouts, and fetch priority.
