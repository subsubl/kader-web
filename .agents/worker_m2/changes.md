# Changes Implemented: Milestone 2 (i18n Expansion to `pl`, `cs`, `es`)

**Agent**: Worker M2  
**Working Directory**: `/home/ator/Kader/.agents/worker_m2`  
**Milestone**: Milestone 2 (R1: i18n Expansion to Polish, Czech, and Spanish)  
**Status**: COMPLETE  

---

## Summary of Changes

1. **`src/composables/useLocale.ts`**:
   - Expanded `SUPPORTED_LOCALES` from 7 to 10 locales: added `'pl'`, `'cs'`, `'es'`.
   - Updated `Locale` union type: automatically inherits `typeof SUPPORTED_LOCALES[number]`.
   - Added entries to `localeLabels`:
     - `pl`: `{ label: 'Polski', name: 'Polski', native: 'PL', flag: '🇵🇱' }`
     - `cs`: `{ label: 'Čeština', name: 'Čeština', native: 'CS', flag: '🇨🇿' }`
     - `es`: `{ label: 'Español', name: 'Español', native: 'ES', flag: '🇪🇸' }`
   - Added full genuine dictionaries `const pl: Dict = { ... }`, `const cs: Dict = { ... }`, `const es: Dict = { ... }`:
     - Each dictionary contains exactly **938 leaf keys** across all 19 domain sections.
     - Symmetrical object nesting matching `sl` and `en` 1:1.
     - Preserved all 8 parameterized placeholder tokens verbatim:
       1. `buyouts.inquiryMessagePrefill` (`{{tier}}`, `{{guests}}`)
       2. `buyouts.thankYou` (`{{name}}`)
       3. `buyouts.upTo` (`{{n}}`)
       4. `craft.phaseBadge` (`{{n}}`)
       5. `home.viewFullSizeAria` (`{{label}}`)
       6. `home.visitP` (`{{food}}`, `{{table}}`)
       7. `lightbox.showImageAria` (`{{n}}`, `{{label}}`)
       8. `lightbox.thumbnailAria` (`{{n}}`, `{{label}}`)
   - Extended `dictionaries` map: `{ sl, en, de, fr, it, sr, nl, pl, cs, es }`.
   - Extended `flatDictionaries` pre-flattening cache:
     - `pl: flattenDict(pl)`
     - `cs: flattenDict(cs)`
     - `es: flattenDict(es)`
   - Updated header comments to document all 10 supported languages.

2. **`nuxt.config.ts`**:
   - Added SEO alternate `<link>` tags in `app.head.link`:
     - `{ rel: 'alternate', hreflang: 'pl', href: 'https://www.kader.si/' }`
     - `{ rel: 'alternate', hreflang: 'cs', href: 'https://www.kader.si/' }`
     - `{ rel: 'alternate', hreflang: 'es', href: 'https://www.kader.si/' }`
   - Preserved `x-default` and existing alternate links.

3. **`scripts/verify_i18n_parity.mjs`**:
   - Created the standalone programmatic audit script using `jiti`.
   - Tests:
     - All 10 languages present in `SUPPORTED_LOCALES`.
     - `localeLabels` integrity for all 10 locales.
     - Exactly 938 leaf keys per language.
     - 100.0% key parity across all 10 languages (0 missing, 0 extra).
     - 0 empty or whitespace strings across all 9,380 key-value pairs.
     - Verbatim parameter preservation across all 8 parameterized keys in all 10 languages.

4. **Translation Architecture & Tooling (`scripts/i18n_data/` & `scripts/assemble_and_verify.py`)**:
   - Modularized translation sources across 8 domain parts for maintainability and review:
     - `part1_common_nav_header_footer_hero.py` (50 keys)
     - `part2_home_seo.py` (97 keys)
     - `part3_events_misc.py` (136 keys)
     - `part4_craft.py` (113 keys)
     - `part5_provenance.py` (119 keys)
     - `part6_buyouts.py` (126 keys)
     - `part7_club.py` (131 keys)
     - `part8_pizzeria.py` (166 keys)
   - Created `scripts/assemble_and_verify.py` and `scripts/update_use_locale.py` to assemble and inject validated dictionaries.

5. **`src/components/Header.vue` Compatibility**:
   - Verified that `Header.vue` dynamically iterates over `localeLabels`.
   - Adding `pl`, `cs`, `es` to `localeLabels` instantly renders `🇵🇱 PL`, `🇨🇿 CS`, `🇪🇸 ES` in the desktop and mobile language selectors with zero code modifications needed in `Header.vue`.

---

## Verification Results

| Test / Command | Expected | Actual | Result |
|---|---|---|---|
| `node scripts/verify_i18n_parity.mjs` | 10 locales, 938 keys/locale, 0 empty, 8/8 params | 10 locales, 938 keys/locale, 0 empty, 8/8 params | **PASS** |
| `npm run typecheck` | 0 TypeScript errors | Type check passed in 7302ms (0 errors) | **PASS** |
| `npm run build` | Clean production Nitro build | ✨ Build complete! 0 errors (.output/ generated) | **PASS** |
