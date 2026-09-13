# Internationalization (i18n) Architecture & Expansion Analysis

**Project**: Kader Grad Kodeljevo (`kader-grad-kodeljevo`)  
**Investigator**: Explorer 1  
**Target Milestone**: M1 (Exploration & Architecture Mapping) -> M2 (R1: i18n Expansion to `pl`, `cs`, `es`)  
**Scope**: `src/composables/useLocale.ts`, `src/components/Header.vue`, `nuxt.config.ts`, date formatters in page templates.

---

## 1. Executive Summary

Kader Grad Kodeljevo utilizes a high-performance, bespoke internationalization architecture implemented entirely in `src/composables/useLocale.ts`. It manages 7 languages:
- `sl` (Slovenian - Default / Source of Truth)
- `en` (English UK)
- `de` (German)
- `fr` (French)
- `it` (Italian)
- `sr` (Serbian)
- `nl` (Dutch)

Target expansion requires adding:
- `pl` (Polish)
- `cs` (Czech)
- `es` (Spanish)

### Key Audit Highlights
1. **Exact Leaf Key Count**: Exactly **938 leaf keys** exist across 19 top-level domain sections.
2. **Current Key Parity**: **100.0% key parity** exists across all 7 currently active dictionaries (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`). Both key sets and key insertion order are 100% identical.
3. **Interpolation Engine**: The translation helper `t(key, params)` supports dual interpolation (`{param}` and `{{param}}`) via regex `\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}`. In practice, all existing 7 dictionaries exclusively and consistently use **double braces** `{{param}}` across exactly **8 parameterized keys**.
4. **Header.vue Integration**: The language dropdown in `Header.vue` dynamically iterates over `localeLabels`. Adding `pl`, `cs`, and `es` to `localeLabels` in `useLocale.ts` will automatically reflect in the UI without requiring HTML modifications.
5. **nuxt.config.ts Integration**: Requires 3 new `<link rel="alternate" hreflang="..." href="https://www.kader.si/" />` tags for `pl`, `cs`, `es`.
6. **Date Formatting Opportunity**: Page components currently hardcode a binary date check: `locale.value === 'sl' ? 'sl-SI' : 'en-GB'`. An exported BCP 47 map or date helper will allow all 10 languages to display localized dates.

---

## 2. Deep Dive: `src/composables/useLocale.ts`

### 2.1 File Metrics and Structure
- **Total Lines**: 7,346 lines
- **Total Bytes**: ~427 KB
- **Dictionary Symmetry**: Each of the 7 existing dictionaries is structured identically and occupies exactly 1,027 lines:
  - `sl`: Lines 42–1068 (1,027 lines)
  - `en`: Lines 1069–2095 (1,027 lines)
  - `de`: Lines 2096–3122 (1,027 lines)
  - `fr`: Lines 3123–4149 (1,027 lines)
  - `it`: Lines 4150–5176 (1,027 lines)
  - `sr`: Lines 5177–6203 (1,027 lines)
  - `nl`: Lines 6204–7230 (1,027 lines)

### 2.2 Core Types and Constants
```typescript
export const SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'sl'

export function isSupportedLocale(val: unknown): val is Locale {
  return typeof val === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(val)
}

export interface Dict {
  [key: string]: string | Dict
}

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

### 2.3 Pre-flattening and O(1) Lookup
To prevent expensive nested object traversals on every render or translation call, dictionaries are pre-flattened at module evaluation time:

```typescript
function flattenDict(obj: Dict, prefix = ''): Record<string, string> {
  const res: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(res, flattenDict(value as Dict, fullKey))
    } else if (typeof value === 'string' || typeof value === 'number') {
      res[fullKey] = String(value)
    }
  }
  return res
}

export const flatDictionaries: Record<Locale, Record<string, string>> = {
  sl: flattenDict(sl),
  en: flattenDict(en),
  de: flattenDict(de),
  fr: flattenDict(fr),
  it: flattenDict(it),
  sr: flattenDict(sr),
  nl: flattenDict(nl)
}
```

