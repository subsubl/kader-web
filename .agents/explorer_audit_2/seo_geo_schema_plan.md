# Full-Site SEO, Metadata & GEO Structured Data Audit & Optimization Plan
**Project**: Kader — Grad Kodeljevo, Ljubljana  
**Author**: Explorer 2 (SEO, Metadata & GEO Structured Data Explorer)  
**Date**: 2026-09-13  
**Status**: COMPLETE SPECIFICATION & ARCHITECTURAL BLUEPRINT  

---

## 1. Executive Summary

A forensic audit of Kader's SEO metadata, internationalization link headers, and Schema.org structured data was conducted across `nuxt.config.ts`, `src/app.vue`, and all five public routes: `/` (Home), `/pizzeria` (Pizzeria Bistro), `/club` (Club & Events), `/buyouts` (Private Hire & Weddings), and `/shop` (Official Merchandise).

### Key Critical Deficiencies Identified
1. **Critical Route Metadata Misalignment on Home (`/`)**:
   - `src/pages/index.vue` currently executes `useSeoMeta` and `useHead` utilizing `t('seo.pizzeria.title')` and `t('seo.pizzeria.description')` instead of `seo.home.*` keys. The homepage erroneously declares itself to search engines as the pizza bistro rather than the unified cultural estate of Grad Kodeljevo (comprising the pizza bistro, night club, and private event venue).
2. **Global Hreflang Contamination from `nuxt.config.ts`**:
   - `nuxt.config.ts` hardcodes eleven `<link rel="alternate" hreflang="..." href="https://www.kader.si/">` tags in `app.head.link`. Because Nuxt app-level head tags are inherited by all pages, every single subpage (`/pizzeria`, `/club`, `/buyouts`, `/shop`) outputs alternate language links pointing to the root homepage `/`. This is a severe violation of Google Search Central Hreflang specifications.
3. **Inaccurate Geographic Coordinates & Street Address Typo**:
   - Every page currently providing JSON-LD schemas (`pizzeria.vue`, `club.vue`, `buyouts.vue`, `index.vue`) outputs latitude `46.0515` and longitude `14.5361`. The project specification and municipal cadastre mandate the exact coordinates: **Latitude `46.0494`**, **Longitude `14.5367`**.
   - The street address in schema markup is inconsistently formatted or misspelled as `"Kobalarjeva ulica 20"` (with a typographical error in the street name and incorrect building number) or `"Ulica Carla Benza 20"`. The official physical address for Grad Kodeljevo structured data is **Koblarjeva ulica 34, 1000 Ljubljana, Slovenia**.
4. **Missing Rich Schema Attributes**:
   - `Restaurant` lacks granular `OpeningHoursSpecification` (separating kitchen and bar hours), `servesCuisine`, `priceRange: "€€"`, `paymentAccepted`, `currenciesAccepted: "EUR"`, and reservation/ordering `potentialAction`.
   - `NightClub` lacks music genres, sound system amenities (`Klipsch La Scala AL6`), Friday/Saturday night hours (`23:00 - 05:00`), and door policy highlights.
   - `Event` structured data in `club.vue` lacks `endDate`, `offers` (ticket price, availability, currency `EUR`, ticket URLs), `performer` arrays, and local `geo` coordinates.
   - `LocalBusiness` / `EventVenue` on `/buyouts` and `/` lacks comprehensive amenity listings, booking actions, and capacity specifications.
5. **Static HTML Language Attribute**:
   - `nuxt.config.ts` sets `htmlAttrs: { lang: 'sl' }` statically. When a visitor or crawler switches language, `<html lang="...">` remains stuck on `'sl'` unless dynamically bound in `src/app.vue`.

---

## 2. Forensic Audit Matrix

