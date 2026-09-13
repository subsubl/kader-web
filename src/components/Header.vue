<template>
  <header class="bg-black/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800/80">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
            <img :src="logoUrl" :alt="t('header.logoAlt')" decoding="async" class="h-9 sm:h-10 md:h-12 w-auto object-contain rounded-lg shadow-sm" width="120" height="48" />
          </NuxtLink>
        </div>
        
        <nav class="flex items-center space-x-3 sm:space-x-6 md:space-x-8 text-xs sm:text-sm font-medium">
          <NuxtLink to="/" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.pizzeria') }}</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.events') }}</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.buyouts') }}</NuxtLink>
        </nav>
        
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Language switch with optimal touch target -->
          <div class="relative">
            <select
              :value="locale"
              @change="(e: any) => setLocale(e.target.value as Locale)"
              :aria-label="t('header.langSelector')"
              class="bg-zinc-900 border border-zinc-700 text-gray-200 text-xs font-bold rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] focus:outline-none focus:border-red-500 cursor-pointer appearance-none pr-7 sm:pr-8 shadow-sm"
            >
              <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-zinc-900 text-white py-1">
                {{ info.flag }} {{ key.toUpperCase() }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLocale, localeLabels, type Locale } from '~/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const logoUrl = '/logo-k.jpg'
</script>