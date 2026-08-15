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
          <div class="flex items-center border border-gray-700 rounded-lg overflow-hidden">
            <button
              @click="setLocale('sl')"
              :class="langClass('sl')"
              class="px-3 py-1.5 text-sm font-semibold transition-colors duration-300"
            >SL</button>
            <button
              @click="setLocale('en')"
              :class="langClass('en')"
              class="px-3 py-1.5 text-sm font-semibold transition-colors duration-300"
            >EN</button>
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
import { ref, computed } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useLocale, type Locale } from '~/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const logoUrl = '/logo-k.jpg'
const mobileMenuOpen = ref(false)

const langClass = (l: Locale) =>
  locale.value === l ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
</script>