| File / Route | Title Tag | Meta Description | OpenGraph Meta | Twitter Card | Canonical URL | Hreflang Alternates | Schema.org JSON-LD | Geo Coordinates & Address |
|---|---|---|---|---|---|---|---|---|
| **`nuxt.config.ts`** | Static fallback | Static fallback | Missing `og:title`, `og:desc`, `og:url` | `summary_large_image` | Missing global default | **CRITICAL BUG**: 11 global static links pointing to `https://www.kader.si/` | None | None |
| **`src/app.vue`** | None | None | None | None | None | None | None | `<html lang="sl">` is static, not bound to reactive `locale` |
| **`/` (`index.vue`)** | **BUG**: Uses `seo.pizzeria.title` | **BUG**: Uses `seo.pizzeria.desc` | `og:image`, uses pizzeria title/desc | `summary_large_image` | `https://www.kader.si/` | Inherits static root links from `nuxt.config.ts` | `PizzaRestaurant` only (missing `LocalBusiness` / `EventVenue`) | **WRONG**: `46.0515, 14.5361`, Carla Benza 20 |
| **`/pizzeria` (`pizzeria.vue`)** | `seo.pizzeria.title` | `seo.pizzeria.desc` | `og:title`, `og:desc`, `og:url` | `summary_large_image` | `https://www.kader.si/pizzeria` | Inherits static root links from `nuxt.config.ts` | Basic `PizzaRestaurant`, missing hours & actions | **WRONG**: `46.0515, 14.5361`, "Kobalarjeva ulica 20" |
| **`/club` (`club.vue`)** | `seo.club.title` | `seo.club.desc` | `og:title`, `og:desc`, `og:url` | `summary_large_image` | `https://www.kader.si/club` | Inherits static root links from `nuxt.config.ts` | `NightClub` + `EventSeries`, missing event offers/end dates | **WRONG**: `46.0515, 14.5361`, "Kobalarjeva ulica 20" |
| **`/buyouts` (`buyouts.vue`)** | `seo.buyouts.title` | `seo.buyouts.desc` | `og:title`, `og:desc`, `og:url` | `summary_large_image` | `https://www.kader.si/buyouts` | Inherits static root links from `nuxt.config.ts` | Basic `EventVenue`, missing amenities & contact actions | **WRONG**: `46.0515, 14.5361`, "Kobalarjeva ulica 20" |
| **`/shop` (`shop.vue`)** | `seo.shop.title` | `seo.shop.desc` | `og:title`, `og:desc`, `og:url` | `summary_large_image` | `https://www.kader.si/shop` | Inherits static root links from `nuxt.config.ts` | Minimal `Store`, missing address, geo, and contact | None |

---

## 3. SEO & GEO Architecture Design

### 3.1 Unified GEO & Address Authority
All structured data across the application must reference the canonical physical location of the estate:
- **Estate Name**: Grad Kodeljevo (Dvorec Kodeljevo)
- **Street Address**: `Koblarjeva ulica 34`
- **City / Locality**: `Ljubljana`
- **Postal Code**: `1000`
- **Country**: `SI` (Slovenia)
- **Latitude**: `46.0494`
- **Longitude**: `14.5367`
- **Google Maps CID / URL**: `https://maps.app.goo.gl/8FAZpJkTksq2zZGq7`

### 3.2 Dynamic SSR Locale Resolution via URL Query (`?lang=`)
The application currently maintains language selection in cookies (`kader-lang`) and `localStorage`. For search crawlers (Googlebot, Bingbot, Yandex) and external social scrapers, cookie-only language switching prevents indexing localized versions.
- **Solution**: Enhance `src/composables/useLocale.ts` to inspect `useRoute().query.lang` during SSR. If `?lang=en` is provided, initialize the reactive locale to `'en'`.
- **Hreflang Generation**: Every public route generates 10 alternate `<link>` tags with query parameters plus `x-default`:
  ```html
  <link rel="alternate" hreflang="sl" href="https://www.kader.si/pizzeria?lang=sl" />
  <link rel="alternate" hreflang="en" href="https://www.kader.si/pizzeria?lang=en" />
  <link rel="alternate" hreflang="de" href="https://www.kader.si/pizzeria?lang=de" />
  <link rel="alternate" hreflang="fr" href="https://www.kader.si/pizzeria?lang=fr" />
  <link rel="alternate" hreflang="it" href="https://www.kader.si/pizzeria?lang=it" />
  <link rel="alternate" hreflang="sr" href="https://www.kader.si/pizzeria?lang=sr" />
  <link rel="alternate" hreflang="nl" href="https://www.kader.si/pizzeria?lang=nl" />
  <link rel="alternate" hreflang="pl" href="https://www.kader.si/pizzeria?lang=pl" />
  <link rel="alternate" hreflang="cs" href="https://www.kader.si/pizzeria?lang=cs" />
  <link rel="alternate" hreflang="es" href="https://www.kader.si/pizzeria?lang=es" />
  <link rel="alternate" hreflang="x-default" href="https://www.kader.si/pizzeria" />
  <link rel="canonical" href="https://www.kader.si/pizzeria" />
  ```
