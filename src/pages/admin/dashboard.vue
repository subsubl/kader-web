<template>
  <div class="space-y-6">
    <!-- BI Dashboard Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950/80 text-red-400 border border-red-800/60 font-mono tracking-wider">
            LIVE BI DASHBOARD
          </span>
          <span class="text-xs text-gray-400 font-mono">Shift ID: #SH-2026-0909</span>
        </div>
        <h1 class="text-2xl font-extrabold text-white mt-1 tracking-tight">Staff Operations Center</h1>
        <p class="text-xs text-gray-400">Grad Kodeljevo Real-Time Venue Intelligence &amp; Surveillance</p>
      </div>

      <!-- Quick Action Bar -->
      <div class="flex items-center gap-2">
        <button 
          @click="refreshData"
          class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': isRefreshing }"
        >
          <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
          Refresh Metrics
        </button>

        <NuxtLink 
          to="/admin/door" 
          class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <ShieldCheckIcon class="w-4 h-4" /> Live Door Ops
        </NuxtLink>
      </div>
    </div>

    <!-- Top Grid: BI Key Performance Indicators (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Venue Capacity Gauge -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Venue Capacity</span>
          <UsersIcon class="w-5 h-5 text-emerald-400" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-white font-mono">{{ biStats.currentCapacity }}</span>
          <span class="text-xs text-gray-400 font-mono">/ {{ biStats.maxCapacity }} guests</span>
        </div>
        <div>
          <div class="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>Occupancy Rate</span>
            <span class="font-bold font-mono" :class="occupancyRate > 85 ? 'text-amber-400' : 'text-emerald-400'">{{ occupancyRate }}%</span>
          </div>
          <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-500" 
              :class="occupancyRate > 85 ? 'bg-amber-500' : 'bg-emerald-500'" 
              :style="{ width: `${Math.min(occupancyRate, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Bar Revenue Velocity -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bar Velocity</span>
          <CurrencyEuroIcon class="w-5 h-5 text-amber-400" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-white font-mono">€{{ biStats.barRevenueVelocity }}</span>
          <span class="text-xs text-emerald-400 font-mono">/ hr</span>
        </div>
        <p class="text-[11px] text-gray-400 flex items-center gap-1">
          <span class="text-emerald-400 font-bold">+18%</span> compared to last Friday shift
        </p>
      </div>

      <!-- Door Check-in Rate -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Door Rate</span>
          <ArrowTrendingUpIcon class="w-5 h-5 text-blue-400" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-white font-mono">{{ biStats.doorScansPerHour }}</span>
          <span class="text-xs text-gray-400 font-mono">scans / hr</span>
        </div>
        <p class="text-[11px] text-gray-400">Peak hour expected at <strong class="text-white font-mono">01:00</strong></p>
      </div>

      <!-- VIP Table Reservations -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">VIP Tables</span>
          <StarIcon class="w-5 h-5 text-purple-400" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-white font-mono">{{ biStats.seatedTables }}</span>
          <span class="text-xs text-gray-400 font-mono">/ {{ biStats.totalVipTables }} Seated</span>
        </div>
        <p class="text-[11px] text-purple-300 font-medium">{{ biStats.pendingTableRequests }} pending table requests</p>
      </div>
    </div>

    <!-- Main BI Split View: RTSP Camera Feed Window & BI Visualizations -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- RTSP Security Camera Stream Window (7 Cols) -->
      <div class="lg:col-span-7 flex flex-col">
        <RtspCameraStream />
      </div>

      <!-- BI Attendance & Visitor Flow Chart (5 Cols) -->
      <div class="lg:col-span-5 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-bold text-white text-base">Visitor Flow Distribution</h3>
              <p class="text-xs text-gray-400">Hourly door entries &amp; castle occupancy curve</p>
            </div>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] font-mono border border-gray-700 rounded">
              HOURLY BI
            </span>
          </div>

          <!-- Interactive SVG BI Bar Chart -->
          <div class="space-y-2 pt-2">
            <div v-for="bar in biHourlyFlow" :key="bar.time" class="flex items-center gap-3 text-xs">
              <span class="w-12 text-gray-400 font-mono text-[11px] shrink-0">{{ bar.time }}</span>
              <div class="flex-1 bg-gray-800 h-3.5 rounded-sm overflow-hidden flex">
                <div 
                  class="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-sm transition-all duration-300"
                  :style="{ width: `${bar.percentage}%` }"
                ></div>
              </div>
              <span class="w-10 text-right text-gray-200 font-mono font-semibold text-[11px] shrink-0">{{ bar.count }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
          <span>Peak Density: <strong class="text-red-400 font-mono">01:30 (128 entries)</strong></span>
          <NuxtLink to="/admin/analytics" class="text-red-400 hover:text-red-300 font-medium">Full Analytics →</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Quick Operations Cards & Live Shift Logs -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Ops Cards (2 Cols) -->
      <div class="lg:col-span-2 space-y-3">
        <h3 class="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono">Operational Modules</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <NuxtLink to="/admin/events" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <CalendarIcon class="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">Event Manager</h4>
            <p class="text-xs text-gray-400 mt-0.5">Lineups &amp; ticketing sync</p>
          </NuxtLink>

          <NuxtLink to="/admin/menu" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <Bars3Icon class="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">Pizzeria Menu</h4>
            <p class="text-xs text-gray-400 mt-0.5">Availability &amp; price overrides</p>
          </NuxtLink>

          <NuxtLink to="/admin/crm" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <UserGroupIcon class="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">Private Hire CRM</h4>
            <p class="text-xs text-gray-400 mt-0.5">Buyout leads &amp; contracts</p>
          </NuxtLink>

          <NuxtLink to="/admin/vip" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <StarIcon class="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">VIP &amp; Guests</h4>
            <p class="text-xs text-gray-400 mt-0.5">Table bookings &amp; CRM</p>
          </NuxtLink>

          <NuxtLink to="/admin/logbook" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <BookOpenIcon class="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">Shift Logbook</h4>
            <p class="text-xs text-gray-400 mt-0.5">BEO notes &amp; security logs</p>
          </NuxtLink>

          <NuxtLink to="/admin/settings" class="p-3.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group">
            <Cog6ToothIcon class="w-6 h-6 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-white text-sm">System Settings</h4>
            <p class="text-xs text-gray-400 mt-0.5">Cameras &amp; radio config</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Live Operational Shift Alerts (1 Col) -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
          <h3 class="font-bold text-white text-sm flex items-center gap-1.5">
            <BellIcon class="w-4 h-4 text-amber-400" /> Live Shift Log Stream
          </h3>
          <span class="text-[10px] font-mono text-gray-400">REALTIME</span>
        </div>

        <div class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          <div v-for="log in shiftLogs" :key="log.id" class="p-2.5 bg-gray-800/60 rounded-lg text-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold font-mono text-[11px]" :class="log.color">{{ log.title }}</span>
              <span class="text-[10px] text-gray-500 font-mono">{{ log.time }}</span>
            </div>
            <p class="text-gray-300 text-[11px] leading-tight">{{ log.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  UsersIcon, 
  CurrencyEuroIcon, 
  ArrowTrendingUpIcon, 
  StarIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon,
  CalendarIcon,
  Bars3Icon,
  UserGroupIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import RtspCameraStream from '~/components/admin/RtspCameraStream.vue'

const isRefreshing = ref(false)

const biStats = ref({
  currentCapacity: 342,
  maxCapacity: 450,
  barRevenueVelocity: 840,
  doorScansPerHour: 92,
  seatedTables: 6,
  totalVipTables: 8,
  pendingTableRequests: 3
})

const occupancyRate = computed(() => {
  return Math.round((biStats.value.currentCapacity / biStats.value.maxCapacity) * 100)
})

const biHourlyFlow = ref([
  { time: '21:00', count: 42, percentage: 32 },
  { time: '22:00', count: 78, percentage: 60 },
  { time: '23:00', count: 110, percentage: 85 },
  { time: '00:00', count: 125, percentage: 96 },
  { time: '01:00', count: 128, percentage: 100 },
  { time: '02:00', count: 95, percentage: 74 }
])

const shiftLogs = ref([
  { id: '1', title: 'SECURITY ALERT', time: '22:45', message: 'Main entrance gate queue reaching 25+ guests. Opening lane 2.', color: 'text-amber-400' },
  { id: '2', title: 'VIP TABLE BOTTLE', time: '22:38', message: 'Table 3 order confirmed: 2x Belvedere + Champagne package.', color: 'text-purple-400' },
  { id: '3', title: 'SOUND CHECK', time: '22:15', message: 'Klipsch La Scala main stack calibrated. Sound engineer approved.', color: 'text-emerald-400' },
  { id: '4', title: 'TICKET SYNC', time: '21:50', message: 'Pretix batch sync complete: 280 presale tickets redeemed.', color: 'text-blue-400' }
])

const refreshData = async () => {
  isRefreshing.value = true
  // Simulate metric updates
  setTimeout(() => {
    biStats.value.currentCapacity = Math.min(biStats.value.maxCapacity, biStats.value.currentCapacity + Math.floor(Math.random() * 5) - 2)
    biStats.value.barRevenueVelocity = 840 + Math.floor(Math.random() * 60) - 30
    isRefreshing.value = false
  }, 600)
}

definePageMeta({ layout: 'admin' })
</script>