Flattening converts hierarchical paths to dot-notation strings:
- Top level: `common.close` -> `"Zapri"`
- Nested SEO: `seo.pizzeria.title` -> `"Pizzeria Kader | Neapeljska Pica..."`
- Triple nested badge: `provenance.badges.sanMarzano.title` -> `"Paradižnik San Marzano D.O.P."`

### 2.4 Translation Function `t(key, params)`
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

**Key Behaviors:**
1. Direct index into `flatDictionaries[locale.value][key]` ($O(1)$).
2. Fallback to `DEFAULT_LOCALE` (`sl`) if missing or empty string.
3. Fallback to `key` string if not found in `DEFAULT_LOCALE`.
4. Regex replacement handles both `{foo}` and `{{foo}}`. Unmatched parameters remain as placeholder text (`match`).

### 2.5 Hydration & Persistence Flow
1. **SSR Phase**: Reads cookie `kader-lang` via `useCookie<Locale>('kader-lang')` with 1-year expiration (`maxAge: 31536000`, `sameSite: 'lax'`). State is initialized with Nuxt `useState<Locale>('locale')`.
2. **Client Mount Phase**: Synchronizes with `localStorage.getItem('kader-lang')` or `'kader-locale'`. Updates `document.documentElement.lang = locale.value`.
3. **Switch Phase**: `setLocale(l)` sets reactive `locale.value`, writes `cookie.value`, stores in `localStorage`, and mutates `document.documentElement.lang`.

---

## 3. Key Catalog and Parity Audit

### 3.1 Breakdown by Domain Section

A comprehensive programmatic audit of `useLocale.ts` revealed that every dictionary contains **exactly 938 leaf keys** across 19 sections:

| # | Section | Leaf Key Count | Description |
|---|---|---|---|
| 1 | `common` | 7 | Common buttons (close, closeWindow), brand titles, day/night mode |
| 2 | `nav` | 7 | Main navigation links (home, pizzeria, club, events, buyouts, shop, admin) |
| 3 | `header` | 10 | Header action CTAs, logo alt, aria labels (including aria aliases) |
| 4 | `footer` | 16 | Tagline, contacts, pickup/reservation headers, tax ID, opening hours |
| 5 | `hero` | 10 | Homepage hero banner headings, tagline, quote, CTAs |
| 6 | `home` | 61 | Day/night split, floor cards, acoustic specs, terrace info, maps, hours |
| 7 | `seo` | 36 | 6 pages (`home`, `pizzeria`, `club`, `events`, `buyouts`, `shop`) × 6 keys (`title`, `description`, `ogTitle`, `ogDescription`, `keywords`, `canonical`) |
| 8 | `pizzeria` | 166 | Neapolitan pizza menu items, categories, ingredients, allergens, descriptions |
| 9 | `club` | 131 | Sound system specs (Klipsch La Scala, Tractrix), floors, door rules, FAQs, safety |
| 10 | `events` | 42 | Resident Advisor integration strings, filters, date labels, ticket status |
| 11 | `buyouts` | 126 | Private hire packages (3 tiers), pricing, specs, inquiry form fields & validation |
| 12 | `shop` | 13 | Merchandise items, sizes, cart notice, coming soon status |
| 13 | `reservation` | 34 | Table reservation modal, time slots, guest counter, dietary preferences |
| 14 | `modal` | 19 | Event ticket modal, checkout integration, cancellation terms, disclaimers |
| 15 | `lightbox` | 11 | Photo gallery lightbox controls, zoom, navigation, aria labels |
| 16 | `pretix` | 5 | Pretix widget fallback text, loading notice, retry, noscript warning |
| 17 | `player` | 12 | DJ player bar controls, resident selector tags, volume, mute |
| 18 | `craft` | 113 | 5 technical phases of Neapolitan dough crafting, hydration, oven thermal metrics |
| 19 | `provenance` | 119 | 17 provenance badges (`sanMarzano`, `bufala`, etc.) × 7 attributes |
| **Total** | | **938** | **100% key parity across all 7 languages** |

### 3.2 Key Parity Verification Results
Running an exhaustive set-difference and key-order script between `sl` and all other 6 languages confirmed:
- Missing keys: **0** across all languages
- Extra keys: **0** across all languages
- Key ordering differences: **0** across all languages
- HTML tags in values: **0** across all languages

