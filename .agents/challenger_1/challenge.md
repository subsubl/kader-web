# Adversarial Challenge Report — i18n System (10 Locales)

**Target**: `src/composables/useLocale.ts`, `src/components/Header.vue`, `nuxt.config.ts`  
**Challenger**: Challenger 1 (critic, specialist)  
**Date**: 2026-09-12  
**Test Harness**: `.agents/challenger_1/stress_test_i18n.mjs`  

---

## Challenge Summary

**Overall risk assessment**: **LOW**

The 10-language internationalization system in `src/composables/useLocale.ts` is exceptionally robust, architecturally sound, and rigorously implemented. Empirical testing confirmed 100.0% parity across all 10 languages (938 leaf keys per language), zero null/undefined/empty string values, correct Unicode character encoding and diacritics across Polish, Czech, Spanish, Slovenian, Serbian, German, French, and Italian, and resilient parameter interpolation handling across all 8 parameterized keys with boundary inputs.

- `npm run typecheck` passed with zero errors in 12.7s (exit code 0).
- `npm run build` succeeded completely with zero errors when run in an isolated build directory (`npx nuxi build --build-dir .nuxt-build`), generating the full Nitro server and Vite bundles. However, running standard `npm run build` against the default `.nuxt` directory triggers an intermittent filesystem race condition (`ENOENT: open .../dist/client/manifest.json`) if persistent `nuxt dev` watcher processes are active on the host machine.

---

## Challenges

### [Low] Challenge 1: Asymmetric / Dotted Brace Interpolation Resilience

- **Assumption challenged**: The interpolation regex `/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g` assumes parameter tokens adhere strictly to `[a-zA-Z0-9_-]+` and treats single or double braces symmetrically.
- **Attack scenario**: 
  1. If a translation string introduces unbalanced braces such as `{param}}` or `{{param}`, the quantifier `\{{1,2}` and `\}{1,2}` matches greedily up to 2 braces, stripping uneven trailing braces.
  2. If future developers introduce dotted object paths (e.g., `{{user.name}}` or `{{item.price}}`), the token character class `[a-zA-Z0-9_-]+` will not match, causing interpolation to fail silently and leaving raw placeholders in the UI.
- **Blast radius**: Low. All current 8 parameterized keys across all 10 locales strictly adhere to single identifier names (`tier`, `guests`, `name`, `n`, `label`, `food`, `table`).
- **Mitigation**: Add a build-time linter rule or dictionary key validator to enforce that any translation string containing `{` matches the allowed parameter list.

---

### [Low] Challenge 2: Unresolved Parameter Fallback in User-Facing Strings

- **Assumption challenged**: Components invoking parameterized translations will always provide all required keys in the `params` record.
- **Attack scenario**: If a caller provides an incomplete parameter object (e.g., `t('buyouts.inquiryMessagePrefill', { tier: 'VIP' })` omitting `guests`), the replacer retains the verbatim placeholder `{{guests}}` in the output text.
- **Blast radius**: Low. Raw placeholder string `{{guests}}` is displayed to users in the browser rather than a blank or fallback value.
- **Mitigation**: In production environments, consider providing default parameter fallbacks or logging a dev-mode warning when an expected placeholder is unresolved.

---

### [Informational] Challenge 3: Storage Quota & Private Browsing Exception Safety

- **Assumption challenged**: Browser storage (`localStorage` and cookies) is accessible and writable across all browsing contexts.
- **Attack scenario**: Under Safari Private Browsing mode, privacy-focused browser extensions, or embedded cross-origin iframes, calls to `localStorage.setItem` throw a `QuotaExceededError` or `SecurityError`.
- **Empirical verification**: The implementation in `useLocale.ts` wraps all `localStorage` access in `try / catch` blocks (lines 10363–10374, 10382–10390). In addition, SSR cookie state and Vue reactive `useState` maintain the active locale even if persistent storage fails.
- **Blast radius**: Zero. Fully mitigated by existing try/catch safeguards.

---

### [Informational / Verified Robust] Challenge 4: Regex Replacement Injection Attack

- **Assumption challenged**: User input containing regex replacement tokens (`$`, `$$`, `$&`, `$'`, `$1`) could corrupt output strings if passed to `String.prototype.replace`.
- **Attack scenario**: If interpolation had been implemented via string-to-string substitution (`text.replace(regex, paramValue)`), special dollar-sign sequences in `paramValue` would be expanded into matched substrings or backreferences.
- **Empirical verification**: The implementation utilizes a functional replacer `(match, paramName) => params[paramName] !== undefined ? String(params[paramName]) : match`. JavaScript does not evaluate dollar-sign replacement tokens in function return values. Tested with `$& and $' and $1` — output retained the exact literal string.
- **Blast radius**: Zero. Immune to regex replacement token injection.

---

### [Medium] Challenge 5: Build-time Filesystem Race Condition with Active Dev Servers

- **Assumption challenged**: Running `npm run build` against the default `.nuxt` build directory assumes no concurrent `nuxt dev` server is active.
- **Attack scenario**: When background `nuxt dev` processes are active (e.g., long-running development server instances in other terminal pts sessions), the dev server's file watcher detects writes to `.nuxt/dist/client`, treats it as dev artifact drift, and automatically wipes `dist/client` to re-create `dev.json`. If this occurs while `buildServer` is executing, the build crashes with:
  `Nuxt build error: Error: ENOENT: no such file or directory, open '/home/ator/Kader/.nuxt/dist/client/manifest.json'`
- **Empirical verification**: 
  1. A file-system watcher script (`fs.watch`) confirmed that concurrent `nuxt dev` processes (PIDs 1296502, 1753421, 2375145) executed `rename dist/client` and wrote `dev.json` mid-build.
  2. When executed with an isolated build directory (`npx nuxi build --build-dir .nuxt-build`), the entire client and Nitro server build completed with 0 errors in 6.8 seconds.