- **Cleanup**: Remove the static hreflangs from `nuxt.config.ts` so they do not contaminate child routes.

### 3.3 OpenGraph & Social Metadata Standard
Every page must deliver:
- `og:site_name`: `"Kader Grad Kodeljevo"`
- `og:type`: `"website"` (or `"restaurant"` / `"music.event"` where appropriate)
- `og:title`: Localized page title
- `og:description`: Localized meta description
- `og:url`: Canonical route URL
- `og:image`: High-resolution banner image (`1200 x 630` px) with `og:image:width`, `og:image:height`, and `og:image:alt`
- `og:locale`: Active locale converted to ISO 639-1 / ISO 3166-1 format (`sl_SI`, `en_GB`, `de_DE`, `fr_FR`, `it_IT`, `sr_RS`, `nl_NL`, `pl_PL`, `cs_CZ`, `es_ES`)
- `og:locale:alternate`: Array of all 9 other supported locale identifiers
- `twitter:card`: `"summary_large_image"`
- `twitter:title`: Localized title
- `twitter:description`: Localized description
- `twitter:image`: Absolute image URL

---

## 4. Rich Schema.org JSON-LD Specifications

### 4.1 Schema: `Restaurant` / `PizzaRestaurant` (`/pizzeria`)
Target route: `/pizzeria` (and linked from `/`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Restaurant", "PizzaRestaurant"],
      "@id": "https://www.kader.si/pizzeria#restaurant",
      "name": "Pizzeria Bistro Kader",
      "alternateName": "Kader Pizza Bistro Grad Kodeljevo",
      "description": "Pristna neapeljska pica z 48-urno fermentacijo testa, San Marzano D.O.P., mocarela di bufala in domači Panuozzo sendviči v ambientu Gradu Kodeljevo.",
      "url": "https://www.kader.si/pizzeria",
      "telephone": "+38683836740",
      "priceRange": "€€",
      "servesCuisine": [
        "Neapolitan Pizza",
        "Italian",
        "Panuozzo",
        "Mediterranean",
        "Salads"
      ],
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Cash, Credit Card, Debit Card, Contactless, Apple Pay, Google Pay",
      "acceptsReservations": true,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Koblarjeva ulica 34",
        "addressLocality": "Ljubljana",
        "postalCode": "1000",
        "addressCountry": "SI"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.0494,
        "longitude": 14.5367
      },
      "hasMap": "https://maps.app.goo.gl/8FAZpJkTksq2zZGq7",
      "image": [
        "https://www.kader.si/logo-banner.png",
        "https://www.kader.si/pizzeria-bg.jpg",
        "https://www.kader.si/menu-a3.jpg"
      ],
      "hasMenu": "https://www.kader.si/pizzeria",
      "menu": "https://www.kader.si/pizzeria",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "12:00",
          "closes": "22:00",
          "description": "Kuhinja / Pizzeria obratovalni čas"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday"],
          "opens": "09:00",
          "closes": "22:00",
          "description": "Bistro & Kavarna bar"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Thursday", "Saturday"],
          "opens": "09:00",
          "closes": "01:00",
          "description": "Bistro & Nočni bar"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday"],
          "opens": "09:00",
          "closes": "05:00",
          "description": "Bistro & Klubska noč"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday"],
          "opens": "09:00",
          "closes": "20:00",
          "description": "Nedeljski grajski vrt"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "120",
        "bestRating": "5",
        "worstRating": "1"
      },
      "potentialAction": [
        {
          "@type": "ReserveAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "tel:+38640175628",
            "inLanguage": "sl",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "result": {
            "@type": "FoodEstablishmentReservation",
            "name": "Rezervacija mize"
          }
        },
        {
          "@type": "OrderAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "tel:+38683836740",
            "inLanguage": "sl",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModePickUp"
        }
      ]
    }
  ]
}
```

---

### 4.2 Schema: `NightClub` & Dynamic `Event` Items (`/club`)
Target route: `/club`
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NightClub",
      "@id": "https://www.kader.si/club#club",
      "name": "Club Kader Grad Kodeljevo",
      "alternateName": "Kader Electronic Music Club",
      "description": "Intimni kletni klub in plesišče z avdiofilskim ozvočenjem Klipsch La Scala AL6, zvočno izoliranim obokom in izbranim programom elektronske glasbe.",
      "url": "https://www.kader.si/club",
      "telephone": "+38640175628",
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Cash, Credit Card, Contactless, Apple Pay, Google Pay",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Koblarjeva ulica 34",
        "addressLocality": "Ljubljana",
        "postalCode": "1000",
        "addressCountry": "SI"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.0494,
        "longitude": 14.5367
      },
      "hasMap": "https://maps.app.goo.gl/8FAZpJkTksq2zZGq7",
      "image": [
        "https://www.kader.si/logo-banner.png",
        "https://www.kader.si/hero-bg.jpg"
      ],
      "maximumAttendeeCapacity": 300,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday", "Saturday"],
          "opens": "23:00",
          "closes": "05:00",
          "description": "Klubske noči & elektronski dogodki"
        }
      ],
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Audiophile Sound System",
          "value": "Klipsch La Scala AL6 3-way fully horn-loaded system with QUAD Class A and CREST C12 amplification"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Acoustic Vault",
          "value": "Stone vaulted basement with custom acoustic dampening and low illumination"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "No Photo Policy",
          "value": "Camera lens stickers provided at entry; strict privacy and freedom on the dancefloor"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Hearing Protection",
          "value": "Free high-fidelity earplugs available at all bars"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Awareness Team",
          "value": "Active on-site Safer Spaces awareness team"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Supervised Cloakroom",
          "value": "Secure wardrobe service available throughout the night"
        }
      ]
    },
    {
      "@type": "Event",
      "@id": "https://www.kader.si/club#event-101",
      "name": "Kader Vault: Hypnotic Techno Night",
      "description": "Hipnotična tehno noč z rezidenti in gosti iz Berlina na avdiofilskem ozvočenju Klipsch La Scala v kletnem oboku Gradu Kodeljevo.",
      "startDate": "2026-09-18T23:00:00+02:00",
      "endDate": "2026-09-19T06:00:00+02:00",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "image": [
        "https://www.kader.si/images/instagram/ig_img_3.jpg",
        "https://www.kader.si/logo-banner.png"
      ],
      "location": {
        "@type": "Place",
        "name": "Club Kader (Grad Kodeljevo)",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Koblarjeva ulica 34",
          "addressLocality": "Ljubljana",
          "postalCode": "1000",
          "addressCountry": "SI"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 46.0494,
          "longitude": 14.5367
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "Club Kader Grad Kodeljevo",
        "url": "https://www.kader.si"
      },
      "performer": [
        {
          "@type": "PerformingGroup",
          "name": "Vault Resident"
        },
        {
          "@type": "PerformingGroup",
          "name": "Berlin Guest Live"
        }
      ],
      "offers": {
        "@type": "Offer",
        "name": "Vstopnica za dogodek",
        "price": "12.00",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-09-10T12:00:00+02:00",
        "url": "https://pretix.eu/kader/vault-01"
      }
    }
  ]
}
```

