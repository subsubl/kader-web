<template>
  <footer class="bg-black border-t border-gray-800 py-12 text-gray-300 content-visibility-auto">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img 
              src="/logo-badge.png" 
              :alt="t('footer.logoAlt')" 
              loading="lazy" 
              decoding="async" 
              width="40" 
              height="40" 
              class="w-10 h-10 object-contain rounded-md" 
            />
            <span class="text-xl font-black tracking-wider text-white">KADER</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">{{ t('footer.tagline') }}</p>
          <div class="text-xs text-gray-500 space-y-1 mb-5">
            <p><strong>Kader d.o.o.</strong></p>
            <p>Koblarjeva ulica 34, 1000 Ljubljana</p>
            <p>{{ t('footer.taxIdLabel') }} {{ t('footer.taxId') }}</p>
          </div>

          <!-- Real Social Media Profiles -->
          <div class="flex items-center space-x-3 pt-1">
            <a 
              href="https://www.instagram.com/kader.lunapark/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram @kader.lunapark"
              class="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-white flex items-center justify-center text-gray-400 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://ra.co/clubs/78778" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Resident Advisor Club Kader"
              class="h-10 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-white flex items-center gap-1.5 text-xs font-black tracking-wider text-gray-400 transition-colors"
            >
              <span class="text-red-500 font-black">RA</span>
              <span class="text-[11px] font-mono font-normal">78778</span>
            </a>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">{{ t('footer.quickLinks') }}</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.home') }}</NuxtLink></li>
            <li><NuxtLink to="/pizzeria" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.pizzeria') }}</NuxtLink></li>
            <li><NuxtLink to="/club" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.events') }}</NuxtLink></li>
            <li><NuxtLink to="/buyouts" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.buyouts') }}</NuxtLink></li>
            <li><NuxtLink to="/shop" class="text-gray-400 hover:text-red-500 transition-colors duration-300">{{ t('nav.shop') }}</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">{{ t('footer.contacts') }}</h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start">
              <MapPinIcon class="w-5 h-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
              <span>Koblarjeva ulica 34,<br />1000 Ljubljana ({{ t('footer.addressCastle') }})</span>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <div>
                <span class="text-xs text-gray-500 block">{{ t('footer.pickUp') }}</span>
                <a href="tel:+38683836740" class="hover:text-white font-semibold text-white">+386 83 836 740</a>
              </div>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <div>
                <span class="text-xs text-gray-500 block">{{ t('footer.tableRes') }}</span>
                <a href="tel:+38640175628" class="hover:text-white font-semibold text-white">+386 40 175 628</a>
              </div>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">{{ t('footer.hours') }}</h3>
          <ul class="space-y-2 text-xs text-gray-400">
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>{{ t('home.monWed') }}</span>
              <span class="text-white font-medium">09:00 – 22:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>{{ t('home.thu') }}</span>
              <span class="text-white font-medium">09:00 – 01:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>{{ t('home.fri') }}</span>
              <span class="text-white font-medium">09:00 – 05:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>{{ t('home.sat') }}</span>
              <span class="text-white font-medium">09:00 – 01:00</span>
            </li>
            <li class="flex justify-between pb-1">
              <span>{{ t('home.sun') }}</span>
              <span class="text-white font-medium">09:00 – 20:00</span>
            </li>
          </ul>
          <p class="text-[11px] text-gray-500 mt-3 italic">{{ t('footer.kitchenNote') }}</p>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Kader Grad Kodeljevo. {{ t('footer.rights') }}</p>
        <p class="mt-2 md:mt-0">{{ t('footer.priceNote') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPinIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>