- **Blast radius**: Medium during local multitasking. Zero in isolated CI/CD environments where `nuxt dev` is not running.
- **Mitigation**: Ensure background `nuxt dev` processes are terminated prior to production builds, or configure isolated build directories in concurrent environments.

---

## Stress Test Results

| # | Scenario / Test Suite | Expected Behavior | Actual Behavior | Pass/Fail |
|---|-----------------------|-------------------|-----------------|:---------:|
| 1 | `SUPPORTED_LOCALES` integrity (10 locales) | Contains exactly `sl, en, de, fr, it, sr, nl, pl, cs, es` | Exactly 10 supported locales | **PASS** |
| 2 | `DEFAULT_LOCALE` | Equal to `'sl'` | `'sl'` | **PASS** |
| 3 | `isSupportedLocale` validation | True for 10 valid codes, false for invalid/uppercase/empty/null/numbers | 100% accurate classification | **PASS** |
| 4 | `localeLabels` integrity | All 10 locales have non-empty `label`, `name`, `native`, `flag` | Valid and complete across all 10 | **PASS** |
| 5 | Dictionary key parity audit | Exactly 100.0% parity across all 10 languages (938 leaf keys) | 938 keys per language, 0 missing, 0 extra | **PASS** |
| 6 | Pairwise cross-language comparison | 45 language pairs match identically | 45/45 pairs have 0 missing and 0 extra keys | **PASS** |
| 7 | Value hygiene audit | 0 nulls, 0 undefineds, 0 empty strings, 0 whitespace-only | 0 issues across 9,380 key-value pairs | **PASS** |
| 8 | Polish diacritics audit | All 9 special characters present: ą, ć, ę, ł, ń, ó, ś, ź, ż | ą:226, ć:89, ę:240, ł:272, ń:87, ó:171, ś:228, ź:28, ż:186 | **PASS** |
| 9 | Czech diacritics audit | All 11 special characters present: ě, š, č, ř, ž, ý, á, í, é, ů, ú | ě:271, š:129, č:289, ř:259, ž:148, ý:332, á:674, í:761, é:342, ů:90, ú:5 | **PASS** |
| 10 | Spanish diacritics audit | All 8 special characters present: á, é, í, ó, ú, ñ, ¿, ¡ | á:98, é:70, í:105, ó:247, ú:51, ñ:37, ¿:2, ¡:9 | **PASS** |
| 11 | Slovenian & Serbian diacritics audit | č, š, ž, ć, đ present | SL: č:438, š:201, ž:110; SR: č:287, ć:130, đ:82, š:183, ž:128 | **PASS** |
| 12 | German, French, Italian diacritics audit | ä, ö, ü, ß, é, è, ê, à, â, ç, ô, ù, ì, ò present | All present and correctly encoded | **PASS** |
| 13 | Forensic Mojibake audit | 0 replacement chars (U+FFFD), 0 double-UTF8, 0 raw `\uXXXX` | 0 anomalies detected across entire file | **PASS** |
| 14 | Parameterized keys discovery | Exactly 8 parameterized keys across dictionaries | Exactly 8 keys found and verified | **PASS** |
| 15 | Parameter boundary: Falsy number `0` | Number `0` rendered as `"0"`, not empty or raw placeholder | Rendered `"0"` accurately | **PASS** |
| 16 | Parameter boundary: Negative/large numbers | Negative & large numbers rendered properly | Rendered `-1`, `-5`, `999999` accurately | **PASS** |
| 17 | Parameter boundary: Floating point decimals | Float numbers rendered properly | Rendered `3.14159` accurately | **PASS** |
| 18 | Parameter boundary: Empty string `""` | Empty string replaces placeholder cleanly | Rendered `""` without placeholders | **PASS** |
| 19 | Parameter boundary: HTML / quotes | Special characters preserved verbatim | Rendered without escaping errors | **PASS** |
| 20 | Parameter boundary: Emojis & Unicode | Emojis preserved intact | Rendered 🍕🥂🎉🏰 correctly | **PASS** |
| 21 | Parameter boundary: Missing params | Placeholders retained when param omitted | Retains `{{placeholder}}` safely | **PASS** |
| 22 | Fallback behavior: Non-existent key | Returns the key string itself verbatim | Returns requested key | **PASS** |
| 23 | Fallback behavior: Unsupported locale | Falls back to `DEFAULT_LOCALE` (`sl`) | Resolves to Slovenian translation | **PASS** |
| 24 | High-throughput microbenchmark | O(1) lookup & interpolation performance | 1,733,666 ops/sec (40,000 ops in 23.07ms) | **PASS** |
| 25 | Nuxt TypeScript validation (`npm run typecheck`) | Clean compilation with zero TypeScript errors | Passed in 12,755ms (exit code 0) | **PASS** |
| 26 | Nuxt production build (isolated build-dir) | Nitro server & Vite client bundles built cleanly | Passed in 6,800ms (exit code 0) | **PASS** |
| 27 | Nuxt production build (default dir with active dev server) | Default dir without concurrent dev interference | Intermittent race condition when dev watcher active (see Challenge 5) | **WARN** |

---

## Unchallenged Areas

- **Dynamic server-side cookie writing in production reverse proxy**: In production deployment behind Nginx/Cloudflare, cookie `SameSite` and `Secure` attributes interact with HTTPS headers. This requires live HTTP browser sessions and is outside unit/static challenge scope.
- **Font rendering / glyph coverage**: While UTF-8 character encoding is verified, actual rendering of diacritics in the user's browser depends on Google Fonts (`Playfair Display` and `Montserrat` loaded in `nuxt.config.ts`).
