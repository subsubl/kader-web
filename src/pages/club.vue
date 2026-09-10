<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">
    <!-- ===== Immersive Hero (distinct from rest of site) ===== -->
    <section class="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
      <img
        :src="'/images/instagram/ig_img_10.jpg'"
        alt="Kader club atmosphere"
        class="absolute inset-0 w-full h-full object-cover opacity-50"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/60 to-transparent"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 md:pb-20 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-4 text-kader-red font-semibold">
          {{ t('club.location') }}
        </p>
        <h1 class="text-5xl md:text-8xl font-black leading-[0.92] mb-6 uppercase">
          Club<br>Kader
        </h1>
        <p class="text-lg md:text-2xl max-w-2xl text-kader-cream/80">
          {{ t('club.heroTagline') }}
        </p>
      </div>
    </section>

    <!-- ===== Venue statement (editorial) ===== -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-4">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.theVenue') }}</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight">{{ t('club.venueTitle') }}</h2>
          </div>
          <div class="lg:col-span-8">
            <p class="text-xl md:text-3xl leading-relaxed mb-6">
              {{ t('club.venueP1') }}
              <span class="text-kader-red font-semibold">{{ t('club.venueP1Accent') }}</span>.
            </p>
            <p class="text-lg md:text-xl leading-relaxed text-kader-cream/70">
              {{ t('club.venueP2') }}
            </p>
            <div class="grid grid-cols-3 gap-6 mt-12 border-t border-kader-cream/10 pt-8">
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">01</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">{{ t('club.venueBasement') }}</p>
              </div>
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">02</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">{{ t('club.venueFloor') }}</p>
              </div>
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">03</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">{{ t('club.venueGarden') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== The Floors ===== -->
    <section class="py-16 md:py-24 px-4 bg-gradient-to-b from-kader-black to-[#1a0506]">
      <div class="max-w-6xl mx-auto">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('club.exploreSpaces') }}</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-14 uppercase">{{ t('club.floorsTitle') }}</h2>

        <!-- FLOOR 01: BASEMENT -->
        <div class="mb-2 group">
          <div class="relative overflow-hidden rounded-3xl">
            <img
              src="/images/instagram/ig_img_3.jpg"
              alt="Kader Basement Club"
              loading="lazy"
              decoding="async"
              class="w-full h-72 md:h-[440px] object-cover object-center brightness-[0.55] group-hover:brightness-[0.7] transition-all duration-700"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <!-- Floor label -->
            <div class="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-3">
              <span class="font-mono text-4xl md:text-6xl font-black text-kader-red leading-none">01</span>
              <div class="h-px w-8 bg-kader-red"></div>
              <span class="text-xs uppercase tracking-[0.3em] text-kader-cream/60 font-semibold">{{ t('club.floorLabel') }}</span>
            </div>

            <!-- Content overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div class="max-w-3xl">
                <h3 class="text-3xl md:text-5xl font-black uppercase mb-3">{{ t('club.floor01Title') }}</h3>
                <p class="text-kader-cream/75 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">{{ t('club.floor01Desc') }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in ['Klipsch La Scala AL6', t('club.tagCapacity300'), t('club.tagLowCeiling'), t('club.tagResidentDJs')]" :key="tag"
                    class="px-3 py-1 bg-kader-red/20 border border-kader-red/40 text-kader-cream/80 text-xs font-bold uppercase tracking-wider rounded-full"
                  >{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FLOOR 02: GROUND LEVEL -->
        <div class="group">
          <div class="relative overflow-hidden rounded-3xl">
            <img
              src="/images/instagram/ig_img_4.webp"
              alt="Kader Ground Floor"
              loading="lazy"
              decoding="async"
              class="w-full h-72 md:h-[440px] object-cover object-center brightness-[0.55] group-hover:brightness-[0.7] transition-all duration-700"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <!-- Floor label -->
            <div class="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-3">
              <span class="font-mono text-4xl md:text-6xl font-black text-kader-red leading-none">02</span>
              <div class="h-px w-8 bg-kader-red"></div>
              <span class="text-xs uppercase tracking-[0.3em] text-kader-cream/60 font-semibold">{{ t('club.floorLabel') }}</span>
            </div>

            <!-- Content overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div class="max-w-3xl">
                <h3 class="text-3xl md:text-5xl font-black uppercase mb-3">{{ t('club.floor02Title') }}</h3>
                <p class="text-kader-cream/75 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">{{ t('club.floor02Desc') }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in [t('club.tagCocktailBar'), t('club.tagGarden'), t('club.tagPizzeria'), t('club.tagOpenAir')]" :key="tag"
                    class="px-3 py-1 bg-kader-red/20 border border-kader-red/40 text-kader-cream/80 text-xs font-bold uppercase tracking-wider rounded-full"
                  >{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Sound systems ===== -->
    <section class="py-20 md:py-28 px-4 content-visibility-auto">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.theSound') }}</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight mb-6">{{ t('club.soundTitle') }}</h2>
            <div class="text-kader-cream/80 text-lg space-y-4 leading-relaxed max-w-xl">
              <p>{{ t('club.soundP1') }}</p>
              <p v-html="t('club.soundP2')"></p>
            </div>

            <button
              @click="showSpecs = !showSpecs"
              class="mt-8 px-6 py-3 border border-kader-red text-kader-cream hover:bg-kader-red hover:text-kader-black rounded-lg font-semibold transition-colors duration-300 min-h-[44px]"
            >
              {{ showSpecs ? t('club.hideSpecs') : t('club.viewSpecs') }}
            </button>
          </div>

          <div class="bg-white/[0.03] border border-kader-cream/10 rounded-2xl p-8">
            <img
              :src="'https://images.unsplash.com/photo-1598387846168-20e4e45de4db?auto=format&fit=crop&w=800&q=80'"
              alt="Klipsch La Scala systems"
              loading="lazy"
              decoding="async"
              class="w-full h-64 object-cover rounded-xl mb-6"
            >
            <div v-if="showSpecs" class="space-y-3 text-sm">
              <div v-for="spec in specs" :key="spec.label" class="flex justify-between border-b border-kader-cream/10 pb-2">
                <span class="text-kader-cream/50">{{ spec.label }}</span>
                <span class="text-right font-medium">{{ spec.value }}</span>
              </div>
            </div>
            <p v-else class="text-kader-cream/50 text-lg italic">{{ t('club.tapReveal') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Safer Spaces / Code of Conduct ===== -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div class="lg:col-span-2">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.ourPromise') }}</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight uppercase">{{ t('club.saferSpaces') }}</h2>
            <p class="text-kader-cream/70 mt-4 leading-relaxed">{{ t('club.safeIntro') }}</p>
          </div>
          <div class="lg:col-span-3">
            <div class="divide-y divide-kader-cream/10 border-y border-kader-cream/10">
              <div v-for="rule in codeRules" :key="rule.key" class="py-5">
                <div class="flex items-start gap-4">
                  <span class="font-mono text-kader-red shrink-0 mt-0.5">{{ rule.index }}</span>
                  <div>
                    <h3 class="font-bold text-lg mb-1">{{ ruled(rule).title }}</h3>
                    <p class="text-kader-cream/70 leading-relaxed">{{ ruled(rule).text }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-kader-cream/50 text-sm mt-6 leading-relaxed">
              {{ t('club.safeOutro') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Upcoming nights (RA-synced, restyled) ===== -->
    <section class="py-20 md:py-28 px-4 bg-[#1a0506]">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2">{{ t('club.lineup') }}</p>
            <h2 class="text-3xl md:text-5xl font-black uppercase">{{ t('club.upcomingNights') }}</h2>
          </div>
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener"
            class="text-sm text-kader-red hover:underline"
          >{{ t('club.viewAllRA') }}</a>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16 text-kader-cream/40">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center">
          <p class="text-kader-cream/80 mb-4">{{ t('club.loadLineupError') }}</p>
          <button @click="loadClubEvents" class="px-6 py-2 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-lg font-semibold transition-colors">
            {{ t('club.retry') }}
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="clubEvents.length === 0" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center text-kader-cream/70">
          <p class="mb-2">{{ t('club.noNights') }}</p>
          <p class="text-sm">{{ t('club.newLineups') }}</p>
        </div>

        <!-- Club events (editorial list, not cards) -->
        <div v-else class="border-t border-kader-cream/10 divide-y divide-kader-cream/10">
          <a
            v-for="event in clubEvents"
            :key="event.ra_id"
            :href="event.ra_url || 'https://ra.co/clubs/78778'"
            target="_blank"
            rel="noopener"
            class="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 md:gap-8 items-center py-6 md:py-8 group"
          >
            <span class="font-mono text-sm text-kader-red shrink-0 md:w-32">{{ listDate(event) }}</span>
            <div class="min-w-0">
              <h3 class="text-xl md:text-2xl font-bold group-hover:text-kader-red transition-colors">{{ event.title }}</h3>
              <p v-if="event.artists.length" class="text-kader-cream/60 mt-1">{{ event.artists.join(', ') }}</p>
            </div>
            <span class="text-kader-cream/40 group-hover:text-kader-red transition-colors text-sm shrink-0 md:text-right">
              {{ t('club.tickets') }}
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Private events ===== -->
    <section class="py-20 md:py-28 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.privateHire') }}</p>
        <h2 class="text-3xl md:text-5xl font-black mb-6 uppercase">{{ t('club.takeoverTitle') }}</h2>
        <p class="text-lg text-kader-cream/70 mb-8">{{ t('club.takeoverP') }}</p>
        <NuxtLink
          to="/buyouts"
          class="inline-block px-8 py-3 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-lg font-semibold transition-colors duration-300"
        >
          {{ t('club.bookVenue') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { locale, t } = useLocale()

interface ClubEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  flyer_url: string | null
  ra_url: string | null
  artists: string[]
  genres: string[]
}


const specs = [
  { label: 'Product', value: 'Klipsch La Scala AL6' },
  { label: 'Type', value: 'Three-way, fully horn-loaded floorstanding loudspeaker' },
  { label: 'Mid-Range Horn', value: 'K-406M patented Tractrix® horn (2" throat)' },
  { label: 'Coverage', value: 'Mumps™ flat response to the horn edge' },
  { label: 'Bass', value: 'Horn-loaded, vented cabinet' },
  { label: 'Optional DSP', value: 'Heritage Active Crossover (time/phase aligned, EQ)' }
]

const codeRules = [
  { key: 'rule01', index: '01', titleKey: 'club.rule01Title', textKey: 'club.rule01Text' },
  { key: 'rule02', index: '02', titleKey: 'club.rule02Title', textKey: 'club.rule02Text' },
  { key: 'rule03', index: '03', titleKey: 'club.rule03Title', textKey: 'club.rule03Text' },
  { key: 'rule04', index: '04', titleKey: 'club.rule04Title', textKey: 'club.rule04Text' },
  { key: 'rule05', index: '05', titleKey: 'club.rule05Title', textKey: 'club.rule05Text' }
]
// Computed accessors so template can read rule.title / rule.text
const ruled = (r: (typeof codeRules)[number]) => ({ title: t(r.titleKey), text: t(r.textKey) })

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'

const showSpecs = ref(false)
const loading = ref(true)
const loadError = ref('')
const events = ref<ClubEvent[]>([])

const clubEvents = computed(() =>
  events.value.filter((e) => {
    const genre = (e.genres[0] || '').toLowerCase()
    const title = (e.title || '').toLowerCase()
    return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
  })
)

const listDate = (e: ClubEvent) =>
  new Date(e.date).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', { weekday: 'short', day: '2-digit', month: 'short' })

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
    loadError.value = t('club.loadLineupError')
  } finally {
    loading.value = false
  }
}

onMounted(loadClubEvents)
</script>