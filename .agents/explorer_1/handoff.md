# Handoff Report: Kader i18n Architecture & Expansion Analysis

**Agent**: Explorer 1  
**Working Directory**: `/home/ator/Kader/.agents/explorer_1`  
**Target Milestone**: M1 (Exploration & Architecture Mapping) -> M2 (R1: i18n Expansion to `pl`, `cs`, `es`)  
**Scope Reference**: `/home/ator/Kader/.agents/orchestrator/PROJECT.md`  

---

## 1. Observation

### 1.1 `src/composables/useLocale.ts` Architecture
- **File Length**: 7,346 lines (`wc -l src/composables/useLocale.ts` -> `7346`).
- **Locales & Types (lines 8–10)**:
  ```typescript
  export const SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl'] as const
  export type Locale = typeof SUPPORTED_LOCALES[number]
  export const DEFAULT_LOCALE: Locale = 'sl'
  ```
- **Locale Labels (lines 32–40)**:
  ```typescript
  export const localeLabels: Record<Locale, { label: string; name: string; native: string; flag: string }> = {
    sl: { label: 'Slovenščina', name: 'Slovenščina', native: 'SL', flag: '🇸🇮' },
    en: { label: 'English (UK)', name: 'English', native: 'EN', flag: '🇬🇧' },
    de: { label: 'Deutsch', name: 'Deutsch', native: 'DE', flag: '🇩🇪' },
    fr: { label: 'Français', name: 'Français', native: 'FR', flag: '🇫🇷' },
    it: { label: 'Italiano', name: 'Italiano', native: 'IT', flag: '🇮🇹' },
    sr: { label: 'Srpski', name: 'Srpski', native: 'SR', flag: '🇷🇸' },
    nl: { label: 'Nederlands', name: 'Nederlands', native: 'NL', flag: '🇳🇱' }
  }
  ```
- **Dictionary Starts & Exact Symmetry**:
  - `sl`: Line 42 (`const sl: Dict = {`) to Line 1068 (1,027 lines)
  - `en`: Line 1069 (`const en: Dict = {`) to Line 2095 (1,027 lines)
  - `de`: Line 2096 (`const de: Dict = {`) to Line 3122 (1,027 lines)
  - `fr`: Line 3123 (`const fr: Dict = {`) to Line 4149 (1,027 lines)
  - `it`: Line 4150 (`const it: Dict = {`) to Line 5176 (1,027 lines)
  - `sr`: Line 5177 (`const sr: Dict = {`) to Line 6203 (1,027 lines)
  - `nl`: Line 6204 (`const nl: Dict = {`) to Line 7230 (1,027 lines)
  Each dictionary block has identical line length (1,027 lines) and identical JSON object structure.
- **Pre-flattening Cache (lines 7234–7255)**:
  `flattenDict` converts nested objects recursively into dot-delimited key-value pairs stored in `flatDictionaries: Record<Locale, Record<string, string>>`.
- **Interpolation Engine (lines 7317–7331)**:
  ```typescript
  const t = (key: string, params?: Record<string, string | number>): string => {
    const currentDict = flatDictionaries[locale.value] || flatDictionaries[DEFAULT_LOCALE]
    let text = currentDict[key]
    if (text === undefined || text === '') {
      text = flatDictionaries[DEFAULT_LOCALE]?.[key] ?? key
    }

    if (params && typeof text === 'string') {
      return text.replace(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g, (match, paramName) => {
        return params[paramName] !== undefined ? String(params[paramName]) : match
      })
    }

    return text
  }
  ```

### 1.2 Programmatic Audit: Leaf Keys & Parity
An automated inspection across all 7 dictionaries confirmed:
- Exact leaf key count per dictionary: **938 keys**.
- Key parity across all 7 existing dictionaries: **100.0% match** (0 missing, 0 extra keys, 100% identical key order).
- Section leaf key counts:
  - `common`: 7
  - `nav`: 7
  - `header`: 10
  - `footer`: 16
  - `hero`: 10
  - `home`: 61
  - `seo`: 36 (6 sub-pages × 6 keys)
  - `pizzeria`: 166
  - `club`: 131
  - `events`: 42
  - `buyouts`: 126
  - `shop`: 13
  - `reservation`: 34
  - `modal`: 19
  - `lightbox`: 11
  - `pretix`: 5
  - `player`: 12
  - `craft`: 113
  - `provenance`: 119 (17 badges × 7 attributes)
  Total: **938 leaf keys**.

