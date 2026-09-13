# Architecture & Implementation Plan: Backend Dual-Language (sl & en) API Support

**Document Version**: 1.0.0  
**Author**: Explorer 3 (Backend Dual-Language API Explorer)  
**Target Milestone**: Milestone 5 Audit & Milestone 6 Implementation  
**Working Directory**: `/home/ator/Kader/.agents/explorer_audit_3`  
**Target Output**: `/home/ator/Kader/.agents/explorer_audit_3/backend_i18n_plan.md`

---

## 1. Executive Summary & Audit Scope

This document provides a forensic audit of the existing backend API endpoints in `src/server/api/` and establishes an end-to-end architectural design for dual-language (**Slovenian `sl`** and **English `en`**) localization across the Kader Grad Kodeljevo platform.

### Scope of Audited Endpoints
1. `src/server/api/inquiries.post.ts` (Public venue hire / buyout inquiries)
2. `src/server/api/table-orders.post.ts` (QR code table orders / Microgramm POS integration)
3. `src/server/api/menu-config.get.ts` (Public pizzeria menu configuration)
4. `src/server/api/events.get.ts` (Public upcoming events)
5. `src/server/api/ra-events.get.ts` (Resident Advisor synchronized events)
6. `src/server/api/site-images.get.ts` (Dynamic site hero backgrounds and gallery items)
7. `src/server/api/img.get.ts` (Sharp on-the-fly image transformer & proxy)
8. Supporting server infrastructure:
   - `src/server/utils/cache.ts` (`handleCachedJsonRequest`, `apiCache`, `invalidateCache`)
   - `src/server/utils/rateLimit.ts` (`checkRateLimit`)
   - `src/server/utils/microgramm.ts` (`sendMicrogrammOrder`)
   - `src/server/utils/supabase.ts` (`getAdminSupabase`, `createServerSupabaseClient`)

---

## 2. Forensic Audit Findings & Critical Observations

### 2.1 `inquiries.post.ts`
- **Current Behavior**:
  - Validation errors and database error messages are hardcoded in English (e.g., `'Please enter your full name.'`, `'The preferred date must be in the future.'`, `'Validation failed.'`).
  - Field names in validation set `errors.preferredDate`, whereas the client form in `src/pages/buyouts.vue` (line 427, 461) and user requests bind to `date`.
  - H3 error throwing uses `createError({ statusCode: 422, statusMessage: 'Validation failed.', data: { errors } })`, which aligns well with Nitro conventions.
- **Identified Deficiencies**:
  - No language detection (`?lang=` or `Accept-Language` is ignored).
  - Slovenian visitors (the primary local demographic) receive English error messages.
  - Disconnect between `errors.preferredDate` and frontend `errors.date`.

### 2.2 `table-orders.post.ts`
- **Current Behavior**:
  - Error responses currently use `setResponseStatus(event, 422); return { errors }` rather than the Nitro-standard `throw createError({ statusCode: 422, statusMessage: ..., data: { errors } })`.
  - Validation checks snake_case `table_number` and ignores camelCase `tableNumber`.
  - Prompt requirements specify validating `tableNumber`, `items`, and `total`. Currently `total` is not validated in the request body (it is only calculated downstream from DB item prices).
  - All item error strings are hardcoded in English (e.g., `'Table number must be an integer between 1 and 50'`, `'Item currently unavailable: ...'`).
- **Identified Deficiencies**:
  - Inconsistent with Nitro H3 event handling pattern (uses `setResponseStatus` + return instead of `createError`).
  - No dual-language support.
  - Does not support both `tableNumber` and `table_number` or client-supplied `total`.

### 2.3 `menu-config.get.ts`
- **Current Behavior**:
  - Uses `handleCachedJsonRequest` with fixed cache key `'menu-config'`.
  - Returns only `{ menuImage, updatedAt }`.
- **Identified Deficiencies**:
  - Completely language-agnostic; does not provide localized menu notes, currency labels, kitchen operational hours, or allergen advisories.
  - **Critical Cache Risk**: If localized data is added without modifying the cache key, cached Slovenian responses would be returned to English users and vice versa. Cache key must be localized (`menu-config:${locale}`).

### 2.4 `site-images.get.ts`
- **Current Behavior**:
  - Contains `gallery_items` with hardcoded Slovenian labels (e.g., `'🍕 Neapeljska Pica z Izbrano Rukolo'`, `'🥪 Panuozzo z Mortadelo & Burrato'`).
  - Caches globally under key `'site-images'`.
- **Identified Deficiencies**:
  - English visitors see untranslated Slovenian gallery descriptions.
  - Cache key must be locale-aware (`site-images:${locale}`).

### 2.5 `events.get.ts` & `ra-events.get.ts`
- **Current Behavior**:
  - Global cache keys `'events'` and `ra-events:${scope}`.
  - Return event title, type, dates, and ra_link.
