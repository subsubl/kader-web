<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <!-- JSON-LD Structured Data (SEO) -->
    <Head>
      <Title>Kader Grad Kodeljevo — Neapolitan Pizza & Underground Club, Ljubljana</Title>
      <Meta name="description" content="Hybrid daytime pizzeria and nighttime underground club in the historic Grad Kodeljevo castle, Ljubljana." />
      <Meta property="og:title" content="Kader Grad Kodeljevo" />
      <Meta property="og:type" content="restaurant" />
      <Meta property="og:url" content="https://www.kader.si/" />
      <Meta property="og:image" content="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80" />
      <Script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": ["Restaurant", "NightClub", "LocalBusiness"],
          "name": "Kader Grad Kodeljevo",
          "description": "Hybrid daytime Neapolitan pizzeria and nighttime underground club in the historic Grad Kodeljevo castle.",
          "servesCuisine": "Neapolitan Pizza",
          "url": "https://www.kader.si/",
          "telephone": "+386 40 000 000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ulica Carla Benza 20",
            "addressLocality": "Ljubljana",
            "postalCode": "1000",
            "addressCountry": "SI"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "46.05000",
            "longitude": "14.53111"
          },
          "sameAs": ["https://www.facebook.com/kader.si", "https://www.instagram.com/kader.si", "https://soundcloud.com/kader"]
        }
      </Script>
    </Head>
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/70 z-10"></div>
      <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80" alt="Grad Kodeljevo Castle" class="absolute inset-0 w-full h-full object-cover z-0">
      
      <div class="relative z-20 text-center px-4 max-w-4xl">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">KADER GRAD KODELJEVO</h1>
        <p class="text-xl md:text-2xl mb-8 animate-fade-in-up">Where Historic Castle Meets Modern Nightlife</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/pizzeria" class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Explore Menu
          </NuxtLink>
          <NuxtLink to="/events" class="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            View Events
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Dual Messaging Section -->
    <section class="py-20 px-4 bg-gray-900">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold mb-6">Daytime Pizzeria</h2>
          <p class="text-lg mb-4">Experience authentic Italian cuisine in the heart of historic Grad Kodeljevo castle. Our wood-fired pizzas are made with locally sourced ingredients and traditional recipes passed down through generations.</p>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Fresh ingredients daily</li>
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Traditional wood-fired ovens</li>
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Family-owned & operated</li>
          </ul>
          <NuxtLink to="/pizzeria" class="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
            View Our Menu
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-6">Nighttime Underground Club</h2>
          <p class="text-lg mb-4">Transform your evening with our world-class sound system and curated selection of artists. Our underground club offers an intimate atmosphere where music and history collide.</p>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Klipsch La Scala sound system</li>
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Expert DJ lineups</li>
            <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-2 text-green-500" /> Historic castle ambiance</li>
          </ul>
          <NuxtLink to="/club" class="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-300">
            Check Our Events
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Events -->
    <section class="py-20 px-4 bg-black">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Upcoming Events</h2>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-gray-800 rounded-lg p-10 text-center border border-gray-700">
          <p class="text-gray-400 mb-4">{{ loadError }}</p>
          <button @click="loadFeatured" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors">
            Retry
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="featuredEvents.length === 0" class="bg-gray-800 rounded-lg p-10 text-center border border-gray-700">
          <p class="text-gray-400 mb-2">No upcoming events right now.</p>
          <p class="text-sm text-gray-500">Check back soon — we're always adding new events.</p>
        </div>

        <!-- Events grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="event in featuredEvents" :key="event.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div class="relative">
              <img :src="event.image || fallbackImage" :alt="event.title" class="w-full h-48 object-cover" @error="onImageError">
              <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">{{ event.typeLabel }}</div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300 mb-4">{{ event.dateLabel }}</p>
              <p class="mb-4 line-clamp-3">{{ event.description }}</p>
              <NuxtLink :to="`/events`" class="text-red-500 hover:text-red-400 font-semibold">
                View Events →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

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

interface FeaturedEvent {
  id: string
  title: string
  description: string
  image: string
  dateLabel: string
  typeLabel: string
}

const CATEGORY_LABELS: Record<string, string> = {
  club: 'Club',
  pizzeria: 'Pizzeria',
  live: 'Live Music',
  private: 'Private'
}

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const loading = ref(true)
const loadError = ref('')
const events = ref<PublicEvent[]>([])

const featuredEvents = computed<FeaturedEvent[]>(() =>
  events.value.slice(0, 3).map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description || 'Join us for a special evening at Kader Grad Kodeljevo.',
    image: e.image_url || fallbackImage,
    dateLabel: new Date(e.date).toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' }),
    typeLabel: CATEGORY_LABELS[e.type || ''] || e.type || 'Event'
  }))
)

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const loadFeatured = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<PublicEvent[]>('/api/events')
    events.value = data || []
  } catch (err: any) {
    console.error('Failed to load events:', err)
    loadError.value = 'We couldn\u2019t load upcoming events right now.'
  } finally {
    loading.value = false
  }
}

onMounted(loadFeatured)
</script>