---

### 4.3 Schema: `LocalBusiness` & `EventVenue` (`/buyouts` & `/`)
Target routes: `/buyouts` (Private venue hire) and `/` (Home parent venue)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "EventVenue"],
      "@id": "https://www.kader.si/#venue",
      "name": "Kader Grad Kodeljevo",
      "alternateName": "Dvorec Grad Kodeljevo — Prizorišče & Zasebni Najem",
      "description": "Zgodovinski baročni dvorec iz 17. stoletja z letnim vrtom, klubskim obokom in celovito gostinsko ter avdio ponudbo za poroke, poslovna srečanja in zasebne zabave v Ljubljani.",
      "url": "https://www.kader.si/buyouts",
      "telephone": "+38640175628",
      "email": "info@kader.si",
      "priceRange": "€€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Bank Transfer, Credit Card, Cash",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Koblarjeva ulica 34",
        "addressLocality": "Ljubljana",
        "postalCode": "1000",
        "addressCountry": "SI"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.0494,
        "longitude": 14.5367
      },
      "hasMap": "https://maps.app.goo.gl/8FAZpJkTksq2zZGq7",
      "image": [
        "https://www.kader.si/logo-banner.png",
        "https://www.kader.si/buyout-bg.jpg",
        "https://www.kader.si/hero-bg.jpg"
      ],
      "maximumAttendeeCapacity": 500,
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Historical Castle Architecture",
          "value": "17th-century baroque manor (Codelli estate) and historic courtyard"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Castle Garden & Terrace",
          "value": "Expansive outdoor summer garden accommodating 100 to 300 guests"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Professional Audio & Stage",
          "value": "Audiophile Klipsch La Scala AL6 club sound system and CDJ-3000 / DJM-A9 setup"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "In-house Gourmet Catering",
          "value": "Neapolitan pizza oven, freshly baked Panuozzo sandwiches, charcuterie, and signature cocktail bar"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Dedicated Parking",
          "value": "Free on-site parking for event attendees"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Security & Wardrobe",
          "value": "Dedicated event security personnel and staffed cloakroom"
        }
      ],
      "potentialAction": {
        "@type": "CommunicateAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.kader.si/buyouts#inquiry-form",
          "inLanguage": "sl",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "name": "Oddaj povpraševanje za najem dvorca"
      }
    }
  ]
}
```

---

### 4.4 Schema: `Store` (`/shop`)
Target route: `/shop`
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": "https://www.kader.si/shop#store",
      "name": "Uradna Trgovina Kader Grad Kodeljevo",
      "description": "Uradni izdelki Kader Grad Kodeljevo: majice, kape in modni dodatki z možnostjo spletnega naročila ali osebnega prevzema v gradu.",
      "url": "https://www.kader.si/shop",
      "telephone": "+38683836740",
      "currenciesAccepted": "EUR",
      "priceRange": "€€",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Koblarjeva ulica 34",
        "addressLocality": "Ljubljana",
        "postalCode": "1000",
        "addressCountry": "SI"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.0494,
        "longitude": 14.5367
      },
      "image": [
        "https://www.kader.si/logo-banner.png"
      ],
      "parentOrganization": {
        "@id": "https://www.kader.si/#venue"
      }
    }
  ]
}
```

