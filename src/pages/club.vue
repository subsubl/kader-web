<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Underground Club Experience</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">Immerse yourself in the sounds of modern music within the historic walls of Grad Kodeljevo castle.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 class="text-3xl font-bold mb-6">Klipsch La Scala AL6 Sound System</h2>
          <p class="text-lg mb-6">Our state-of-the-art audio system delivers crystal-clear sound throughout the castle grounds. The Klipsch La Scala AL6 — a premium, fully horn-loaded, three-way loudspeaker — provides an immersive sonic experience that perfectly complements the historic stone-vaulted setting.</p>
          
          <div class="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 class="text-xl font-bold mb-4">Technical Specifications</h3>
            <ul class="space-y-2">
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Product:</span>
                <span>Klipsch La Scala AL6</span>
              </li>
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Type:</span>
                <span>Three-way, fully horn-loaded floorstanding loudspeaker</span>
              </li>
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Mid-Range Horn:</span>
                <span>K-406M patented Tractrix® horn (2" throat)</span>
              </li>
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Coverage Tech:</span>
                <span>Mumps™ for flat response to the horn edge</span>
              </li>
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Bass:</span>
                <span>Horn-loaded, vented cabinet</span>
              </li>
              <li class="flex justify-between border-b border-gray-700 pb-2">
                <span>Optional DSP:</span>
                <span>Heritage Active Crossover (time/phase aligned, EQ)</span>
              </li>
              <li class="flex justify-between">
                <span>System Coverage:</span>
                <span>Full dance-floor dispersion, 150m² club vault</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">Sound Quality Features</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Horn-loaded efficiency: more acoustic power per watt, minimal distortion</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Crystal-clear highs with precise, present mid-range detail</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Deep, punchy bass response perfect for club beats</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Dynamic range suited to both intimate acoustic sets and high-energy dance tracks</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80" alt="Club Setup" class="rounded-xl shadow-2xl w-full h-96 object-cover">
          <div class="mt-6 bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">Why Our Sound System?</h3>
            <p class="mb-4">The Klipsch La Scala system was specifically chosen to complement the acoustics of our historic castle. Its design ensures that every corner of the venue receives balanced sound without any dead zones, making it ideal for both intimate performances and large-scale events.</p>
            <p>Our sound engineers work closely with artists to optimize the acoustic environment, ensuring that each performance delivers maximum impact while preserving the historical integrity of the space.</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8 mb-12">
        <h2 class="text-3xl font-bold mb-6 text-center">Upcoming Club Nights</h2>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-gray-700 rounded-lg p-10 text-center">
          <p class="text-gray-400 mb-4">{{ loadError }}</p>
          <button @click="loadClubEvents" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
            Retry
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="clubEvents.length === 0" class="bg-gray-700 rounded-lg p-10 text-center text-gray-400">
          <p class="mb-2">No club nights scheduled right now.</p>
          <p class="text-sm">Check back soon — new lineups are coming.</p>
        </div>

        <!-- Club events -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="event in clubEvents" :key="event.ra_id" class="bg-gray-900 rounded-lg overflow-hidden">
            <div class="relative">
              <img :src="event.flyer_url || fallbackImage" :alt="event.title" class="w-full h-40 object-cover" @error="onImageError">
              <div class="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">{{ event.genres[0] || 'Club' }}</div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300 mb-2">{{ formatDate(event.date) }}{{ event.start_time ? ' · ' + formatTime(event.start_time) : '' }}</p>
              <p v-if="event.artists.length" class="text-sm text-gray-400 mb-4">{{ event.artists.join(', ') }}</p>
              <a
                :href="event.ra_url || 'https://ra.co/clubs/78778'"
                target="_blank"
                rel="noopener"
                class="block w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-center transition-colors duration-300"
              >
                Get Tickets
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center bg-gray-800 rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-4">Book Your Private Event</h2>
        <p class="text-xl mb-6 max-w-2xl mx-auto">Transform your special occasion into an unforgettable experience in our historic castle venue.</p>
        <NuxtLink to="/buyouts" class="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-300">
          View Private Hire Options
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

interface ClubEvent {
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
}

const CATEGORY_LABELS: Record<string, string> = {
  club: 'Club',
  pizzeria: 'Pizzeria',
  live: 'Live Music',
  private: 'Private'
}

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'

const loading = ref(true)
const loadError = ref('')
const events = ref<ClubEvent[]>([])

// Only show club / live events for the club page
const clubEvents = computed(() =>
  events.value.filter((e) => {
    const genre = (e.genres[0] || '').toLowerCase()
    const title = (e.title || '').toLowerCase()
    return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
  })
)

const typeLabel = (type: string | null) => CATEGORY_LABELS[type || ''] || type || 'Event'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('sl-SI', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

const formatTime = (d: string) => new Date(d).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const loadClubEvents = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<ClubEvent[]>('/api/ra-events?scope=upcoming')
    events.value = (data || []).map((e: any) => ({
      ...e,
      artists: Array.isArray(e.artists) ? e.artists : [],
      genres: Array.isArray(e.genres) ? e.genres : []
    }))
  } catch (err: any) {
    console.error('Failed to load club events:', err)
    loadError.value = 'We couldn\u2019t load the club lineup right now.'
  } finally {
    loading.value = false
  }
}

onMounted(loadClubEvents)
</script>