### 1.3 Parameterized Interpolation Keys
Exactly 8 keys across the dictionaries contain interpolation placeholders, and all 8 consistently use double braces `{{param}}`:
1. `buyouts.inquiryMessagePrefill`: `{{tier}}`, `{{guests}}` (used in `src/pages/buyouts.vue:433`)
2. `buyouts.thankYou`: `{{name}}` (used in `src/pages/buyouts.vue:225`)
3. `buyouts.upTo`: `{{n}}` (used in `src/pages/buyouts.vue:80, 96, 112`)
4. `craft.phaseBadge`: `{{n}}` (used in `src/components/PizzeriaCraft.vue:78`)
5. `home.viewFullSizeAria`: `{{label}}` (used in `src/pages/index.vue:299`)
6. `home.visitP`: `{{food}}`, `{{table}}` (used in `src/pages/index.vue:229`)
7. `lightbox.showImageAria`: `{{n}}`, `{{label}}` (used in `src/components/ImageLightboxModal.vue:111`)
8. `lightbox.thumbnailAria`: `{{n}}`, `{{label}}` (used in `src/components/ImageLightboxModal.vue`)

### 1.4 UI & Config Inspection
- **`src/components/Header.vue` (lines 22–31)**:
  ```vue
  <select :value="locale" @change="(e: any) => setLocale(e.target.value as Locale)">
    <option v-for="(info, key) in localeLabels" :key="key" :value="key">
      {{ info.flag }} {{ key.toUpperCase() }}
    </option>
  </select>
  ```
  The language switcher is entirely driven by `localeLabels`. Adding `pl`, `cs`, `es` to `localeLabels` in `useLocale.ts` immediately integrates them into the Header UI without touching `Header.vue` template code.