---

## 5. Implementation Pattern & Architectural Recommendation

### 5.1 Architecture Decision: Centralized Composable Pattern
Instead of hardcoding disjointed `useHead` and `useSeoMeta` scripts across every page template, introduce a unified composable:
**`src/composables/usePageSeo.ts`**

#### Benefits
1. **Zero External Dependencies**: Operates natively on Nuxt 3's built-in `unhead` engine (`useHead`, `useSeoMeta`). No additional node modules required.
2. **Single Source of Truth**: Coordinates `46.0494, 14.5367`, address `Koblarjeva ulica 34`, contact phone numbers, domain `https://www.kader.si`, and image banners are declared once.
3. **Automatic Hreflang Construction**: Dynamically computes all 10 `<link rel="alternate" hreflang="...">` tags for the current route, appending `?lang=` parameters and `x-default`.
4. **Complete OpenGraph & Twitter Cards**: Generates localized titles, descriptions, canonical URLs, image dimensions (`1200x630`), and alternate locale arrays automatically.
5. **Reactive JSON-LD Injection**: Encapsulates schema objects in reactive `computed()` refs with `type: 'application/ld+json'`.

### 5.2 Implementation Blueprint: `src/composables/usePageSeo.ts`
```ts
// src/composables/usePageSeo.ts
import { computed } from 'vue'
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

const LOCALE_OG_MAP: Record<Locale, string> = {
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
  schema?: Record<string, any> | Record<string, any>[]
}

export function usePageSeo(options: PageSeoOptions) {
  const { t, locale } = useLocale()
  const route = useRoute()

  const normalizedPath = options.path === '/' ? '' : options.path
  const canonicalUrl = `${CANONICAL_BASE}${normalizedPath}`
  const imageUrl = options.image || CANONICAL_CONTACTS.defaultBanner

  const title = computed(() => t(options.titleKey))
  const description = computed(() => t(options.descKey))
  const ogTitle = computed(() => t(options.ogTitleKey || options.titleKey))
  const ogDescription = computed(() => t(options.ogDescKey || options.descKey))

  // Build 10 localized hreflang tags + x-default for the current route
  const hreflangLinks = computed(() => {
    const links = SUPPORTED_LOCALES.map((loc) => ({
      rel: 'alternate',
      hreflang: loc,
      href: `${canonicalUrl}?lang=${loc}`
    }))
    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: canonicalUrl
    })
    return links
  })

  // Assemble full JSON-LD script if schema is provided
  const schemaJson = computed(() => {
    if (!options.schema) return null
    if ('@context' in options.schema) {
      return JSON.stringify(options.schema)
    }
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': Array.isArray(options.schema) ? options.schema : [options.schema]
    })
  })

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
    twitterCard: 'summary_large_image',
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: imageUrl
  })
}
```

