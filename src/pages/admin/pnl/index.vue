<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <BanknotesIcon class="h-8 w-8 text-white" />
        <h1 class="text-2xl font-semibold text-white">Event P&L Reports</h1>
      </div>
      <button
        @click="openModal"
        class="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Generate New Report
      </button>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="report in reports"
        :key="report.id"
        class="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm flex flex-col"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-medium text-white">{{ report.event_label }}</h3>
            <p class="text-sm text-gray-400">{{ formatDate(report.event_date) }}</p>
          </div>
          <span
            :class="[
              report.status === 'final' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold'
            ]"
          >
            {{ report.status.charAt(0).toUpperCase() + report.status.slice(1) }}
          </span>
        </div>

        <div class="space-y-2 mb-4 flex-grow">
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Total Revenue:</span>
            <span class="text-green-400 font-medium">€{{ formatCurrency(getTotalRevenue(report)) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Total Cost:</span>
            <span class="text-red-400 font-medium">€{{ formatCurrency(getTotalCost(report)) }}</span>
          </div>
          <div class="flex justify-between text-sm border-t border-gray-700 pt-2 mt-2">
            <span class="text-gray-300 font-medium">Net Profit:</span>
            <span :class="['font-bold', getNetProfit(report) >= 0 ? 'text-green-500' : 'text-red-500']">
              €{{ formatCurrency(getNetProfit(report)) }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Profit Margin:</span>
            <span class="text-white">{{ getProfitMargin(report) }}%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Attendance:</span>
            <span class="text-white">{{ report.attendance }}</span>
          </div>
        </div>

        <div class="flex space-x-3 mt-auto pt-4 border-t border-gray-700">
          <a
            :href="`/api/admin/pnl-export?event_id=${report.event_id}`"
            target="_blank"
            class="flex-1 rounded-md bg-gray-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
          >
            Export CSV
          </a>
          <button
            v-if="report.status === 'draft'"
            @click="markAsFinal(report)"
            class="flex-1 rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Mark as Final
          </button>
        </div>
      </div>
    </div>

    <div v-if="reports.length === 0" class="text-center py-12">
      <p class="text-sm text-gray-400">No P&L reports found.</p>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 border border-gray-700">
            <div>
              <h3 class="text-lg font-semibold leading-6 text-white mb-4" id="modal-title">Generate P&L Report</h3>
              <form @submit.prevent="submitReport" class="space-y-4">
                
                <div>
                  <label class="block text-sm font-medium text-gray-300">Select Event</label>
                  <select v-model="form.event_id" required class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                    <option value="" disabled>Select an event...</option>
                    <option v-for="event in availableEvents" :key="event.id" :value="event.id">
                      {{ event.title }} ({{ formatDate(event.date) }})
                    </option>
                  </select>
                </div>

                <div class="flex items-center">
                  <input id="auto_prefill" v-model="form.auto_prefill" type="checkbox" class="h-4 w-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600 focus:ring-offset-gray-900">
                  <label for="auto_prefill" class="ml-2 block text-sm text-gray-300">Auto-Prefill from Pretix (Ticket Revenue, Promoter Cost, Attendance)</label>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-white border-b border-gray-700 pb-1">Revenue</h4>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Ticket Revenue</label>
                      <input v-model.number="form.ticket_revenue" type="number" step="0.01" :disabled="form.auto_prefill" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm disabled:opacity-50">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Bar Revenue</label>
                      <input v-model.number="form.bar_revenue" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Door Revenue</label>
                      <input v-model.number="form.door_revenue" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Other Revenue</label>
                      <input v-model.number="form.other_revenue" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                  </div>

                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-white border-b border-gray-700 pb-1">Costs</h4>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Staff Cost</label>
                      <input v-model.number="form.staff_cost" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Promoter Cost</label>
                      <input v-model.number="form.promoter_cost" type="number" step="0.01" :disabled="form.auto_prefill" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm disabled:opacity-50">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Artist Fee</label>
                      <input v-model.number="form.artist_fee" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Venue Cost</label>
                      <input v-model.number="form.venue_cost" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-400">Other Cost</label>
                      <input v-model.number="form.other_cost" type="number" step="0.01" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm">
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-400">Attendance</label>
                    <input v-model.number="form.attendance" type="number" :disabled="form.auto_prefill" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm disabled:opacity-50">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-400">Notes</label>
                  <textarea v-model="form.notes" rows="3" class="mt-1 block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm"></textarea>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="submit" :disabled="submitting" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:col-start-2 disabled:opacity-50">
                    {{ submitting ? 'Saving...' : 'Save Report' }}
                  </button>
                  <button type="button" @click="closeModal" class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:col-start-1 sm:mt-0">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BanknotesIcon } from '@heroicons/vue/24/outline'
import { useNuxtApp } from '#app'

definePageMeta({ layout: 'admin' })

const { $supabase } = useNuxtApp()

const reports = ref<any[]>([])
const availableEvents = ref<any[]>([])
const isModalOpen = ref(false)
const submitting = ref(false)

const form = ref({
  event_id: '',
  auto_prefill: true,
  ticket_revenue: 0,
  bar_revenue: 0,
  door_revenue: 0,
  other_revenue: 0,
  staff_cost: 0,
  promoter_cost: 0,
  artist_fee: 0,
  venue_cost: 0,
  other_cost: 0,
  attendance: 0,
  notes: ''
})

const fetchReports = async () => {
  const { data } = await $fetch<any>('/api/admin/pnl')
  // $fetch returns directly what api sends
  if (data) reports.value = data
  else reports.value = await $fetch<any>('/api/admin/pnl')
}

const fetchEvents = async () => {
  const { data } = await $supabase
    .from('events')
    .select('id, title, date')
    .order('date', { ascending: false })
  if (data) {
    availableEvents.value = data
  }
}

onMounted(async () => {
  await fetchReports()
  await fetchEvents()
})

const openModal = () => {
  form.value = {
    event_id: '',
    auto_prefill: true,
    ticket_revenue: 0,
    bar_revenue: 0,
    door_revenue: 0,
    other_revenue: 0,
    staff_cost: 0,
    promoter_cost: 0,
    artist_fee: 0,
    venue_cost: 0,
    other_cost: 0,
    attendance: 0,
    notes: ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitReport = async () => {
  if (!form.value.event_id) return
  submitting.value = true
  
  const selectedEvent = availableEvents.value.find(e => e.id === form.value.event_id)
  
  try {
    await $fetch('/api/admin/pnl', {
      method: 'POST',
      body: {
        ...form.value,
        event_label: selectedEvent?.title,
        event_date: selectedEvent?.date,
        status: 'draft'
      }
    })
    closeModal()
    await fetchReports()
  } catch (err) {
    console.error(err)
    alert('Failed to save report')
  } finally {
    submitting.value = false
  }
}

const markAsFinal = async (report: any) => {
  if (!confirm('Are you sure you want to mark this report as final?')) return
  try {
    await $fetch('/api/admin/pnl', {
      method: 'POST',
      body: {
        ...report,
        status: 'final'
      }
    })
    await fetchReports()
  } catch (err) {
    console.error(err)
    alert('Failed to update status')
  }
}

// Helpers
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (val: number) => {
  return Number(val).toFixed(2)
}

const getTotalRevenue = (report: any) => {
  return (Number(report.ticket_revenue) || 0) +
         (Number(report.bar_revenue) || 0) +
         (Number(report.door_revenue) || 0) +
         (Number(report.other_revenue) || 0)
}

const getTotalCost = (report: any) => {
  return (Number(report.staff_cost) || 0) +
         (Number(report.promoter_cost) || 0) +
         (Number(report.artist_fee) || 0) +
         (Number(report.venue_cost) || 0) +
         (Number(report.other_cost) || 0)
}

const getNetProfit = (report: any) => {
  return getTotalRevenue(report) - getTotalCost(report)
}

const getProfitMargin = (report: any) => {
  const rev = getTotalRevenue(report)
  if (rev === 0) return 0
  const profit = getNetProfit(report)
  return ((profit / rev) * 100).toFixed(1)
}
</script>