### 3.3 Alias Patterns and Redundancy
The dictionary intentionally incorporates alias keys to guarantee component compatibility regardless of naming style:
1. **Provenance Badges**:
   - `provenance.badges.sanMarzano` ≡ `provenance.badges.san-marzano`
   - `provenance.badges.fiorDiLatte` ≡ `provenance.badges.fior-di-latte`
   - `provenance.badges.ferment48h` ≡ `provenance.badges.ferment-48h`
   - `provenance.badges.olioBio` ≡ `provenance.badges.olio-bio`
   - Internal badge attributes: `shortName` ≡ `short` and `description` ≡ `desc`
2. **Header Aria Aliases**:
   - `langSelectAria` ≡ `langSelector` ≡ `aria_lang`
   - `menuToggleAria` ≡ `toggleMenu` ≡ `navMenuToggleAria` ≡ `aria_menu`
3. **Footer Aliases**:
   - `taxId` ≡ `tax_id` ("SI45321361")
   - `locationSub` ≡ `addressCastle` ("Grad Kodeljevo")

When generating `pl`, `cs`, and `es`, these aliases must be maintained with identical values.

---

## 4. Parameter Interpolation Analysis

Across the 938 keys in all 7 dictionaries, exactly **8 keys** contain parameter interpolation placeholders. All 8 keys consistently utilize the `{{param}}` syntax:

| Key | Parameters | Slovenian (`sl`) | English (`en`) | Component Usage |
|---|---|---|---|---|
| `buyouts.inquiryMessagePrefill` | `{{tier}}`, `{{guests}}` | `Zanimam se za paket {{tier}} (do {{guests}} oseb)...` | `I am interested in the {{tier}} package (up to {{guests}} guests)...` | `src/pages/buyouts.vue:433` |
| `buyouts.thankYou` | `{{name}}` | `Hvala, {{name}}. Kmalu vas bomo kontaktirali.` | `Thank you, {{name}}. We will be in touch shortly.` | `src/pages/buyouts.vue:225` |
| `buyouts.upTo` | `{{n}}` | `Do {{n}} gostov` | `Up to {{n}} guests` | `src/pages/buyouts.vue:80, 96, 112` |
| `craft.phaseBadge` | `{{n}}` | `Faza {{n}} / 05` | `Phase {{n}} / 05` | `src/components/PizzeriaCraft.vue:78` |
| `home.viewFullSizeAria` | `{{label}}` | `Poglej sliko v polni velikosti: {{label}}` | `View image in full size: {{label}}` | `src/pages/index.vue:299` |
| `home.visitP` | `{{food}}`, `{{table}}` | `... Naročila hrane: {{food}} ; Rezervacije miz: {{table}}.` | `... Food orders: {{food}} ; Table bookings: {{table}}.` | `src/pages/index.vue:229` |
| `lightbox.showImageAria` | `{{n}}`, `{{label}}` | `Prikaži sliko {{n}}: {{label}}` | `Show image {{n}}: {{label}}` | `src/components/ImageLightboxModal.vue:111` |
| `lightbox.thumbnailAria` | `{{n}}`, `{{label}}` | `Prikaži sliko {{n}}: {{label}}` | `Show image {{n}}: {{label}}` | `src/components/ImageLightboxModal.vue` |

### Critical Requirement for New Locales
When creating `pl`, `cs`, and `es` dictionaries, these 8 keys **must retain their exact parameter names** (`{{tier}}`, `{{guests}}`, `{{name}}`, `{{n}}`, `{{label}}`, `{{food}}`, `{{table}}`). Do NOT translate parameter names (e.g. do not translate `{{name}}` to `{{ime}}` or `{{nombre}}`).

---

## 5. UI and Configuration Integration

### 5.1 `src/components/Header.vue`
The desktop and mobile header utilizes a `<select>` language switcher:

```vue
<select
  :value="locale"
  @change="(e: any) => setLocale(e.target.value as Locale)"
  :aria-label="t('header.langSelector')"
  class="bg-zinc-900 border border-zinc-700 text-gray-200 text-xs font-bold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-red-500 cursor-pointer appearance-none pr-8 shadow-sm"
>
  <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-zinc-900 text-white py-1">
    {{ info.flag }} {{ key.toUpperCase() }}
  </option>
</select>
```

