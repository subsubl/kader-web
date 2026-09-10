<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      <div 
        class="absolute inset-0 z-10 transition-colors duration-700 pointer-events-none"
        :class="ambientMode === 'day' 
          ? 'bg-gradient-to-t from-black via-red-950/20 to-black/70' 
          : 'bg-gradient-to-t from-black via-red-950/30 to-purple-950/20'"
      ></div>
      <img :src="getOptImg(siteImages.home_hero_bg, 1920, 85)" alt="Grad Kodeljevo Castle" class="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
      
      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <img src="/logo-banner.png" alt="Kader Grad Kodeljevo Logo" class="h-24 md:h-32 object-contain mb-8 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-fade-in" />
        
        <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white uppercase">
          {{ t('hero.title') }}
        </h1>
        <p 
          class="text-xl md:text-2xl font-bold mb-8 tracking-widest uppercase transition-colors duration-500"
          :class="ambientMode === 'day' ? 'text-red-500' : 'text-red-500'"
        >
          “{{ ambientMode === 'day' ? 'Pristna neapeljska pica & sproščeni grajski vrt' : t('hero.tagline') }}”
        </p>

        <!-- Interactive Ambient Mode Switcher (Day vs Night) -->
        <div 
          class="inline-flex items-center p-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-xl shadow-2xl mb-8 relative transition-all duration-500"
          :class="ambientMode === 'day' ? 'shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'"
          role="radiogroup"
          aria-label="Izbira ambienta: Dnevni bistro ali Nočni klub"
        >
          <button
            type="button"
            role="radio"
            :aria-checked="ambientMode === 'day'"
            @click="setAmbientMode('day')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 min-h-[44px]"
            :class="ambientMode === 'day' 
              ? 'text-white bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg shadow-red-950/60' 
              : 'text-zinc-400 hover:text-zinc-200'"
          >
            <span class="text-base">🍕</span>
            <span>Dnevni Bistro</span>
            <span v-if="ambientMode === 'day'" class="w-2 h-2 rounded-full bg-red-200 animate-pulse"></span>
          </button>

          <button
            type="button"
            role="radio"
            :aria-checked="ambientMode === 'night'"
            @click="setAmbientMode('night')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 min-h-[44px]"
            :class="ambientMode === 'night' 
              ? 'text-white bg-gradient-to-r from-red-600 via-red-500 to-purple-700 shadow-lg shadow-red-950/80' 
              : 'text-zinc-400 hover:text-zinc-200'"
          >
            <span class="text-base">🪩</span>
            <span>Nočni Klub</span>
            <span v-if="ambientMode === 'night'" class="w-2 h-2 rounded-full bg-red-200 animate-pulse"></span>
          </button>
        </div>

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

        <!-- Dynamic CTAs -->
        <div class="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
          <NuxtLink 
            v-if="ambientMode === 'day'" 
            to="/pizzeria" 
            class="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-950 text-center flex-1 min-w-[170px]"
          >
            Pica Meni & Telefon →
          </NuxtLink>
          <NuxtLink 
            v-else 
            to="/events" 
            class="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-950 text-center flex-1 min-w-[170px]"
          >
            {{ t('hero.events') }} (RA) →
          </NuxtLink>

          <NuxtLink 
            to="/pizzeria" 
            class="px-8 py-3.5 bg-zinc-900 border hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]"
            :class="ambientMode === 'day' ? 'border-red-500/50 text-red-200' : 'border-zinc-700'"
          >
            {{ t('nav.pizzeria') }}
          </NuxtLink>
          <NuxtLink 
            to="/club" 
            class="px-8 py-3.5 bg-zinc-900 border hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]"
            :class="ambientMode === 'night' ? 'border-red-500/50 text-red-200' : 'border-zinc-700'"
          >
            {{ t('nav.club') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Dual Messaging Section -->
    <section class="py-20 px-4 bg-zinc-950 border-y border-zinc-900 transition-colors duration-700">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        <!-- Day Card (Pizzeria Bistro) -->
        <div 
          class="p-8 rounded-3xl flex flex-col justify-between transition-all duration-500"
          :class="ambientMode === 'day' 
            ? 'bg-gradient-to-b from-red-950/30 to-zinc-900/90 border-2 border-red-500/70 shadow-[0_0_50px_rgba(239,68,68,0.2)] scale-[1.01]' 
            : 'bg-zinc-900/60 border border-zinc-800/80 opacity-80 hover:opacity-100 hover:border-red-800/50'"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <span class="text-4xl">🍕</span>
                <h2 class="text-3xl font-black uppercase text-white">{{ t('home.dayTitle') }}</h2>
              </div>
              <span 
                v-if="ambientMode === 'day'" 
                class="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full"
              >
                ● Aktiven Ambient
              </span>
              <button 
                v-else 
                type="button" 
                @click="setAmbientMode('day')" 
                class="text-xs text-red-400 hover:underline font-bold"
              >
                Preklopi sem ↗
              </button>
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
          <NuxtLink 
            to="/pizzeria" 
            class="inline-block text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 min-h-[44px]"
            :class="ambientMode === 'day' 
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'"
          >
            {{ t('home.dayCta') }}
          </NuxtLink>
        </div>

        <!-- Night Card (Dance Club) -->
        <div 
          class="p-8 rounded-3xl flex flex-col justify-between transition-all duration-500"
          :class="ambientMode === 'night' 
            ? 'bg-gradient-to-b from-red-950/30 via-purple-950/20 to-zinc-900/90 border-2 border-red-600/70 shadow-[0_0_50px_rgba(239,68,68,0.25)] scale-[1.01]' 
            : 'bg-zinc-900/60 border border-zinc-800/80 opacity-80 hover:opacity-100 hover:border-purple-800/50'"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <span class="text-4xl">🪩</span>
                <h2 class="text-3xl font-black uppercase text-white">{{ t('home.nightTitle') }}</h2>
              </div>
              <span 
                v-if="ambientMode === 'night'" 
                class="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full"
              >
                ● Aktiven Ambient
              </span>
              <button 
                v-else 
                type="button" 
                @click="setAmbientMode('night')" 
                class="text-xs text-purple-400 hover:underline font-bold"
              >
                Preklopi sem ↗
              </button>
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
          <NuxtLink 
            to="/events" 
            class="inline-block text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 min-h-[44px]"
            :class="ambientMode === 'night' 
              ? 'bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 text-white shadow-lg shadow-red-950' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'"
          >
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
            <img :src="getOptImg(siteImages.home_basement_bg, 1200, 80)" alt="Basement Club Live Performance" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-125 saturate-75 group-hover:scale-105 transition-transform duration-700">
          </div>
        </div>

        <!-- 2nd Floor Segment -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div class="h-64 md:h-[450px] rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <div class="absolute inset-0 bg-purple-900/30 mix-blend-multiply z-10 transition-opacity group-hover:opacity-50"></div>
            <img :src="getOptImg(siteImages.home_second_floor_bg, 1200, 80)" alt="2nd Floor Pizzeria Lounge" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-125 saturate-110 group-hover:scale-105 transition-transform duration-700">
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
            <img :src="getOptImg(siteImages.home_terrace_bg, 1200, 80)" alt="Summer Terrace Party" loading="lazy" decoding="async" class="w-full h-full object-cover filter contrast-110 saturate-125 group-hover:scale-105 transition-transform duration-700">
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
              <img :src="getOptImg(event.image || fallbackImage, 600, 80)" :alt="event.title" loading="lazy" decoding="async" class="w-full h-full object-cover" @error="onImageError">
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

    <!-- ===== Instagram Feed & Gallery Section ===== -->
    <section class="py-20 px-4 bg-black border-t border-zinc-900">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div class="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-3">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@kader.lunapark</span>
            </div>
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">Kader V Slikah</h2>
          </div>
          <a 
            href="https://www.instagram.com/kader.lunapark/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
          >
            Sledi na Instagramu →
          </a>
        </div>

        <!-- Image Grid (Interactive Lightbox Triggers) -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <button 
            v-for="(item, idx) in siteImages.gallery_items" 
            :key="idx"
            type="button"
            @click="openLightbox(idx)"
            class="relative group aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-600/60 transition-all duration-500 text-left focus:outline-none focus:ring-2 focus:ring-red-500 cursor-zoom-in"
            :aria-label="`Poglej sliko v polni velikosti: ${item.label}`"
          >
            <img 
              :src="getOptImg(item.src, 640, 80)" 
              :alt="item.label" 
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <!-- Hover Glass Overlay with Zoom Icon & Label -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div class="flex justify-end">
                <span class="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                  <MagnifyingGlassPlusIcon class="w-5 h-5" />
                </span>
              </div>
              <div>
                <span class="text-xs font-bold text-white uppercase tracking-wider block mb-1">{{ item.label }}</span>
                <span class="text-[10px] text-red-400 font-mono flex items-center gap-1">
                  <span>Odpri v polni resoluciji</span>
                  <span>↗</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        <!-- Lightbox Modal Instance -->
        <ImageLightboxModal
          v-model="lightboxOpen"
          :items="siteImages.gallery_items"
          :initial-index="selectedImageIndex"
        />

        <!-- Floating Ambient Mode Pill (Sticky on Scroll) -->
        <aside 
          class="fixed bottom-6 right-6 z-40 transition-all duration-500 transform"
          :class="scrolledPastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
        >
          <button
            type="button"
            @click="toggleAmbientMode"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-950/95 border backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 min-h-[44px]"
            :class="ambientMode === 'day' 
              ? 'border-amber-500/60 text-amber-300 hover:border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' 
              : 'border-red-500/60 text-red-300 hover:border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]'"
            :aria-label="ambientMode === 'day' ? 'Preklopi na Nočni Klub' : 'Preklopi na Dnevni Bistro'"
          >
            <span class="text-base">{{ ambientMode === 'day' ? '☀️' : '🌙' }}</span>
            <span class="text-xs font-black uppercase tracking-wider text-white">
              {{ ambientMode === 'day' ? 'Dnevni Bistro' : 'Nočni Klub' }}
            </span>
            <span 
              class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
              :class="ambientMode === 'day' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'"
            >
              {{ ambientMode === 'day' ? 'PICA' : 'KLUB' }}
            </span>
          </button>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CheckIcon, MapPinIcon, PhoneIcon, MagnifyingGlassPlusIcon } from '@heroicons/vue/24/outline'

export type AmbientMode = 'day' | 'night'

const { locale, t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const ambientMode = ref<AmbientMode>('day')
const scrolledPastHero = ref(false)

// Lightbox state
const lightboxOpen = ref(false)
const selectedImageIndex = ref(0)

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  lightboxOpen.value = true
}

const setAmbientMode = (mode: AmbientMode) => {
  ambientMode.value = mode
  if (typeof window !== 'undefined') {
    localStorage.setItem('kader_ambient_mode', mode)
  }
}

const toggleAmbientMode = () => {
  setAmbientMode(ambientMode.value === 'day' ? 'night' : 'day')
}

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    scrolledPastHero.value = window.scrollY > 400
  }
}

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

onMounted(() => {
  loadFeatured()
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    const saved = localStorage.getItem('kader_ambient_mode') as AmbientMode | null
    if (saved === 'day' || saved === 'night') {
      ambientMode.value = saved
    } else {
      const hour = new Date().getHours()
      ambientMode.value = (hour >= 8 && hour < 18) ? 'day' : 'night'
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>