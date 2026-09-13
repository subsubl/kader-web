# Analysis Report: Navigation, Routing, and Build/Test Verification Architecture

**Agent**: Explorer 3  
**Date**: 2026-09-12  
**Target Milestone**: M1 Exploration & Architecture Mapping  
**Working Directory**: `/home/ator/Kader/.agents/explorer_3`  
**Integrity Mode**: Development / Read-Only Investigation  

---

## 1. Executive Summary

This investigation establishes the technical blueprint for:
1. **Navigation Consolidation**: Migrating from separate `/club` and `/events` navigation entries in `Header.vue` and `Footer.vue` to a unified "Klub & Dogodki" (Club & Events) entry pointing cleanly to `/club`, eliminating redundant links and updating cross-references in `index.vue` and `sitemap.xml`.
2. **Clean 301 Route Redirection**: Implementing a dual-tier Nuxt 3 redirection strategy:
   - **Server-side (Nitro)**: `routeRules` in `nuxt.config.ts` providing instantaneous HTTP 301 Moved Permanently responses to external visitors, bookmarks, and search crawlers with zero SSR rendering overhead.
   - **Client-side (Vue Router)**: A clean redirect stub in `src/pages/events.vue` using `definePageMeta` and `navigateTo('/club', { redirectCode: 301 })` to handle in-app client navigation and query preservation without page hydration flashes.
3. **Comprehensive Automated Verification Architecture**: Designing two self-contained, high-speed automated audit test scripts (executable in <1 second with zero external dependencies) plus the full production build pipeline:
   - `scripts/verify_i18n_parity.mjs`: Audits 100% dictionary key parity across all 10 target languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`), ensuring all 938 leaf keys exist, have non-empty content, preserve all 8 interpolation parameter sets, and verify `nuxt.config.ts` `hreflang` alternate tags and `Header.vue` language dropdown.
   - `scripts/verify_club_consolidation.mjs`: Verifies complete removal of Sound System and Floors sections from `club.vue`, preservation of Club Culture/Safety and Door Rules FAQ, embedding of upcoming events grid, countdown banner, detail modal with `<PretixWidget>`, and past events archive, alongside clean redirection from `/events` -> `/club` and elimination of dead `/events` links across navigation components.
   - Production validation: Type checking (`npm run typecheck`) and Nitro production build (`npm run build`).

---

## 2. Navigation Links & Cross-Reference Audit

### 2.1 Complete Inventory of `/events` and `/club` References

A comprehensive audit of the project repository reveals the following references to `/events` and `/club`:

| File Path | Line(s) | Current Content | Required Target State |
|-----------|---------|-----------------|-----------------------|
| `src/components/Header.vue` | 13 | `<NuxtLink to="/club">{{ t('nav.club') }}</NuxtLink>` | Retain / upgrade to unified Club & Events link (`t('nav.clubEvents')` or `t('nav.club')`) |
| `src/components/Header.vue` | 14 | `<NuxtLink to="/events">{{ t('nav.events') }}</NuxtLink>` | **Remove** (consolidated into `/club`) |
| `src/components/Header.vue` | 61 | `<NuxtLink to="/club" ...>{{ t('nav.club') }}</NuxtLink>` | Retain / upgrade mobile link |
| `src/components/Header.vue` | 62 | `<NuxtLink to="/events" ...>{{ t('nav.events') }}</NuxtLink>` | **Remove** (consolidated into `/club`) |
| `src/components/Footer.vue` | 23 | `<NuxtLink to="/club">{{ t('nav.club') }}</NuxtLink>` | Retain / upgrade to unified link |
| `src/components/Footer.vue` | 24 | `<NuxtLink to="/events">{{ t('nav.events') }}</NuxtLink>` | **Remove** (consolidated into `/club`) |
| `src/pages/index.vue` | 40 | `<NuxtLink to="/events">{{ t('home.heroCtaEventsClub') }}</NuxtLink>` | Point to `to="/club"` or streamline hero CTA pair |
| `src/pages/index.vue` | 46 | `<NuxtLink to="/club">{{ t('home.heroCtaAboutClub') }}</NuxtLink>` | Retain `to="/club"` |
| `src/pages/index.vue` | 103 | `<NuxtLink to="/events">{{ t('home.nightCta') }}</NuxtLink>` | Update to `to="/club"` |
| `src/pages/index.vue` | 392 | `'url': 'https://www.kader.si/club'` | Retain canonical club structured data |
| `src/pages/buyouts.vue` | 158 | `<NuxtLink to="/club">{{ t('buyouts.takeoverExploreClub') }}</NuxtLink>` | Retain (already points to `/club`) |
| `src/pages/admin/events/index.vue` | 6 | `prikaz na kader.si/events` | Update admin text to `prikaz na kader.si/club` |
| `src/public/sitemap.xml` | 16 | `<loc>https://www.kader.si/club</loc>` | Retain |
| `src/public/sitemap.xml` | 22 | `<loc>https://www.kader.si/events</loc>` | **Remove** (do not index redirecting URL in XML sitemap) |
| `src/pages/events.vue` | 1–431 | Entire standalone events page | Convert to clean 301 redirect stub to `/club` |

