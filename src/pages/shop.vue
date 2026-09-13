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

const { t, locale } = useLocale()
const config = useRuntimeConfig()
const shopUrl = computed(() => {
  const pretixBase = (config.public.pretixUrl as string || 'http://192.168.64.147').replace(/\/$/, '')
  return `${pretixBase}/kader/merch/`
})

const shopSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': 'https://www.kader.si/shop#store',
  'name': 'Uradna Trgovina Kader Grad Kodeljevo',
  'description': t('shop.desc'),
  'inLanguage': locale.value,
  'url': 'https://www.kader.si/shop',
  'image': 'https://www.kader.si/logo-banner.png'
}))

useHead({
  title: computed(() => t('seo.shop.title')),
  link: [
    { rel: 'canonical', href: 'https://www.kader.si/shop' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(shopSchema.value))
    }
  ]
})

useSeoMeta({
  title: computed(() => t('seo.shop.title')),
  description: computed(() => t('seo.shop.description')),
  ogTitle: computed(() => t('seo.shop.ogTitle')),
  ogDescription: computed(() => t('seo.shop.ogDescription')),
  ogImage: 'https://www.kader.si/logo-banner.png',
  ogUrl: 'https://www.kader.si/shop',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => t('seo.shop.ogTitle')),
  twitterDescription: computed(() => t('seo.shop.ogDescription')),
  twitterImage: 'https://www.kader.si/logo-banner.png'
})
</script>