- **Identified Deficiencies**:
  - Event types (e.g., `'club'`, `'private'`, `'concert'`) and entry notes (e.g., `'Free admission'`, `'Presale'`) lack localized labels.
  - Cache keys must be locale-isolated.

### 2.6 `img.get.ts`
- **Current Behavior**:
  - Error messages for invalid URL, protocol, or file path are hardcoded in English.
- **Identified Deficiencies**:
  - Error responses can be localized into Slovenian when requested.

### 2.7 `cache.ts` & `rateLimit.ts`
- **Cache Engine**:
  - `handleCachedJsonRequest` caches response payloads in memory (`ApiCacheEngine`).
  - When endpoints vary their output based on language, the cache key **MUST** include the locale.
  - `invalidateCache('menu-config')` prefix matching automatically cleans up `menu-config:sl` and `menu-config:en` if prefix matching is preserved.
- **Rate Limiting**:
  - Currently throws hardcoded English HTTP 429: `'Too Many Requests: Please wait before trying again.'`.
  - Can be localized via `resolveApiLocale(event)`.

---

## 3. Language Preference Detection Architecture

### 3.1 Resolution Algorithm & Priority Order

To ensure predictable behavior across web browsers, mobile apps, automated bots, and API consumers, language preference resolution follows a strict hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Explicit Query Parameter: ?lang=sl or ?lang=en          │
│    - Highest priority; overrides all headers/cookies        │
│    - Case-insensitive (e.g. ?lang=EN -> 'en')              │
│    - Subtag support (e.g. ?lang=sl-SI -> 'sl', en-US -> 'en')│
│    - Array protection: handles ?lang=en&lang=sl safely     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (if missing or unsupported)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Cookie Fallback: kader-lang = 'sl' | 'en'                │
│    - Aligns with frontend useLocale() storage key           │
│    - Synchronizes client-side cookie with SSR/API calls     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (if missing or unsupported)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. HTTP Header: Accept-Language (RFC 9110 compliant)        │
│    - Parses weighted tags: "sl-SI,sl;q=0.9,en-US;q=0.8,en" │
│    - Compares highest effective weight for 'sl' vs 'en'    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (if no preference detected)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Default Fallback: 'sl' (Slovenian)                       │
│    - Authentic primary language of Grad Kodeljevo, Ljubljana│
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Proposed Implementation: `src/server/utils/locale.ts`

This new server utility file will be placed in `src/server/utils/locale.ts` and will be automatically imported across all Nitro event handlers.

```typescript
// src/server/utils/locale.ts
import type { H3Event } from 'h3'
import { getQuery, getRequestHeader, parseCookies, createError } from 'h3'

export const SUPPORTED_API_LOCALES = ['sl', 'en'] as const
export type ApiLocale = typeof SUPPORTED_API_LOCALES[number]
export const DEFAULT_API_LOCALE: ApiLocale = 'sl'

export function isApiLocale(val: unknown): val is ApiLocale {
  return typeof val === 'string' && (SUPPORTED_API_LOCALES as readonly string[]).includes(val)
}

/**
 * Parses RFC 9110 Accept-Language header into ordered language tags by weight (q-factor).
 * Example input: "en-US,en;q=0.9,sl-SI;q=0.8,sl;q=0.7"
 */
export function parseAcceptLanguage(header: string | null | undefined): Array<{ code: string; q: number }> {
  if (!header || typeof header !== 'string') return []

  return header
    .split(',')
    .map((part) => {
      const [lang, ...params] = part.trim().split(';')
      let q = 1.0
      for (const param of params) {
        const [k, v] = param.trim().split('=')
        if (k === 'q') {
          const parsedQ = parseFloat(v)
          if (!Number.isNaN(parsedQ) && Number.isFinite(parsedQ)) {
            q = Math.max(0, Math.min(1, parsedQ))
          }
        }
      }
      return { code: lang.trim().toLowerCase(), q }
    })
    .filter((item) => item.code.length > 0)
    .sort((a, b) => b.q - a.q)
}

/**
 * Resolves the effective API locale ('sl' | 'en') for an incoming H3 request event.
 * Follows priority: 1) Query (?lang=), 2) Cookie (kader-lang), 3) Accept-Language header, 4) Default 'sl'.
 */
export function resolveApiLocale(event: H3Event): ApiLocale {
  if (!event) return DEFAULT_API_LOCALE

  // 1. Query parameter (?lang=)
  try {
    const query = getQuery(event)
    const rawLang = Array.isArray(query.lang) ? query.lang[0] : query.lang
    if (typeof rawLang === 'string') {
      const normalized = rawLang.trim().toLowerCase()
      if (normalized === 'en' || normalized.startsWith('en-') || normalized.startsWith('en_')) {
        return 'en'
      }
      if (normalized === 'sl' || normalized.startsWith('sl-') || normalized.startsWith('sl_')) {
        return 'sl'
      }
    }
  } catch {
    // Ignore query parsing errors
  }

  // 2. Cookie fallback ('kader-lang')
  try {
    const cookies = parseCookies(event)
    const cookieLang = cookies['kader-lang']
    if (typeof cookieLang === 'string') {
      const normalized = cookieLang.trim().toLowerCase()
      if (normalized === 'en' || normalized.startsWith('en-')) return 'en'
      if (normalized === 'sl' || normalized.startsWith('sl-')) return 'sl'
    }
  } catch {
    // Ignore cookie parsing errors
  }

  // 3. Accept-Language header
  try {
    const header = getRequestHeader(event, 'accept-language')
    if (header) {
      const parsed = parseAcceptLanguage(header)
      let highestEn = -1
      let highestSl = -1

      for (const item of parsed) {
        if (highestEn === -1 && (item.code === 'en' || item.code.startsWith('en-'))) {
          highestEn = item.q
        }
        if (highestSl === -1 && (item.code === 'sl' || item.code.startsWith('sl-'))) {
          highestSl = item.q
        }
      }

      if (highestEn > 0 || highestSl > 0) {
        // If English weight strictly exceeds Slovenian, resolve 'en'
        if (highestEn > highestSl) return 'en'
        if (highestSl >= highestEn) return 'sl'
      }
    }
  } catch {
    // Ignore header parsing errors
  }

  // 4. Default fallback
  return DEFAULT_API_LOCALE
}

/** Alias for developer ergonomics */
export const getRequestLocale = resolveApiLocale
```

