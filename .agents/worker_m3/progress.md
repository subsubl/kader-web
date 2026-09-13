# Progress Tracker — Milestone 3: Merge /events into /club

Last visited: 2026-09-12T11:37:05+02:00

## Status: COMPLETE

### Tasks
- [x] Step 1: Initialize briefing and read context & explorer handoffs
- [x] Step 2: Inspect `src/pages/club.vue` and `src/pages/events.vue` in detail
- [x] Step 3: Implement consolidated `src/pages/club.vue`:
  - [x] Remove Sound System ("Klipsch La Scala") and Floors 01/02 sections & unused script state (`showSpecs`, `specs`)
  - [x] Retain Club Culture / Safety and Door Rules & FAQ (6 pillars)
  - [x] Embed complete Events experience (upcoming RA events grid, countdown banner, category filter tabs, detail modal with PretixWidget, past archive, JSON-LD)
- [x] Step 4: Configure 301 redirection:
  - [x] Update `nuxt.config.ts` routeRules with 301 redirect from `/events` to `/club`
  - [x] Replace `src/pages/events.vue` with clean SSR/client redirect stub forwarding queries
- [x] Step 5: Update navigation links:
  - [x] Update `src/components/Header.vue` (consolidate to single `/club` link, label "Klub & Dogodki")
  - [x] Update `src/components/Footer.vue` (remove redundant `/events`, point to `/club`)
  - [x] Update `src/pages/index.vue` (CTAs pointing to `/club`)
  - [x] Update `src/public/sitemap.xml` (remove `/events`)
- [x] Step 6: Create automated verification script `scripts/verify_club_consolidation.mjs` and execute it (17/17 PASS)
- [x] Step 7: Run `npm run typecheck` (0 errors) and `npm run build` (0 errors)
- [x] Step 8: Document changes in `changes.md` and complete `handoff.md`
- [x] Step 9: Send completion message to orchestrator parent agent
