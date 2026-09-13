## 2026-09-12T09:32:11Z
You are Worker M3 implementing Milestone 3: Merge /events into /club Page & Simplify Club Sections.
Working directory: /home/ator/Kader/.agents/worker_m3
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
Explorer handoffs to review:
- /home/ator/Kader/.agents/explorer_2/handoff.md (Detailed section breakdown in club.vue and events.vue)
- /home/ator/Kader/.agents/explorer_3/handoff.md (Redirection architecture, nav links, and verification scripts)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. On /home/ator/Kader/src/pages/club.vue:
   - Remove the detailed Sound System ("Klipsch La Scala") section and Floors 01/02 sections. Also remove unused script state (`showSpecs`, `specs`).
   - Retain the Club Culture / Safety ("Ljubljanska klubska kultura, svoboda in varnost") and Door Rules & FAQ ("Pravila na vratih & Pogosta vprašanja") sections.
   - Embed the complete interactive Events experience from /home/ator/Kader/src/pages/events.vue into /club:
     * Upcoming RA Events grid with reactive cards, flyer images, genre badges, start/end times.
     * Countdown banner for the next upcoming event.
     * Category filter tabs.
     * Event detail modal with `<Teleport to="body">`, `<PretixWidget>` integration, Olaii / Free Admission / direct ticketing fallbacks, and keyboard ESC / backdrop dismissal.
     * Past events archive (`pastEvents`, `loadPastEvents()`).
     * JSON-LD structured data schema markup.
2. Setup clean 301 redirection from /events to /club:
   - In /home/ator/Kader/nuxt.config.ts: add routeRules with 301 redirect from `/events` to `/club`.
   - In /home/ator/Kader/src/pages/events.vue: replace with a clean SSR/client redirect stub forwarding query parameters (`path: '/club', query: to.query`, redirectCode: 301).
3. Update navigation links:
   - In /home/ator/Kader/src/components/Header.vue: consolidate the nav link to point to `/club` seamlessly (labeled "Klub & Dogodki" or using appropriate translation key), removing the redundant separate `/events` link.
   - In /home/ator/Kader/src/components/Footer.vue: remove redundant `/events` link, pointing "Klub & Dogodki" to `/club`.
   - In /home/ator/Kader/src/pages/index.vue: update CTAs pointing to `/events` to point to `/club`.
   - In /home/ator/Kader/src/public/sitemap.xml: remove `/events` URL entry.
4. Implement and run automated test script `scripts/verify_club_consolidation.mjs`:
   - Verify absence of Floors and Sound System sections.
   - Verify presence of Culture/Safety and Door Rules FAQ.
   - Verify presence of events grid, detail modal with PretixWidget, and past archive.
   - Verify 301 redirect configuration and clean navigation links.
5. Run `npm run typecheck` and `npm run build` and ensure exit code 0 with zero errors.
6. Record all changes in /home/ator/Kader/.agents/worker_m3/changes.md and write a comprehensive handoff report to /home/ator/Kader/.agents/worker_m3/handoff.md. Send a completion message when finished.