### 5.3 Updates Required in `src/app.vue`
Update `src/app.vue` to dynamically set `<html :lang="locale" class="dark">`:
```vue
<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { locale } = useLocale()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
    class: 'dark'
  }
})
</script>
```

### 5.4 Updates Required in `nuxt.config.ts`
1. Remove lines 31-41 (`rel: 'alternate', hreflang: '...'`) from `app.head.link` in `nuxt.config.ts`.
2. Add route rules to protect internal admin and private endpoints from search indexing:
```ts
routeRules: {
  '/events': { redirect: { to: '/club', statusCode: 301 } },
  '/admin/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
}
```

### 5.5 SSR Language Detection in `src/composables/useLocale.ts`
Enhance `useLocale.ts` to inspect `useRoute().query.lang` upon SSR initialization:
```ts
// In useLocale.ts:
const route = useRoute()
const queryLang = route?.query?.lang as string | undefined
const initialLocale = isSupportedLocale(queryLang) 
  ? queryLang 
  : (isSupportedLocale(cookie.value) ? cookie.value : DEFAULT_LOCALE)
```

---

## 6. Implementation Action Plan for Milestone 6

| Step | Action Item | Target File | Impact |
|---|---|---|---|
| **1** | Create `src/composables/usePageSeo.ts` | `src/composables/usePageSeo.ts` | Centralizes coordinates `46.0494, 14.5367`, address, contacts, and meta generator. |
| **2** | Add Query Parameter SSR Resolution | `src/composables/useLocale.ts` | Enables crawlers to fetch localized versions via `?lang=en`. |
| **3** | Clean up `nuxt.config.ts` | `nuxt.config.ts` | Removes hardcoded root hreflangs and adds `X-Robots-Tag` for admin routes. |
| **4** | Dynamic HTML Lang in `app.vue` | `src/app.vue` | Automatically sets `<html lang="...">` on SSR and client navigation. |
| **5** | Refactor Home Page (`/`) SEO & Schema | `src/pages/index.vue` | Switches from `seo.pizzeria.*` to `seo.home.*` and injects `LocalBusiness` / `EventVenue` schema. |
| **6** | Refactor Pizzeria Page (`/pizzeria`) | `src/pages/pizzeria.vue` | Upgrades `Restaurant` schema with exact coordinates, hours, actions, and menu. |
| **7** | Refactor Club Page (`/club`) | `src/pages/club.vue` | Upgrades `NightClub` and dynamic `Event` schemas with offers, performers, and Klipsch specs. |
| **8** | Refactor Buyouts Page (`/buyouts`) | `src/pages/buyouts.vue` | Injects full `EventVenue` and `LocalBusiness` schemas with capacity and booking action. |
| **9** | Refactor Shop Page (`/shop`) | `src/pages/shop.vue` | Injects `Store` schema with physical address and coordinates for in-person pickup. |
| **10** | Automated Test Verification | `scripts/verify_seo_geo_schema.mjs` | Automated script testing valid JSON-LD parsing, exact coordinates, and tag presence. |

---

## 7. Verification & Automated Test Strategy

To verify the implementation during Milestone 7:
1. **Coordinates & Address Precision Test**:
   - Parse all SSR rendered HTML and verify that `latitude === 46.0494` and `longitude === 14.5367`.
   - Verify street address string strictly matches `"Koblarjeva ulica 34"`.
2. **Schema.org JSON-LD Validity Test**:
   - Extract `<script type="application/ld+json">` from SSR output of each route.
   - Run `JSON.parse()` to ensure 0 syntax errors.
   - Assert presence of required types: `Restaurant`, `NightClub`, `Event`, `EventVenue`, `LocalBusiness`.
   - Verify `Event` schema includes `startDate`, `endDate`, `location`, `offers`, and `organizer`.
3. **Hreflang & Canonical URL Test**:
   - Inspect `<link rel="canonical">` matches the exact route.
   - Inspect `<link rel="alternate" hreflang="...">` includes all 10 supported locales with matching paths (e.g. `/club?lang=de` on `/club`, NOT `/`).
4. **HTML Lang Attribute Test**:
   - Validate `<html lang="sl">` for default, `<html lang="en">` when `?lang=en` is requested.
5. **Build & Typecheck**:
   - Execute `npm run typecheck` to confirm 0 TypeScript errors.
   - Execute `npm run build` to confirm clean Nitro SSR bundle generation.
