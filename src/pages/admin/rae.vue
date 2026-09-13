<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Resident Advisor Events</h1>
        <p class="text-gray-400 mt-1">Synced from ra.co/clubs/78778 — map each event's on-page ticket widget (Pretix)</p>
      </div>
      <button
        @click="syncNow"
        :disabled="syncing"
        class="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-wait rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <svg v-if="syncing" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        {{ syncing ? 'Syncing...' : 'Sync from RA now' }}
      </button>
    </div>

    <div v-if="syncMessage" class="mb-6 px-4 py-3 rounded-lg text-sm" :class="syncError ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-green-900/40 border border-green-700 text-green-300'">
      {{ syncMessage }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
      <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
    </div>

    <!-- Table -->
    <div v-else class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <table class="w-full">
        <thead class="bg-gray-900">
          <tr class="text-left text-sm text-gray-400">
            <th class="px-6 py-3 font-medium">Event</th>
            <th class="px-6 py-3 font-medium">Date</th>
            <th class="px-6 py-3 font-medium">Artists</th>
            <th class="px-6 py-3 font-medium">Pretix Widget URL</th>
            <th class="px-6 py-3 font-medium text-right">RA Link</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="event in events" :key="event.ra_id" class="hover:bg-gray-700/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img v-if="event.flyer_url" :src="event.flyer_url" :alt="event.title" class="w-12 h-12 rounded-lg object-cover" @error="(e:any)=>e.target.style.display='none'">
                <div v-else class="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500">🎫</div>
                <span class="font-medium">{{ event.title }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm">{{ formatDate(event.date) }}</td>
            <td class="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{{ event.artists?.join(', ') || '—' }}</td>
            <td class="px-6 py-4">
              <form @submit.prevent="savePretix(event)" class="flex gap-2">
                <input
                  v-model="event.pretix_event_url"
                  type="text"
                  :placeholder="pretixExample"
                  class="w-56 px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  :disabled="savingPretixFor === event.ra_id"
                  class="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded font-medium transition-colors shrink-0"
                >
                  {{ savingPretixFor === event.ra_id ? '...' : 'Save' }}
                </button>
              </form>
            </td>
            <td class="px-6 py-4 text-right">
              <a :href="event.ra_url || '#'" target="_blank" rel="noopener" class="text-red-400 hover:text-red-300 text-sm">Open →</a>
            </td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="5" class="px-6 py-16 text-center text-gray-500">No synced events yet. Click "Sync from RA now".</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

interface RaEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  artists: string[] | null
  genres: string[] | null
  flyer_url: string | null
  ra_url: string | null
  pretix_event_url: string | null
}

const events = ref<RaEvent[]>([])
const loading = ref(false)
const syncing = ref(false)
const syncMessage = ref('')
const syncError = ref(false)
const savingPretixFor = ref<number | null>(null)

const pretixExample = 'https://pretix.eu/<org>/<event>/'

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' })

const loadEvents = async () => {
  loading.value = true
  try {
    const data = (await $fetch('/api/ra-events?scope=all')) as RaEvent[]
    events.value = data || []
  } catch (err: any) {
    console.error('Failed to load RA events:', err)
  } finally {
    loading.value = false
  }
}

const syncNow = async () => {
  syncing.value = true
  syncError.value = false
  syncMessage.value = ''
  try {
    const res = (await $fetch('/api/admin/sync-ra', { method: 'POST' })) as { ok: boolean; synced: number }
    syncMessage.value = `Synced ${res.synced} events from Resident Advisor.`
    await loadEvents()
  } catch (err: any) {
    syncError.value = true
    syncMessage.value = err?.data?.statusMessage || 'Sync failed.'
  } finally {
    syncing.value = false
  }
}

const savePretix = async (event: RaEvent) => {
  savingPretixFor.value = event.ra_id
  syncError.value = false
  syncMessage.value = ''
  try {
    const res = (await $fetch('/api/admin/ra-events', {
      method: 'PUT',
      body: { ra_id: event.ra_id, pretix_event_url: event.pretix_event_url || '' }
    })) as { ok: boolean; pretix_event_url: string | null }
    if (res.ok) {
      event.pretix_event_url = res.pretix_event_url
      syncMessage.value = 'Pretix widget URL saved.'
    }
  } catch (err: any) {
    syncError.value = true
    syncMessage.value = err?.data?.statusMessage || 'Failed to save.'
  } finally {
    savingPretixFor.value = null
  }
}

onMounted(loadEvents)
</script>