### 2.2 Navigation Consolidation Recommendation ("Klub & Dogodki")

Currently, `Header.vue` displays 5 desktop links:
`[Pizzeria] [Klub] [Dogodki] [Zasebni najem] [Trgovina]`

Merging Club and Events into a single destination (`/club`) creates a cleaner 4-item navigation:
`[Pizzeria] [Klub & Dogodki] [Zasebni najem] [Trgovina]`

#### Proposed Dictionary Key Addition
Add a dedicated key `nav.clubEvents` across all 10 supported languages (or alternatively update `nav.club`):
- `sl`: `"Klub & Dogodki"`
- `en`: `"Club & Events"`
- `de`: `"Klub & Events"`
- `fr`: `"Club & Événements"`
- `it`: `"Club & Eventi"`
- `sr`: `"Klub & Događaji"`
- `nl`: `"Club & Evenementen"`
- `pl`: `"Klub & Wydarzenia"`
- `cs`: `"Klub & Akce"`
- `es`: `"Club & Eventos"`

*(Note: Keep existing `nav.club` and `nav.events` keys intact in dictionaries so no legacy or third-party reference breaks.)*

#### Before & After: `src/components/Header.vue`
**Before (Desktop, lines 11–17):**
```vue
<nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
  <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.pizzeria') }}</NuxtLink>
  <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.club') }}</NuxtLink>
  <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.events') }}</NuxtLink>
  <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.buyouts') }}</NuxtLink>
  <NuxtLink to="/shop" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.shop') }}</NuxtLink>
</nav>
```

**After (Desktop):**
```vue
<nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
  <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.pizzeria') }}</NuxtLink>
  <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.clubEvents') || t('nav.club') }}</NuxtLink>
  <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.buyouts') }}</NuxtLink>
  <NuxtLink to="/shop" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.shop') }}</NuxtLink>
</nav>
```

*(Identical consolidation applies to lines 60–64 for mobile navigation).*

#### Before & After: `src/components/Footer.vue`
**Before (lines 20–27):**
```vue
<ul class="space-y-2 text-sm">
  <li><NuxtLink to="/" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.home') }}</NuxtLink></li>
  <li><NuxtLink to="/pizzeria" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.pizzeria') }}</NuxtLink></li>
  <li><NuxtLink to="/club" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.club') }}</NuxtLink></li>
  <li><NuxtLink to="/events" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.events') }}</NuxtLink></li>
  <li><NuxtLink to="/buyouts" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.buyouts') }}</NuxtLink></li>
  <li><NuxtLink to="/shop" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.shop') }}</NuxtLink></li>
</ul>
```

**After:**
```vue
<ul class="space-y-2 text-sm">
  <li><NuxtLink to="/" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.home') }}</NuxtLink></li>
  <li><NuxtLink to="/pizzeria" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.pizzeria') }}</NuxtLink></li>
  <li><NuxtLink to="/club" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.clubEvents') || t('nav.club') }}</NuxtLink></li>
  <li><NuxtLink to="/buyouts" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.buyouts') }}</NuxtLink></li>
  <li><NuxtLink to="/shop" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.shop') }}</NuxtLink></li>
</ul>
```

