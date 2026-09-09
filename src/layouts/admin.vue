<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Top Admin Header with Persistent Radio Meuh Player -->
    <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-md">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-500 text-lg">
          K
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-white leading-tight">KADER GRAD KODELJEVO</h1>
          <p class="text-[11px] text-gray-400 font-medium leading-none">Venue Operations & System Admin</p>
        </div>
      </div>

      <!-- Center / Persistent Internet Radio Header Player -->
      <div class="flex items-center space-x-4">
        <RadioPlayer />
      </div>

      <!-- Right Side User Profile & Status -->
      <div class="flex items-center space-x-3">
        <div class="hidden md:flex flex-col text-right">
          <span class="text-xs font-semibold text-gray-200">Staff Ops</span>
          <span class="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300">
          <UserCircleIcon class="w-6 h-6" />
        </div>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-900/90 border-r border-gray-800 p-4 shrink-0 flex flex-col justify-between min-h-[calc(100vh-57px)]">
        <div>
          <p class="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3 font-mono">Navigation</p>
          <nav class="space-y-1 text-sm font-medium">
            <NuxtLink to="/admin/dashboard" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <HomeIcon class="w-4 h-4" />
              <span>BI Dashboard</span>
            </NuxtLink>

            <NuxtLink to="/admin/analytics" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <ChartBarIcon class="w-4 h-4" />
              <span>Analytics</span>
            </NuxtLink>

            <NuxtLink to="/admin/events" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <CalendarIcon class="w-4 h-4" />
              <span>Events</span>
            </NuxtLink>

            <NuxtLink to="/admin/rae" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <RadioIcon class="w-4 h-4" />
              <span>RA Events</span>
            </NuxtLink>

            <NuxtLink to="/admin/menu" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <Bars3Icon class="w-4 h-4" />
              <span>Menu Manager</span>
            </NuxtLink>

            <NuxtLink to="/admin/kader" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <PhotoIcon class="w-4 h-4" />
              <span>Kader Media</span>
            </NuxtLink>

            <NuxtLink to="/admin/crm" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <UserGroupIcon class="w-4 h-4" />
              <span>CRM Pipeline</span>
            </NuxtLink>

            <NuxtLink to="/admin/door" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <ShieldCheckIcon class="w-4 h-4" />
              <span>Door Operations</span>
            </NuxtLink>

            <NuxtLink to="/admin/vip" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <StarIcon class="w-4 h-4" />
              <span>VIP &amp; Guests</span>
            </NuxtLink>

            <NuxtLink to="/admin/calendar" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <ClockIcon class="w-4 h-4" />
              <span>Internal Calendar</span>
            </NuxtLink>

            <NuxtLink to="/admin/schedule" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <CalendarDaysIcon class="w-4 h-4" />
              <span>Staff Scheduling</span>
            </NuxtLink>

            <NuxtLink to="/admin/logbook" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <BookOpenIcon class="w-4 h-4" />
              <span>Logbook</span>
            </NuxtLink>

            <NuxtLink to="/admin/settings" class="nav-item flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-950/60 text-red-400 border border-red-800/60">
              <Cog6ToothIcon class="w-4 h-4" />
              <span>Settings</span>
            </NuxtLink>
          </nav>
        </div>

        <!-- System Footer -->
        <div class="pt-4 border-t border-gray-800 text-xs text-gray-500 flex flex-col gap-1">
          <div class="flex items-center justify-between font-mono text-[11px]">
            <span>Version</span>
            <span class="text-gray-400">v2.4.0-BI</span>
          </div>
          <p>© Grad Kodeljevo Ops</p>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 bg-gray-950 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  HomeIcon, 
  CalendarIcon, 
  CalendarDaysIcon, 
  BookOpenIcon, 
  StarIcon, 
  ChartBarIcon, 
  Bars3Icon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  UserCircleIcon, 
  PhotoIcon, 
  RadioIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import RadioPlayer from '~/components/admin/RadioPlayer.vue'

definePageMeta({ middleware: 'admin' })
</script>