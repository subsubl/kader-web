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
 * Example: "en-US,en;q=0.9,sl-SI;q=0.8,sl;q=0.7"
 */
export function parseAcceptLanguage(header: string | null | undefined): Array<{ code: string; q: number }> {
  if (!header || typeof header !== 'string') return []

  return header
    .split(',')
    .map((part) => {
      const [lang, ...params] = part.trim().split(';')
      let q = 1.0
      for (const param of params) {
        const [k, v] = param.split('=').map(s => s.trim())
        if (k === 'q' && v !== undefined) {
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

  // 3. Accept-Language header (RFC 9110 compliant)
  try {
    const header = getRequestHeader(event, 'accept-language')
    if (header) {
      const parsed = parseAcceptLanguage(header)
      let highestEn = -1
      let highestSl = -1

      for (const item of parsed) {
        if (highestEn === -1 && (item.code === 'en' || item.code.startsWith('en-') || item.code.startsWith('en_'))) {
          highestEn = item.q
        }
        if (highestSl === -1 && (item.code === 'sl' || item.code.startsWith('sl-') || item.code.startsWith('sl_'))) {
          highestSl = item.q
        }
      }

      if (highestEn > 0 || highestSl > 0) {
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

export const getRequestLocale = resolveApiLocale

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

export const DICTIONARIES = apiMessages
export type ApiDictionary = typeof apiMessages['sl']

export function createApiTranslator(event: H3Event) {
  const locale = resolveApiLocale(event)
  const dict = apiMessages[locale]

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

  function throwValidationError(errors: Record<string, string>, statusMessage?: string): never {
    throw createError({
      statusCode: 422,
      statusMessage: statusMessage || t('common.validationFailed'),
      data: {
        errors,
        ...errors
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