---

## 4. Backend Dual-Language Dictionaries (`src/server/utils/locale.ts`)

To ensure type-safety and eliminate duplication, all API error messages, status messages, and static labels are defined in structured message dictionaries:

```typescript
export const apiMessages = {
  sl: {
    common: {
      invalidBody: 'Neveljavno telo zahteve.',
      validationFailed: 'Validacija podatkov ni uspela.',
      rateLimitExceeded: 'Preveč zahtev. Prosimo, počakajte trenutek in poskusite znova.',
      databaseError: 'Prišlo je do napake pri komunikaciji s podatkovno bazo.',
      serverError: 'Prišlo je do notranje napake strežnika. Prosimo, poskusite kasneje.'
    },
    inquiries: {
      errName: 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).',
      errEmail: 'Prosimo, vnesite veljaven e-poštni naslov.',
      errPhone: 'Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).',
      errEventType: 'Prosimo, izberite vrsto dogodka.',
      errGuests: 'Prosimo, vnesite število gostov med 1 in 500.',
      errDateRequired: 'Prosimo, izberite veljaven datum.',
      errDateFuture: 'Želeni datum dogodka mora biti v prihodnosti.',
      saveFailed: 'Vašega povpraševanja ni bilo mogoče shraniti. Prosimo, poskusite znova.',
      successMessage: 'Vaše povpraševanje je bilo uspešno prejeto. Kmalu vas bomo kontaktirali.'
    },
    tableOrders: {
      errTableNumber: 'Številka mize mora biti celo število med 1 in 50.',
      errItemsRequired: 'Seznam artiklov je obvezen in ne sme biti prazen.',
      errTotalRequired: 'Skupni znesek naročila mora biti veljavno pozitivno število.',
      errInvalidItem: 'Artikel v naročilu ima nepopolne ali neveljavne podatke.',
      errItemNotFound: 'Artikla ni mogoče najti v jedilnem listu: {name}',
      errItemUnavailable: 'Artikel trenutno ni na voljo: {name}',
      errCustomerNote: 'Opomba stranke lahko vsebuje največ 500 znakov.',
      insertFailed: 'Naročila ni bilo mogoče oddati. Prosimo, poskusite znova.',
      successMessage: 'Naročilo je bilo uspešno oddano in poslano v točilnico.'
    },
    menuConfig: {
      title: 'Pizzeria Meni Grad Kodeljevo',
      vatNote: 'Vse cene so v EUR in vključujejo DDV.',
      kitchenHoursNote: 'Kuhinja obratuje od 12:00 do 22:00.',
      allergensNote: 'Za informacije o alergenih se prosimo posvetujte z osebjem.'
    },
    img: {
      errParamRequired: 'Parameter src ali url slike je obvezen.',
      errInvalidUrl: 'Neveljaven URL slike.',
      errInvalidProtocol: 'Neveljaven protokol: Dovoljena sta samo HTTP in HTTPS.',
      errPrivateNetwork: 'Prepovedano: Dostop do zasebnih omrežnih naslovov ni dovoljen.',
      errInvalidPath: 'Prepovedano: Neveljavna pot do datoteke.',
      errFileNotFound: 'Datoteka ni bila najdena: {path}',
      errProcessFailed: 'Slike ni bilo mogoče obdelati: {error}'
    }
  },
  en: {
    common: {
      invalidBody: 'Invalid request body.',
      validationFailed: 'Validation failed.',
      rateLimitExceeded: 'Too many requests. Please wait before trying again.',
      databaseError: 'Database communication error occurred.',
      serverError: 'Internal server error occurred. Please try again later.'
    },
    inquiries: {
      errName: 'Please enter your full name (at least 2 characters).',
      errEmail: 'Please enter a valid email address.',
      errPhone: 'Please enter a valid phone number (at least 6 digits).',
      errEventType: 'Please select an event type.',
      errGuests: 'Please enter a guest count between 1 and 500.',
      errDateRequired: 'Please choose a valid date.',
      errDateFuture: 'The preferred date must be in the future.',
      saveFailed: 'Could not save your inquiry. Please try again.',
      successMessage: 'Your inquiry has been submitted successfully. We will contact you soon.'
    },
    tableOrders: {
      errTableNumber: 'Table number must be an integer between 1 and 50.',
      errItemsRequired: 'Items array is required and must not be empty.',
      errTotalRequired: 'Total order amount must be a valid positive number.',
      errInvalidItem: 'Order item contains invalid or incomplete structure.',
      errItemNotFound: 'Item not found in database: {name}',
      errItemUnavailable: 'Item currently unavailable: {name}',
      errCustomerNote: 'Customer note must be a string up to 500 characters.',
      insertFailed: 'Failed to submit order. Please try again.',
      successMessage: 'Order submitted successfully and forwarded to the bar.'
    },
    menuConfig: {
      title: 'Grad Kodeljevo Pizzeria Menu',
      vatNote: 'All prices are in EUR and include VAT.',
      kitchenHoursNote: 'Kitchen operates from 12:00 to 22:00.',
      allergensNote: 'For allergen information, please consult our staff.'
    },
    img: {
      errParamRequired: 'Image src or url parameter is required.',
      errInvalidUrl: 'Invalid image URL.',
      errInvalidProtocol: 'Invalid protocol: Only HTTP and HTTPS are allowed.',
      errPrivateNetwork: 'Forbidden: Access to private network addresses is prohibited.',
      errInvalidPath: 'Forbidden: Invalid file path.',
      errFileNotFound: 'File not found: {path}',
      errProcessFailed: 'Could not process image: {error}'
    }
  }
} as const
```

