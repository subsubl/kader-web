<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">
    <!-- ===== Immersive Hero (distinct from rest of site) ===== -->
    <section class="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
      <img
        :src="getOptImg(siteImages.club_hero_bg, 1920, 85)"
        alt="Kader club atmosphere"
        class="absolute inset-0 w-full h-full object-cover opacity-50"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/60 to-transparent"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 md:pb-20 w-full">
        <!-- Live Sound & Venue Status Pill -->
        <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/80 border border-kader-red/50 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(237,34,36,0.3)]">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-kader-red opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-kader-red"></span>
          </span>
          <span class="text-[11px] uppercase font-mono tracking-widest text-kader-red font-bold">
            VAULT ACOUSTICS ONLINE · 134 BPM · KLIPSCH LA SCALA
          </span>
        </div>

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

    <!-- Inline DJ Player Component -->
    <ClubDjPlayer />

    <!-- ===== The Floors ===== -->
    <section class="py-16 md:py-24 px-4 bg-gradient-to-b from-kader-black to-[#1a0506]">
      <div class="max-w-6xl mx-auto">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('club.exploreSpaces') }}</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-14 uppercase">{{ t('club.floorsTitle') }}</h2>

        <!-- FLOOR 01: BASEMENT -->
        <div class="mb-2 group">
          <div class="relative overflow-hidden rounded-3xl">
            <img
              :src="getOptImg(siteImages.club_floor1_bg, 1200, 80)"
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
              :src="getOptImg(siteImages.club_floor2_bg, 1200, 80)"
              alt="Kader Outdoor Terrace Party"
              loading="lazy"
              decoding="async"
              class="w-full h-72 md:h-[440px] object-cover object-center brightness-[0.6] group-hover:brightness-[0.75] transition-all duration-700"
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
              :src="getOptImg(siteImages.club_sound_system, 800, 80)"
              alt="Klipsch La Scala audio system at Kader"
              loading="lazy"
              decoding="async"
              class="w-full h-64 object-contain bg-black/60 p-4 rounded-xl mb-6 border border-kader-red/30"
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

    <!-- ===== Berlin Door Policy & Venue FAQ Accordion ===== -->
    <section class="py-20 md:py-28 px-4 bg-gradient-to-b from-[#120506] to-kader-black">
      <div class="max-w-4xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <p class="text-xs uppercase tracking-[0.35em] text-kader-red font-semibold mb-3">
            {{ t('club.doorPolicySub') }}
          </p>
          <h2 class="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            {{ t('club.doorPolicyTitle') }}
          </h2>
          <div class="w-16 h-1 bg-kader-red mx-auto mt-4 rounded-full"></div>
        </div>

        <!-- Interactive Accordion List -->
        <div class="space-y-4">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.id"
            class="rounded-2xl border transition-all duration-300 overflow-hidden"
            :class="openFaqIndex === idx ? 'bg-[#18090a] border-kader-red/60 shadow-[0_0_25px_rgba(237,34,36,0.15)]' : 'bg-[#0f0405] border-kader-cream/10 hover:border-kader-red/30'"
          >
            <!-- Accordion Header Button -->
            <button
              type="button"
              @click="toggleFaq(idx)"
              class="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-kader-red cursor-pointer"
              :aria-expanded="openFaqIndex === idx"
              :aria-controls="'faq-content-' + idx"
            >
              <div class="flex items-center gap-4 md:gap-6 min-w-0">
                <span class="font-mono text-sm md:text-base font-bold text-kader-red shrink-0">
                  0{{ idx + 1 }}
                </span>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      v-if="item.badge"
                      class="px-2 py-0.5 text-[10px] font-mono font-black uppercase rounded tracking-wider"
                      :class="item.id === 'photo' ? 'bg-red-600 text-white animate-pulse' : 'bg-kader-red/20 text-kader-red border border-kader-red/40'"
                    >
                      {{ item.badge }}
                    </span>
                  </div>
                  <h3 class="text-lg md:text-xl font-bold text-white tracking-tight">
                    {{ item.title }}
                  </h3>
                </div>
              </div>

              <!-- Animated Chevron -->
              <div
                class="w-8 h-8 rounded-full border border-kader-cream/20 flex items-center justify-center shrink-0 transition-transform duration-300"
                :class="openFaqIndex === idx ? 'rotate-180 bg-kader-red border-kader-red text-white' : 'text-kader-cream/60 group-hover:text-white'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </button>

            <!-- Smooth Grid Transition Body -->
            <div
              :id="'faq-content-' + idx"
              class="grid transition-all duration-300 ease-out"
              :style="{ gridTemplateRows: openFaqIndex === idx ? '1fr' : '0fr' }"
            >
              <div class="overflow-hidden">
                <div class="px-6 pb-6 md:px-8 md:pb-8 pt-2 border-t border-kader-cream/10 text-kader-cream/80 text-sm md:text-base leading-relaxed">
                  <!-- Highlight summary badge -->
                  <p class="font-semibold text-white mb-2 flex items-center gap-2">
                    <span class="text-kader-red">↳</span>
                    {{ item.highlight }}
                  </p>
                  <p>{{ item.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Upcoming nights (RA-synced, Dark Techno Grid & Countdown) ===== -->
    <section class="py-20 md:py-28 px-4 bg-[#120506]">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header with RA club link -->
        <div class="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2">{{ t('club.lineup') }}</p>
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white">{{ t('club.upcomingNights') }}</h2>
          </div>
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 border border-kader-red/40 hover:border-kader-red rounded-xl text-sm text-kader-cream hover:bg-kader-red/10 transition-colors"
          >
            <span>{{ t('club.viewAllRA') }}</span>
            <svg class="w-4 h-4 text-kader-red" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

        <!-- Live Event Countdown Banner -->
        <div v-if="nextEvent" class="mb-12 bg-black/70 border border-kader-red/40 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="text-center md:text-left">
              <div class="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-kader-red opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-kader-red"></span>
                </span>
                <span class="text-xs uppercase font-mono tracking-widest text-kader-red font-bold">
                  {{ t('club.nextEventIn') }}
                </span>
              </div>
              <h4 class="text-xl md:text-2xl font-black uppercase text-white">{{ nextEvent.title }}</h4>
              <p class="text-xs text-kader-cream/60 font-mono mt-1">{{ formatFullDate(nextEvent.date) }}</p>
            </div>

            <!-- Real-Time Countdown Blocks -->
            <div class="grid grid-cols-4 gap-2 sm:gap-3 text-center font-mono">
              <div class="bg-[#1a0608] border border-kader-red/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[62px]">
                <span class="text-2xl sm:text-3xl font-black text-white block">{{ countdown.days }}</span>
                <span class="text-[9px] sm:text-[10px] text-kader-cream/50 uppercase tracking-widest">{{ t('club.countdownDays') }}</span>
              </div>
              <div class="bg-[#1a0608] border border-kader-red/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[62px]">
                <span class="text-2xl sm:text-3xl font-black text-white block">{{ countdown.hours }}</span>
                <span class="text-[9px] sm:text-[10px] text-kader-cream/50 uppercase tracking-widest">{{ t('club.countdownHours') }}</span>
              </div>
              <div class="bg-[#1a0608] border border-kader-red/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[62px]">
                <span class="text-2xl sm:text-3xl font-black text-white block">{{ countdown.minutes }}</span>
                <span class="text-[9px] sm:text-[10px] text-kader-cream/50 uppercase tracking-widest">{{ t('club.countdownMinutes') }}</span>
              </div>
              <div class="bg-[#1a0608] border border-kader-red/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[62px]">
                <span class="text-2xl sm:text-3xl font-black text-kader-red block animate-pulse">{{ countdown.seconds }}</span>
                <span class="text-[9px] sm:text-[10px] text-kader-cream/50 uppercase tracking-widest">{{ t('club.countdownSeconds') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20 text-kader-cream/40">
          <svg class="animate-spin h-10 w-10 text-kader-red" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="bg-kader-red/10 border border-kader-red/40 rounded-2xl p-10 text-center">
          <p class="text-kader-cream/80 mb-4">{{ t('club.loadLineupError') }}</p>
          <button @click="loadClubEvents" class="px-6 py-2 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-lg font-semibold transition-colors">
            {{ t('club.retry') }}
          </button>
        </div>

        <!-- Modern Dark Techno Card Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in displayEvents"
            :key="event.ra_id"
            class="bg-[#0e0405] border border-kader-red/20 hover:border-kader-red/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(237,34,36,0.2)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <!-- Flyer / Photo Container -->
              <div class="relative h-48 sm:h-52 overflow-hidden bg-black">
                <img
                  :src="event.flyer_url || fallbackImage"
                  :alt="event.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] group-hover:brightness-90"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0e0405] via-transparent to-black/40"></div>

                <!-- Date Badge -->
                <div class="absolute top-3 left-3 bg-black/80 border border-kader-red/40 backdrop-blur-md px-3 py-1 rounded-lg">
                  <span class="font-mono text-xs font-bold text-white uppercase">{{ listDate(event) }}</span>
                </div>

                <!-- Price Badge -->
                <div class="absolute top-3 right-3 bg-kader-red text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">
                  {{ event.cost !== null && event.cost !== undefined ? (event.cost === 0 ? 'FREE' : `€${event.cost}`) : 'RA PRE-SALE' }}
                </div>
              </div>

              <!-- Content Info -->
              <div class="p-5 md:p-6">
                <!-- Genre Tags -->
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="genre in (event.genres && event.genres.length ? event.genres : ['Techno', 'Electronic'])"
                    :key="genre"
                    class="px-2 py-0.5 bg-kader-red/10 border border-kader-red/30 text-kader-cream/80 text-[10px] font-bold uppercase tracking-wider rounded"
                  >
                    {{ genre }}
                  </span>
                </div>

                <h3 class="text-xl font-black uppercase text-white group-hover:text-kader-red transition-colors mb-2 line-clamp-2">
                  {{ event.title }}
                </h3>

                <p v-if="event.artists && event.artists.length" class="text-xs text-kader-cream/70 font-mono mb-4 line-clamp-2">
                  <span class="text-kader-red">Lineup:</span> {{ event.artists.join(', ') }}
                </p>
              </div>
            </div>

            <!-- Direct RA Ticket CTA -->
            <div class="p-5 md:p-6 pt-0 border-t border-kader-cream/5 mt-auto">
              <a
                :href="event.ra_url || 'https://ra.co/clubs/78778'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 px-4 bg-kader-red/20 hover:bg-kader-red text-kader-cream hover:text-white border border-kader-red/40 hover:border-kader-red rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(237,34,36,0.4)] cursor-pointer"
              >
                <span>{{ t('club.buyTicketsRA') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
            </div>
          </div>
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
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const { locale, t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

interface ClubEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  flyer_url: string | null
  ra_url: string | null
  cost?: number | null
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

// Accordion state
const openFaqIndex = ref<number | null>(0)
const toggleFaq = (idx: number) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx
}

const faqItems = computed(() => [
  {
    id: 'photo',
    badge: t('club.faqPhotoBadge'),
    title: t('club.faqPhotoTitle'),
    highlight: t('club.faqPhotoHighlight'),
    content: t('club.faqPhotoText')
  },
  {
    id: 'dress',
    badge: t('club.faqDressBadge'),
    title: t('club.faqDressTitle'),
    highlight: t('club.faqDressHighlight'),
    content: t('club.faqDressText')
  },
  {
    id: 'age',
    badge: t('club.faqAgeBadge'),
    title: t('club.faqAgeTitle'),
    highlight: t('club.faqAgeHighlight'),
    content: t('club.faqAgeText')
  },
  {
    id: 'safer',
    badge: t('club.faqSaferBadge'),
    title: t('club.faqSaferTitle'),
    highlight: t('club.faqSaferHighlight'),
    content: t('club.faqSaferText')
  },
  {
    id: 'payment',
    badge: t('club.faqPaymentBadge'),
    title: t('club.faqPaymentTitle'),
    highlight: t('club.faqPaymentHighlight'),
    content: t('club.faqPaymentText')
  },
  {
    id: 'sound',
    badge: t('club.faqSoundBadge'),
    title: t('club.faqSoundTitle'),
    highlight: t('club.faqSoundHighlight'),
    content: t('club.faqSoundText')
  }
])

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

const curatedEvents: ClubEvent[] = [
  {
    ra_id: 101,
    title: 'Kader Vault: Hypnotic Techno Night',
    date: new Date(Date.now() + 2 * 86400000 + 5 * 3600000).toISOString(),
    start_time: '23:00',
    flyer_url: '/images/instagram/ig_img_3.jpg',
    ra_url: 'https://ra.co/clubs/78778',
    cost: 12,
    artists: ['Vault Resident', 'Berlin Guest Live', 'Sub-Acoustic'],
    genres: ['Techno', 'Hypnotic', 'Live']
  },
  {
    ra_id: 102,
    title: 'Klipsch Sound System Night: Low-End Theory',
    date: new Date(Date.now() + 8 * 86400000 + 4 * 3600000).toISOString(),
    start_time: '23:00',
    flyer_url: '/images/instagram/ig_img_5.jpg',
    ra_url: 'https://ra.co/clubs/78778',
    cost: 10,
    artists: ['Analog Drift', 'Modular Ritual', 'Kader Crew'],
    genres: ['Industrial', 'Minimal', 'Electro']
  },
  {
    ra_id: 103,
    title: 'Castle Nightfall: Ambient & Deep Electronics',
    date: new Date(Date.now() + 15 * 86400000 + 3 * 3600000).toISOString(),
    start_time: '22:00',
    flyer_url: '/images/instagram/ig_img_1.jpg',
    ra_url: 'https://ra.co/clubs/78778',
    cost: 0,
    artists: ['Dub Techno Collective', 'Castle Acoustic Ensemble'],
    genres: ['Dub Techno', 'Deep', 'Ambient']
  }
]

const displayEvents = computed<ClubEvent[]>(() => {
  if (clubEvents.value && clubEvents.value.length > 0) {
    return clubEvents.value
  }
  return curatedEvents
})

const nextEvent = computed<ClubEvent | undefined>(() => {
  return displayEvents.value[0]
})

const countdown = reactive({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let countdownInterval: number | null = null

const updateCountdown = () => {
  if (!nextEvent.value) return
  const targetTime = new Date(nextEvent.value.date).getTime()
  const now = Date.now()
  const diff = Math.max(0, targetTime - now)

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.days = String(d).padStart(2, '0')
  countdown.hours = String(h).padStart(2, '0')
  countdown.minutes = String(m).padStart(2, '0')
  countdown.seconds = String(s).padStart(2, '0')
}

const listDate = (e: ClubEvent) =>
  new Date(e.date).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', { weekday: 'short', day: '2-digit', month: 'short' })

const formatFullDate = (d: string) => {
  return new Date(d).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
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
    loadError.value = t('club.loadLineupError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadClubEvents()
  updateCountdown()
  if (typeof window !== 'undefined') {
    countdownInterval = window.setInterval(updateCountdown, 1000)
  }
})

onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>