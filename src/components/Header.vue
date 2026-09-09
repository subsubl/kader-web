<template>
  <header class="bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img :src="logoUrl" alt="Kader" class="h-10 md:h-12 w-auto object-contain rounded-lg shadow-sm" />
          </NuxtLink>
        </div>
        
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300">{{ t('nav.pizzeria') }}</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300">{{ t('nav.club') }}</NuxtLink>
          <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300">{{ t('nav.events') }}</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300">{{ t('nav.buyouts') }}</NuxtLink>
          <NuxtLink to="/shop" class="hover:text-red-500 transition-colors duration-300">{{ t('nav.shop') }}</NuxtLink>
        </nav>
        
        <div class="flex items-center space-x-4">
          <!-- Language switch -->
          <div class="relative">
            <select
              :value="locale"
              @change="(e: any) => setLocale(e.target.value as Locale)"
              class="bg-zinc-900 border border-zinc-700 text-gray-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer appearance-none pr-7 shadow-sm"
            >
              <option v-for="(info, key) in localeLabels" :key="key" :value="key" class="bg-zinc-900 text-white">
                {{ info.flag }} {{ key.toUpperCase() }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-800">
        <div class="flex flex-col space-y-3">
          <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">{{ t('nav.pizzeria') }}</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">{{ t('nav.club') }}</NuxtLink>
          <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">{{ t('nav.events') }}</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">{{ t('nav.buyouts') }}</NuxtLink>
          <NuxtLink to="/shop" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">{{ t('nav.shop') }}</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useLocale, localeLabels, type Locale } from '~/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const logoUrl = '/logo-k.jpg'
const mobileMenuOpen = ref(false)
</script>