### 4.1 Translator Helper: `createApiTranslator(event)`

```typescript
export type ApiDictionary = typeof apiMessages['sl']

export function createApiTranslator(event: H3Event) {
  const locale = resolveApiLocale(event)
  const dict = apiMessages[locale]

  /**
   * Translates a dictionary key with optional interpolation parameters.
   * Format: t('inquiries.errItemNotFound', { name: 'Margherita' })
   */
  function t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split('.')
    let current: any = dict
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return path
      }
    }

    if (typeof current !== 'string') return path

    if (!params) return current

    let result = current
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
    }
    return result
  }

  /**
   * Helper to throw a standardized H3/Nitro validation error.
   */
  function throwValidationError(errors: Record<string, string>, statusMessage?: string): never {
    throw createError({
      statusCode: 422,
      statusMessage: statusMessage || t('common.validationFailed'),
      data: {
        errors,
        ...errors // Shallow spread for consumers directly indexing err.data[field]
      }
    })
  }

  return {
    locale,
    dict,
    t,
    throwValidationError
  }
}
```

---

## 5. Detailed Endpoint-by-Endpoint Refactoring Blueprints

### 5.1 Endpoint 1: `src/server/api/inquiries.post.ts`

#### Contract Requirements:
- Resolve locale via `resolveApiLocale(event)` / `createApiTranslator(event)`.
- Support both `date` and `preferredDate` body properties.
- Return errors under both `errors.date` and `errors.preferredDate` to guarantee full compatibility with frontend form (`src/pages/buyouts.vue`) and tests.
- Emit HTTP 422 with localized messages for:
  - `name`: missing or `< 2` characters
  - `email`: missing or invalid regex
  - `phone`: missing or `< 6` digits
  - `eventType`: missing or not in `TYPE_MAP`
  - `guests`: missing, non-finite, `< 1` or `> 500`
  - `date`: missing, unparseable date, or date in the past
- Emit HTTP 400 with localized message for invalid body.
- Emit HTTP 500 with localized message on database insert failure.
- Return `{ ok: true, id: data.id, message: t('inquiries.successMessage') }`.

