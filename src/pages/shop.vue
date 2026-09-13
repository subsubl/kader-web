<template>
  <div class="min-h-screen bg-black text-white pt-28 pb-20 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="border-b border-gray-800 pb-8 mb-10">
        <p class="text-xs uppercase tracking-widest text-red-500 font-semibold mb-2">{{ t('shop.overline') }}</p>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          {{ t('shop.title') }}
        </h1>
        <p class="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
          {{ t('shop.desc') }}
        </p>
      </div>

      <!-- Pretix Widget Container -->
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 md:p-8 min-h-[500px]">
        <PretixWidget :event="shopUrl" />
      </div>

      <!-- Footer Info -->
      <div class="mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500">
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">{{ t('shop.pickupTitle') }}</h4>
          <p>{{ t('shop.pickupText') }}</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">{{ t('shop.checkoutTitle') }}</h4>
          <p>{{ t('shop.checkoutText') }}</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">{{ t('shop.supportTitle') }}</h4>
          <p>{{ t('shop.supportText') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { usePageSeo, EXACT_GEO, CANONICAL_ADDRESS, CANONICAL_CONTACTS } from '~/composables/usePageSeo'

const { t, locale } = useLocale()
const config = useRuntimeConfig()

const shopUrl = computed(() => {
  const pretixBase = (config.public.pretixUrl as string || 'https://pretix.eu').replace(/\/$/, '')
  return `${pretixBase}/kader/merch/`
})

const shopSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Store',
      '@id': 'https://www.kader.si/shop#store',
      'name': 'Uradna Trgovina Kader Grad Kodeljevo',
      'description': t('shop.desc') || 'Uradni izdelki Kader Grad Kodeljevo: majice, kape in modni dodatki z možnostjo spletnega naročila ali osebnega prevzema v gradu.',
      'url': 'https://www.kader.si/shop',
      'telephone': CANONICAL_CONTACTS.takeawayPhone,
      'currenciesAccepted': 'EUR',
      'priceRange': '€€',
      'address': CANONICAL_ADDRESS,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': EXACT_GEO.latitude,
        'longitude': EXACT_GEO.longitude
      },
      'image': [
        'https://www.kader.si/logo-banner.png'
      ],
      'parentOrganization': {
        '@id': 'https://www.kader.si/#venue'
      }
    }
  ]
}))

usePageSeo({
  path: '/shop',
  titleKey: 'seo.shop.title',
  descKey: 'seo.shop.description',
  ogTitleKey: 'seo.shop.ogTitle',
  ogDescKey: 'seo.shop.ogDescription',
  schema: shopSchema
})
</script>