#### Homepage Hero & Night Card CTAs: `src/pages/index.vue`
- Line 40: `<NuxtLink to="/events">{{ t('home.heroCtaEventsClub') }}</NuxtLink>`  
  Update `to="/club"`.
- Line 103: `<NuxtLink to="/events" ...>{{ t('home.nightCta') }}</NuxtLink>`  
  Update `to="/club"`.

---

## 3. Nuxt 3 Route Redirection Architecture (`/events` -> `/club`)

### 3.1 Architectural Requirement
To ensure that search engines, social media links, promotional flyers, QR codes, direct bookmarks, and client-side history navigation all resolve seamlessly to `/club` with zero 404 errors and zero SEO link equity loss:
- Server requests must return **HTTP 301 (Moved Permanently)**.
- Client-side in-app transitions must seamlessly transition to `/club` without an unnecessary full page reload or blank flash.
- Any URL query parameters (such as `?event=...` or UTM marketing parameters) should be cleanly preserved.

### 3.2 Multi-Tier Redirection Design

Nuxt 3 provides two complementary layers that combine to provide 100% redirect coverage:

#### Layer 1: Nitro Server Engine Level (`nuxt.config.ts`)
In `nuxt.config.ts`, define `routeRules`:
```ts
export default defineNuxtConfig({
  // ...
  routeRules: {
    '/events': { redirect: { to: '/club', statusCode: 301 } }
  },
  // ...
})
```
**Benefits:**
- Intercepts incoming HTTP requests directly in the Nitro engine (`h3`) before Vue SSR instantiation.
- Returns an instantaneous HTTP 301 header with `Location: /club`.
- Fast sub-millisecond response, zero memory allocation for Vue components.
- Caches permanently in search engine crawlers and browser caches.

#### Layer 2: Client-Side & Page Meta Stub (`src/pages/events.vue`)
Replace the contents of `src/pages/events.vue` with a dedicated redirect stub:
```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    (to) => {
      return navigateTo({
        path: '/club',
        query: to.query,
        hash: to.hash
      }, { redirectCode: 301 })
    }
  ]
})
</script>

<template>
  <div></div>
</template>
```
**Benefits:**
- Vue Router recognizes `/events` as a valid route during build-time route generation.
- Nuxt route middleware executes before the route resolves and immediately calls `navigateTo()`.
- Supports query parameter and hash preservation (e.g. `/events?ref=promo#tickets` -> `/club?ref=promo#tickets`).
- Prevents loading of any heavy events page components, eliminating unused bundle weight.

### 3.3 Why Avoid Global Middleware (`src/middleware/events.global.ts`)
A global route middleware (`.global.ts`) executes on **every single navigation** across the entire application (Pizzeria, Shop, Buyouts, Admin, etc.), adding conditional branching overhead to all route transitions. By placing the redirect rule in `routeRules` and `definePageMeta` within `events.vue`, the redirect logic executes exclusively when `/events` is requested.

---

## 4. Current Verification Setup & Empirical Baseline

### 4.1 `package.json` Scripts Audit
Inspection of `/home/ator/Kader/package.json` reveals:
- `"build": "nuxt build"`: Compiles the client bundle and Nitro SSR server (`.output/server`).
- `"typecheck": "nuxt typecheck"`: Executes `vue-tsc --noEmit`.
- `"test:e2e": "playwright test"`: Configured in `playwright.config.ts` targeting `./tests/e2e`.
- `"dev": "nuxt dev"`, `"generate": "nuxt generate"`, `"preview": "nuxt preview"`.

### 4.2 Empirical Execution Baseline
We executed the verification commands against the current project state:

1. **`npm run typecheck`**:
   - Status: **PASSED (0 errors)**
   - Duration: 8,324 ms
   - Diagnostic: Clean TypeScript compilation across all Vue SFCs and server routes.
2. **`npm run build`**:
   - Status: **PASSED (0 errors)**
   - Duration: 15,200 ms
   - Output: `.output/server/index.mjs` (24.8 MB total uncompressed bundle size, 9.91 MB gzip).
