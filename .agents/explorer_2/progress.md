# Progress — Explorer 2

Last visited: 2026-09-12T11:19:55+02:00

## Current Status
- Inspected `/home/ator/Kader/src/pages/club.vue`:
  - Mapped all 8 sections
  - Isolated Floors 01/02 section (lines 76-149) to be removed
  - Isolated Sound system / Klipsch La Scala section (lines 152-189) to be removed, along with related script state (`showSpecs`, `specs`)
  - Confirmed Club Culture / Safety & Door Rules / FAQ section (lines 191-270) to be retained, with subtitle `club.doorPolicySub` ("Ljubljanska klubska kultura, svoboda in varnost") and title `club.doorPolicyTitle` ("Pravila na vratih & Pogosta vprašanja")
- Inspected `/home/ator/Kader/src/pages/events.vue`:
  - Mapped upcoming RA events grid, data loading via `/api/ra-events?scope=upcoming`
  - Mapped event detail modal with Teleport, lineup parser, PretixWidget integration, Olaii / direct ticketing fallback
  - Mapped past events archive loaded via `/api/ra-events?scope=past`
  - Mapped filter tabs / categories and schema markup
- Checked cross-references in `Header.vue`, `Footer.vue`, `index.vue`, `nuxt.config.ts`, and `sitemap.xml`
- Running background typecheck to verify baseline health
