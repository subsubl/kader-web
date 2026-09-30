<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-5">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center focus:outline-none focus:ring-2 focus:ring-kader-red rounded">
          <span class="text-xl font-black tracking-wider text-gray-900">KADER</span>
        </NuxtLink>

        <div class="flex items-center">
          <div class="relative">
            <select
              :value="locale"
              @change="(e: any) => setLocale(e.target.value as Locale)"
              :aria-label="t('header.langSelector')"
              class="bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-kader-red cursor-pointer appearance-none pr-6"
            >
              <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-white text-gray-900">
                {{ info.flag }} {{ key.toUpperCase() }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293c0-1 1.243-1.5 2-1.5.757 0 1.45.5 2 1.5.55 1 1.243 1.5 2 1.5 1 0 2-.5 2-1.5a1 1 0 112 0 1 1 0 112 0c0 1-1 2-2 2-.757 0-1.45-.5-2-1.5-.55-1-1.243-1.5-2-1.5-.757 0-1.45.5-2 1.5-.55 1-1.243 1.5-2 1.5a1 1 0 11-2 0 1 1 0 012 0c.757 0 1.45-.5 2-1.5.55-1 1.243-1.5 2-1.5.757 0 1.45.5 2 1.5.55 1 1.243 1.5 2 1.5a1 1 0 002 0 1 1 0 112 0 1 1 0 01-2 0c-.757 0-1.45-.5-2-1.5-.55-1-1.243-1.5-2-1.5-.757 0-1.45.5-2 1.5-.55 1-1.243 1.5-2 1.5a1 1 0 01-2 0 1 1 0 010-2z"/></svg>
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
</script>
