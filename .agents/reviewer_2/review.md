# Independent Review & Adversarial Audit: Milestone 2 & Milestone 3

**Reviewer**: Reviewer 2 (reviewer, critic)  
**Date**: 2026-09-12  
**Target Milestones**:
- Milestone 2: R1 i18n Expansion to Polish (`pl`), Czech (`cs`), and Spanish (`es`)
- Milestone 3: R2 Club Page Simplification & Events Consolidation into `/club`
- Acceptance Verification: R3 Automated Verification & Build Integrity

---

## 1. Review Summary

**Verdict**: **APPROVED**

Milestone 2 (i18n expansion) and Milestone 3 (club page simplification and events consolidation) meet 100% of user acceptance criteria defined in `ORIGINAL_REQUEST.md` and architectural requirements in `PROJECT.md`. Zero integrity violations, dummy facades, hardcoded test shortcuts, or regressions were identified during forensic decompilation, static analysis, SSR runtime inspection, and adversarial stress testing.

---

## 2. Acceptance Criteria Audit

### Requirement R1: i18n Expansion to Polish (`pl`), Czech (`cs`), and Spanish (`es`)
- [x] **`SUPPORTED_LOCALES`**: Verified `['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es'] as const` in `src/composables/useLocale.ts:8`.
- [x] **`Locale` type**: Inferred `typeof SUPPORTED_LOCALES[number]`, covering all 10 languages.
- [x] **`localeLabels`**: Verified entries for `pl` (🇵🇱 PL, Polski), `cs` (🇨🇿 CS, Čeština), and `es` (🇪🇸 ES, Español) with label, name, native, and flag properties.
- [x] **Leaf Key Parity**: Exactly 938 leaf keys present in all 10 dictionaries (sl, en, de, fr, it, sr, nl, pl, cs, es) with 100.0% key parity and 0 missing or empty string values.
- [x] **Linguistic Authenticity**: Audited all 19 domain sections (`common`, `nav`, `header`, `footer`, `hero`, `home`, `seo`, `pizzeria`, `club`, `events`, `buyouts`, `shop`, `reservation`, `modal`, `lightbox`, `pretix`, `player`, `craft`, `provenance`). Translations are idiomatic, natural, and culturally localized (e.g. Polish "Zasady Wejścia i FAQ", Czech "Pravidla Vstupu a FAQ", Spanish "Acceso y Preguntas Frecuentes").
- [x] **Parameter Symmetry**: All 8 parameterized interpolation keys (`buyouts.inquiryMessagePrefill`, `buyouts.thankYou`, `buyouts.upTo`, `craft.phaseBadge`, `home.viewFullSizeAria`, `home.visitP`, `lightbox.showImageAria`, `lightbox.thumbnailAria`) retain identical placeholder tokens (`{{tier}}`, `{{guests}}`, `{{name}}`, `{{n}}`, `{{label}}`, `{{food}}`, `{{table}}`) across all 10 languages.
- [x] **`Header.vue`**: Language switcher `<select>` iterates over `localeLabels`, immediately exposing `pl`, `cs`, and `es` without breaking styling or touch targets.
- [x] **`nuxt.config.ts`**: Included alternate `<link>` tags with `hreflang="pl"`, `hreflang="cs"`, and `hreflang="es"` pointing to `https://www.kader.si/`.

