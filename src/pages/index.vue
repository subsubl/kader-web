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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="event in featuredEvents" :key="event.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <img :src="event.image" :alt="event.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-gray-300 mb-4">{{ event.date }} | {{ event.time }}</p>
              <p class="mb-4">{{ event.description }}</p>
              <NuxtLink :to="`/events/${event.slug}`" class="text-red-500 hover:text-red-400 font-semibold">
                Learn More →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

const featuredEvents = [
  {
    id: '1',
    title: 'Live Jazz Night',
    date: 'June 15, 2023',
    time: '9:00 PM',
    description: 'Enjoy live jazz performances by local musicians in our historic castle.',
    slug: 'live-jazz-night',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Italian Wine Tasting',
    date: 'June 22, 2023',
    time: '7:00 PM',
    description: 'Discover the finest Italian wines paired with our signature pizzas.',
    slug: 'italian-wine-tasting',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Underground Dance Party',
    date: 'June 29, 2023',
    time: '10:00 PM',
    description: 'Our monthly dance party featuring top DJs from Slovenia and beyond.',
    slug: 'underground-dance-party',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
  }
]
</script>