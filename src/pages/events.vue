<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('events.pageTitle') }}</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">{{ t('events.pageDesc') }}</p>
      </header>

      <!-- Upcoming events -->
      <div class="mb-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">{{ t('events.upcoming') }}</h2>
            <p class="text-gray-300">{{ t('events.syncedFromRA') }}</p>
          </div>
          <div class="flex gap-2">
            <button 
              v-for="f in typeFilters" 
              :key="f.value"
              @click="activeFilter = f.value"
              :class="activeFilter === f.value
                ? 'px-4 py-2 bg-red-600 text-white rounded-lg transition-colors duration-300'
                : 'px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300'"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="loadError" class="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-8 text-center">
          <p class="mb-2">{{ loadError }}</p>
          <button @click="loadEvents" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Retry
          </button>
        </div>

        <!-- Loading state -->
        <div v-else-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredEvents.length === 0" class="bg-gray-800/50 border border-gray-700 rounded-xl p-16 text-center text-gray-500">
          <p class="text-lg mb-2">{{ emptyMessage }}</p>
          <p class="text-sm">{{ t('events.newEventsSync') }}</p>
          <button v-if="activeFilter !== 'all'" @click="activeFilter = 'all'" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
            {{ t('events.viewAll') }}
          </button>
        </div>

        <!-- Events grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="event in filteredEvents" :key="event.ra_id" class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <div class="relative">
              <img 
                :src="event.flyer_url || fallbackImage" 
                :alt="event.title" 
                class="w-full h-48 object-cover"
                @error="onImageError"
              >
              <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ event.genres[0] || 'Club' }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300 mb-2">{{ formatDate(event.date) }} {{ event.start_time ? '· ' + formatTime(event.start_time) : '' }}</p>
              <p v-if="event.artists.length" class="text-sm text-gray-400 mb-4">{{ t('events.featuringBy') }}{{ event.artists.join(', ') }}</p>
              <div v-if="event.pretix_event_url" class="mt-4">
                <PretixWidget :event="event.pretix_event_url" />
              </div>
              <a 
                v-else
                :href="event.ra_url || 'https://ra.co/clubs/78778'" 
                target="_blank" 
                rel="noopener"
                class="inline-block w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-center transition-colors duration-300"
              >
                {{ t('events.viewOnRA') }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Past events archive -->
      <div v-if="pastEvents.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ t('events.pastEvents') }}</h2>
        <div v-if="pastLoading" class="flex items-center justify-center py-10 text-gray-400">
          <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>
        <div v-else class="bg-gray-800/60 rounded-xl border border-gray-700 divide-y divide-gray-700">
          <button 
            v-for="event in pastEvents" 
            :key="event.ra_id"
            @click="openRa(event.ra_url)"
            class="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-700/50 transition-colors text-left"
          >
            <div class="min-w-0">
              <p class="font-medium truncate">{{ event.title }}</p>
              <p v-if="event.artists.length" class="text-sm text-gray-400 truncate">{{ event.artists.join(', ') }}</p>
            </div>
            <span class="text-sm text-gray-400 shrink-0">{{ pastDateLabel(event.date) }}</span>
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('events.ticketsTitle') }}</h2>
        <p class="text-xl mb-2 max-w-2xl mx-auto">{{ t('events.buyHere') }}</p>
        <p class="text-gray-400 mb-6 max-w-2xl mx-auto">{{ t('events.alsoRA') }}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener"
            class="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300"
          >
            {{ t('events.raPage') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { locale, t } = useLocale()

interface RaEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  cost: number | null
  flyer_url: string | null
  ra_url: string | null
  lineup: string | null
  artists: string[]
  genres: string[]
  pretix_event_url: string | null
}

const typeFilters = computed(() => [
  { label: t('events.allEvents'), value: 'all' },
  { label: t('events.filterPizzeria'), value: 'pizzeria' },
  { label: t('events.filterClub'), value: 'club' },
  { label: t('events.filterLive'), value: 'live' }
])

// map filter value → translation key suffix for the empty-state message
const activeFilterLabelsKey = (f: string) => (f === 'all' ? 'allEvents' : f === 'pizzeria' ? 'filterPizzeria' : f === 'club' ? 'filterClub' : 'filterLive')

const emptyMessage = computed(() => {
  if (activeFilter.value === 'all') return t('events.noUpcoming', { filter: '' })
  return t('events.noUpcoming', { filter: ` — ${t('events.' + activeFilterLabelsKey(activeFilter.value))}` })
})

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const openRa = (url: string | null) => {
  window.open(url || 'https://ra.co/clubs/78778', '_blank', 'noopener')
}

// Upcoming events (loaded from /api/ra-events?scope=upcoming)
const events = ref<RaEvent[]>([])
const activeFilter = ref('all')
const loading = ref(true)
const loadError = ref('')

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') return events.value
  // RA genres aren't strongly typed, so filter by genre name or title matching
  return events.value.filter((e) => {
    const genre = (e.genres[0] || '').toLowerCase()
    const title = (e.title || '').toLowerCase()
    if (activeFilter.value === 'club') return genre.includes('house') || genre.includes('techno') || genre.includes('club') || genre.includes('electronica')
    if (activeFilter.value === 'live') return genre.includes('live') || genre.includes('jazz') || genre.includes('music')
    if (activeFilter.value === 'pizzeria') return title.includes('pizza') || title.includes('dining') || genre.includes('pizzeria')
    return true
  })
})

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' }) : ''

const loadEvents = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<RaEvent[]>('/api/ra-events?scope=upcoming')
    events.value = (data || []).map(normalizeEvent)
  } catch (err: any) {
    console.error('Failed to load RA events:', err)
    loadError.value = 'We couldn\u2019t load events right now. Please try again.'
  } finally {
    loading.value = false
  }
}

// Past events archive
const pastEvents = ref<RaEvent[]>([])
const pastLoading = ref(true)

const loadPastEvents = async () => {
  try {
    const data = await $fetch<RaEvent[]>('/api/ra-events?scope=past')
    pastEvents.value = (data || []).map(normalizeEvent)
  } catch (err: any) {
    console.error('Failed to load past RA events:', err)
  } finally {
    pastLoading.value = false
  }
}

const pastDateLabel = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// Normalize API rows to guarantee array fields
function normalizeEvent(e: any): RaEvent {
  return {
    ...e,
    artists: Array.isArray(e.artists) ? e.artists : [],
    genres: Array.isArray(e.genres) ? e.genres : []
  }
}

onMounted(() => {
  loadEvents()
  loadPastEvents()
})
</script>
