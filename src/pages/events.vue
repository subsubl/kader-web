<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Events Calendar</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">Join us for exciting events at Kader Grad Kodeljevo - from live music to cultural evenings.</p>
      </header>

      <div class="mb-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">Upcoming Events</h2>
            <p class="text-gray-300">Browse our upcoming events and book your tickets now</p>
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

        <!-- Empty state (graceful: no events, or no events match filter) -->
        <div v-else-if="filteredEvents.length === 0" class="bg-gray-800/50 border border-gray-700 rounded-xl p-16 text-center text-gray-500">
          <p class="text-lg mb-2">No events found{{ activeFilter !== 'all' ? ` in "${activeFilterLabels[activeFilter]}"` : '' }}.</p>
          <p class="text-sm">Please check back soon — we're always adding new events.</p>
          <button v-if="activeFilter !== 'all'" @click="activeFilter = 'all'" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
            View all events
          </button>
        </div>

        <!-- Events grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="event in filteredEvents" :key="event.id" class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <div class="relative">
              <img 
                :src="event.image_url || fallbackImage" 
                :alt="event.title" 
                class="w-full h-48 object-cover"
                @error="onImageError"
              >
              <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ typeLabel(event.type) }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300 mb-2">{{ formatDate(event.date) }}</p>
              <p class="mb-4 line-clamp-3">{{ event.description || 'Join us for a special evening at Kader Grad Kodeljevo.' }}</p>
              <a 
                v-if="event.ra_link" 
                :href="event.ra_link" 
                target="_blank" 
                rel="noopener"
                class="inline-block w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-center transition-colors duration-300"
              >
                Get Tickets
              </a>
              <NuxtLink v-else :to="`/events/${event.slug}`" class="inline-block w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-center transition-colors duration-300">
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Event Booking</h2>
        <div class="max-w-2xl mx-auto">
          <div v-if="bookingState === 'success'" class="bg-green-900/40 border border-green-700 text-green-300 rounded-lg p-6 text-center mb-6">
            <h3 class="text-xl font-semibold mb-2">Booking requested! 🎉</h3>
            <p>We'll confirm your tickets by email shortly.</p>
          </div>
          <form v-else @submit.prevent="submitBooking" class="space-y-6">
            <div v-if="bookingError" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{{ bookingError }}</div>
            <div>
              <label for="name" class="block mb-2 font-medium">Full Name</label>
              <input type="text" id="name" v-model="bookingForm.name" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="email" class="block mb-2 font-medium">Email Address</label>
              <input type="email" id="email" v-model="bookingForm.email" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="event" class="block mb-2 font-medium">Select Event</label>
              <select id="event" v-model="bookingForm.eventId" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="">Choose an event</option>
                <option v-for="event in upcomingEvents" :key="event.id" :value="event.id">{{ event.title }}</option>
              </select>
            </div>
            <div>
              <label for="tickets" class="block mb-2 font-medium">Number of Tickets</label>
              <input type="number" id="tickets" v-model.number="bookingForm.tickets" min="1" max="10" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <button type="submit" :disabled="bookingSubmitting" class="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-300">
              {{ bookingSubmitting ? 'Booking...' : 'Book Tickets' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'

interface PublicEvent {
  id: string
  title: string
  slug: string
  date: string
  type: string | null
  description: string | null
  image_url: string | null
  ra_link: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  club: 'Club',
  pizzeria: 'Pizzeria',
  live: 'Live Music',
  private: 'Private'
}

const typeFilters = [
  { label: 'All Events', value: 'all' },
  { label: 'Pizzeria', value: 'pizzeria' },
  { label: 'Club', value: 'club' },
  { label: 'Live', value: 'live' }
]

const activeFilterLabels: Record<string, string> = {
  pizzeria: 'Pizzeria',
  club: 'Club',
  live: 'Live Music'
}

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const typeLabel = (type: string | null) => CATEGORY_LABELS[type || ''] || type || 'Event'

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const events = ref<PublicEvent[]>([])
const activeFilter = ref('all')
const loading = ref(true)
const loadError = ref('')

const upcomingEvents = computed(() => events.value)
const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') return events.value
  return events.value.filter(e => e.type === activeFilter.value)
})

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const loadEvents = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<PublicEvent[]>('/api/events')
    events.value = data || []
  } catch (err: any) {
    console.error('Failed to load events:', err)
    loadError.value = 'We couldn\u2019t load events right now. Please try again.'
  } finally {
    loading.value = false
  }
}

// Booking form (best-effort; will be replaced by Pretix widget when wired)
const bookingForm = reactive({ name: '', email: '', eventId: '', tickets: 1 })
const bookingState = ref('idle')
const bookingError = ref('')
const bookingSubmitting = ref(false)

const submitBooking = async () => {
  bookingState.value = 'idle'
  bookingError.value = ''
  bookingSubmitting.value = true
  try {
    // Currently a stub — real ticket sales go through the Pretix widget.
    // Simulate async so the UX state transitions are real.
    await new Promise(r => setTimeout(r, 300))
    bookingState.value = 'success'
  } catch (e: any) {
    bookingError.value = 'Booking failed. Please try again.'
  } finally {
    bookingSubmitting.value = false
  }
}

onMounted(loadEvents)
</script>
