<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">
    <!-- ===== Immersive Hero (distinct from rest of site) ===== -->
    <section class="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
      <img
        :src="'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=1600&q=80'"
        alt="Kader club"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/60 to-transparent"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 md:pb-20 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-4 text-kader-red font-semibold">
          Grad Kodeljevo · Ljubljana
        </p>
        <h1 class="text-5xl md:text-8xl font-black leading-[0.92] mb-6 uppercase">
          Club<br>Kader
        </h1>
        <p class="text-lg md:text-2xl max-w-2xl text-kader-cream/80">
          Electronic music. Live acts.<br>Everyone's welcome.
        </p>
      </div>
    </section>

    <!-- ===== Venue statement (editorial) ===== -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-4">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">The Venue</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight">A castle, minutes from Ljubljana's centre</h2>
          </div>
          <div class="lg:col-span-8">
            <p class="text-xl md:text-3xl leading-relaxed mb-6">
              Kader is a club set within a historic castle. We play
              <span class="text-kader-red font-semibold">electronic music and host live acts</span>.
            </p>
            <p class="text-lg md:text-xl leading-relaxed text-kader-cream/70">
              Inclusive, LGBT-friendly, and for everyone. Come as you are; the night is open.
            </p>
            <div class="grid grid-cols-3 gap-6 mt-12 border-t border-kader-cream/10 pt-8">
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">01</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">Basement club</p>
              </div>
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">02</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">Dance floor &amp; bar</p>
              </div>
              <div>
                <p class="font-mono text-3xl font-black text-kader-red">03</p>
                <p class="text-sm uppercase tracking-wider text-kader-cream/60 mt-2">Summer garden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== The Spaces ===== -->
    <section class="py-16 md:py-24 px-4 bg-gradient-to-b from-kader-black to-[#1a0506]">
      <div class="max-w-6xl mx-auto">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">Explore the Spaces</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-14 uppercase">Four worlds in one castle</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-kader-red/20 border border-kader-red/20">
          <div v-for="space in spaces" :key="space.title" class="bg-[#120607] p-8 md:p-12 group hover:bg-[#1a0a0b] transition-colors duration-300">
            <p class="font-mono text-sm text-kader-red mb-4">{{ space.index }}</p>
            <h3 class="text-2xl md:text-3xl font-bold mb-3">{{ space.title }}</h3>
            <p class="text-kader-cream/70 leading-relaxed">{{ space.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Sound systems ===== -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">The Sound</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight mb-6">Custom, high-fidelity systems in both indoor rooms</h2>
            <div class="text-kader-cream/80 text-lg space-y-4 leading-relaxed max-w-xl">
              <p>
                Both indoor rooms are powered by dedicated, custom-engineered audio rigs built for clarity and
                body — engineered to fill the castle's stone vaults without a hint of distortion.
              </p>
              <p>
                The centrepiece is the <strong class="text-kader-cream">Klipsch La Scala AL6</strong>: a fully
                horn-loaded, three-way loudspeaker chosen for its efficiency and punch in this historic space.
              </p>
            </div>

            <button
              @click="showSpecs = !showSpecs"
              class="mt-8 px-6 py-3 border border-kader-red text-kader-cream hover:bg-kader-red hover:text-kader-black rounded-lg font-semibold transition-colors duration-300"
            >
              {{ showSpecs ? 'Hide specs' : 'View technical specs' }}
            </button>
          </div>

          <div class="bg-white/[0.03] border border-kader-cream/10 rounded-2xl p-8">
            <img
              :src="'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'"
              alt="Klipsch La Scala systems"
              class="w-full h-64 object-cover rounded-xl mb-6"
            >
            <div v-if="showSpecs" class="space-y-3 text-sm">
              <div v-for="spec in specs" :key="spec.label" class="flex justify-between border-b border-kader-cream/10 pb-2">
                <span class="text-kader-cream/50">{{ spec.label }}</span>
                <span class="text-right font-medium">{{ spec.value }}</span>
              </div>
            </div>
            <p v-else class="text-kader-cream/50 text-lg italic">Tap to reveal the engineering behind the sound.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Safer Spaces / Code of Conduct ===== -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div class="lg:col-span-2">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">Our Promise</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight uppercase">Safer Spaces</h2>
            <p class="text-kader-cream/70 mt-4 leading-relaxed">
              A club is only as good as how safe everyone feels inside it. These are the ground rules we hold for every night, every dance floor, every room of the castle.
            </p>
          </div>
          <div class="lg:col-span-3">
            <div class="divide-y divide-kader-cream/10 border-y border-kader-cream/10">
              <div v-for="rule in codeRules" :key="rule.title" class="py-5">
                <div class="flex items-start gap-4">
                  <span class="font-mono text-kader-red shrink-0 mt-0.5">{{ rule.index }}</span>
                  <div>
                    <h3 class="font-bold text-lg mb-1">{{ rule.title }}</h3>
                    <p class="text-kader-cream/70 leading-relaxed">{{ rule.text }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-kader-cream/50 text-sm mt-6 leading-relaxed">
              We'll always be learning, and hope you will too. If anything — or anyone — makes you feel unsafe,
              tell our staff. We take it seriously.
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
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2">Lineup</p>
            <h2 class="text-3xl md:text-5xl font-black uppercase">Upcoming Nights</h2>
          </div>
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener"
            class="text-sm text-kader-red hover:underline"
          >View all on Resident Advisor →</a>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16 text-kader-cream/40">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center">
          <p class="text-kader-cream/80 mb-4">{{ loadError }}</p>
          <button @click="loadClubEvents" class="px-6 py-2 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-lg font-semibold transition-colors">
            Retry
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="clubEvents.length === 0" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center text-kader-cream/70">
          <p class="mb-2">No club nights scheduled right now.</p>
          <p class="text-sm">New lineups sync here automatically.</p>
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
              Tickets →
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Private events ===== -->
    <section class="py-20 md:py-28 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">Private Hire</p>
        <h2 class="text-3xl md:text-5xl font-black mb-6 uppercase">Take over the castle</h2>
        <p class="text-lg text-kader-cream/70 mb-8">Transform your occasion into an unforgettable night in our historic venue.</p>
        <NuxtLink
          to="/buyouts"
          class="inline-block px-8 py-3 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-lg font-semibold transition-colors duration-300"
        >
          Book the venue
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

const spaces = [
  {
    index: '01',
    title: 'The Basement Club',
    description: 'Descend into the vaulted basement — an intimate, immersive room for electronics and heavy-hitting sets.'
  },
  {
    index: '02',
    title: 'The Floor & Cocktail Bar',
    description: 'A ground-level dance floor with a dedicated cocktail bar, engineered for music and conversation alike.'
  },
  {
    index: '03',
    title: 'The Summer Garden',
    description: 'An expansive outdoor garden that opens up in the warm months — for daytime hangs and balmy night sets.'
  },
  {
    index: '04',
    title: 'The Pizzeria',
    description: 'Our on-site pizzeria keeps the night fuelled with fire-baked pizzas from the castle kitchen.'
  }
]

const specs = [
  { label: 'Product', value: 'Klipsch La Scala AL6' },
  { label: 'Type', value: 'Three-way, fully horn-loaded floorstanding loudspeaker' },
  { label: 'Mid-Range Horn', value: 'K-406M patented Tractrix® horn (2" throat)' },
  { label: 'Coverage', value: 'Mumps™ flat response to the horn edge' },
  { label: 'Bass', value: 'Horn-loaded, vented cabinet' },
  { label: 'Optional DSP', value: 'Heritage Active Crossover (time/phase aligned, EQ)' }
]

const codeRules = [
  {
    index: '01',
    title: 'Respect & consent',
    text: "Ask before you touch. No means no. Space, consent and boundaries are non-negotiable — for everyone, every time."
  },
  {
    index: '02',
    title: 'Check your assumptions',
    text: "Leave assumptions at the door. We're inclusive of every background, identity, and belief — including how you read yours and other people's."
  },
  {
    index: '03',
    title: 'Know your impact',
    text: "Watch your space, your noise, and your energy. How you behave shapes the night for the people around you."
  },
  {
    index: '04',
    title: 'Honour privacy',
    text: "What happens on the floor stays on the floor. Respect that everyone's presence here is their own business."
  },
  {
    index: '05',
    title: 'Respect the door',
    text: "Our door policy balances safety and freedom for all. It exists to keep the space open and welcoming — and we hold it firmly."
  }
]

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
  new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })

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