#### Refactored Code Blueprint:
```typescript
// src/server/api/inquiries.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { checkRateLimit } from '../utils/rateLimit'
import { createApiTranslator } from '../utils/locale'

const TYPE_MAP: Record<string, string> = {
  wedding: 'private',
  corporate: 'corporate',
  'private-party': 'private',
  cultural: 'private',
  other: 'buyout'
}

export default defineEventHandler(async (event) => {
  const { locale, t, throwValidationError } = createApiTranslator(event)

  // Rate limiting: 5 requests per minute per IP
  checkRateLimit(event, { limit: 5, windowMs: 60 * 1000, name: 'inquiries' })

  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: t('common.invalidBody') })
  }

  const errors: Record<string, string> = {}

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const eventType = String(body.eventType || '').trim()
  const guests = Number(body.guests)
  const rawDate = String(body.date || '').trim() || String(body.preferredDate || '').trim()
  const message = String(body.message || '').trim()

  // --- Authoritative Server-Side Validation ---
  if (name.length < 2) {
    errors.name = t('inquiries.errName')
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t('inquiries.errEmail')
  }

  if (!phone || phone.replace(/\D/g, '').length < 6) {
    errors.phone = t('inquiries.errPhone')
  }

  if (!eventType || !TYPE_MAP[eventType]) {
    errors.eventType = t('inquiries.errEventType')
  }

  if (!Number.isFinite(guests) || guests < 1 || guests > 500) {
    errors.guests = t('inquiries.errGuests')
  }

  if (!rawDate || Number.isNaN(Date.parse(rawDate))) {
    const errDate = t('inquiries.errDateRequired')
    errors.date = errDate
    errors.preferredDate = errDate
  } else if (new Date(rawDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
    const errFuture = t('inquiries.errDateFuture')
    errors.date = errFuture
    errors.preferredDate = errFuture
  }

  if (Object.keys(errors).length > 0) {
    throwValidationError(errors, t('common.validationFailed'))
  }

  // Persist via Supabase service role
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name,
      email,
      type: TYPE_MAP[eventType],
      party_size: guests,
      date: new Date(rawDate).toISOString(),
      notes: [message, phone ? `Phone: ${phone}` : ''].filter(Boolean).join('\n')
    })
    .select('id')
    .single()

  if (error) {
    console.error('[api] inquiry insert failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: t('inquiries.saveFailed') })
  }

  return {
    ok: true,
    id: data.id,
    locale,
    message: t('inquiries.successMessage')
  }
})
```

---

### 5.2 Endpoint 2: `src/server/api/table-orders.post.ts`

#### Contract Requirements:
- Modernize error throwing to use standard H3 `createError({ statusCode: 422, statusMessage, data: { errors } })`.
- Support both camelCase (`tableNumber`, `customerNote`) and snake_case (`table_number`, `customer_note`).
- Support both `total` (if sent by client) and server calculation from menu items in Supabase.
- Validate:
  - `tableNumber` / `table_number`: must be integer between 1 and 50. Missing or invalid sets `errors.tableNumber` and `errors.table_number`.
  - `items`: must be non-empty array. Empty array sets `errors.items`.
  - Item structure: each item must have valid `menu_item_id` / `menuItemId`, `name`, `qty` (1-10), and `price` (number).
  - `total`: if supplied, must be positive number.
  - `customerNote` / `customer_note`: optional string up to 500 characters.
  - DB checks: item existence and availability.
- Localized error messages in `sl` and `en`.

