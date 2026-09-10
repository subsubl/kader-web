<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10"></div>
      <img src="/hero-bg.jpg" alt="Grad Kodeljevo Castle" class="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
      
      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <img src="/logo-banner.png" alt="Kader Grad Kodeljevo Logo" class="h-24 md:h-32 object-contain mb-8 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-fade-in" />
        
        <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white uppercase">
          {{ t('hero.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-red-500 font-bold mb-8 tracking-widest uppercase">
          “{{ t('hero.tagline') }}”
        </p>

        <!-- Address & Contact Quick Badge -->
        <div class="bg-zinc-900/90 border border-zinc-800 backdrop-blur-md px-6 py-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm text-gray-300">
          <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="flex items-center hover:text-red-400 transition-colors">
            <MapPinIcon class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span>{{ t('hero.address') }}</span>
          </a>
          <span class="hidden md:inline text-zinc-700">|</span>
          <a href="tel:+38683836740" class="flex items-center hover:text-red-400 transition-colors font-bold text-white">
            <PhoneIcon class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span>{{ t('hero.orders') }}: +386 83 836 740</span>
          </a>
        </div>

        <div class="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
          <NuxtLink to="/events" class="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-950 text-center flex-1 min-w-[150px]">
            {{ t('hero.events') }}
          </NuxtLink>
          <NuxtLink to="/pizzeria" class="px-8 py-3.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]">
            {{ t('nav.pizzeria') }}
          </NuxtLink>
          <NuxtLink to="/club" class="px-8 py-3.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]">
            {{ t('nav.club') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Dual Messaging Section -->
    <section class="py-20 px-4 bg-zinc-950 border-y border-zinc-900">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        <div class="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-2xl flex flex-col justify-between hover:border-red-900/50 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <span class="text-4xl">🍕</span>
              <h2 class="text-3xl font-black uppercase text-white">{{ t('home.dayTitle') }}</h2>
            </div>
            <p class="text-gray-300 text-lg mb-6 leading-relaxed">
              {{ t('home.dayP') }}
            </p>
            <ul class="space-y-3 mb-8 text-sm text-gray-300">
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {{ t('home.dayF1') }}</li>
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {{ t('home.dayF2') }}</li>
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {{ t('home.dayF3') }}</li>
            </ul>
          </div>
          <NuxtLink to="/pizzeria" class="inline-block text-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors duration-300">
            {{ t('home.dayCta') }}
          </NuxtLink>
        </div>

        <div class="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-2xl flex flex-col justify-between hover:border-purple-900/50 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <span class="text-4xl">🪩</span>
              <h2 class="text-3xl font-black uppercase text-white">{{ t('home.nightTitle') }}</h2>
            </div>
            <p class="text-gray-300 text-lg mb-6 leading-relaxed">
              {{ t('home.nightP') }}
            </p>
            <ul class="space-y-3 mb-8 text-sm text-gray-300">
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF1') }}</li>
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF2') }}</li>
              <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF3') }}</li>
            </ul>
          </div>
          <NuxtLink to="/events" class="inline-block text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors duration-300">
            {{ t('home.nightCta') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- The Club Experience -->
    <section class="py-16 md:py-24 px-4 bg-black border-b border-zinc-900 content-visibility-auto">
      <div class="max-w-6xl mx-auto space-y-20 md:space-y-32">
        <!-- Basement Segment -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div class="order-2 md:order-1 flex flex-col justify-center">
            <h3 class="text-red-600 font-bold uppercase tracking-widest text-sm mb-2">{{ t('home.basementSub') }}</h3>
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 md:mb-6">{{ t('home.basementTitle') }}</h2>
            <p class="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
              {{ t('home.basementDesc') }}
            </p>
            <div class="bg-zinc-950 border border-zinc-900 p-5 rounded-xl inline-block max-w-sm">
              <h4 class="text-white font-bold mb-1.5 flex items-center"><span class="text-red-500 mr-2">🔊</span> {{ t('home.basementSoundTitle') }}</h4>
              <p class="text-gray-400 text-sm leading-snug">{{ t('home.basementSoundDesc') }}</p>
            </div>
          </div>
          <div class="order-1 md:order-2 h-64 md:h-[450px] rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div class="absolute inset-0 bg-red-900/30 mix-blend-multiply z-10 transition-opacity group-hover:opacity-50"></div>
            <img src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=800&q=80" alt="Basement Club" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:scale-105 transition-transform duration-700">
          </div>
        </div>

        <!-- 2nd Floor Segment -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div class="h-64 md:h-[450px] rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <div class="absolute inset-0 bg-purple-900/30 mix-blend-multiply z-10 transition-opacity group-hover:opacity-50"></div>
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" alt="2nd Floor Club" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-125 saturate-110 group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="flex flex-col justify-center">
            <h3 class="text-purple-500 font-bold uppercase tracking-widest text-sm mb-2">{{ t('home.secondFloorSub') }}</h3>
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 md:mb-6">{{ t('home.secondFloorTitle') }}</h2>
            <p class="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
              {{ t('home.secondFloorDesc') }}
            </p>
            <div class="bg-zinc-950 border border-zinc-900 p-5 rounded-xl inline-block max-w-sm">
              <h4 class="text-white font-bold mb-1.5 flex items-center"><span class="text-purple-500 mr-2">🔊</span> {{ t('home.secondFloorSoundTitle') }}</h4>
              <p class="text-gray-400 text-sm leading-snug">{{ t('home.secondFloorSoundDesc') }}</p>
            </div>
          </div>
        </div>

        <!-- Summer Outdoor Segment -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div class="order-2 md:order-1 flex flex-col justify-center">
            <h3 class="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2">{{ t('home.terraceSub') }}</h3>
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 md:mb-6">{{ t('home.terraceTitle') }}</h2>
            <p class="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
              {{ t('home.terraceDesc') }}
            </p>
            <ul class="space-y-3 mb-8 text-sm text-gray-300">
              <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center mr-4 text-orange-500 border border-orange-500/30 flex-shrink-0"><CheckIcon class="w-4 h-4" /></span> {{ t('home.terraceF1') }}</li>
              <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center mr-4 text-orange-500 border border-orange-500/30 flex-shrink-0"><CheckIcon class="w-4 h-4" /></span> {{ t('home.terraceF2') }}</li>
              <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center mr-4 text-orange-500 border border-orange-500/30 flex-shrink-0"><CheckIcon class="w-4 h-4" /></span> {{ t('home.terraceF3') }}</li>
            </ul>
          </div>
          <div class="order-1 md:order-2 h-64 md:h-[450px] rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            <div class="absolute inset-0 bg-orange-900/20 mix-blend-multiply z-10 transition-opacity group-hover:opacity-50"></div>
            <img src="https://images.unsplash.com/photo-1533174000255-a63b8f20c1da?auto=format&fit=crop&w=800&q=80" alt="Summer Terrace" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-110 saturate-150 group-hover:scale-105 transition-transform duration-700">
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Events (RA Integration) -->
    <section class="py-16 md:py-20 px-4 bg-black content-visibility-auto">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-black uppercase text-center mb-12">{{ t('home.upcomingTitle') }}</h2>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <svg class="animate-spin h-10 w-10 text-red-500" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-zinc-900 rounded-xl p-10 text-center border border-zinc-800">
          <p class="text-gray-400 mb-4">{{ loadError }}</p>
          <button @click="loadFeatured" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors min-h-[44px]">
            {{ t('home.retry') }}
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="featuredEvents.length === 0" class="bg-zinc-900 rounded-xl p-10 text-center border border-zinc-800">
          <p class="text-gray-400 mb-2">{{ t('home.noEvents') }}</p>
          <p class="text-sm text-gray-500">{{ t('home.noEvents2') }}</p>
        </div>

        <!-- Events grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="event in featuredEvents" :key="event.id" class="bg-zinc-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl border border-zinc-800 transition-all duration-300 hover:border-red-900/50 flex flex-col">
            <div class="relative aspect-[16/9] overflow-hidden">
              <img :src="event.image || fallbackImage" :alt="event.title" loading="lazy" decoding="async" class="w-full h-full object-cover" @error="onImageError">
              <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ event.typeLabel }}</div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-bold mb-2 text-white">{{ event.title }}</h3>
                <p class="text-xs text-gray-400 mb-4">{{ event.dateLabel }}</p>
                <p class="text-sm text-gray-300 mb-4 line-clamp-3">{{ event.description }}</p>
              </div>
              <a :href="event.ra_url" target="_blank" rel="noopener" class="text-red-500 hover:text-red-400 text-sm font-bold inline-flex items-center min-h-[44px]">
                {{ t('home.viewRA') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Real Google Working Hours & Map Banner -->
    <section class="py-16 px-4 bg-zinc-950 border-t border-zinc-900">
      <div class="max-w-6xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span class="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">{{ t('home.visitLabel') }}</span>
            <h2 class="text-3xl font-black text-white mb-6 uppercase">{{ t('home.visitTitle') }}</h2>
            <p class="text-gray-400 mb-6 leading-relaxed">
              {{ t('home.visitP', { food: '(+386 83 836 740)', table: '(+386 40 175 628)' }) }}
            </p>
            <div class="flex space-x-4">
              <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors">
                {{ t('home.openMaps') }}
              </a>
            </div>
          </div>

          <div class="bg-black/60 p-6 rounded-2xl border border-zinc-800">
            <h3 class="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2">{{ t('home.hoursTitle') }}</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-300">
                <span>{{ t('home.monWed') }}</span>
                <span class="font-bold text-white">09:00 – 22:00</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>{{ t('home.thu') }}</span>
                <span class="font-bold text-white">09:00 – 01:00</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>{{ t('home.fri') }}</span>
                <span class="font-bold text-red-400">09:00 – 05:00</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>{{ t('home.sat') }}</span>
                <span class="font-bold text-white">09:00 – 01:00</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>{{ t('home.sun') }}</span>
                <span class="font-bold text-white">09:00 – 20:00</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-4 italic">{{ t('footer.kitchenNote') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon, MapPinIcon, PhoneIcon } from '@heroicons/vue/24/outline'

const { locale, t } = useLocale()

useHead({
  title: 'Kader Grad Kodeljevo — Pizza bistro in plesni bar Ljubljana',
  meta: [
    { name: 'description', content: 'Pizza bistro in plesni bar na gradu Kodeljevo. Pizzeria podnevi in klubska kultura ponoči v Ljubljani.' },
    { property: 'og:title', content: 'Kader Grad Kodeljevo' },
    { property: 'og:image', content: '/logo-badge.png' }
  ]
})

interface PublicEvent {
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

interface FeaturedEvent {
  id: number
  title: string
  description: string
  image: string
  dateLabel: string
  typeLabel: string
  ra_url: string
}

const fallbackImage = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'

const loading = ref(true)
const loadError = ref('')
const events = ref<PublicEvent[]>([])

const featuredEvents = computed<FeaturedEvent[]>(() =>
  events.value.slice(0, 3).map((e) => ({
    id: e.ra_id,
    title: e.title,
    description: e.artists?.length ? `${t('home.featuredBy')}${e.artists.join(', ')}` : t('home.fallbackDesc'),
    image: e.flyer_url || fallbackImage,
    dateLabel: new Date(e.date).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    typeLabel: (e.genres?.[0] || 'Klub'),
    ra_url: e.ra_url || 'https://ra.co/clubs/78778'
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
    const data = await $fetch<PublicEvent[]>('/api/ra-events?scope=upcoming')
    events.value = (data || []).map((e: any) => ({
      ...e,
      artists: Array.isArray(e.artists) ? e.artists : [],
      genres: Array.isArray(e.genres) ? e.genres : []
    }))
  } catch (err: any) {
    console.error('Failed to load events:', err)
    loadError.value = 'Trenutno ni bilo mogoče naložiti prihajajočih dogodkov.'
  } finally {
    loading.value = false
  }
}

onMounted(loadFeatured)
</script>