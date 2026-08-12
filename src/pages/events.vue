<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('events.pageTitle') }}</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">{{ t('events.pageDesc') }}</p>
      </header>

      <!-- Upcoming & Featured Events -->
      <div class="mb-12">
        <div class="mb-8 border-b border-gray-800 pb-4">
          <h2 class="text-3xl font-bold tracking-tight text-white">{{ t('events.upcoming') }}</h2>
        </div>

        <!-- Error state -->
        <div v-if="loadError" class="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-8 text-center">
          <p class="mb-2">{{ loadError }}</p>
          <button @click="loadEvents" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Poskusi znova
          </button>
        </div>

        <!-- Loading state -->
        <div v-else-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Empty state -->
        <div v-else-if="events.length === 0" class="bg-gray-800/50 border border-gray-700 rounded-xl p-16 text-center text-gray-500">
          <p class="text-lg mb-2">{{ t('events.noUpcoming', { filter: '' }) }}</p>
        </div>

        <!-- Events grid (Clickable Cards) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="event in events" 
            :key="event.ra_id" 
            @click="openModal(event)"
            class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-red-600/60 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div class="relative overflow-hidden aspect-[16/10]">
                <img 
                  :src="event.flyer_url || fallbackImage" 
                  :alt="event.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="onImageError"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {{ event.genres[0] || 'Club' }}
                </div>
                <div class="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <span class="text-xs font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-gray-200">
                    {{ formatDate(event.date) }}
                  </span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors leading-snug">
                  {{ event.title }}
                </h3>
                <p class="text-xs text-gray-400 mb-3 flex items-center">
                  <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  {{ event.start_time ? formatTime(event.start_time) : 'Kader Grad Kodeljevo' }}
                  {{ event.end_time ? ' – ' + formatTime(event.end_time) : '' }}
                </p>
                <p v-if="event.artists.length" class="text-sm text-gray-300 line-clamp-2 mb-4">
                  <span class="text-gray-400 font-semibold">{{ t('events.featuringBy') }}</span> {{ event.artists.join(', ') }}
                </p>
              </div>
            </div>

            <div class="px-6 pb-6 pt-0">
              <div class="flex items-center justify-between pt-4 border-t border-gray-700/60 text-xs font-medium">
                <span class="text-red-400 flex items-center group-hover:translate-x-1 transition-transform">
                  Podrobnosti & vstopnice
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </span>
                <span 
                  v-if="event.cost === 0 || event.ticket_provider === 'free'" 
                  class="text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-md font-semibold"
                >
                  Prost vstop
                </span>
                <span v-else-if="event.cost" class="text-gray-300 bg-gray-700/60 px-2.5 py-1 rounded-md">
                  {{ event.cost }} €
                </span>
              </div>
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
        <div v-else class="bg-gray-800/60 rounded-xl border border-gray-700 divide-y divide-gray-700 overflow-hidden">
          <button 
            v-for="event in pastEvents" 
            :key="event.ra_id"
            @click="openModal(event)"
            class="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-700/60 transition-colors text-left group"
          >
            <div class="min-w-0 flex items-center space-x-4">
              <img 
                :src="event.flyer_url || fallbackImage" 
                :alt="event.title"
                class="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-700"
                @error="onImageError"
              />
              <div class="min-w-0">
                <p class="font-bold truncate group-hover:text-red-400 transition-colors">{{ event.title }}</p>
                <p v-if="event.artists.length" class="text-xs text-gray-400 truncate">{{ event.artists.join(', ') }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 shrink-0 text-sm text-gray-400">
              <span>{{ pastDateLabel(event.date) }}</span>
              <svg class="w-4 h-4 text-gray-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- EVENT DETAILS MODAL (FULL DETAILS) -->
    <Teleport to="body">
      <div 
        v-if="selectedEvent" 
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto relative">
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-gray-700 text-sm"
          >
            ✕
          </button>

          <!-- Modal Flyer Header -->
          <div class="relative w-full max-h-96 overflow-hidden bg-black flex items-center justify-center">
            <img 
              :src="selectedEvent.flyer_url || fallbackImage" 
              :alt="selectedEvent.title" 
              class="w-full h-auto max-h-96 object-contain"
              @error="onImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 md:p-8 space-y-6">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span 
                  v-for="genre in selectedEvent.genres" 
                  :key="genre" 
                  class="px-3 py-1 bg-red-950/80 border border-red-800/80 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  {{ genre }}
                </span>
                <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                  {{ formatDate(selectedEvent.date) }}
                </span>
              </div>
              
              <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {{ selectedEvent.title }}
              </h2>
              
              <p class="text-sm text-gray-400 flex items-center space-x-2">
                <span>Kader Grad Kodeljevo (Ulica Carla Benza 20, Ljubljana)</span>
                <span v-if="selectedEvent.start_time">• {{ formatTime(selectedEvent.start_time) }} {{ selectedEvent.end_time ? '– ' + formatTime(selectedEvent.end_time) : '' }}</span>
              </p>
            </div>

            <!-- Artists List -->
            <div v-if="selectedEvent.artists.length > 0" class="bg-gray-800/60 p-4 rounded-xl border border-gray-800">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Nastopajoči</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="artist in selectedEvent.artists" 
                  :key="artist"
                  class="px-3 py-1.5 bg-gray-700/80 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {{ artist }}
                </span>
              </div>
            </div>

            <!-- Raw Lineup Text -->
            <div v-if="selectedEvent.lineup" class="bg-gray-800/40 p-4 rounded-xl border border-gray-800">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Spored</h4>
              <div class="text-sm text-gray-300 whitespace-pre-line leading-relaxed font-mono" v-html="cleanLineup(selectedEvent.lineup)"></div>
            </div>

            <!-- Embedded Pretix Checkout Widget (Upcoming events only) -->
            <div v-if="!isPastEvent(selectedEvent) && (selectedEvent.ticket_provider === 'pretix' || selectedEvent.pretix_event_url)" class="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Nakup vstopnic</h4>
              <PretixWidget :event="selectedEvent.pretix_event_url || selectedEvent.ticket_url || ''" />
            </div>

            <!-- Ticket & Price Action Footer (Upcoming events only) -->
            <div v-if="!isPastEvent(selectedEvent)" class="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span class="text-xs text-gray-400 block uppercase font-medium">Vstopnina</span>
                <span class="text-xl font-bold text-white">
                  {{ selectedEvent.cost === 0 || selectedEvent.ticket_provider === 'free' ? 'Prost vstop' : (selectedEvent.cost ? selectedEvent.cost + ' €' : 'Vstop prost') }}
                </span>
              </div>

              <div class="w-full sm:w-auto">
                <div v-if="selectedEvent.ticket_provider === 'free' || selectedEvent.cost === 0" class="px-6 py-3 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-xl text-center text-sm">
                  Prost vstop
                </div>
                <a 
                  v-else-if="selectedEvent.ticket_provider === 'olaii' || (selectedEvent.ticket_url && selectedEvent.ticket_url.includes('olaii'))"
                  :href="selectedEvent.ticket_url || 'https://olaii.com'"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center transition-colors shadow-lg shadow-red-950 flex items-center justify-center"
                >
                  Kupi na Olaii
                </a>
                <a 
                  v-else
                  :href="selectedEvent.ticket_url || selectedEvent.pretix_event_url || selectedEvent.ra_url || 'https://kader.si'"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center transition-colors shadow-lg shadow-red-950 flex items-center justify-center"
                >
                  Kupi vstopnico
                </a>
              </div>
            </div>

            <!-- Past Event Concluded Banner -->
            <div v-else class="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span class="text-xs text-gray-500 uppercase font-semibold">Pretekli dogodek</span>
              <span class="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs font-semibold rounded-xl">
                Zaključeno
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
  ticket_provider?: string | null
  ticket_url?: string | null
}

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

// Modal State
const selectedEvent = ref<RaEvent | null>(null)

const isPastEvent = (event: RaEvent | null) => {
  if (!event) return false
  const time = new Date(event.end_time || event.date).getTime()
  return time < new Date().getTime()
}

const openModal = (event: RaEvent) => {
  selectedEvent.value = event
}

const closeModal = () => {
  selectedEvent.value = null
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadEvents()
  loadPastEvents()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const cleanLineup = (raw: string | null) => {
  if (!raw) return ''
  return raw.replace(/<[^>]*>/g, '').trim()
}

// Upcoming events
const events = ref<RaEvent[]>([])
const loading = ref(true)
const loadError = ref('')

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
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

const pastDateLabel = (d: string) => new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' })

function normalizeEvent(e: any): RaEvent {
  return {
    ...e,
    artists: Array.isArray(e.artists) ? e.artists : [],
    genres: Array.isArray(e.genres) ? e.genres : []
  }
}
</script>
