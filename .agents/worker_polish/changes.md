# Changes: Targeted Hardening Improvements

## Overview
Applied targeted hardening improvements based on Challenger 2 and Reviewer findings to address event categorization evaluation, XSS prevention in lineup rendering, and editorial route accuracy.

## Modified Files

### 1. `src/pages/club.vue`
- **Line 752**: Updated `displayEvents` computed property initial list from:
  ```ts
  let list = (clubEvents.value && clubEvents.value.length > 0) ? clubEvents.value : curatedEvents
  ```
  to:
  ```ts
  let list = (events.value && events.value.length > 0) ? events.value : curatedEvents
  ```
  *Rationale*: `clubEvents` was a pre-filtered list containing only club/techno/house events. Using `events.value` ensures all loaded RA events are available when filtering across tabs like 'All Events', 'Live', or 'Pizzeria'.
- **Line 461**: Replaced raw `v-html` directive with safe Vue mustache interpolation:
  ```html
  <p class="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-line">{{ cleanLineup(selectedEvent.lineup) }}</p>
  ```
  *Rationale*: Completely eliminates potential XSS vulnerabilities when displaying untrusted external event lineup text in the modal while preserving whitespace formatting.

### 2. `src/pages/admin/events/index.vue`
- **Line 6**: Updated editorial subheader description:
  ```html
  <p class="text-gray-400 mt-1 text-sm">Dodajte nove dogodke ali urejajte obstoječe za prikaz na kader.si/club</p>
  ```
  *Rationale*: Fixed outdated URL reference `kader.si/events` to point to the consolidated events destination `kader.si/club`.

## Verification
- `npm run typecheck` — Passed with 0 errors (7656ms).
- `node scripts/verify_i18n_parity.mjs` — Passed (10/10 locales, 938/938 keys, 100% parity).
- `node scripts/verify_club_consolidation.mjs` — Passed (17/17 checks passed).
- `npm run build` — Nuxt 3 client and nitro server built successfully with 0 errors.