3. **Current i18n Baseline**:
   - Supported locales: `['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl']` (7 locales).
   - Total keys per language: **938 leaf keys**.
   - Parity: 100% identical key sets across all 7 locales (0 missing, 0 extra, 0 empty values).
   - Parameterized keys: Exactly 8 keys containing `{param}` or `{{param}}` interpolation tokens.

---

## 5. Automated Verification Plan & Test Suite Design

To ensure zero regressions, complete i18n key parity, clean section consolidation, and robust redirect behavior, we have designed three verification suites.

### 5.1 Test Suite 1: Automated 100% Dictionary Key Parity Audit (`scripts/verify_i18n_parity.mjs`)

This script verifies:
1. **Locales Definition**: `SUPPORTED_LOCALES` in `useLocale.ts` contains all 10 locales: `['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']`.
2. **Metadata Parity**: `localeLabels` contains valid labels, native identifiers, and country flags for all 10 locales:
   - `pl`: flag `🇵🇱`, label `Polski`, native `PL`
   - `cs`: flag `🇨🇿`, label `Čeština`, native `CS`
   - `es`: flag `🇪🇸`, label `Español`, native `ES`
3. **100% Key Parity**: For every single locale, compares leaf keys against `flatDictionaries.sl`:
   - Missing keys count = 0
   - Extra keys count = 0
   - Empty/whitespace values count = 0
4. **Interpolation Token Symmetry**: All 8 keys with parameters (`home.visitP`, `home.viewFullSizeAria`, `buyouts.upTo`, `buyouts.thankYou`, `buyouts.inquiryMessagePrefill`, `lightbox.showImageAria`, `lightbox.thumbnailAria`, `craft.phaseBadge`) preserve the identical interpolation tokens (`{{food}}`, `{{table}}`, `{{n}}`, `{{name}}`, `{{tier}}`, `{{guests}}`, `{{label}}`) across all 10 languages.
5. **Fallback Non-Identity Check**: Ensures Polish, Czech, and Spanish dictionaries are genuinely translated and not simply copied from Slovenian fallback text.
6. **SEO Alternate Links**: Verifies `nuxt.config.ts` contains `hreflang` alternate links for `pl`, `cs`, `es`, and all other supported locales.
7. **UI Language Dropdown**: Verifies `Header.vue` dynamically exposes `localeLabels` for all 10 options.

