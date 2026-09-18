<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">
    <!-- ===== Immersive Hero (distinct from rest of site) ===== -->
    <section class="relative h-[38vh] min-h-[280px] md:min-h-[340px] flex items-center overflow-hidden">
      <img
        :src="assetUrl(siteImages.club_hero_bg || '/images/club-red-hero.jpg')"
        :alt="t('club.heroAlt')"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-110 opacity-85 transition-transform duration-700"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/40 to-black/30"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-2 text-kader-red font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {{ t('club.location') }}
        </p>
        <h1 class="text-4xl md:text-6xl font-black leading-tight mb-3 uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] [text-shadow:_0_4px_20px_rgb(0_0_0_/_90%)]">
          Club Kader
        </h1>
        <p class="text-sm md:text-lg max-w-2xl text-kader-cream/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {{ t('club.heroTagline') }}
        </p>
      </div>
    </section>

    <!-- ===== Consolidated Events Experience (Prihajajoči Dogodki) - MOVED TO TOP ===== -->
    <section id="events" class="py-16 md:py-24 px-4 bg-[#120506]">
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
        <div v-if="nextEvent" class="mb-10 bg-black/70 border border-kader-red/40 rounded-2xl p-6 md:p-8 backdrop-blur-md">
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

        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer"
            :class="activeCategory === cat.id ? 'bg-kader-red text-white shadow-[0_0_15px_rgba(237,34,36,0.4)]' : 'bg-zinc-900/80 text-kader-cream/70 hover:text-white hover:bg-zinc-800 border border-zinc-800'"
          >
            {{ cat.label }}
          </button>
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

        <!-- Empty State -->
        <div v-else-if="displayEvents.length === 0" class="bg-kader-red/5 border border-kader-red/20 rounded-2xl p-16 text-center text-kader-cream/50">
          <p class="text-lg mb-2">{{ t('events.noUpcoming', { filter: '' }) }}</p>
          <p class="text-sm">{{ t('club.newLineups') }}</p>
        </div>

        <!-- Modern Dark Techno Card Grid with Modal Trigger -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in displayEvents"
            :key="event.ra_id"
            @click="openModal(event)"
            class="bg-[#0e0405] border border-kader-red/20 hover:border-kader-red/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(237,34,36,0.2)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <!-- Flyer / Photo Container -->
              <div class="relative overflow-hidden aspect-[4/3] bg-black">
                <img
                  :src="event.flyer_url || fallbackImage"
                  :alt="event.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75] group-hover:brightness-95"
                  @error="onImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0e0405] via-transparent to-black/40"></div>

                <!-- Genre Badge -->
                <div v-if="event.genres && event.genres[0]" class="absolute top-4 left-4 px-3 py-1 bg-kader-red/90 text-white text-xs font-black uppercase tracking-widest rounded-full">
                  {{ event.genres[0] }}
                </div>

                <!-- Date Badge -->
                <div class="absolute bottom-4 left-4 bg-black/80 border border-kader-red/40 backdrop-blur-md px-3 py-1 rounded-lg">
                  <span class="font-mono text-xs font-bold text-white uppercase">{{ listDate(event) }}</span>
                </div>

                <!-- Price / Free Badge -->
                <div v-if="event.cost === 0 || event.ticket_provider === 'free'" class="absolute bottom-4 right-4 px-3 py-1 bg-emerald-900/80 border border-emerald-700 text-emerald-300 text-xs font-black rounded-lg">
                  {{ t('events.freeEntry') }}
                </div>
                <div v-else-if="event.cost !== null && event.cost !== undefined" class="absolute bottom-4 right-4 bg-kader-red text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">
                  {{ event.cost }} €
                </div>
                <div v-else class="absolute bottom-4 right-4 bg-kader-red text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">
                  {{ t('club.ticketPreSale') }}
                </div>
              </div>

              <!-- Content Info -->
              <div class="p-5 md:p-6">
                <!-- Genre Tags -->
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="genre in (event.genres && event.genres.length ? event.genres : [t('club.genreTechno'), t('club.genreElectronic')])"
                    :key="genre"
                    class="px-2 py-0.5 bg-kader-red/10 border border-kader-red/30 text-kader-cream/80 text-[10px] font-bold uppercase tracking-wider rounded"
                  >
                    {{ genre }}
                  </span>
                </div>

                <h3 class="text-xl font-black uppercase text-white group-hover:text-kader-red transition-colors mb-2 line-clamp-2">
                  {{ event.title }}
                </h3>

                <p v-if="event.artists && event.artists.length" class="text-xs text-kader-cream/70 font-mono mb-2 line-clamp-2">
                  <span class="text-kader-red">{{ t('club.lineupLabel') }}</span> {{ event.artists.join(', ') }}
                </p>

                <p v-if="event.start_time" class="text-xs text-kader-cream/40 font-mono">
                  {{ formatTime(event.start_time) }}{{ event.end_time ? ' – ' + formatTime(event.end_time) : '' }}
                </p>
              </div>
            </div>

            <!-- Card Bottom Bar: Details CTA & External RA link -->
            <div class="p-5 md:p-6 pt-0 border-t border-kader-cream/5 mt-auto flex items-center justify-between gap-3">
              <span class="text-xs text-kader-red font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                {{ t('events.details') }}
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </span>
              <a
                :href="event.ra_url || 'https://ra.co/clubs/78778'"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
                class="text-xs text-kader-cream/60 hover:text-white inline-flex items-center gap-1 px-2.5 py-1 rounded border border-kader-cream/10 hover:border-kader-red/40 transition-colors"
              >
                <span>RA</span>
                <svg class="w-3 h-3 text-kader-red" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- ===== Venue statement (editorial) - MOVED BELOW UPCOMING EVENTS & BEFORE PAST EVENTS ===== -->
        <div class="mt-20 pt-16 border-t border-kader-cream/10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-4">
              <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('club.theVenue') }}</p>
              <h2 class="text-3xl md:text-5xl font-black leading-tight text-white">{{ t('club.venueTitle') }}</h2>
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

        <!-- ===== Past Events Archive ===== -->
        <div v-if="pastEvents.length > 0" class="mt-20 pt-12 border-t border-kader-cream/10">
          <div class="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-1">{{ t('events.archive') }}</p>
              <h3 class="text-2xl md:text-3xl font-black uppercase text-white">{{ t('events.pastEvents') }}</h3>
            </div>
          </div>

          <div v-if="pastLoading" class="flex items-center justify-center py-10 text-kader-cream/30">
            <svg class="animate-spin h-8 w-8 text-kader-red" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <button
              v-for="pastEv in pastEvents"
              :key="pastEv.ra_id"
              type="button"
              @click="openModal(pastEv)"
              class="w-full flex items-center justify-between gap-4 py-4 px-4 rounded-2xl bg-black/40 hover:bg-zinc-900/60 border border-kader-cream/5 hover:border-kader-red/30 transition-all text-left group cursor-pointer"
            >
              <div class="flex items-center space-x-4 min-w-0">
                <img
                  :src="pastEv.flyer_url || fallbackImage"
                  :alt="pastEv.title"
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
                  class="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-kader-cream/10"
                  @error="onImageError"
                >
                <div class="min-w-0">
                  <p class="font-bold text-white truncate group-hover:text-kader-red transition-colors">{{ pastEv.title }}</p>
                  <p v-if="pastEv.artists && pastEv.artists.length" class="text-xs text-kader-cream/50 truncate mt-0.5">{{ pastEv.artists.join(', ') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="font-mono text-xs text-kader-cream/40">{{ pastDateLabel(pastEv.date) }}</span>
                <svg class="w-4 h-4 text-kader-cream/30 group-hover:text-kader-red group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== Berlin Door Policy & Venue FAQ Accordion (Retained Culture / Safety) ===== -->
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

    <!-- ===== Private events / Takeover CTA ===== -->
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

    <!-- ===== Interactive Event Detail Modal (Teleported with Pretix) ===== -->
    <Teleport to="body">
      <div
        v-if="selectedEvent"
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="bg-[#0e0404] border border-kader-red/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto relative">

          <!-- Close button -->
          <button
            type="button"
            @click="closeModal"
            class="absolute top-4 right-4 z-20 bg-black/60 hover:bg-kader-red text-kader-cream w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-kader-cream/20 text-sm font-bold cursor-pointer"
            :aria-label="t('events.closeModal')"
          >✕</button>

          <!-- Flyer image banner -->
          <div class="relative w-full max-h-80 overflow-hidden bg-black flex items-center justify-center">
            <img
              :src="selectedEvent.flyer_url || fallbackImage"
              :alt="selectedEvent.title"
              decoding="async"
              class="w-full h-auto max-h-80 object-contain"
              @error="onImageError"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-[#0e0404] via-transparent to-transparent opacity-90"></div>
          </div>

          <!-- Content Details -->
          <div class="p-6 md:p-8 space-y-5">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span
                  v-for="genre in selectedEvent.genres"
                  :key="genre"
                  class="px-3 py-1 bg-kader-red/20 border border-kader-red/40 text-kader-red rounded-full text-xs font-bold uppercase tracking-wider"
                >{{ genre }}</span>
                <span class="px-3 py-1 bg-kader-cream/10 text-kader-cream/60 rounded-full text-xs font-medium">
                  {{ formatFullDate(selectedEvent.date) }}
                </span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase">{{ selectedEvent.title }}</h2>
              <p class="text-sm text-kader-cream/50 flex items-center gap-2">
                <span>{{ t('events.modalLocation') }}</span>
                <span v-if="selectedEvent.start_time">· {{ formatTime(selectedEvent.start_time) }}{{ selectedEvent.end_time ? ' – ' + formatTime(selectedEvent.end_time) : '' }}</span>
              </p>
            </div>

            <!-- Artists roster -->
            <div v-if="selectedEvent.artists && selectedEvent.artists.length > 0" class="bg-kader-cream/5 border border-kader-cream/10 p-4 rounded-2xl">
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
              <h4 class="text-xs font-bold text-kader-cream/40 uppercase tracking-wider mb-2">{{ t('events.lineupHeading') }}</h4>
              <p class="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-line">{{ cleanLineup(selectedEvent.lineup) }}</p>
            </div>

            <!-- Upcoming ticket action footer -->
            <div v-if="!isPastEvent(selectedEvent)" class="pt-4 border-t border-kader-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span class="text-xs text-kader-cream/40 block uppercase font-bold tracking-wider mb-1">{{ t('events.ticketPriceLabel') }}</span>
                <span class="text-2xl font-black text-white">
                  {{ selectedEvent.cost === 0 || selectedEvent.ticket_provider === 'free' ? t('events.freeAdmission') : (selectedEvent.cost ? selectedEvent.cost + ' €' : t('events.freeAdmission')) }}
                </span>
              </div>
              <div class="w-full sm:w-auto">
                <div v-if="selectedEvent.ticket_provider === 'free' || selectedEvent.cost === 0"
                  class="px-6 py-3 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-xl text-center text-sm">
                  {{ t('events.freeAdmission') }}
                </div>
                <a
                  v-else-if="selectedEvent.ticket_provider === 'olaii' || (selectedEvent.ticket_url && selectedEvent.ticket_url.includes('olaii'))"
                  :href="selectedEvent.ticket_url || 'https://olaii.com'"
                  target="_blank" rel="noopener noreferrer"
                  class="w-full sm:w-auto px-8 py-3.5 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-white font-black rounded-xl text-center transition-all flex items-center justify-center text-sm uppercase tracking-wider"
                >{{ t('events.buyOnOlaii') }}</a>
                <a
                  v-else
                  :href="selectedEvent.ticket_url || selectedEvent.pretix_event_url || selectedEvent.ra_url || 'https://ra.co/clubs/78778'"
                  target="_blank" rel="noopener noreferrer"
                  class="w-full sm:w-auto px-8 py-3.5 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-white font-black rounded-xl text-center transition-all flex items-center justify-center text-sm uppercase tracking-wider"
                >{{ t('events.buyTicket') }}</a>
              </div>
            </div>

            <!-- Past event notice footer -->
            <div v-else class="pt-4 border-t border-kader-cream/10 flex items-center justify-between">
              <span class="text-xs text-kader-cream/30 uppercase font-bold tracking-wider">{{ t('events.pastEventNotice') }}</span>
              <span class="px-4 py-2 bg-kader-cream/10 border border-kader-cream/10 text-kader-cream/40 text-xs font-bold rounded-xl">{{ t('events.concludedBadge') }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import eventSnapshot from '~/data/events.json'
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useSiteImages } from '~/composables/useSiteImages'
import { usePageSeo, EXACT_GEO, CANONICAL_ADDRESS, CANONICAL_CONTACTS } from '~/composables/usePageSeo'

const { locale, t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

export interface ClubEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  end_time?: string | null
  cost?: number | null
  flyer_url: string | null
  ra_url: string | null
  lineup?: string | null
  artists: string[]
  genres: string[]
  pretix_event_url?: string | null
  ticket_provider?: string | null
  ticket_url?: string | null
}

export type RaEvent = ClubEvent

// Event State & Modals
const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'

const loading = ref(true)
const loadError = ref('')
const events = ref<ClubEvent[]>([])
const pastEvents = ref<ClubEvent[]>([])
const pastLoading = ref(true)
const selectedEvent = ref<ClubEvent | null>(null)

// Category Filters
const activeCategory = ref('all')
const categoryFilters = computed(() => [
  { id: 'all', label: t('events.allEvents') },
  { id: 'club', label: t('events.filterClub') },
  { id: 'live', label: t('events.filterLive') },
  { id: 'pizzeria', label: t('events.filterPizzeria') }
])

const clubEvents = computed(() =>
  events.value.filter((e) => {
    const genre = (e.genres[0] || '').toLowerCase()
    const title = (e.title || '').toLowerCase()
    return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
  })
)

// Only the checked-in RA snapshot is displayed. No invented fallback events.
const displayEvents = computed<ClubEvent[]>(() => {
  let list = events.value
  if (activeCategory.value !== 'all') {
    list = list.filter(e => {
      const g = (e.genres || []).join(' ').toLowerCase()
      const title = (e.title || '').toLowerCase()
      if (activeCategory.value === 'club') {
        return g.includes('techno') || g.includes('house') || g.includes('club') || g.includes('electro') || title.includes('techno') || title.includes('night') || title.includes('vault')
      }
      if (activeCategory.value === 'live') {
        return g.includes('live') || g.includes('ambient') || g.includes('modular') || title.includes('live') || title.includes('acoustic')
      }
      if (activeCategory.value === 'pizzeria') {
        return g.includes('pizzeria') || g.includes('acoustic') || g.includes('ambient') || title.includes('pizzeria')
      }
      return true
    })
  }
  return list
})

// Structured Data Schema Markup (NightClub + Dynamic Events)
const clubSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NightClub',
      '@id': 'https://www.kader.si/club#club',
      'name': 'Club Kader Grad Kodeljevo',
      'alternateName': 'Kader Electronic Music Club',
      'description': t('club.heroTagline') || 'Intimni kletni klub in plesišče z avdiofilskim ozvočenjem Klipsch La Scala AL6, zvočno izoliranim obokom in izbranim programom elektronske glasbe.',
      'url': 'https://www.kader.si/club',
      'telephone': CANONICAL_CONTACTS.reservationsPhone,
      'priceRange': '€€',
      'currenciesAccepted': 'EUR',
      'paymentAccepted': 'Cash, Credit Card, Contactless, Apple Pay, Google Pay',
      'address': CANONICAL_ADDRESS,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': EXACT_GEO.latitude,
        'longitude': EXACT_GEO.longitude
      },
      'hasMap': CANONICAL_CONTACTS.googleMapsUrl,
      'image': [
        'https://www.kader.si/logo-banner.png',
        'https://www.kader.si/hero-bg.jpg'
      ],
      'maximumAttendeeCapacity': 300,
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Friday', 'Saturday'],
          'opens': '23:00',
          'closes': '05:00',
          'description': 'Klubske noči & elektronski dogodki'
        }
      ],
      'amenityFeature': [
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Audiophile Sound System',
          'value': 'Klipsch La Scala AL6 3-way fully horn-loaded system with QUAD Class A and CREST C12 amplification'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Acoustic Vault',
          'value': 'Stone vaulted basement with custom acoustic dampening and low illumination'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'No Photo Policy',
          'value': 'Camera lens stickers provided at entry; strict privacy and freedom on the dancefloor'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Hearing Protection',
          'value': 'Free high-fidelity earplugs available at all bars'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Awareness Team',
          'value': 'Active on-site Safer Spaces awareness team'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Supervised Cloakroom',
          'value': 'Secure wardrobe service available throughout the night'
        }
      ]
    },
    ...(displayEvents.value || []).slice(0, 5).map((e: any) => ({
      '@type': 'Event',
      '@id': `https://www.kader.si/club#event-${e.ra_id || e.id || String(e.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      'name': e.title,
      'description': e.lineup ? cleanLineup(e.lineup) : (e.artists?.length ? `Nastopajo: ${e.artists.join(', ')}` : t('club.heroTagline')),
      'startDate': e.date,
      'endDate': e.end_time || e.date,
      'url': e.ra_url || 'https://www.kader.si/club',
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'image': [e.flyer_url || 'https://www.kader.si/logo-banner.png'],
      'location': {
        '@type': 'Place',
        'name': 'Club Kader (Grad Kodeljevo)',
        'address': CANONICAL_ADDRESS,
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': EXACT_GEO.latitude,
          'longitude': EXACT_GEO.longitude
        }
      },
      'organizer': {
        '@type': 'Organization',
        'name': 'Club Kader Grad Kodeljevo',
        'url': 'https://www.kader.si'
      },
      'performer': (e.artists || []).map((art: string) => ({
        '@type': 'PerformingGroup',
        'name': art
      })),
      'offers': {
        '@type': 'Offer',
        'name': 'Vstopnica za dogodek',
        'price': typeof e.cost === 'number' ? String(e.cost) : '12.00',
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock',
        'url': e.ticket_url || e.ra_url || 'https://ra.co/clubs/78778'
      }
    }))
  ]
}))

usePageSeo({
  path: '/club',
  titleKey: 'seo.club.title',
  descKey: 'seo.club.description',
  ogTitleKey: 'seo.club.ogTitle',
  ogDescKey: 'seo.club.ogDescription',
  schema: clubSchema
})

// Door Policy FAQ Accordion State (Retained 6 Pillars)
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

const nextEvent = computed<ClubEvent | undefined>(() => {
  return displayEvents.value[0]
})

// Real-Time Countdown Engine
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

// Date & Time Formatting Utilities
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

const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' }) : ''

const pastDateLabel = (d: string) => new Date(d).toLocaleDateString(locale.value === 'sl' ? 'sl-SI' : 'en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
})

// Modal & Interaction Handlers
const openModal = (event: ClubEvent) => {
  selectedEvent.value = event
}

const closeModal = () => {
  selectedEvent.value = null
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal()
}

const onImageError = (e: Event) => {
  const img = e.currentTarget as HTMLImageElement | null
  if (img) img.src = fallbackImage
}

const cleanLineup = (raw: string | null) => (raw ? raw.replace(/<[^>]*>/g, '').trim() : '')

const isPastEvent = (event: ClubEvent | null) => {
  if (!event) return false
  const time = new Date(event.end_time || event.date).getTime()
  return time < Date.now()
}

function normalizeEvent(e: any): ClubEvent {
  return {
    ...e,
    artists: Array.isArray(e.artists) ? e.artists : [],
    genres: Array.isArray(e.genres) ? e.genres : []
  }
}

// Data Fetching
const loadClubEvents = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const data = eventSnapshot.events.filter(e => new Date(e.end_time || e.date).getTime() >= Date.now())
    events.value = (data || []).map(normalizeEvent)
  } catch (err: any) {
    console.error('Failed to load club events:', err)
    loadError.value = t('club.loadLineupError')
  } finally {
    loading.value = false
  }
}

const loadPastEvents = async () => {
  pastLoading.value = true
  try {
    const data = eventSnapshot.events.filter(e => new Date(e.end_time || e.date).getTime() < Date.now())
    pastEvents.value = (data || [])
      .map(normalizeEvent)
      .sort((a, b) => new Date(b.end_time || b.date).getTime() - new Date(a.end_time || a.date).getTime())
  } catch (err: any) {
    console.error('Failed to load past RA events:', err)
  } finally {
    pastLoading.value = false
  }
}

// Modal body scroll lock management
watch(selectedEvent, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

// Lifecycle Hooks
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
    countdownInterval = window.setInterval(updateCountdown, 1000)
  }
  loadClubEvents()
  loadPastEvents()
  updateCountdown()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>