- **`nuxt.config.ts` (lines 31–38)**:
  Currently lists alternate links for `sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, and `x-default`. Requires adding links for `pl`, `cs`, `es`.
- **Date formatting in page templates**:
  `src/pages/club.vue` (lines 650, 653), `src/pages/events.vue` (lines 388, 419), and `src/pages/index.vue` (line 475) use:
  `locale.value === 'sl' ? 'sl-SI' : 'en-GB'`
  Adding a `BCP47_LOCALES` map or date helper will allow localized formatting for all 10 languages.
- **Typecheck Baseline**:
  Executed `npm run typecheck` (`nuxt typecheck`) -> passed cleanly with 0 errors in 9,694ms.

---

## 2. Logic Chain

1. **Premise**: Milestone M2 requires expanding Kader's i18n system to support Polish (`pl`), Czech (`cs`), and Spanish (`es`) with 100% key parity (~938 keys).
2. **Observation 1.1 & 1.2**: All 7 existing dictionaries have identical key counts (938), identical section hierarchies (19 sections), identical key ordering, and symmetrical line lengths (1,027 lines each).
3. **Inference**: To maintain full compatibility and avoid fallback bugs or runtime undefined errors, `pl`, `cs`, and `es` must be structured as identical JSON trees containing the exact 938 leaf keys in the same order.
4. **Observation 1.3**: Caller components in `src/pages/buyouts.vue`, `src/pages/index.vue`, etc. pass parameters to `t()` expecting placeholders like `{{n}}`, `{{label}}`, `{{tier}}`, `{{guests}}`, `{{name}}`, `{{food}}`, `{{table}}`.
5. **Inference**: Translators/implementers must preserve these 8 parameter tokens verbatim within the translated sentences so that runtime parameter replacement succeeds.
6. **Observation 1.4**: `Header.vue` dynamically loops over `localeLabels`.
7. **Inference**: Updating `SUPPORTED_LOCALES` and `localeLabels` in `useLocale.ts` automatically updates `Header.vue`'s selector with flags (🇵🇱, 🇨🇿, 🇪🇸) and 2-letter codes without needing HTML changes.
8. **Observation 1.4 (nuxt.config.ts)**: Alternate `<link>` tags exist for the 7 initial languages.
9. **Inference**: Adding `<link rel="alternate" hreflang="pl|cs|es" href="https://www.kader.si/" />` in `nuxt.config.ts` satisfies SEO parity.
10. **Conclusion**: The i18n architecture is ready for extension. The concrete roadmap and verification scripts documented in `analysis.md` provide an error-free path for Implementer 1 in Milestone M2.

---

## 3. Caveats

1. **Read-Only Explorer Scope**: In accordance with explorer role guidelines, no source code was modified during this task. Dictionary generation and file modifications belong to Milestone M2 (Implementer).
2. **File Size Consideration**: Adding `pl`, `cs`, and `es` directly to `useLocale.ts` will expand the file from 7,346 lines to ~10,430 lines. While Nuxt 3 / Vite handles this file size without compilation performance degradation, splitting dictionaries into `src/locales/*.ts` is documented as an alternative option in `analysis.md` if the team prefers modular files.
3. **Date Formatting**: Updating the binary date formatters (`locale.value === 'sl' ? 'sl-SI' : 'en-GB'`) in `club.vue`, `events.vue`, and `index.vue` is recommended for full localization fidelity, but is optional and independent of core key parity.

---

## 4. Conclusion

1. **Key Parity Baseline**: The existing 7 dictionaries have **100% key parity** with exactly **938 leaf keys** each.
2. **Expansion Target**: Milestone M2 must generate dictionaries for `pl`, `cs`, and `es` matching all 938 keys, preserving the 8 parameterized tokens (`buyouts.inquiryMessagePrefill`, `buyouts.thankYou`, `buyouts.upTo`, `craft.phaseBadge`, `home.viewFullSizeAria`, `home.visitP`, `lightbox.showImageAria`, `lightbox.thumbnailAria`).
3. **Target Files for M2**:
   - `src/composables/useLocale.ts` (SUPPORTED_LOCALES, Locale type, localeLabels, pl/cs/es dictionaries, flatDictionaries)
   - `nuxt.config.ts` (add 3 alternate link tags)
   - `Header.vue` (verified compatible out-of-the-box via `localeLabels`)
4. **Detailed Reference**: All section distributions, domain glossaries, and automated verification scripts are documented in `.agents/explorer_1/analysis.md`.

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Key Count & Parity Programmatically**:
   Run the following Python one-liner from the project root:
   ```bash
   python3 -c "
   import json, re
   with open('src/composables/useLocale.ts') as f:
       lines = f.readlines()
   ranges = {'sl':(41,1067),'en':(1068,2094),'de':(2095,3121),'fr':(3122,4148),'it':(4149,5175),'sr':(5176,6202),'nl':(6203,7229)}
   def flat(d, p=''):
       r = {}
       for k, v in d.items():
           f = f'{p}.{k}' if p else k
           r.update(flat(v, f)) if isinstance(v, dict) else r.setdefault(f, str(v))
       return r
   dicts = {loc: flat(json.loads(''.join(lines[s:e+1]).replace(f'const {loc}: Dict = ', '', 1).strip())) for loc, (s, e) in ranges.items()}
   base = set(dicts['sl'].keys())
   print(f'Base leaf count: {len(base)}')
   assert len(base) == 938
   for loc in ['en','de','fr','it','sr','nl']:
       assert set(dicts[loc].keys()) == base
   print('100% key parity verified across all 7 locales!')
   "
   ```
   **Expected Output**:
   ```
   Base leaf count: 938
   100% key parity verified across all 7 locales!
   ```

2. **Verify Parameter Interpolation**:
   Run the following check for all parameterized keys:
   ```bash
   python3 -c "
   import json, re
   with open('src/composables/useLocale.ts') as f:
       lines = f.readlines()
   ranges = {'sl':(41,1067),'en':(1068,2094),'de':(2095,3121),'fr':(3122,4148),'it':(4149,5175),'sr':(5176,6202),'nl':(6203,7229)}
   def flat(d, p=''):
       r = {}
       for k, v in d.items():
           f = f'{p}.{k}' if p else k
           r.update(flat(v, f)) if isinstance(v, dict) else r.setdefault(f, str(v))
       return r
   sl = flat(json.loads(''.join(lines[41:1068]).replace('const sl: Dict = ', '', 1).strip()))
   param_keys = [k for k, v in sl.items() if '{' in v]
   print(f'Parameterized keys count: {len(param_keys)}')
   for k in sorted(param_keys):
       print(f'  {k}: {re.findall(r\"\{\{([a-zA-Z0-9_-]+)\}\}\", sl[k])}')
   assert len(param_keys) == 8
   "
   ```
   **Expected Output**:
   ```
   Parameterized keys count: 8
     buyouts.inquiryMessagePrefill: ['tier', 'guests']
     buyouts.thankYou: ['name']
     buyouts.upTo: ['n']
     craft.phaseBadge: ['n']
     home.viewFullSizeAria: ['label']
     home.visitP: ['food', 'table']
     lightbox.showImageAria: ['n', 'label']
     lightbox.thumbnailAria: ['n', 'label']
   ```

3. **Verify Baseline TypeScript Compilation**:
   ```bash
   npm run typecheck
   ```
   **Expected Output**: `Type check passed in ...ms.` with exit code 0.
