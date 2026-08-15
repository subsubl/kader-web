<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">

    <!-- ===== Hero ===== -->
    <section class="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80"
        alt="Kader events"
        class="absolute inset-0 w-full h-full object-cover opacity-35"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/60 to-transparent"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 pb-14 md:pb-18 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-4 text-kader-red font-semibold">Kader Grad Kodeljevo</p>
        <h1 class="text-5xl md:text-8xl font-black leading-[0.92] mb-5 uppercase">{{ t('events.pageTitle') }}</h1>
        <p class="text-lg md:text-xl max-w-2xl text-kader-cream/70">{{ t('events.pageDesc') }}</p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4">

      <!-- ===== Upcoming Events ===== -->
      <section class="py-16 md:py-20">
        <div class="flex items-end justify-between mb-10 flex-wrap gap-4 border-b border-kader-cream/10 pb-6">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-1">{{ t('events.upcoming') }}</p>
            <h2 class="text-3xl md:text-4xl font-black uppercase">{{ t('events.upcomingTitle') }}</h2>
          </div>
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener"
            class="text-xs text-kader-red hover:underline uppercase tracking-wider font-semibold"
          >RA Profile →</a>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20 text-kader-cream/30">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center">
          <p class="text-kader-cream/80 mb-4">{{ loadError }}</p>
          <button @click="loadEvents" class="px-6 py-2 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-xl font-bold text-sm uppercase tracking-wider transition-colors">
            {{ t('club.retry') }}
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="events.length === 0" class="bg-kader-red/5 border border-kader-red/20 rounded-2xl p-16 text-center text-kader-cream/50">
          <p class="text-lg mb-2">{{ t('events.noUpcoming', { filter: '' }) }}</p>
          <p class="text-sm">{{ t('club.newLineups') }}</p>
        </div>

        <!-- Events grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in events"
            :key="event.ra_id"
            @click="openModal(event)"
            class="bg-[#0e0404] border border-kader-red/20 hover:border-kader-red/60 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <!-- Flyer -->
            <div class="relative overflow-hidden aspect-[4/3]">
              <img
                :src="event.flyer_url || fallbackImage"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="onImageError"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <!-- Genre badge -->
              <div v-if="event.genres[0]" class="absolute top-4 left-4 px-3 py-1 bg-kader-red/90 text-white text-xs font-black uppercase tracking-widest rounded-full">
                {{ event.genres[0] }}
              </div>
              <!-- Date badge -->
              <div class="absolute bottom-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-kader-cream text-xs font-bold rounded-lg">
                {{ formatDate(event.date) }}
              </div>
              <!-- Free badge -->
              <div v-if="event.cost === 0 || event.ticket_provider === 'free'" class="absolute bottom-4 right-4 px-3 py-1 bg-emerald-900/80 border border-emerald-700 text-emerald-300 text-xs font-black rounded-lg">
                {{ t('events.freeEntry') }}
              </div>
              <div v-else-if="event.cost" class="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-kader-cream text-xs font-bold rounded-lg">
                {{ event.cost }} €
              </div>
            </div>

            <!-- Info -->
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-black text-white group-hover:text-kader-red transition-colors leading-tight mb-2">
                  {{ event.title }}
                </h3>
                <p v-if="event.artists.length" class="text-sm text-kader-cream/60 line-clamp-1">
                  {{ event.artists.join(', ') }}
                </p>
                <p v-if="event.start_time" class="text-xs text-kader-cream/40 mt-1">
                  {{ formatTime(event.start_time) }}{{ event.end_time ? ' – ' + formatTime(event.end_time) : '' }}
                </p>
              </div>
              <div class="mt-4 pt-4 border-t border-kader-cream/10 flex items-center justify-between">
                <span class="text-xs text-kader-red font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  {{ t('events.details') }}
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Past Events ===== -->
      <section v-if="pastEvents.length > 0" class="pb-20 md:pb-28">
        <div class="border-b border-kader-cream/10 pb-6 mb-8">
          <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-1">{{ t('events.archive') }}</p>
          <h2 class="text-3xl md:text-4xl font-black uppercase">{{ t('events.pastEvents') }}</h2>
        </div>

        <div v-if="pastLoading" class="flex items-center justify-center py-10 text-kader-cream/30">
          <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <div v-else class="border-t border-kader-cream/10 divide-y divide-kader-cream/10">
          <button
            v-for="event in pastEvents"
            :key="event.ra_id"
            @click="openModal(event)"
            class="w-full flex items-center justify-between gap-4 py-5 md:py-6 hover:text-kader-red transition-colors text-left group"
          >
            <div class="flex items-center space-x-4 min-w-0">
              <img
                :src="event.flyer_url || fallbackImage"
                :alt="event.title"
                class="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-kader-cream/10"
                @error="onImageError"
              >
              <div class="min-w-0">
                <p class="font-black truncate group-hover:text-kader-red transition-colors">{{ event.title }}</p>
                <p v-if="event.artists.length" class="text-xs text-kader-cream/50 truncate mt-0.5">{{ event.artists.join(', ') }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="font-mono text-sm text-kader-cream/40">{{ pastDateLabel(event.date) }}</span>
              <svg class="w-4 h-4 text-kader-cream/30 group-hover:text-kader-red group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </section>

    </div>

    <!-- ===== Event Modal ===== -->
    <Teleport to="body">
      <div
        v-if="selectedEvent"
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="bg-[#0e0404] border border-kader-red/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto relative">

          <!-- Close -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-20 bg-black/60 hover:bg-kader-red text-kader-cream w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-kader-cream/20 text-sm font-bold"
          >✕</button>

          <!-- Flyer -->
          <div class="relative w-full max-h-80 overflow-hidden bg-black flex items-center justify-center">
            <img
              :src="selectedEvent.flyer_url || fallbackImage"
              :alt="selectedEvent.title"
              class="w-full h-auto max-h-80 object-contain"
              @error="onImageError"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-[#0e0404] via-transparent to-transparent opacity-90"></div>
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8 space-y-5">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span
                  v-for="genre in selectedEvent.genres"
                  :key="genre"
                  class="px-3 py-1 bg-kader-red/20 border border-kader-red/40 text-kader-red rounded-full text-xs font-bold uppercase tracking-wider"
                >{{ genre }}</span>
                <span class="px-3 py-1 bg-kader-cream/10 text-kader-cream/60 rounded-full text-xs font-medium">
                  {{ formatDate(selectedEvent.date) }}
                </span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">{{ selectedEvent.title }}</h2>
              <p class="text-sm text-kader-cream/50 flex items-center gap-2">
                <span>Kader Grad Kodeljevo — Ulica Carla Benza 20, Ljubljana</span>
                <span v-if="selectedEvent.start_time">· {{ formatTime(selectedEvent.start_time) }}{{ selectedEvent.end_time ? ' – ' + formatTime(selectedEvent.end_time) : '' }}</span>
              </p>
            </div>

            <!-- Artists -->
            <div v-if="selectedEvent.artists.length > 0" class="bg-kader-cream/5 border border-kader-cream/10 p-4 rounded-2xl">
              <h4 class="text-xs font-bold text-kader-cream/40 uppercase tracking-wider mb-3">{{ t('events.featuringBy') }}</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="artist in selectedEvent.artists"
                  :key="artist"
                  class="px-3 py-1.5 bg-kader-cream/10 hover:bg-kader-red/20 text-kader-cream rounded-xl text-sm font-bold transition-colors"
                >{{ artist }}</span>
              </div>
            </div>

            <!-- Lineup text -->
            <div v-if="selectedEvent.lineup" class="bg-kader-cream/5 border border-kader-cream/10 p-4 rounded-2xl">
              <h4 class="text-xs font-bold text-kader-cream/40 uppercase tracking-wider mb-2">Lineup</h4>
              <div class="text-sm text-kader-cream/70 whitespace-pre-line leading-relaxed font-mono" v-html="cleanLineup(selectedEvent.lineup)"></div>
            </div>

            <!-- Pretix widget -->
            <div v-if="!isPastEvent(selectedEvent) && (selectedEvent.ticket_provider === 'pretix' || selectedEvent.pretix_event_url)" class="bg-kader-cream/5 border border-kader-cream/10 p-4 rounded-2xl">
              <h4 class="text-xs font-bold text-kader-cream/40 uppercase tracking-wider mb-3">Vstopnice</h4>
              <PretixWidget :event="selectedEvent.pretix_event_url || selectedEvent.ticket_url || ''" />
            </div>

            <!-- Ticket footer (upcoming) -->
            <div v-if="!isPastEvent(selectedEvent)" class="pt-4 border-t border-kader-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span class="text-xs text-kader-cream/40 block uppercase font-bold tracking-wider mb-1">Vstopnina</span>
                <span class="text-2xl font-black text-white">
                  {{ selectedEvent.cost === 0 || selectedEvent.ticket_provider === 'free' ? 'Prost vstop' : (selectedEvent.cost ? selectedEvent.cost + ' €' : 'Vstop prost') }}
                </span>
              </div>
              <div class="w-full sm:w-auto">
                <div v-if="selectedEvent.ticket_provider === 'free' || selectedEvent.cost === 0"
                  class="px-6 py-3 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-xl text-center text-sm">
                  Prost vstop
                </div>
                <a
                  v-else-if="selectedEvent.ticket_provider === 'olaii' || (selectedEvent.ticket_url && selectedEvent.ticket_url.includes('olaii'))"
                  :href="selectedEvent.ticket_url || 'https://olaii.com'"
                  target="_blank" rel="noopener"
                  class="w-full sm:w-auto px-8 py-3.5 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-white font-black rounded-xl text-center transition-all flex items-center justify-center text-sm uppercase tracking-wider"
                >Kupi na Olaii</a>
                <a
                  v-else
                  :href="selectedEvent.ticket_url || selectedEvent.pretix_event_url || selectedEvent.ra_url || 'https://kader.si'"
                  target="_blank" rel="noopener"
                  class="w-full sm:w-auto px-8 py-3.5 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-white font-black rounded-xl text-center transition-all flex items-center justify-center text-sm uppercase tracking-wider"
                >Kupi vstopnico</a>
              </div>
            </div>

            <!-- Past event footer -->
            <div v-else class="pt-4 border-t border-kader-cream/10 flex items-center justify-between">
              <span class="text-xs text-kader-cream/30 uppercase font-bold tracking-wider">Pretekli dogodek</span>
              <span class="px-4 py-2 bg-kader-cream/10 border border-kader-cream/10 text-kader-cream/40 text-xs font-bold rounded-xl">Zaključeno</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

const selectedEvent = ref<RaEvent | null>(null)

const isPastEvent = (event: RaEvent | null) => {
  if (!event) return false
  const time = new Date(event.end_time || event.date).getTime()
  return time < new Date().getTime()
}

const openModal = (event: RaEvent) => { selectedEvent.value = event }
const closeModal = () => { selectedEvent.value = null }

const handleKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadEvents()
  loadPastEvents()
})
onUnmounted(() => { window.removeEventListener('keydown', handleKeydown) })

const cleanLineup = (raw: string | null) => raw ? raw.replace(/<[^>]*>/g, '').trim() : ''

const events = ref<RaEvent[]>([])
const loading = ref(true)
const loadError = ref('')

const formatDate = (d: string) => new Date(d).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
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
    loadError.value = 'Dogodkov trenutno ni mogoče naložiti. Poskusite znova.'
  } finally {
    loading.value = false
  }
}

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

const pastDateLabel = (d: string) => new Date(d).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
})

function normalizeEvent(e: any): RaEvent {
  return {
    ...e,
    artists: Array.isArray(e.artists) ? e.artists : [],
    genres: Array.isArray(e.genres) ? e.genres : []
  }
}
</script>
