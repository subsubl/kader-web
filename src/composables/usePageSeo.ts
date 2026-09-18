// src/composables/usePageSeo.ts
import { computed, type MaybeRef } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale, SUPPORTED_LOCALES, type Locale } from './useLocale'

export const CANONICAL_BASE = 'https://www.kader.si'
export const EXACT_GEO = {
  latitude: 46.0494,
  longitude: 14.5367
} as const

export const CANONICAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Koblarjeva ulica 34',
  addressLocality: 'Ljubljana',
  postalCode: '1000',
  addressCountry: 'SI'
} as const

export const CANONICAL_CONTACTS = {
  takeawayPhone: '+38683836740',
  reservationsPhone: '+38640175628',
  email: 'info@kader.si',
  googleMapsUrl: 'https://maps.app.goo.gl/8FAZpJkTksq2zZGq7',
  defaultBanner: `${CANONICAL_BASE}/logo-banner.png`
} as const

export const LOCALE_OG_MAP: Record<Locale, string> = {
  sl: 'sl_SI',
  en: 'en_GB',
  de: 'de_DE',
  fr: 'fr_FR',
  it: 'it_IT',
  sr: 'sr_RS',
  nl: 'nl_NL',
  pl: 'pl_PL',
  cs: 'cs_CZ',
  es: 'es_ES'
}

export interface PageSeoOptions {
  path: string
  titleKey: string
  descKey: string
  ogTitleKey?: string
  ogDescKey?: string
  image?: string
  schema?: MaybeRef<Record<string, any> | Record<string, any>[] | null | undefined>
}

export function usePageSeo(options: PageSeoOptions) {
  const { t, locale } = useLocale()

  const normalizedPath = options.path === '/' ? '' : (options.path.startsWith('/') ? options.path : `/${options.path}`)
  const canonicalUrl = `${CANONICAL_BASE}${normalizedPath}`
  const imageUrl = options.image || CANONICAL_CONTACTS.defaultBanner

  const title = computed(() => t(options.titleKey))
  const description = computed(() => t(options.descKey))
  const ogTitle = computed(() => t(options.ogTitleKey || options.titleKey))
  const ogDescription = computed(() => t(options.ogDescKey || options.descKey))

  // Build 10 localized hreflang tags + x-default for the current route
  const hreflangLinks = computed(() => {
    const links: Array<{ rel: 'alternate'; hreflang: string; href: string; type: string }> = SUPPORTED_LOCALES.map((loc) => ({
      rel: 'alternate',
      type: 'text/html',
      hreflang: loc,
      href: `${canonicalUrl}?lang=${loc}`
    }))
    links.push({
      rel: 'alternate',
      type: 'text/html',
      hreflang: 'x-default',
      href: canonicalUrl
    })
    return links
  })

  // Assemble full JSON-LD script if schema is provided
  const schemaJson = computed(() => {
    const rawSchema = typeof options.schema === 'function' 
      ? (options.schema as Function)() 
      : (options.schema && 'value' in options.schema ? (options.schema as any).value : options.schema)

    if (!rawSchema) return null

    if (typeof rawSchema === 'object' && '@context' in rawSchema) {
      return JSON.stringify(rawSchema)
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': Array.isArray(rawSchema) ? rawSchema : [rawSchema]
    })
  })

  const alternateLocales = computed(() => 
    SUPPORTED_LOCALES
      .filter((loc) => loc !== locale.value)
      .map((loc) => LOCALE_OG_MAP[loc] || `${loc}_${loc.toUpperCase()}`)
  )

  useHead({
    title,
    link: computed(() => [
      { rel: 'canonical', href: canonicalUrl },
      ...hreflangLinks.value
    ]),
    script: computed(() => {
      if (!schemaJson.value) return []
      return [
        {
          type: 'application/ld+json',
          innerHTML: schemaJson.value
        }
      ]
    })
  })

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage: imageUrl,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: title,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogSiteName: 'Kader Grad Kodeljevo',
    ogLocale: computed(() => LOCALE_OG_MAP[locale.value] || 'sl_SI'),
    ogLocaleAlternate: alternateLocales.value,
    twitterCard: 'summary_large_image',
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: imageUrl
  })

  return {
    canonicalUrl,
    title,
    description,
    ogTitle,
    ogDescription
  }
}
