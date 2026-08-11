<template>
  <header class="bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img :src="logoUrl" alt="Kader" class="h-9 w-auto" />
          </NuxtLink>
        </div>
        
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/" class="hover:text-red-500 transition-colors duration-300">Home</NuxtLink>
          <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300">Pizzeria</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300">Club</NuxtLink>
          <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300">Events</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300">Buyouts</NuxtLink>
        </nav>
        
        <div class="flex items-center space-x-4">
          <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
            <SunIcon v-if="darkMode" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
          <NuxtLink to="/admin" class="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
            Admin
          </NuxtLink>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-800">
        <div class="flex flex-col space-y-3">
          <NuxtLink to="/" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">Home</NuxtLink>
          <NuxtLink to="/pizzeria" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">Pizzeria</NuxtLink>
          <NuxtLink to="/club" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">Club</NuxtLink>
          <NuxtLink to="/events" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">Events</NuxtLink>
          <NuxtLink to="/buyouts" class="hover:text-red-500 transition-colors duration-300 py-2" @click="mobileMenuOpen = false">Buyouts</NuxtLink>
          <NuxtLink to="/admin" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 mt-2" @click="mobileMenuOpen = false">Admin</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import { useDark } from '@vueuse/core'

const logoUrl = '/kader/asset-6100.png'

const mobileMenuOpen = ref(false)
const darkMode = useDark()

function toggleDarkMode() {
  darkMode.value = !darkMode.value
}
</script>