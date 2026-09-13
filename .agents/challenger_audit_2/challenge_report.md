# Adversarial Challenge Report: SEO, GEO & Schema.org Structured Data
**Agent**: Challenger 2 (Adversarial SEO, GEO & Schema Challenger)  
**Date**: 2026-09-13  
**Target Environment**: Production Nitro Build (`.output/server/index.mjs`)  
**Test Harness**: `/home/ator/Kader/.agents/challenger_audit_2/test_adversarial_seo.mjs`  
**Overall Risk Assessment**: **MEDIUM** (Core SEO/GEO/Schema specifications pass 100%, but critical legacy address leakage detected in UI translation strings)

---

## Executive Summary

Challenger 2 executed an exhaustive, independent adversarial test harness comprising **298 empirical assertions** against the compiled production Nitro server (`node .output/server/index.mjs`).

The core SEO, GEO, and Schema.org mandates were verified with high precision:
- **0 syntax errors** across all Schema.org `<script type="application/ld+json">` blocks.
- **Exact GEO Coordinates**: All 8 identified geo entities strictly feature `latitude === 46.0494` and `longitude === 14.5367` (numeric type).
- **Exact Postal Address in Schema.org**: All 16 Schema.org address records strictly define `streetAddress: "Koblarjeva ulica 34"`, `addressLocality: "Ljubljana"`, `postalCode: "1000"`, `addressCountry: "SI"`.
- **Zero Outdated Coordinates or Typos**: Static and built bundle grep confirms 0 occurrences of `46.0515`, `14.5361`, or `Kobalarjeva`.
- **Canonicals & Hreflangs**: 100% correct across all 5 public routes (`/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`), with 0 subpage leakage of root links.
- **Dynamic HTML Lang**: Confirmed dynamic server-rendered `<html lang="...">` matching query parameters (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`, `EN`, and fallback `INVALID_LANG` -> `sl`).
- **X-Robots-Tag**: Verified `noindex, nofollow` on `/admin` and `/api` routes; verified public routes do not emit `noindex`.

However, adversarial stress-testing uncovered **one significant flaw** in UI translation data:
- **Vulnerability Found**: The legacy street address `"Ulica Carla Benza 20"` remains present in `src/composables/useLocale.ts` across all 10 language dictionaries, resulting in **20 live instances of obsolete street address leakage in SSR body HTML** on `/` (via `home.visitP`) and `/pizzeria` (via `pizzeria.legalCompanyLine` and `pizzeria.companyLine`).

---

## Adversarial Challenges

### [Medium] Challenge 1: Translation Dictionaries Leak Legacy Address `"Ulica Carla Benza 20"` into SSR Body HTML
- **Assumption Challenged**: The assumption that replacing the address in `usePageSeo.ts`, `Footer.vue`, `index.vue` hero badge, and `pizzeria.vue` hero badge completely migrated the site's address to `"Koblarjeva ulica 34"`.
- **Attack Scenario / Reproduction**:
  1. Make an SSR request to `GET /` or `GET /pizzeria` in any supported language (e.g., `curl -s http://127.0.0.1:3388/?lang=sl` or `curl -s http://127.0.0.1:3388/pizzeria?lang=en`).
  2. Inspect the rendered HTML.
  3. On `/`: Section *"Obiščite Nas"* renders:  
     `<p class="text-gray-400 mb-6 leading-relaxed">Ulica Carla Benza 20 v Ljubljani. Naročila hrane: (+386 83 836 740) ; Rezervacije miz: (+386 40 175 628).</p>`
  4. On `/pizzeria`: Legal company line renders:  
     `Kader d.o.o., Ulica Carla Benza 20, 1000 Ljubljana, SI45321361`
- **Blast Radius**: Discrepancy between Schema.org structured data (`Koblarjeva ulica 34`) and visible page content (`Ulica Carla Benza 20`) can trigger Google Search Console structured data penalty for deceptive or conflicting business details, and creates confusion for physical visitors navigating to the estate.
- **Mitigation**: Update all 10 locale dictionaries in `src/composables/useLocale.ts` (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`) to replace `"Ulica Carla Benza 20"` with `"Koblarjeva ulica 34"` across keys: `visitP`, `legalCompanyLine`, `companyLine`, `address`, `locationLine`, `colLocAddress`, `modalLocation`, `venueAddress`.

---

### [Low] Challenge 2: `/admin` Route Throws 500 During Unconfigured Production Deployments
- **Assumption Challenged**: That `/admin` behaves cleanly when visited without Supabase credentials.
- **Attack Scenario**:
  Visiting `/admin` when `NUXT_PUBLIC_SUPABASE_URL` is empty redirects to `/admin/dashboard`, which returns HTTP 500 `{"statusCode": 500, "message": "Supabase not configured"}`.
- **Verification of Security Posture**:
  Despite the 500 error, Nitro correctly attached `X-Robots-Tag: noindex, nofollow`, preventing search engines from indexing error pages.
- **Mitigation**: Gracefully redirect unauthenticated or unconfigured `/admin` visits to `/admin/login` with HTTP 302/200 rather than crashing with 500.

---

## Empirical Stress Test Results

| Test Group | Description | Assertions Checked | Passed | Failed | Status |
|---|---|---|---|---|---|
| **Group 1** | Static Grep: Outdated coords `46.0515, 14.5361`, typo `Kobalarjeva` | 1 | 1 | 0 | **PASS** |
| **Group 2** | Production Nitro Server Spawning & Readiness (`.output/server/index.mjs`) | 2 | 2 | 0 | **PASS** |
| **Group 3** | SSR HTML, Canonical & 10 Hreflang Alternates + x-default (5 routes) | 104 | 104 | 0 | **PASS** |
| **Group 4** | Schema.org JSON-LD Extraction & Syntax Check (0 JSON parse errors) | 20 | 20 | 0 | **PASS** |
| **Group 5** | Exact GEO Coordinates (`46.0494, 14.5367`) across all entities | 41 | 41 | 0 | **PASS** |
| **Group 6** | Postal Address Strict Verification (`Koblarjeva ulica 34`, `1000`, `Ljubljana`, `SI`) | 65 | 65 | 0 | **PASS** |
| **Group 7** | Dynamic HTML lang Attribute (`?lang=sl\|en\|de\|fr\|it\|sr\|nl\|pl\|cs\|es`, fallback, uppercase) | 26 | 26 | 0 | **PASS** |
| **Group 8** | `X-Robots-Tag: noindex, nofollow` on `/admin` & `/api` (and absent on public routes) | 26 | 26 | 0 | **PASS** |
| **Group 9** | Entity Types per Route (`EventVenue`, `LocalBusiness`, `Restaurant`, `NightClub`, `Event`, `Store`) | 8 | 8 | 0 | **PASS** |
| **Group 10** | Adversarial Stress Cases: Query pollution canonicals, casing, UI legacy address scan | 5 | 4 | 1 | **FAIL (1)** |
| **TOTAL** | **Comprehensive Adversarial Suite** | **298** | **297** | **1** | **99.66% PASS** |

---

## Detailed Evidence Logs

### 1. Schema.org Entities Verified
1. `https://www.kader.si/#venue` (`LocalBusiness`, `EventVenue`): `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.
2. `https://www.kader.si/pizzeria#restaurant` (`Restaurant`, `PizzaRestaurant`): `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.
3. `https://www.kader.si/club#club` (`NightClub`): `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.
4. `https://www.kader.si/club#event-...` (`Event` dynamic items): nested `location.geo`: `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.
5. `https://www.kader.si/buyouts#venue` (`LocalBusiness`, `EventVenue`): `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.
6. `https://www.kader.si/shop#store` (`Store`): `latitude: 46.0494`, `longitude: 14.5367`, `streetAddress: "Koblarjeva ulica 34"`.

### 2. Failure Log: Legacy Address UI Residuals
```
[FAIL] [Assert #298] ZERO occurrences of legacy 'Ulica Carla Benza 20' in SSR body HTML across all routes and locales (Found in: /?lang=sl, /?lang=en, /?lang=de, /?lang=fr, /?lang=it...) (expected 0, got 20)
```
Snippet captured from `http://127.0.0.1:3399/`:
```html
<h2 class="text-2xl sm:text-3xl font-black text-white mb-6 uppercase">Obiščite Nas</h2>
<p class="text-gray-400 mb-6 leading-relaxed">Ulica Carla Benza 20 v Ljubljani. Naročila hrane: (+386 83 836 740) ; Rezervacije miz: (+386 40 175 628).</p>
```

---

## Unchallenged Areas

- Dynamic Pretix event ticket webhooks were not live-tested against external Pretix endpoints due to CODE_ONLY network sandbox mode.
- Third-party social graph crawlers (Facebook / Twitter validator bots) were simulated locally via standard HTTP header and meta tag parsers.