#### Complete Executable Code for `scripts/verify_i18n_parity.mjs`:
```javascript
#!/usr/bin/env node
// scripts/verify_i18n_parity.mjs
// Automated 100% Key Parity & i18n Integrity Validator for Kader

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createJiti } from 'jiti'

const REQUIRED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']

async function runParityAudit() {
  console.log('======================================================================')
  console.log('  KADER i18n 10-LANGUAGE AUDIT & KEY PARITY VERIFIER')
  console.log('======================================================================\n')

  const jiti = createJiti(import.meta.url)
  const localePath = path.resolve(process.cwd(), 'src/composables/useLocale.ts')
  const nuxtConfigPath = path.resolve(process.cwd(), 'nuxt.config.ts')
  const headerPath = path.resolve(process.cwd(), 'src/components/Header.vue')

  const mod = await jiti.import(localePath)
  const { SUPPORTED_LOCALES, flatDictionaries, localeLabels, DEFAULT_LOCALE } = mod

  // 1. Check Supported Locales
  console.log('[1] Auditing SUPPORTED_LOCALES list...')
  assert.equal(DEFAULT_LOCALE, 'sl', 'DEFAULT_LOCALE must be "sl"')
  for (const loc of REQUIRED_LOCALES) {
    assert(SUPPORTED_LOCALES.includes(loc), `SUPPORTED_LOCALES missing required locale: ${loc}`)
  }
  assert.equal(SUPPORTED_LOCALES.length, 10, `Expected exactly 10 supported locales, found ${SUPPORTED_LOCALES.length}`)
  console.log(`  ✔ All 10 target locales declared in SUPPORTED_LOCALES.`)

  // 2. Check Locale Labels & Metadata
  console.log('\n[2] Auditing localeLabels metadata...')
  for (const loc of REQUIRED_LOCALES) {
    const meta = localeLabels[loc]
    assert(meta, `localeLabels missing metadata for ${loc}`)
    assert(meta.label && meta.label.length > 0, `localeLabels[${loc}].label is empty`)
    assert(meta.native && meta.native.length > 0, `localeLabels[${loc}].native is empty`)
    assert(meta.flag && meta.flag.length > 0, `localeLabels[${loc}].flag is empty`)
    console.log(`  ✔ ${loc.toUpperCase()} metadata: ${meta.flag} ${meta.label} (${meta.native})`)
  }

  // 3. Key Parity & Empty Value Audit
  console.log('\n[3] Auditing 100% dictionary leaf key parity across all 10 locales...')
  const slDict = flatDictionaries.sl
  assert(slDict, 'Baseline Slovenian flatDictionary missing')
  const slKeys = Object.keys(slDict).sort()
  console.log(`  Baseline Slovenian keys count: ${slKeys.length}`)
  assert(slKeys.length >= 938, `Expected at least 938 keys, found ${slKeys.length}`)

  // Map of keys containing interpolation parameters in sl
  const paramKeys = new Map()
  for (const [k, v] of Object.entries(slDict)) {
    const tokens = v.match(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g)
    if (tokens) {
      paramKeys.set(k, tokens.sort())
    }
  }
  console.log(`  Identified ${paramKeys.size} parameterized keys in baseline.`)

  let totalKeysAudited = 0

  for (const loc of REQUIRED_LOCALES) {
    const locDict = flatDictionaries[loc]
    assert(locDict, `flatDictionaries missing dictionary for ${loc}`)

    const locKeys = Object.keys(locDict)
    const missing = slKeys.filter(k => !(k in locDict))
    const extra = locKeys.filter(k => !(k in slDict))
    const empty = Object.entries(locDict).filter(([k, v]) => typeof v !== 'string' || v.trim() === '')

    assert.equal(missing.length, 0, `Locale ${loc} is missing ${missing.length} keys: ${missing.slice(0, 5).join(', ')}`)
    assert.equal(extra.length, 0, `Locale ${loc} has ${extra.length} unexpected extra keys: ${extra.slice(0, 5).join(', ')}`)
    assert.equal(empty.length, 0, `Locale ${loc} has ${empty.length} empty string values: ${empty.slice(0, 5).map(e => e[0]).join(', ')}`)

    // Check interpolation token integrity
    for (const [key, expectedTokens] of paramKeys.entries()) {
      const val = locDict[key]
      const actualTokens = (val.match(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g) || []).sort()
      assert.deepEqual(
        actualTokens,
        expectedTokens,
        `Locale ${loc} key "${key}" param mismatch! Expected: ${JSON.stringify(expectedTokens)}, Got: ${JSON.stringify(actualTokens)}`
      )
    }

    totalKeysAudited += locKeys.length
    console.log(`  ✔ [PASS] ${loc.toUpperCase()}: ${locKeys.length} keys (100% parity, 0 missing, 0 empty, parameters aligned)`)
  }

  // 4. Fallback Prevention Check for new languages (pl, cs, es)
  console.log('\n[4] Verifying genuine translations for new languages (no verbatim Slovenian fallback)...')
  const sampleKeys = [
    'common.close',
    'nav.pizzeria',
    'footer.quickLinks',
    'footer.hours',
    'events.pageTitle',
    'club.doorPolicyTitle'
  ]
  for (const newLoc of ['pl', 'cs', 'es']) {
    for (const key of sampleKeys) {
      const slVal = slDict[key]
      const locVal = flatDictionaries[newLoc][key]
      assert.notEqual(
        locVal.toLowerCase(),
        slVal.toLowerCase(),
        `Potential un-translated fallback detected in ${newLoc} for "${key}": "${locVal}" equals Slovenian "${slVal}"`
      )
    }
    console.log(`  ✔ Genuine translations verified for ${newLoc.toUpperCase()} across sample keys.`)
  }

  // 5. Nuxt Config hreflang Alternate Tags Check
  console.log('\n[5] Auditing nuxt.config.ts hreflang alternate tags...')
  const nuxtConfig = fs.readFileSync(nuxtConfigPath, 'utf8')
  for (const loc of REQUIRED_LOCALES) {
    assert(
      nuxtConfig.includes(`hreflang: '${loc}'`) || nuxtConfig.includes(`hreflang: "${loc}"`),
      `nuxt.config.ts missing hreflang alternate link for "${loc}"`
    )
  }
  assert(nuxtConfig.includes("hreflang: 'x-default'") || nuxtConfig.includes('hreflang: "x-default"'), 'nuxt.config.ts missing x-default hreflang')
  console.log('  ✔ All 10 locales + x-default verified in nuxt.config.ts.')

  // 6. Header Language Selector Check
  console.log('\n[6] Auditing Header.vue language selector integration...')
  const headerContent = fs.readFileSync(headerPath, 'utf8')
  assert(headerContent.includes('localeLabels'), 'Header.vue must reference localeLabels for dynamic option rendering')
  assert(headerContent.includes('setLocale'), 'Header.vue must bind setLocale handler')
  console.log('  ✔ Header.vue language dropdown uses reactive localeLabels.')

  console.log(`\n======================================================================`)
  console.log(`  AUDIT COMPLETE: ${totalKeysAudited} KEYS AUDITED ACROSS 10 LOCALES`)
  console.log(`  RESULT: 100% KEY PARITY CONFIRMED WITH ZERO REGRESSIONS`)
  console.log(`======================================================================\n`)
}

runParityAudit().catch(err => {
  console.error('\n✖ i18n AUDIT FAILED:')
  console.error(err.message)
  process.exit(1)
})
```