**Findings:**
- The component is **100% data-driven**. It iterates dynamically over `localeLabels`.
- Key display format is `{{ info.flag }} {{ key.toUpperCase() }}` (e.g. `🇵🇱 PL`, `🇨🇿 CS`, `🇪🇸 ES`).
- Width is fixed/compact enough that expanding to 10 two-letter codes introduces zero layout shift or overflow issues.
- Minimum touch target (`min-h-[44px]`) satisfies accessibility standards.

### 5.2 `nuxt.config.ts`
`nuxt.config.ts` defines explicit SEO alternate links in `app.head.link`:

```typescript
{ rel: 'alternate', hreflang: 'sl', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'en', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'de', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'fr', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'it', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'sr', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'nl', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'x-default', href: 'https://www.kader.si/' }
```

**Required Update:**
Insert the three new locales before `x-default`:
```typescript
{ rel: 'alternate', hreflang: 'pl', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'cs', href: 'https://www.kader.si/' },
{ rel: 'alternate', hreflang: 'es', href: 'https://www.kader.si/' },
```

### 5.3 Page-Level Date Formatting Pattern
In `src/pages/club.vue` (lines 650, 653), `src/pages/events.vue` (lines 388, 419), and `src/pages/index.vue` (line 475), date strings are formatted using:
```typescript
new Date(e.date).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', { ... })
```

**Architectural Recommendation:**
Export a locale-to-BCP-47 map or a helper function from `useLocale.ts`:
```typescript
export const BCP47_LOCALES: Record<Locale, string> = {
  sl: 'sl-SI',
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  sr: 'sr-RS',
  nl: 'nl-NL',
  pl: 'pl-PL',
  cs: 'cs-CZ',
  es: 'es-ES'
}

export function formatDate(date: string | Date | number, options?: Intl.DateTimeFormatOptions, currentLocale: Locale = DEFAULT_LOCALE): string {
  const bcp47 = BCP47_LOCALES[currentLocale] || 'en-GB'
  return new Date(date).toLocaleDateString(bcp47, options)
}
```
This enables authentic localized date rendering in Polish, Czech, and Spanish (e.g. `sob., 12 wrz`, `so 12. 9.`, `sáb, 12 sept`).

---

## 6. Implementation Strategy for Polish (`pl`), Czech (`cs`), and Spanish (`es`)

### 6.1 Cultural & Linguistic Domain Guidelines

#### A. Culinary Domain (Authentic Neapolitan Pizza Bistro)
- **Polish (`pl`)**:
  - Venue: *Kader Grad Kodeljevo* / *Bistro pizzowe i klub w Zamku Kodeljevo*
  - Dough/Fermentation: *ciasto dojrzewające przez 48 godzin*, *mąka Caputo Tipo "00"*, *ręcznie rozciągane ciasto*
  - Oven/Baking: *tradycyjny piec neapolitański opalany w temperaturze 485°C*
  - Ingredients: *pomidory San Marzano D.O.P.*, *świeża Mozzarella di Bufala Campana*, *Fior di Latte*, *oliwa z pierwszego tłoczenia z certyfikatem ekologicznym*, *rzemieślnicze włoskie wędliny*, *panuozzo (pieczona kanapka neapolitańska)*
- **Czech (`cs`)**:
  - Venue: *Kader Grad Kodeljevo* / *Pizza bistro a klub na Hradě Kodeljevo*
  - Dough/Fermentation: *těsto kynuté 48 hodin*, *italská mouka Caputo Tipo "00"*, *ručně vytahované těsto bez válečku*
  - Oven/Baking: *neapolská kamenná pec rozpálená na 485 °C*
  - Ingredients: *rajčata San Marzano D.O.P.*, *čerstvá Mozzarella di Bufala Campana*, *Fior di Latte*, *bio extra panenský olivový olej*, *panuozzo (tradiční pečený neapolský sendvič)*
