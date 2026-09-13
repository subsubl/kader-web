<template>
  <header class="bg-black/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800/80">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
            <img :src="logoUrl" :alt="t('header.logoAlt')" decoding="async" class="h-10 md:h-12 w-auto object-contain rounded-lg shadow-sm" width="120" height="48" />
          </NuxtLink>
        </div>
        
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
          <NuxtLink to="/" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.home') }}</NuxtLink>
          <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.pizzeria') }}</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.events') }}</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.buyouts') }}</NuxtLink>
          <NuxtLink to="/shop" class="hover:text-red-500 transition-colors duration-300 py-2 border-b-2 border-transparent" active-class="text-red-500 font-bold border-red-500">{{ t('nav.shop') }}</NuxtLink>
        </nav>
        
        <div class="flex items-center space-x-3">
          <!-- Language switch with optimal touch target -->
          <div class="relative">
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
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>

          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            :aria-label="t('header.toggleMenu')"
            :aria-expanded="mobileMenuOpen"
            class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-gray-200 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <XMarkIcon v-if="mobileMenuOpen" class="w-6 h-6 text-red-500" />
            <Bars3Icon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <!-- Mobile Navigation Drawer -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-zinc-800/80 bg-black/95">
          <div class="flex flex-col space-y-1 text-base font-semibold">
            <NuxtLink to="/" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.home') }}</NuxtLink>
            <NuxtLink to="/pizzeria" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.pizzeria') }}</NuxtLink>
            <NuxtLink to="/club" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.events') }}</NuxtLink>
            <NuxtLink to="/buyouts" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.buyouts') }}</NuxtLink>
            <NuxtLink to="/shop" class="hover:text-red-500 hover:bg-zinc-900/80 rounded-xl px-4 py-3 transition-colors" active-class="text-red-500 font-bold bg-zinc-900/90" @click="mobileMenuOpen = false">{{ t('nav.shop') }}</NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useLocale, localeLabels, type Locale } from '~/composables/useLocale'

const { locale, setLocale, t } = useLocale()
const route = useRoute()

const logoUrl = '/logo-k.jpg'
const mobileMenuOpen = ref(false)

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})
</script>