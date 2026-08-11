<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 min-h-screen p-4">
        <div class="mb-8">
          <h1 class="text-xl font-bold">Admin Dashboard</h1>
          <p class="text-gray-400 text-sm">Kader Grad Kodeljevo</p>
        </div>
        
        <nav class="space-y-2">
          <NuxtLink to="/admin/dashboard" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <HomeIcon class="w-5 h-5" />
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/admin/events" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <CalendarIcon class="w-5 h-5" />
            <span>Events</span>
          </NuxtLink>
          <NuxtLink to="/admin/menu" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <Bars3Icon class="w-5 h-5" />
            <span>Menu</span>
          </NuxtLink>
          <NuxtLink to="/admin/kader" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <PhotoIcon class="w-5 h-5" />
            <span>Kader / Menu Image</span>
          </NuxtLink>
          <NuxtLink to="/admin/crm" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <UserGroupIcon class="w-5 h-5" />
            <span>CRM</span>
          </NuxtLink>
          <NuxtLink to="/admin/door" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <ShieldCheckIcon class="w-5 h-5" />
            <span>Door Ops</span>
          </NuxtLink>
          <NuxtLink to="/admin/calendar" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <ClockIcon class="w-5 h-5" />
            <span>Internal Calendar</span>
          </NuxtLink>
        </nav>
        
        <div class="mt-8 pt-4 border-t border-gray-700">
          <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
            <UserCircleIcon class="w-8 h-8" />
            <div>
              <p class="font-medium">Admin User</p>
              <p class="text-sm text-gray-400">admin@kader.si</p>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-grow p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, CalendarIcon, Bars3Icon, UserGroupIcon, ShieldCheckIcon, ClockIcon, UserCircleIcon, PhotoIcon } from '@heroicons/vue/24/outline'

definePageMeta({ middleware: 'admin' })
</script>