- **Spanish (`es`)**:
  - Venue: *Kader Grad Kodeljevo* / *Bistró de pizza y club en el Castillo Kodeljevo*
  - Dough/Fermentation: *masa fermentada lentamente durante 48 horas*, *harina Caputo Tipo "00"*, *estirada a mano*
  - Oven/Baking: *horno de piedra napolitano a 485 °C*
  - Ingredients: *tomates San Marzano D.O.P.*, *Mozzarella di Bufala Campana fresca*, *Fior di Latte*, *aceite de oliva virgen extra ecológico*, *panuozzo napolitano tradicional*

#### B. Nightlife & Club Domain (Audiophile Sound Sanctuary)
- **Polish (`pl`)**:
  - Sound: *audiofilski system nagłośnieniowy Klipsch La Scala*, *opatentowana tuba Tractrix®*, *wzmacniacze QUAD Class A*, *końcówki mocy Crest C12*, *przetworniki B&C*
  - Experience: *hipnotyczne techno*, *surowy minimal industrialny*, *selekcja rezydentów*, *intymna atmosfera piwnicy*
  - Safety & Door Policy: *polityka bezpiecznej przestrzeni (safe space)*, *zerowa tolerancja dla nękania i dyskryminacji*, *zakaz używania telefonów i robienia zdjęć na parkiecie*, *ochrona słuchu*
- **Czech (`cs`)**:
  - Sound: *audiofilské ozvučení Klipsch La Scala*, *patentovaná horna Tractrix®*, *zesilovače QUAD Class A*, *koncové zesilovače Crest C12*, *měniče B&C*
  - Experience: *hypnotické techno*, *industriální minimal*, *rezidentní selektoři*, *suterénní klubový prostor*
  - Safety & Door Policy: *politika bezpečného prostoru (safe space)*, *nulová tolerance k obtěžování a diskriminaci*, *zákaz focení a používání telefonů na parketu*, *ochrana sluchu*
- **Spanish (`es`)**:
  - Sound: *sistema de sonido audiófilo Klipsch La Scala*, *bocina patentada Tractrix®*, *amplificadores QUAD Clase A*, *etapas de potencia Crest C12*, *transductores B&C*
  - Experience: *techno hipnótico*, *minimal industrial*, *selectores residentes*, *club subterráneo íntimo*
  - Safety & Door Policy: *política de espacio seguro (safe space)*, *tolerancia cero hacia el acoso y la discriminación*, *prohibido usar teléfonos o tomar fotos en la pista de baile*, *protección auditiva*

#### C. Invariant Entities (Must NOT Be Translated)
- Venue Proper Name: **Kader Grad Kodeljevo** (remains unchanged in brand headers and logo tags)
- Exact Physical Address: **Ulica Carla Benza 20, 1000 Ljubljana**
- Slovenian Tax ID: **SI45321361**
- Phone Numbers: **(+386 83 836 740)** and **(+386 40 175 628)**
- Technical Audio Brands: **Klipsch La Scala**, **Tractrix®**, **QUAD Class A**, **CREST C12**, **B&C**
- External Platforms: **Resident Advisor**, **RA**, **Pretix**, **Google Maps**

---

### 6.2 Structural Placement Architecture

There are two viable approaches for placing the new dictionaries:

#### Option A: Direct Monolithic Extension in `useLocale.ts` (Recommended for Consistency)
- In `src/composables/useLocale.ts`, declare `const pl: Dict = { ... }`, `const cs: Dict = { ... }`, `const es: Dict = { ... }` alongside `sl`...`nl`.
- Update `SUPPORTED_LOCALES`, `localeLabels`, `dictionaries`, and `flatDictionaries`.
- **Pros**: Matches existing code pattern 100%; zero impact on imports across components; maintains single-file composable packaging.
- **Cons**: Increases `useLocale.ts` from 7,346 lines to ~10,430 lines.

#### Option B: Modular Locales Architecture (`src/locales/*.ts`)
- Extract each dictionary into `src/locales/sl.ts`, `src/locales/en.ts`, ..., `src/locales/pl.ts`, `src/locales/cs.ts`, `src/locales/es.ts`.
- Re-export and assemble in `src/composables/useLocale.ts`.
- **Pros**: Cleaner file sizes (~1,027 lines per file), easier git review.
- **Cons**: Refactoring existing file structure; requires orchestrator approval according to layout constraints.