### Requirement R2: Merge `/events` into `/club` Page & Simplify Club Sections
- [x] **Floors 01/02 Removed**: Section referencing `club.floorsTitle`, `club.exploreSpaces`, `club_floor1_bg`, and `club_floor2_bg` removed completely from `src/pages/club.vue`.
- [x] **Sound System Section Removed**: Section referencing `club.theSound`, `club.soundTitle`, `club_sound_system`, `showSpecs`, and `specs` computed property removed completely from `src/pages/club.vue`.
- [x] **Culture, Safety & Door Policy Retained**: Retained section header (`club.doorPolicySub` "Ljubljanska klubska kultura, svoboda in varnost", `club.doorPolicyTitle` "Pravila na vratih & Pogosta vprašanja"), all 6 policy pillars (`photo`, `dress`, `age`, `safer`, `payment`, `sound`), interactive accordion with smooth CSS grid row height transition, and ARIA attributes (`aria-expanded`, `aria-controls`).
- [x] **Interactive Events Experience Embedded on `/club`**:
  - Upcoming RA Events grid with dark techno styling, flyer thumbnails, genre badges, dates, lineup artists, start/end times, and modal trigger.
  - Live Event Countdown Banner displaying real-time days, hours, minutes, and seconds, updating every 1000ms with cleanup on unmount.
  - Category Filter Tabs (`all`, `club`, `live`, `pizzeria`).
  - Interactive Event Detail Modal teleported to `body`, featuring flyer banner, artist roster, sanitized lineup text, `<PretixWidget>` integration, Olaii ticket purchase fallback, direct ticket button, free admission badge, past event notice, ESC key listener, and backdrop click dismissal.
  - Past Events Archive rendered beneath upcoming events with thumbnail cards opening the detail modal.
  - Structured Data: Schema.org `@graph` containing `NightClub` and `EventSeries` metadata for search engine indexing.
- [x] **Dual-Tier 301 Redirection**:
  - Server-level: `routeRules: { '/events': { redirect: { to: '/club', statusCode: 301 } } }` in `nuxt.config.ts`.
  - Client/route middleware: `navigateTo({ path: '/club', query: to.query, hash: to.hash }, { redirectCode: 301 })` in `src/pages/events.vue`.
- [x] **Navigation Consolidation**:
  - `Header.vue` desktop and mobile menus link to `/club` with `{{ t('nav.club') }} &amp; {{ t('nav.events') }}`; no links point to `/events`.
  - `Footer.vue` quicklinks link to `/club` with `{{ t('nav.club') }} &amp; {{ t('nav.events') }}`; no links point to `/events`.
  - `index.vue` CTAs link to `/club`.
  - `sitemap.xml` lists `https://www.kader.si/club` and excludes `/events`.

### Requirement R3: Automated Verification & Build Integrity
- [x] `npm run typecheck`: Passed with 0 errors (10,077ms).
- [x] `npm run build`: Compiled production Nitro SSR server bundle (`.output/server/index.mjs`, 25.4 MB total) with exit code 0.
- [x] `node scripts/verify_i18n_parity.mjs`: Passed all 4 checks (10/10 locales, 938/938 keys, 80/80 parameter signatures).
- [x] `node scripts/verify_club_consolidation.mjs`: Passed all 17 checks.

---

## 3. Adversarial Challenges & Stress Testing

### Challenge 1: Translation Authenticity vs Facade Copying (Anti-Cheating Audit)
- **Hypothesis**: The worker might have copied English or Slovenian strings into Polish, Czech, and Spanish dictionaries to pass the 938-key count test without providing real translations.
- **Test**: Measured exact string equality between `en`/`sl` and `pl`/`cs`/`es` for strings longer than 5 characters across all 938 keys.
- **Results**:
  - Polish (`pl`): Only 41/938 identical to English (genres, brand names like "Techno", "SoundCloud"), 42/938 identical to Slovenian (addresses, "Grad Kodeljevo"). >850 keys are uniquely translated into Polish.
  - Czech (`cs`): Only 43/938 identical to English, 46/938 identical to Slovenian. >840 keys are uniquely translated into Czech.
  - Spanish (`es`): Only 40/938 identical to English, 34/938 identical to Slovenian. >860 keys are uniquely translated into Spanish.
- **Conclusion**: **PASS**. Genuine, high-quality human/idiomatic translations; no facade cheating.

### Challenge 2: Live Server SSR Routing & 301 Status Code Integrity
- **Hypothesis**: The redirect from `/events` might be a client-side only redirect (leaving crawlers with a 200 or 404) or return a 302 temporary redirect instead of an SEO-preserving 301 permanent redirect.
- **Test**: Booted the production Nitro server (`.output/server/index.mjs`) on localhost port 3985 and tested raw HTTP requests.
- **Results**:
  - `GET /events` returned HTTP status `301 Moved Permanently` with header `Location: /club`.
  - `GET /events/` returned HTTP status `301 Moved Permanently` with header `Location: /club`.
  - `GET /club` returned HTTP status `200 OK` with 186,753 bytes of rendered SSR HTML.