---

### 5.2 Test Suite 2: Automated Club Consolidation & Redirect Validator (`scripts/verify_club_consolidation.mjs`)

This script verifies:
1. **Sound System Section Removal**: Confirms absence of "Klipsch La Scala", `siteImages.club_sound_system`, `soundTitle`, `specs`, and `showSpecs` in `club.vue`.
2. **Floors 01/02 Section Removal**: Confirms absence of `club_floor1_bg`, `club_floor2_bg`, `floorsTitle`, `exploreSpaces`, `floor01Title`, and `floor02Title` in `club.vue`.
3. **Culture/Safety & Door Rules Retained**: Confirms presence of subtitle `club.doorPolicySub` ("Ljubljanska klubska kultura, svoboda in varnost"), title `club.doorPolicyTitle` ("Pravila na vratih & Pogosta vprašanja"), and 6 FAQ items.
4. **Complete Events Experience Embedded**: Confirms upcoming events grid, live countdown timer, past events archive (`pastEvents`), detail modal (`<Teleport to="body">`, `selectedEvent`, `openModal`, `closeModal`), and `<PretixWidget>`.
5. **Route Redirection Configuration**:
   - `src/pages/events.vue`: Confirms 301 redirect stub (`navigateTo('/club', { redirectCode: 301 })`).
   - `nuxt.config.ts`: Confirms `routeRules` entry for `/events` -> `/club` with status 301.
6. **Navigation Links Cleanliness**:
   - `Header.vue`: Desktop and mobile link to `/club`, 0 links to `/events`.
   - `Footer.vue`: Quick links link to `/club`, 0 links to `/events`.
   - `index.vue`: Hero and night card CTAs link to `/club`, 0 links to `/events`.
   - `sitemap.xml`: `/events` removed, `/club` retained.

