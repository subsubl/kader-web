<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="flex items-center gap-3 text-white">
        <MegaphoneIcon class="h-8 w-8 text-red-600" />
        <h1 class="text-2xl font-bold">Promoter Performance & Commissions</h1>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <button
          @click="refreshData"
          class="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700"
        >
          Refresh
        </button>
        <button
          @click="exportCsv"
          class="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="bg-gray-900 shadow-sm ring-1 ring-gray-700 sm:rounded-lg overflow-hidden mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-700">
        <h3 class="text-base font-semibold leading-6 text-white">Leaderboard</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Rank</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Name</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Total Guests</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Verified Check-ins</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Check-in Rate %</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Earned Commission</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700 bg-gray-900">
            <tr v-if="pendingPromoters" class="text-center">
              <td colspan="8" class="py-4 text-sm text-gray-400">Loading...</td>
            </tr>
            <tr v-else-if="!promoters?.length" class="text-center">
              <td colspan="8" class="py-4 text-sm text-gray-400">No promoters found</td>
            </tr>
            <tr v-for="(promoter, index) in promoters" :key="promoter.promoter_id" class="hover:bg-gray-800">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                #{{ index + 1 }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ promoter.name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{{ promoter.email }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ promoter.total_guests }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ promoter.checked_in }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ promoter.checkin_rate }}%</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm font-semibold text-green-400">€{{ promoter.commission.toFixed(2) }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  @click="generatePayout(promoter)"
                  :disabled="generating === promoter.promoter_id || promoter.commission === 0"
                  class="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Payout
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payout History -->
    <div class="bg-gray-900 shadow-sm ring-1 ring-gray-700 sm:rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-700">
        <h3 class="text-base font-semibold leading-6 text-white">Payout History</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Date</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Promoter</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Check-ins</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Total Payout</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700 bg-gray-900">
            <tr v-if="pendingPayouts" class="text-center">
              <td colspan="5" class="py-4 text-sm text-gray-400">Loading...</td>
            </tr>
            <tr v-else-if="!payouts?.length" class="text-center">
              <td colspan="5" class="py-4 text-sm text-gray-400">No payouts found</td>
            </tr>
            <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-gray-800">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-6">
                {{ new Date(payout.created_at).toLocaleDateString() }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-white font-medium">{{ payout.promoter_name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ payout.verified_checkins }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm font-semibold text-green-400">€{{ payout.total_payout.toFixed(2) }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="{
                    'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20': payout.status === 'pending',
                    'bg-blue-400/10 text-blue-400 ring-blue-400/20': payout.status === 'approved',
                    'bg-green-400/10 text-green-400 ring-green-400/20': payout.status === 'paid'
                  }"
                >
                  {{ payout.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MegaphoneIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const { $supabase } = useNuxtApp()

const { data: promoters, pending: pendingPromoters, refresh: refreshPromoters } = await useFetch<any[]>('/api/admin/promoters')

const { data: payouts, pending: pendingPayouts, refresh: refreshPayouts } = await useAsyncData('promoter_payouts', async () => {
  const { data, error } = await $supabase
    .from('promoter_payouts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
})

const refreshData = async () => {
  await Promise.all([refreshPromoters(), refreshPayouts()])
}

const generating = ref<string | null>(null)

const generatePayout = async (promoter: any) => {
  try {
    generating.value = promoter.promoter_id
    
    const rate = promoter.checked_in > 0 ? promoter.commission / promoter.checked_in : 2.0
    
    await $fetch('/api/admin/promoters-payout', {
      method: 'POST',
      body: {
        promoter_id: promoter.promoter_id,
        promoter_name: promoter.name,
        verified_checkins: promoter.checked_in,
        commission_rate: rate,
        total_payout: promoter.commission,
      }
    })
    
    // Using simple browser alert/toast replacement for visual feedback as specified
    alert('Payout generated successfully!')
    await refreshData()
  } catch (error) {
    console.error(error)
    alert('Failed to generate payout')
  } finally {
    generating.value = null
  }
}

const exportCsv = () => {
  if (!promoters.value || promoters.value.length === 0) return
  
  const headers = ['Rank', 'Name', 'Email', 'Total Guests', 'Verified Check-ins', 'Check-in Rate %', 'Earned Commission']
  
  const csvContent = [
    headers.join(','),
    ...promoters.value.map((p, i) => [
      i + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email}"`,
      p.total_guests,
      p.checked_in,
      p.checkin_rate,
      p.commission
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `promoter_performance_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