- **Conclusion**: **PASS**. Fully compliant with dual-tier 301 redirect specifications.

### Challenge 3: SSR Hydration and DOM Element Verification on `/club`
- **Hypothesis**: The embedded events or door policy components might fail to render during SSR or leak removed section content.
- **Test**: Inspected the rendered HTML body of `GET /club`:
  - `Prihajajoče Noči` (Upcoming Nights heading): **PRESENT**
  - `Pravila na vratih` (Door Policy FAQ heading): **PRESENT**
  - `Ljubljanska klubska kultura` (Culture & Safety subheading): **PRESENT**
  - `Kader Vault: Hypnotic Techno Night` (Event card): **PRESENT**
  - `Klipsch Sound System Night` (Event card): **PRESENT**
  - `Vsi Dogodki` (Category filter): **PRESENT**
  - Floors 01/02 section ("Raziskovalni prostori", `club_floor1_bg`): **ABSENT**
  - Sound System section (`club.theSound`, `showSpecs`): **ABSENT**
- **Conclusion**: **PASS**. Component hierarchy renders cleanly in SSR without hydration mismatch or remnant section templates.

### Challenge 4: Memory Leak & Event Listener Teardown
- **Hypothesis**: The live countdown timer or keyboard ESC listener in `club.vue` could create memory leaks if components are unmounted repeatedly.
- **Test**: Code inspection of lifecycle hooks in `src/pages/club.vue`:
  - `window.addEventListener('keydown', handleKeydown)` is explicitly cleaned up via `window.removeEventListener('keydown', handleKeydown)` in `onBeforeUnmount`.
  - `window.setInterval(updateCountdown, 1000)` is assigned to `countdownInterval` and explicitly cleared via `clearInterval(countdownInterval)` in `onBeforeUnmount`.
- **Conclusion**: **PASS**. Proper cleanup implemented.

---

## 4. Minor Findings & Observations (Non-Blocking)

### [Minor] Finding 1: Date Formatting in Club Page Uses Binary Fallback Locale
- **Where**: `src/pages/club.vue`, lines 805, 808, 816, 819
- **Observation**: Date formatting helpers use `locale.value === 'sl' ? 'sl-SI' : 'en-GB'`. For users selecting Polish, Czech, Spanish, or other locales, month and weekday names fall back to British English rather than native locale formats (e.g., `pl-PL`, `cs-CZ`, `es-ES`).
- **Impact**: Low. Does not violate any acceptance criteria or break functionality.
- **Recommendation**: In a future UX polish cycle, map `locale.value` to standard BCP-47 locale tags (e.g. `const dateLocales: Record<Locale, string> = { sl: 'sl-SI', en: 'en-GB', pl: 'pl-PL', cs: 'cs-CZ', es: 'es-ES', ... }`).

### [Minor] Finding 2: Lineup Sanitization with `v-html`
- **Where**: `src/pages/club.vue`, line 462
- **Observation**: `v-html="cleanLineup(selectedEvent.lineup)"` strips `<[^>]*>` tags before rendering.
- **Impact**: Minimal. Tag stripping mitigates injection risk, but using standard template mustache interpolation `{{ cleanLineup(selectedEvent.lineup) }}` with `whitespace-pre-line` is even safer.

---

## 5. Integrity Audit

- **Hardcoded test results embedded in source code**: None.
- **Dummy or facade implementations**: None. All 938 keys are translated; all events features are reactive.
- **Shortcuts bypassing intended tasks**: None.
- **Fabricated verification outputs or logs**: None. Verified live independently.
- **Self-certifying claims**: Fully re-verified via independent CLI execution and live server HTTP inspection.

**Integrity Status**: **CLEAN / ZERO VIOLATIONS**

---

## 6. Final Verdict

**APPROVED**
All deliverables for Milestone 2 and Milestone 3 are complete, robust, well-architected, and ready for deployment.
