<template>
  <footer class="bg-black border-t border-gray-800 py-12 text-gray-300">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img src="/logo-badge.png" alt="Kader Logo" class="w-10 h-10 object-contain rounded-md" />
            <span class="text-xl font-black tracking-wider text-white">KADER</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">Pizza bistro in plesni bar na gradu Kodeljevo. Pizzeria podnevi in klubska kultura ponoči v zgodovinskem ambientu.</p>
          <div class="text-xs text-gray-500 space-y-1">
            <p><strong>Kader d.o.o.</strong></p>
            <p>Ulica Carla Benza 20, 1000 Ljubljana</p>
            <p>Davčna št.: SI45321361</p>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">Hitre Povezave</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-red-500 transition-colors duration-300">Začetna / Home</NuxtLink></li>
            <li><NuxtLink to="/pizzeria" class="text-gray-400 hover:text-red-500 transition-colors duration-300">Meni / Pizzeria</NuxtLink></li>
            <li><NuxtLink to="/club" class="text-gray-400 hover:text-red-500 transition-colors duration-300">Klub / Klipsch Sound</NuxtLink></li>
            <li><NuxtLink to="/events" class="text-gray-400 hover:text-red-500 transition-colors duration-300">Dogodki / Events</NuxtLink></li>
            <li><NuxtLink to="/buyouts" class="text-gray-400 hover:text-red-500 transition-colors duration-300">Zasebni Najem / Buyouts</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">Kontakt & Naročila</h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start">
              <MapPinIcon class="w-5 h-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
              <span>Ulica Carla Benza 20,<br />1000 Ljubljana (Grad Kodeljevo)</span>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <div>
                <span class="text-xs text-gray-500 block">Naročim in pridem iskat:</span>
                <a href="tel:+38683836740" class="hover:text-white font-semibold text-white">+386 83 836 740</a>
              </div>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <div>
                <span class="text-xs text-gray-500 block">Rezervacije miz:</span>
                <a href="tel:+38640175628" class="hover:text-white font-semibold text-white">+386 40 175 628</a>
              </div>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4 text-white">Delovni Čas (Google)</h3>
          <ul class="space-y-2 text-xs text-gray-400">
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>Ponedeljek – Sreda</span>
              <span class="text-white font-medium">09:00 – 22:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>Četrtek</span>
              <span class="text-white font-medium">09:00 – 01:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>Petek</span>
              <span class="text-white font-medium">09:00 – 05:00</span>
            </li>
            <li class="flex justify-between border-b border-gray-800 pb-1">
              <span>Sobota</span>
              <span class="text-white font-medium">09:00 – 01:00</span>
            </li>
            <li class="flex justify-between pb-1">
              <span>Nedelja</span>
              <span class="text-white font-medium">09:00 – 20:00</span>
            </li>
          </ul>
          <p class="text-[11px] text-gray-500 mt-3 italic">* Kuhinja obratuje od 12:00 do 22:00</p>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Kader Grad Kodeljevo. Vse pravice pridržane.</p>
        <p class="mt-2 md:mt-0">Cenik velja od 06.09.2024. Cene so v € in vključujejo DDV.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

// Social media icons would be imported here
// For this example, we'll use placeholder icons
const FacebookIcon = () => h('svg', { viewBox: '0 0 24 24', class: 'w-5 h-5' }, h('path', { d: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' }))
const InstagramIcon = () => h('svg', { viewBox: '0 0 24 24', class: 'w-5 h-5' }, h('path', { d: 'M12.316 3.051a1.5 1.5 0 0 0-2.632 0 1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632zm-6.032 1.5a1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632 1.5 1.5 0 0 0-2.632 0zm12.064 0a1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632 1.5 1.5 0 0 0-2.632 0zM12 12.5a1.5 1.5 0 0 0-2.632 0 1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632zm-6.032 1.5a1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632 1.5 1.5 0 0 0-2.632 0zm12.064 0a1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632 1.5 1.5 0 0 0-2.632 0zM12 18.5a1.5 1.5 0 0 0-2.632 0 1.5 1.5 0 0 0 0 2.632 1.5 1.5 0 0 0 2.632 0 1.5 1.5 0 0 0 0-2.632z' }))
const TwitterIcon = () => h('svg', { viewBox: '0 0 24 24', class: 'w-5 h-5' }, h('path', { d: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.072 4.072 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.616 11.616 0 0 0 6.29 1.84' }))
</script>