**Recommendation**: Proceed with **Option A** to strictly adhere to the contract established in `PROJECT.md` ("src/composables/useLocale.ts (SUPPORTED_LOCALES, Locale type, localeLabels, dictionary definitions, flatDictionaries)").

---

### 6.3 Automated Key Parity & Parameter Verification Protocol

Before completing Milestone M2, the implementer must execute an automated audit script to verify 100% key parity and parameter safety.

#### Validator Script Specification (`scripts/verify-i18n.mjs`)
```javascript
import fs from 'node:fs'
import { SUPPORTED_LOCALES, dictionaries, flatDictionaries } from '../src/composables/useLocale.ts'

const baseLocale = 'sl'
const baseKeys = Object.keys(flatDictionaries[baseLocale])

console.log(`Auditing ${SUPPORTED_LOCALES.length} locales against ${baseKeys.length} base keys...`)

let hasErrors = false
const paramRegex = /\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g

for (const loc of SUPPORTED_LOCALES) {
  const currentKeys = Object.keys(flatDictionaries[loc])
  
  // 1. Key count
  if (currentKeys.length !== baseKeys.length) {
    console.error(`[FAIL] ${loc} has ${currentKeys.length} keys, expected ${baseKeys.length}`)
    hasErrors = true
  }

  // 2. Missing & extra keys
  const baseSet = new Set(baseKeys)
  const currSet = new Set(currentKeys)
  const missing = [...baseSet].filter(k => !currSet.has(k))
  const extra = [...currSet].filter(k => !baseSet.has(k))

  if (missing.length > 0) {
    console.error(`[FAIL] ${loc} missing keys:`, missing)
    hasErrors = true
  }
  if (extra.length > 0) {
    console.error(`[FAIL] ${loc} extra keys:`, extra)
    hasErrors = true
  }

  // 3. Parameter parity
  for (const k of baseKeys) {
    const baseParams = (flatDictionaries[baseLocale][k].match(paramRegex) || []).sort()
    const locParams = (flatDictionaries[loc][k].match(paramRegex) || []).sort()
    if (baseParams.join(',') !== locParams.join(',')) {
      console.error(`[FAIL] Parameter mismatch in key "${k}" for locale ${loc}: expected [${baseParams}] got [${locParams}]`)
      hasErrors = true
    }
  }
}

if (!hasErrors) {
  console.log('✅ All 10 locales passed 100% key parity and parameter verification!')
  process.exit(0)
} else {
  process.exit(1)
}
```

---

## 7. Action Plan for Milestone M2 (Implementer Roadmap)

1. **Step 1: Construct Full `pl`, `cs`, `es` Dictionaries**
   - Translate all 938 keys with domain accuracy for Neapolitan pizza craft, audiophile clubbing, private venue hire, and visitor logistics.
   - Maintain exact key order and tree hierarchy matching `sl`.
   - Preserve all 8 `{{param}}` interpolation tokens verbatim.
   - Mirror all badge aliases (`sanMarzano` / `san-marzano`, `shortName` / `short`, `description` / `desc`).

2. **Step 2: Update `src/composables/useLocale.ts`**
   - Extend `SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es'] as const`.
   - Add `pl`, `cs`, `es` entries to `localeLabels`.
   - Add `const pl: Dict = { ... }`, `const cs: Dict = { ... }`, `const es: Dict = { ... }`.
   - Add `pl`, `cs`, `es` to `dictionaries` and `flatDictionaries`.
   - Optional: Add `BCP47_LOCALES` map for localized date rendering.

3. **Step 3: Update `nuxt.config.ts`**
   - Add hreflang links for `pl`, `cs`, `es` in `app.head.link`.

4. **Step 4: Execute Verification Suite**
   - Run key parity audit script (ensuring 10 × 938 = 9,380 leaf keys with 100% parity).
   - Run `npm run typecheck` (`vue-tsc --noEmit`).
   - Run `npm run build` (`nuxt build`).
