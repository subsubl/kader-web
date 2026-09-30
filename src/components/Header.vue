<template>
  <!--
    Language picker only — a small control parked in the top-right corner of the
    viewport, with no header bar. The hero carries the wordmark and the big menu
    links, so there is nothing else a bar would be for.

    It floats above the content (fixed, not sticky in a bar) so it stays reachable
    on a single long page, and it stays out of the way of the hero copy: the hero's
    left column starts below it, and the right-aligned nav sits above/clear of it.
  -->
  <div class="fixed top-0 right-0 z-50 p-3 sm:p-4">
    <div class="relative">
      <select
        :value="locale"
        @change="(e: any) => setLocale(e.target.value as Locale)"
        :aria-label="t('header.langSelector')"
        class="bg-kader-red/90 backdrop-blur-sm border border-white/40 text-white text-xs font-bold rounded-full pl-3 pr-7 py-1.5 focus:outline-none focus:border-white cursor-pointer appearance-none"
      >
        <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-white text-kader-black">
          {{ info.flag }} {{ key.toUpperCase() }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-white/70">
        <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.293 7.293c0-1 1.243-1.5 2-1.5.757 0 1.45.5 2 1.5.55 1 1.243 1.5 2 1.5 1 0 2-.5 2-1.5a1 1 0 112 0 1 1 0 112 0c0 1-1 2-2 2-.757 0-1.45-.5-2-1.5-.55-1-1.243-1.5-2-1.5-.757 0-1.45.5-2 1.5-.55 1-1.243 1.5-2 1.5a1 1 0 11-2 0 1 1 0 012 0c.757 0 1.45-.5 2-1.5.55-1 1.243-1.5 2-1.5.757 0 1.45.5 2 1.5.55 1 1.243 1.5 2 1.5a1 1 0 002 0 1 1 0 112 0 1 1 0 01-2 0c-.757 0-1.45-.5-2-1.5-.55-1-1.243-1.5-2-1.5-.757 0-1.45.5-2 1.5a1 1 0 01-2 0 1 1 0 010-2z"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale, localeLabels, type Locale } from '~/composables/useLocale'

const { locale, setLocale, t } = useLocale()
</script>