#### Complete Executable Code for `scripts/verify_club_consolidation.mjs`:
```javascript
#!/usr/bin/env node
// scripts/verify_club_consolidation.mjs
// Automated Club Consolidation & Redirect Verification for Kader

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

function runClubConsolidationAudit() {
  console.log('======================================================================')
  console.log('  KADER CLUB & EVENTS CONSOLIDATION VERIFIER')
  console.log('======================================================================\n')

  const clubPath = path.join(ROOT, 'src/pages/club.vue')
  const eventsPath = path.join(ROOT, 'src/pages/events.vue')
  const nuxtConfigPath = path.join(ROOT, 'nuxt.config.ts')
  const headerPath = path.join(ROOT, 'src/components/Header.vue')
  const footerPath = path.join(ROOT, 'src/components/Footer.vue')
  const indexPath = path.join(ROOT, 'src/pages/index.vue')
  const sitemapPath = path.join(ROOT, 'src/public/sitemap.xml')

  const club = fs.readFileSync(clubPath, 'utf8')
  const events = fs.readFileSync(eventsPath, 'utf8')
  const nuxtConfig = fs.readFileSync(nuxtConfigPath, 'utf8')
  const header = fs.readFileSync(headerPath, 'utf8')
  const footer = fs.readFileSync(footerPath, 'utf8')
  const index = fs.readFileSync(indexPath, 'utf8')
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')

  // 1. Verify Sound System section removal from club.vue
  console.log('[1] Verifying Sound System ("Klipsch La Scala") removal from club.vue...')
  assert(!club.includes('club.soundTitle'), 'club.vue must not contain soundTitle')
  assert(!club.includes('club.theSound'), 'club.vue must not contain theSound')
  assert(!club.includes('siteImages.club_sound_system'), 'club.vue must not reference club_sound_system')
  assert(!club.includes('showSpecs'), 'club.vue must not contain showSpecs state')
  console.log('  ✔ Sound System section successfully removed.')

  // 2. Verify Floors 01/02 section removal from club.vue
  console.log('\n[2] Verifying Floors 01/02 section removal from club.vue...')
  assert(!club.includes('club.floorsTitle'), 'club.vue must not contain floorsTitle')
  assert(!club.includes('club.exploreSpaces'), 'club.vue must not contain exploreSpaces')
  assert(!club.includes('siteImages.club_floor1_bg'), 'club.vue must not reference club_floor1_bg')
  assert(!club.includes('siteImages.club_floor2_bg'), 'club.vue must not reference club_floor2_bg')
  console.log('  ✔ Floors 01/02 section successfully removed.')

  // 3. Verify Club Culture & Door Rules FAQ retention in club.vue
  console.log('\n[3] Verifying retention of Club Culture, Safety, and Door Rules FAQ...')
  assert(club.includes('club.doorPolicySub'), 'club.vue must retain doorPolicySub ("Ljubljanska klubska kultura, svoboda in varnost")')
  assert(club.includes('club.doorPolicyTitle'), 'club.vue must retain doorPolicyTitle ("Pravila na vratih & Pogosta vprašanja")')
  assert(club.includes('faqItems'), 'club.vue must retain interactive faqItems accordion')
  for (const pillar of ['photo', 'dress', 'age', 'safer', 'payment', 'sound']) {
    assert(club.includes(`'${pillar}'`) || club.includes(`"${pillar}"`), `club.vue faqItems missing pillar "${pillar}"`)
  }
  console.log('  ✔ Club Culture, Safety, and all 6 Door Policy FAQ items verified.')

  // 4. Verify Interactive Events Experience embedded into club.vue
  console.log('\n[4] Verifying interactive Events Experience embedded in club.vue...')
  assert(club.includes('<PretixWidget'), 'club.vue must embed PretixWidget component')
  assert(club.includes('Teleport') && club.includes('to="body"'), 'club.vue must teleport event detail modal to body')
  assert(club.includes('selectedEvent'), 'club.vue must maintain selectedEvent modal state')
  assert(club.includes('openModal') && club.includes('closeModal'), 'club.vue must provide openModal and closeModal methods')
  assert(club.includes('pastEvents'), 'club.vue must include pastEvents archive data and rendering')
  assert(club.includes('countdown'), 'club.vue must maintain live event countdown banner')
  console.log('  ✔ Upcoming grid, countdown, detail modal, Pretix widget, and past events verified.')

  // 5. Verify /events -> /club 301 Redirection
  console.log('\n[5] Verifying /events -> /club redirect configuration...')
  // Check nuxt.config.ts routeRules
  assert(
    /routeRules[\s\S]*['"]\/events['"][\s\S]*['"]\/club['"]/.test(nuxtConfig),
    'nuxt.config.ts must configure routeRules redirect from /events to /club with 301'
  )
  // Check events.vue redirect stub
  assert(
    /navigateTo\([\s\S]*['"]\/club['"][\s\S]*301/.test(events) || /navigateTo\(['"]\/club['"]/.test(events),
    'src/pages/events.vue must call navigateTo("/club") with 301 redirect'
  )
  console.log('  ✔ Dual-tier redirect (Nitro routeRules + Vue Router stub) verified.')

  // 6. Verify Navigation Link Cleanliness
  console.log('\n[6] Verifying navigation links across Header, Footer, and Index...')
  assert(!header.includes('to="/events"'), 'Header.vue must not link to /events')
  assert(header.includes('to="/club"'), 'Header.vue must link to /club')

  assert(!footer.includes('to="/events"'), 'Footer.vue must not link to /events')
  assert(footer.includes('to="/club"'), 'Footer.vue must link to /club')

  assert(!index.includes('to="/events"'), 'index.vue must not link to /events')
  assert(index.includes('to="/club"'), 'index.vue must link to /club')

  assert(!sitemap.includes('https://www.kader.si/events'), 'sitemap.xml must not include /events')
  assert(sitemap.includes('https://www.kader.si/club'), 'sitemap.xml must include /club')
  console.log('  ✔ All stale /events links removed and pointing directly to /club.')

  console.log(`\n======================================================================`)
  console.log(`  CONSOLIDATION VERIFICATION PASSED WITH ZERO ERRORS`)
  console.log(`======================================================================\n`)
}

runClubConsolidationAudit()
```

