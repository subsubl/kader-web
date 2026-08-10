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
        <h2 class="text-3xl font-bold mb-6 text-center">Upcoming DJ Sets</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="set in djSets" :key="set.id" class="bg-gray-900 rounded-lg p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ set.artist }}</h3>
              <span class="text-red-500 font-bold">€{{ set.price }}</span>
            </div>
            <p class="text-gray-300 mb-2">{{ set.date }} • {{ set.time }}</p>
            <p class="mb-4">{{ set.genre }}</p>
            <button class="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-300">
              Book Now
            </button>
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
import { CheckIcon } from '@heroicons/vue/24/outline'

interface DJSet {
  id: string;
  artist: string;
  date: string;
  time: string;
  genre: string;
  price: number;
}

const djSets: DJSet[] = [
  {
    id: '1',
    artist: 'DJ Luna',
    date: 'June 15, 2023',
    time: '10:00 PM',
    genre: 'House & Techno',
    price: 250
  },
  {
    id: '2',
    artist: 'Slovenian Beats',
    date: 'June 22, 2023',
    time: '11:00 PM',
    genre: 'Electronic',
    price: 300
  },
  {
    id: '3',
    artist: 'The Jazz Collective',
    date: 'June 29, 2023',
    time: '9:00 PM',
    genre: 'Jazz Fusion',
    price: 400
  }
]
</script>