#### Refactored Code Blueprint:
```typescript
// src/server/api/table-orders.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { sendMicrogrammOrder } from '../utils/microgramm'
import { checkRateLimit } from '../utils/rateLimit'
import { createApiTranslator } from '../utils/locale'

export default defineEventHandler(async (event) => {
  const { locale, t, throwValidationError } = createApiTranslator(event)

  // Rate limiting: 10 orders per minute per IP
  checkRateLimit(event, { limit: 10, windowMs: 60 * 1000, name: 'table-orders' })

  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: t('common.invalidBody') })
  }

  const tableNumberRaw = body.tableNumber ?? body.table_number
  const items = body.items
  const totalInput = body.total
  const customerNote = body.customerNote ?? body.customer_note

  const errors: Record<string, string> = {}

  // 1. Table number validation
  const tableNumber = Number(tableNumberRaw)
  if (
    tableNumberRaw === undefined ||
    tableNumberRaw === null ||
    !Number.isInteger(tableNumber) ||
    tableNumber < 1 ||
    tableNumber > 50
  ) {
    const msg = t('tableOrders.errTableNumber')
    errors.tableNumber = msg
    errors.table_number = msg
  }

  // 2. Items array validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.items = t('tableOrders.errItemsRequired')
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item || typeof item !== 'object') {
        errors[`items.${i}`] = t('tableOrders.errInvalidItem')
        continue
      }
      const menuItemId = item.menu_item_id || item.menuItemId
      const name = item.name
      const qty = item.qty ?? item.quantity
      const price = item.price

      if (!menuItemId || typeof menuItemId !== 'string') {
        errors[`items.${i}.menu_item_id`] = t('tableOrders.errInvalidItem')
      }
      if (!name || typeof name !== 'string') {
        errors[`items.${i}.name`] = t('tableOrders.errInvalidItem')
      }
      if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > 10) {
        errors[`items.${i}.qty`] = t('tableOrders.errInvalidItem')
      }
      if (typeof price !== 'number' || price < 0) {
        errors[`items.${i}.price`] = t('tableOrders.errInvalidItem')
      }
    }
  }

  // 3. Optional client total validation (if supplied)
  if (totalInput !== undefined && (typeof totalInput !== 'number' || Number.isNaN(totalInput) || totalInput <= 0)) {
    errors.total = t('tableOrders.errTotalRequired')
  }

  // 4. Customer note validation
  if (customerNote !== undefined && customerNote !== null && (typeof customerNote !== 'string' || customerNote.length > 500)) {
    const msg = t('tableOrders.errCustomerNote')
    errors.customerNote = msg
    errors.customer_note = msg
  }

  if (Object.keys(errors).length > 0) {
    throwValidationError(errors, t('common.validationFailed'))
  }

  const admin = getAdminSupabase()
  const itemIds = items.map((i: any) => i.menu_item_id || i.menuItemId)

  const { data: dbItems, error: dbError } = await admin
    .from('menu_items')
    .select('id, price, is_available, name')
    .in('id', itemIds)

  if (dbError) {
    throw createError({ statusCode: 500, statusMessage: t('common.databaseError') })
  }

  let calculatedTotal = 0
  const finalItems = []

  for (const item of items) {
    const mId = item.menu_item_id || item.menuItemId
    const dbItem = dbItems?.find((db: any) => db.id === mId)
    if (!dbItem) {
      throw createError({
        statusCode: 422,
        statusMessage: t('common.validationFailed'),
        data: { errors: { items: t('tableOrders.errItemNotFound', { name: item.name || mId }) } }
      })
    }
    if (!dbItem.is_available) {
      throw createError({
        statusCode: 422,
        statusMessage: t('common.validationFailed'),
        data: { errors: { items: t('tableOrders.errItemUnavailable', { name: dbItem.name || item.name }) } }
      })
    }

    const qty = Number(item.qty ?? item.quantity)
    calculatedTotal += dbItem.price * qty
    finalItems.push({
      menu_item_id: dbItem.id,
      name: item.name || dbItem.name,
      qty,
      price: dbItem.price
    })
  }

  const finalTotal = calculatedTotal

  const { data: inserted, error: insertError } = await admin
    .from('table_orders')
    .insert({
      table_number: tableNumber,
      items: finalItems,
      total: finalTotal,
      customer_note: typeof customerNote === 'string' ? customerNote : null,
      status: 'pending'
    })
    .select('id')
    .single()

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: t('tableOrders.insertFailed') })
  }

  // Microgramm POS dispatch
  sendMicrogrammOrder({
    orderId: inserted.id,
    tableNumber,
    items: finalItems,
    total: finalTotal,
    customerNote: typeof customerNote === 'string' ? customerNote : undefined
  }).catch((err) => console.error('[api/table-orders] Microgramm dispatch failed:', err))

  return {
    ok: true,
    id: inserted.id,
    total: finalTotal,
    locale,
    message: t('tableOrders.successMessage')
  }
})
```

---

### 5.3 Endpoint 3: `src/server/api/menu-config.get.ts`

#### Contract Requirements:
- Resolve locale via `resolveApiLocale(event)`.
- Use locale-specific cache key: `menu-config:${locale}`.
- Maintain existing attributes (`menuImage`, `updatedAt`) for backward compatibility.
- Add localized fields:
  - `locale`: `'sl' | 'en'`
  - `title`: `'Pizzeria Meni Grad Kodeljevo'` / `'Grad Kodeljevo Pizzeria Menu'`
  - `currency`: `'EUR'`
  - `vatNote`: `'Vse cene so v EUR in vključujejo DDV.'` / `'All prices are in EUR and include VAT.'`
  - `kitchenHoursNote`: `'Kuhinja obratuje od 12:00 do 22:00.'` / `'Kitchen operates from 12:00 to 22:00.'`
  - `allergensNote`: `'Za informacije o alergenih se prosimo posvetujte z osebjem.'` / `'For allergen information, please consult our staff.'`

#### Refactored Code Blueprint:
```typescript
// src/server/api/menu-config.get.ts
import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'
import { resolveApiLocale, apiMessages } from '../utils/locale'

const DEFAULT_MENU_IMAGE = '/kader/menu.jpg'

export interface LocalizedMenuConfig {
  menuImage: string
  updatedAt: string | null
  locale: string
  title: string
  currency: string
  vatNote: string
  kitchenHoursNote: string
  allergensNote: string
}

export default defineEventHandler(async (event) => {
  const locale = resolveApiLocale(event)
  const dict = apiMessages[locale].menuConfig

  return handleCachedJsonRequest(event, {
    key: `menu-config:${locale}`,
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    fetcher: async () => {
      let menuImage = DEFAULT_MENU_IMAGE
      let updatedAt: string | null = null

      try {
        const supabase = getAdminSupabase()
        const { data, error } = await supabase
          .from('site_settings')
          .select('value, updated_at')
          .eq('key', 'pizzeria_menu')
          .maybeSingle()

        if (!error && data?.value && typeof data.value === 'object' && 'menuImage' in data.value) {
          const v = data.value as Record<string, unknown>
          // Check for language-specific image e.g. menuImage_en or default menuImage
          const localizedImageKey = `menuImage_${locale}`
          if (typeof v[localizedImageKey] === 'string' && v[localizedImageKey]) {
            menuImage = v[localizedImageKey] as string
          } else if (typeof v.menuImage === 'string' && v.menuImage) {
            menuImage = v.menuImage
          }
          updatedAt = data.updated_at
        }
      } catch (err) {
        console.error('[api] menu-config database query error:', (err as Error).message)
      }

      return <LocalizedMenuConfig>{
        menuImage,
        updatedAt,
        locale,
        title: dict.title,
        currency: 'EUR',
        vatNote: dict.vatNote,
        kitchenHoursNote: dict.kitchenHoursNote,
        allergensNote: dict.allergensNote
      }
    },
    fallback: <LocalizedMenuConfig>{
      menuImage: DEFAULT_MENU_IMAGE,
      updatedAt: null,
      locale,
      title: dict.title,
      currency: 'EUR',
      vatNote: dict.vatNote,
      kitchenHoursNote: dict.kitchenHoursNote,
      allergensNote: dict.allergensNote
    }
  })
})
```

