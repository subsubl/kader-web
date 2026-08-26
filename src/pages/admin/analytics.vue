<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold">Analytics</h1>
        <p class="text-gray-400 mt-1">Ticket revenue · door conversion · staffing · sales pipeline</p>
      </div>
      <button @click="load" :disabled="loading" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm">
        {{ loading ? 'Loading…' : 'Refresh' }}
      </button>
    </div>

    <div v-if="loadError" class="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-6 mb-6">
      <p>{{ loadError }}</p>
      <button @click="load" class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm">Retry</button>
    </div>

    <template v-else-if="data">
      <!-- KPI cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" :value="fmtEur(data.totals.revenue)" icon="CurrencyEuroIcon" color="green" />
        <StatsCard title="Tickets Sold" :value="String(data.totals.tickets)" icon="TicketIcon" color="blue" />
        <StatsCard
          title="Check-in Rate"
          :value="data.totals.checkinRate === null ? '—' : data.totals.checkinRate + '%'"
          icon="CheckCircleIcon"
          color="purple"
        />
        <StatsCard
          title="Understaffed (7d)"
          :value="String(data.staffing.understaffedShifts)"
          icon="ExclamationTriangleIcon"
          color="yellow"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue by event -->
        <div class="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 class="text-lg font-semibold mb-4">Revenue by Event</h2>
          <div v-if="data.eventsByRevenue.length === 0" class="text-center py-10 text-gray-500 text-sm">
            No ticket orders yet — revenue appears once Pretix webhooks flow in.
          </div>
          <div v-else class="space-y-3">
            <div v-for="(e, i) in data.eventsByRevenue" :key="e.eventId" class="flex items-center gap-4">
              <span class="font-mono text-xs text-gray-500 w-5">{{ i + 1 }}.</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate">{{ e.title || 'Event ' + shortId(e.eventId) }}</p>
                <div class="h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full" :style="{ width: barPct(e.revenue) }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ e.orders }} orders · {{ e.tickets }} tickets
                  <template v-if="e.checkedIn > 0"> · {{ e.checkedIn }} checked in</template>
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-green-400 font-semibold">{{ fmtEur(e.revenue) }}</p>
                <p v-if="e.checkinRate !== null" class="text-xs text-gray-500">{{ e.checkinRate }}% at door</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Staffing -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 class="text-lg font-semibold mb-4">Staffing — next 7 days</h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between"><span class="text-gray-400">Shifts scheduled</span><span class="font-semibold">{{ data.staffing.shiftsNextWeek }}</span></div>
              <div class="flex justify-between"><span class="text-gray-400">Assignments filled</span><span class="font-semibold">{{ data.staffing.assignmentsNextWeek }}</span></div>
              <div class="flex justify-between">
                <span class="text-gray-400">Understaffed</span>
                <span class="font-semibold" :class="data.staffing.understaffedShifts > 0 ? 'text-yellow-400' : 'text-green-400'">
                  {{ data.staffing.understaffedShifts }}
                </span>
              </div>
            </div>
            <NuxtLink to="/admin/schedule" class="block mt-4 text-xs text-red-400 hover:text-red-300">Open scheduler →</NuxtLink>
          </div>

          <!-- Inquiry pipeline -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 class="text-lg font-semibold mb-4">Inquiry Pipeline</h2>
            <div class="space-y-3 text-sm">
              <div v-for="st in PIPELINE" :key="st.key" class="flex items-center justify-between">
                <span class="flex items-center gap-2 text-gray-400">
                  <span class="w-2 h-2 rounded-full" :class="st.dot"></span>{{ st.label }}
                </span>
                <span class="font-semibold">{{ data.inquiryPipeline[st.key] || 0 }}</span>
              </div>
            </div>
            <NuxtLink to="/admin/crm" class="block mt-4 text-xs text-red-400 hover:text-red-300">Open CRM →</NuxtLink>
          </div>

          <!-- Upcoming RA events -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 class="text-lg font-semibold mb-4">Next RA Events</h2>
            <div v-if="data.upcomingRaEvents.length === 0" class="text-gray-500 text-sm">Nothing scheduled.</div>
            <ul v-else class="space-y-2 text-sm">
              <li v-for="ev in data.upcomingRaEvents.slice(0, 5)" :key="ev.ra_id" class="flex justify-between gap-3">
                <span class="truncate">{{ ev.title }}</span>
                <span class="text-gray-500 shrink-0">{{ fmtDate(ev.date) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StatsCard from '~/components/admin/StatsCard.vue'

interface Analytics {
  totals: { revenue: number; paidOrders: number; tickets: number; checkedIn: number; checkinRate: number | null }
  eventsByRevenue: Array<{ eventId: string; title: string; date: string; revenue: number; orders: number; tickets: number; checkedIn: number; checkinRate: number | null }>
  upcomingRaEvents: Array<{ ra_id: number; title: string; date: string }>
  staffing: { shiftsNextWeek: number; assignmentsNextWeek: number; understaffedShifts: number }
  inquiryPipeline: Record<string, number>
}

const data = ref<Analytics | null>(null)
const loading = ref(true)
const loadError = ref('')

const PIPELINE = [
  { key: 'new', label: 'New', dot: 'bg-red-400' },
  { key: 'contacted', label: 'Contacted', dot: 'bg-yellow-400' },
  { key: 'contracted', label: 'Contracted', dot: 'bg-blue-400' },
  { key: 'invoiced', label: 'Invoiced', dot: 'bg-green-400' }
]

const maxRevenue = computed(() =>
  Math.max(1, ...(data.value?.eventsByRevenue.map((e) => e.revenue) || [1]))
)

const barPct = (rev: number) => `${Math.max(3, Math.round((rev / maxRevenue.value) * 100))}%`
const shortId = (id: string) => id.slice(0, 8)
const fmtEur = (n: number) => new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const fmtDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    data.value = await $fetch<Analytics>('/api/admin/analytics')
  } catch (err: any) {
    console.error('Failed to load analytics:', err)
    loadError.value = err?.statusCode === 403 || err?.statusCode === 401
      ? 'Admin access required.'
      : 'Could not compute analytics right now.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

definePageMeta({ layout: 'admin' })
</script>