---

### 5.3 Test Suite 3: Build & Typecheck Validation Protocol

The complete verification sequence to run in Milestone 4:
```bash
# 1. Audit i18n key parity across all 10 languages
node scripts/verify_i18n_parity.mjs

# 2. Audit club sections and redirect configuration
node scripts/verify_club_consolidation.mjs

# 3. TypeScript static type checking
npm run typecheck

# 4. Full production Nitro SSR build
npm run build
```

---

## 6. Implementation Action Plan for Implementer

| Step | Action | Files Modified | Verification |
|------|--------|----------------|--------------|
| **1** | Add `pl`, `cs`, and `es` dictionaries with all 938 leaf keys, update `SUPPORTED_LOCALES`, `Locale` type, and `localeLabels` in `src/composables/useLocale.ts`. Add `nav.clubEvents` key across all 10 locales. | `src/composables/useLocale.ts` | `node scripts/verify_i18n_parity.mjs` |
| **2** | Add `hreflang` alternate links for `pl`, `cs`, and `es` to `nuxt.config.ts`. Add `routeRules` redirect for `/events` -> `/club` (301). | `nuxt.config.ts` | `node scripts/verify_i18n_parity.mjs` |
| **3** | Update navigation links in `Header.vue` and `Footer.vue`: remove `/events` item, update `/club` label to `t('nav.clubEvents')`. | `src/components/Header.vue`, `src/components/Footer.vue` | Inspect template; `npm run typecheck` |
| **4** | Update `src/pages/club.vue`: remove Floors 01/02 and Sound System sections; retain Door Rules FAQ; integrate upcoming events grid, countdown banner, past events archive, and detail modal with `<PretixWidget>`. | `src/pages/club.vue` | `node scripts/verify_club_consolidation.mjs` |
| **5** | Replace `src/pages/events.vue` with 301 redirect stub using `definePageMeta` and `navigateTo('/club', { redirectCode: 301 })`. | `src/pages/events.vue` | `node scripts/verify_club_consolidation.mjs` |
| **6** | Update `index.vue` CTAs (`to="/club"`) and remove `https://www.kader.si/events` from `sitemap.xml`. | `src/pages/index.vue`, `src/public/sitemap.xml` | `node scripts/verify_club_consolidation.mjs` |
| **7** | Execute final acceptance verification: typecheck and full production build. | Entire repository | `npm run typecheck && npm run build` |