---

### 5.4 Endpoint 4: `src/server/api/site-images.get.ts`

#### Contract Requirements:
- Resolve locale via `resolveApiLocale(event)`.
- Use locale-specific cache key: `site-images:${locale}`.
- Localize gallery item descriptions between Slovenian and English.

#### Localized Gallery Map:
```typescript
const GALLERY_TRANSLATIONS: Record<string, { sl: string; en: string }> = {
  '/images/instagram/ig_img_7.jpg': {
    sl: '🍕 Neapeljska Pica z Izbrano Rukolo',
    en: '🍕 Neapolitan Pizza with Fresh Rocket'
  },
  '/images/instagram/ig_img_13.jpg': {
    sl: '🥪 Panuozzo z Mortadelo & Burrato',
    en: '🥪 Panuozzo with Mortadella & Burrata'
  },
  '/images/instagram/ig_img_5.jpg': {
    sl: '🎉 Poletna Zabava na Terasi',
    en: '🎉 Summer Party on the Castle Terrace'
  },
  '/images/instagram/ig_img_3.jpg': {
    sl: '🎸 Koncert v Živo pod Grajskimi Drevesi',
    en: '🎸 Live Concert under Castle Trees'
  },
  '/pizzeria-bg.jpg': {
    sl: '🍷 Neapeljski Pica Bistro Ambient',
    en: '🍷 Neapolitan Pizza Bistro Ambiance'
  },
  '/buyout-bg.jpg': {
    sl: '🏰 Grajski Vrt Kodeljevo',
    en: '🏰 Grad Kodeljevo Castle Garden'
  }
}
```

#### Cache Key:
`key: 'site-images:' + locale`

---

### 5.5 Endpoint 5 & 6: `src/server/api/events.get.ts` & `ra-events.get.ts`

- `events.get.ts`:
  - Cache key: `'events:' + locale`.
  - Format event types to localized labels (e.g., `'club'` -> `Klub` / `Club`, `'private'` -> `Zasebni dogodek` / `Private Event`, `'concert'` -> `Koncert` / `Concert`).
- `ra-events.get.ts`:
  - Cache key: `'ra-events:' + scope + ':' + locale`.
  - Augment events with localized admission notes (e.g. `cost === 0` -> `Brezplačen vstop` / `Free admission`).

---

### 5.6 Endpoint 7: `src/server/api/img.get.ts`

- Add `createApiTranslator(event)` for localized error messages on 400 (missing param, invalid url), 403 (private IP SSRF, traversal), 404 (file not found), and 500 (Sharp failure).

---

## 6. Cache Key Isolation Matrix

| Endpoint | Previous Cache Key | Refactored Locale-Aware Cache Key | Invalidation Trigger |
|---|---|---|---|
| `/api/menu-config` | `menu-config` | `menu-config:${locale}` | `invalidateCache('menu-config')` |
| `/api/site-images` | `site-images` | `site-images:${locale}` | `invalidateCache('site-images')` |
| `/api/events` | `events` | `events:${locale}` | `invalidateCache('events')` |
| `/api/ra-events` | `ra-events:${scope}` | `ra-events:${scope}:${locale}` | `invalidateCache('ra-events')` |

*Note*: Because `invalidateCache` in `src/server/utils/cache.ts` uses prefix matching (`key === keyOrPrefix || key.startsWith(keyOrPrefix + ':')`), calling `invalidateCache('menu-config')` will automatically invalidate both `menu-config:sl` and `menu-config:en` simultaneously!

---

## 7. Forensic Verification & Test Matrix

This section specifies test commands and expected outputs to prove correctness during multi-dimensional audit and adversarial challenger testing.

