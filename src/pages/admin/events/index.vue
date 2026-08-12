<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Upravljanje dogodkov</h1>
        <p class="text-gray-400 mt-1 text-sm">Dodajte nove dogodke ali urejajte obstoječe za prikaz na kader.si/events</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="syncRa" 
          :disabled="syncing"
          class="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
        >
          {{ syncing ? 'Sinhronizacija...' : 'Osveži RA dogodke' }}
        </button>
        <NuxtLink to="/admin/events/new" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-950 text-sm">
          + Nov dogodek
        </NuxtLink>
      </div>
    </div>

    <!-- Feedback alert -->
    <div v-if="alertMsg" class="mb-6 px-4 py-3 bg-emerald-900/50 border border-emerald-700 text-emerald-300 rounded-xl text-sm font-semibold">
      {{ alertMsg }}
    </div>

    <!-- Events Table -->
    <div class="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
        <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
      </div>

      <div v-else-if="events.length === 0" class="text-center py-16 text-gray-500">
        Trenutno ni vnesenih dogodkov. <NuxtLink to="/admin/events/new" class="text-red-400 font-bold hover:underline">Dodaj prvega</NuxtLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-black/60 border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th class="px-6 py-4 font-bold">Dogodek</th>
              <th class="px-6 py-4 font-bold">Datum</th>
              <th class="px-6 py-4 font-bold">Žanri</th>
              <th class="px-6 py-4 font-bold">Vir</th>
              <th class="px-6 py-4 font-bold text-right">Akcije</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/80 text-sm">
            <tr v-for="event in events" :key="event.ra_id" class="hover:bg-gray-800/40 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img 
                    :src="event.flyer_url || fallbackImage" 
                    :alt="event.title"
                    class="w-12 h-12 rounded-lg object-cover border border-gray-800 shrink-0"
                    @error="onImgErr"
                  />
                  <div>
                    <p class="font-bold text-white leading-tight">{{ event.title }}</p>
                    <p v-if="event.artists && event.artists.length" class="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {{ event.artists.join(', ') }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-300 whitespace-nowrap font-medium">
                {{ formatDate(event.date) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="g in (event.genres || []).slice(0, 2)" 
                    :key="g" 
                    class="px-2 py-0.5 bg-gray-800 text-red-400 text-xs font-semibold rounded-md border border-gray-700"
                  >
                    {{ g }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="event.is_custom ? 'bg-purple-950/80 text-purple-400 border-purple-800/80' : 'bg-blue-950/80 text-blue-400 border-blue-800/80'" 
                  class="px-2.5 py-1 text-xs font-bold rounded-full border"
                >
                  {{ event.is_custom ? 'Ročni vnos' : 'Resident Advisor' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <NuxtLink :to="`/admin/events/${event.ra_id}`" class="text-xs font-bold text-red-400 hover:text-red-300 mr-4">
                  Uredi
                </NuxtLink>
                <button 
                  v-if="event.is_custom"
                  @click="removeEvent(event.ra_id)" 
                  class="text-xs font-bold text-red-500 hover:text-red-400"
                >
                  Izbriši
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface EventRecord {
  ra_id: number
  title: string
  date: string
  flyer_url: string | null
  artists: string[]
  genres: string[]
  is_custom?: boolean
}

const events = ref<EventRecord[]>([])
const loading = ref(true)
const syncing = ref(false)
const alertMsg = ref('')

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const onImgErr = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const loadEvents = async () => {
  loading.value = true
  try {
    const data = await $fetch<EventRecord[]>('/api/ra-events?scope=all')
    events.value = data || []
  } catch (err: any) {
    console.error('Failed to load events:', err)
  } finally {
    loading.value = false
  }
}

const syncRa = async () => {
  syncing.value = true
  alertMsg.value = ''
  try {
    await $fetch('/api/admin/sync-ra', { method: 'POST' })
    alertMsg.value = 'Resident Advisor dogodki uspešno osveženi!'
    await loadEvents()
  } catch (err: any) {
    alertMsg.value = 'Napaka pri osveževanju RA dogodkov.'
  } finally {
    syncing.value = false
  }
}

const removeEvent = async (id: number) => {
  if (!confirm('Ali ste prepričani, da želite izbrisati ta dogodek?')) return
  try {
    await $fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
    alertMsg.value = 'Dogodek uspešno izbrisan!'
    await loadEvents()
  } catch (err: any) {
    alertMsg.value = 'Napaka pri brisanju dogodka.'
  }
}

onMounted(loadEvents)
</script>