### 7.1 Test Case 1: Inquiries Validation in Slovenian (`lang=sl`)
```bash
# Missing name, email, phone, eventType, guests, date
curl -s -X POST http://localhost:3000/api/inquiries?lang=sl \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected Response**:
- HTTP Status: `422 Unprocessable Entity`
- Response Body:
```json
{
  "statusCode": 422,
  "statusMessage": "Validacija podatkov ni uspela.",
  "data": {
    "errors": {
      "name": "Prosimo, vnesite svoje polno ime (vsaj 2 znaka).",
      "email": "Prosimo, vnesite veljaven e-poštni naslov.",
      "phone": "Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).",
      "eventType": "Prosimo, izberite vrsto dogodka.",
      "guests": "Prosimo, vnesite število gostov med 1 in 500.",
      "date": "Prosimo, izberite veljaven datum.",
      "preferredDate": "Prosimo, izberite veljaven datum."
    }
  }
}
```

### 7.2 Test Case 2: Inquiries Validation in English (`lang=en`)
```bash
curl -s -X POST http://localhost:3000/api/inquiries?lang=en \
  -H "Content-Type: application/json" \
  -d '{"name": "A", "email": "invalid", "phone": "12", "eventType": "unknown", "guests": 0, "date": "2020-01-01"}'
```
**Expected Response**:
- HTTP Status: `422 Unprocessable Entity`
- Response Body:
```json
{
  "statusCode": 422,
  "statusMessage": "Validation failed.",
  "data": {
    "errors": {
      "name": "Please enter your full name (at least 2 characters).",
      "email": "Please enter a valid email address.",
      "phone": "Please enter a valid phone number (at least 6 digits).",
      "eventType": "Please select an event type.",
      "guests": "Please enter a guest count between 1 and 500.",
      "date": "The preferred date must be in the future.",
      "preferredDate": "The preferred date must be in the future."
    }
  }
}
```

### 7.3 Test Case 3: Table Orders Validation in Slovenian (`Accept-Language: sl-SI,sl;q=0.9,en;q=0.8`)
```bash
curl -s -X POST http://localhost:3000/api/table-orders \
  -H "Accept-Language: sl-SI,sl;q=0.9,en;q=0.8" \
  -H "Content-Type: application/json" \
  -d '{"tableNumber": 99, "items": []}'
```
**Expected Response**:
- HTTP Status: `422 Unprocessable Entity`
- Response Body:
```json
{
  "statusCode": 422,
  "statusMessage": "Validacija podatkov ni uspela.",
  "data": {
    "errors": {
      "tableNumber": "Številka mize mora biti celo število med 1 in 50.",
      "table_number": "Številka mize mora biti celo število med 1 in 50.",
      "items": "Seznam artiklov je obvezen in ne sme biti prazen."
    }
  }
}
```

### 7.4 Test Case 4: Table Orders Validation in English (`Accept-Language: en-US,en;q=0.9`)
```bash
curl -s -X POST http://localhost:3000/api/table-orders \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Content-Type: application/json" \
  -d '{"tableNumber": 99, "items": []}'
```
**Expected Response**:
- HTTP Status: `422 Unprocessable Entity`
- Response Body:
```json
{
  "statusCode": 422,
  "statusMessage": "Validation failed.",
  "data": {
    "errors": {
      "tableNumber": "Table number must be an integer between 1 and 50.",
      "table_number": "Table number must be an integer between 1 and 50.",
      "items": "Items array is required and must not be empty."
    }
  }
}
```

### 7.5 Test Case 5: Query Override Precedence (`?lang=en` with `Accept-Language: sl`)
```bash
curl -s -X POST "http://localhost:3000/api/inquiries?lang=en" \
  -H "Accept-Language: sl-SI,sl;q=1.0" \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected Outcome**: Returns English error messages (`?lang=en` overrides `Accept-Language: sl`).

### 7.6 Test Case 6: Menu Config Localization and Cache Isolation
```bash
# 1. Fetch Slovenian menu config
curl -s "http://localhost:3000/api/menu-config?lang=sl"
# Expected: title = "Pizzeria Meni Grad Kodeljevo", vatNote = "Vse cene so v EUR in vključujejo DDV."

# 2. Fetch English menu config
curl -s "http://localhost:3000/api/menu-config?lang=en"
# Expected: title = "Grad Kodeljevo Pizzeria Menu", vatNote = "All prices are in EUR and include VAT."
```

---

## 8. Summary Checklist for Implementer (Worker)

1. [ ] Create `src/server/utils/locale.ts` containing `resolveApiLocale`, `createApiTranslator`, `apiMessages`, and `SUPPORTED_API_LOCALES`.
2. [ ] Update `src/server/api/inquiries.post.ts` to use `createApiTranslator`, support both `date` and `preferredDate`, and return localized errors.
3. [ ] Update `src/server/api/table-orders.post.ts` to use `createError`, support `tableNumber` / `table_number` and `total`, and return localized errors.
4. [ ] Update `src/server/api/menu-config.get.ts` to use `menu-config:${locale}` cache key and return localized labels.
5. [ ] Update `src/server/api/site-images.get.ts` to use `site-images:${locale}` and localized gallery item titles.
6. [ ] Verify that `npm run typecheck` passes with 0 errors.
7. [ ] Verify that `npm run build` succeeds.
8. [ ] Execute automated test suite for `sl` vs `en` validation outputs.
