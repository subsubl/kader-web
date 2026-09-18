<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-600 selection:text-white">
    <!-- Top red stripe border (matching print menu aesthetic) -->
    <div class="menu-stripe-border" aria-hidden="true"></div>

    <!-- ===== EDITORIAL HERO HEADER (Print Menu Aesthetic) ===== -->
    <header class="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b-2 border-red-100 bg-white py-16 px-4">
      <!-- High contrast light imagery layer -->
      <img 
        :src="getOptImg(siteImages.pizzeria_hero_bg, 1920, 85)" 
        :alt="t('pizzeria.heroAlt')" 
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover opacity-15 filter contrast-125 saturate-75 scale-105 transform transition-transform duration-1000" 
      />
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-white z-10"></div>
      
      <!-- Subtle red radial glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] z-10 pointer-events-none"></div>

      <div class="relative z-20 text-center max-w-4xl mx-auto px-4 flex flex-col items-center">
        <!-- Brand Crest / Tagline Badge -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span class="px-3.5 py-1 bg-red-600 text-white text-[11px] font-bold uppercase tracking-[0.25em] rounded-full shadow-sm">
            {{ t('pizzeria.fermentation') }}
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            {{ t('pizzeria.sanMarzano') }}
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            {{ t('pizzeria.bufala') }}
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            {{ t('pizzeria.panuozzoBadge') }}
          </span>
        </div>

        <!-- Main Title (Serif Editorial Style) -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-gray-900 mb-3 uppercase leading-[0.95]">
          {{ t('pizzeria.titleMain') }}<br>
          <span class="text-red-600 font-serif italic lowercase text-4xl md:text-6xl font-normal block mt-2">{{ t('pizzeria.titleSub') }}</span>
        </h1>

        <!-- Manifesto Quote -->
        <p class="text-gray-600 text-sm md:text-lg max-w-2xl font-light italic mt-4 mb-8 leading-relaxed">
          {{ t('pizzeria.manifesto') }}
        </p>

        <!-- Direct Action Buttons -->
        <div class="flex flex-wrap gap-4 justify-center w-full max-w-xl">
          <button 
            type="button"
            @click="openModal('takeaway')" 
            class="px-8 py-4 bg-red-600 text-white hover:bg-red-700 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-600/20 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px] cursor-pointer"
          >
            <PhoneIcon class="w-4 h-4 mr-2" />
            {{ t('pizzeria.pickUp') }}
          </button>
          <button 
            type="button"
            @click="openModal('table')" 
            class="px-8 py-4 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px] cursor-pointer"
          >
            <CalendarDaysIcon class="w-4 h-4 mr-2" />
            {{ t('pizzeria.tableRes') }}
          </button>
        </div>

        <!-- Address & Contact Quick Info Badge -->
        <div class="mt-8 bg-red-50/90 border border-red-200 backdrop-blur-md px-6 py-3.5 rounded-2xl flex flex-col sm:flex-row gap-3 sm:gap-6 items-center text-xs font-medium text-gray-800 shadow-sm">
          <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" rel="noopener noreferrer" class="flex items-center hover:text-red-600 transition-colors">
            <MapPinIcon class="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
            <span>Koblarjeva ulica 34, 1000 Ljubljana</span>
          </a>
          <span class="hidden sm:inline text-red-300">|</span>
          <a href="tel:+38683836740" class="flex items-center hover:text-red-600 transition-colors font-bold text-gray-900">
            <PhoneIcon class="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
            <span>{{ t('hero.orders') }}: +386 83 836 740</span>
          </a>
        </div>
      </div>
    </header>

    <!-- ===== PIZZERIA WHITE SECTION (matching print menu aesthetic) ===== -->
    <div class="relative bg-white">

    <div class="max-w-6xl mx-auto px-4 py-16">

      <!-- ===== DIGITAL INTERACTIVE MENU VIEW (1:1 with menu.jpg) ===== -->
      <div class="mb-20">
        <!-- 1:1 DESIGNER MENU CONTAINER (Matching menu.jpg) -->
        <div class="bg-white border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden relative">
          <!-- Top Red & White Stripe Border -->
          <div class="menu-stripe-border" aria-hidden="true"></div>

          <!-- Main Content Inner Grid -->
          <div class="p-6 md:p-10">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

              <!-- ===== COLUMN 1: PIZZE (1 to 13) ===== -->
              <div class="space-y-6">
                <div class="flex items-baseline justify-between border-b-2 border-red-600 pb-2 mb-4">
                  <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">{{ t('pizzeria.colPizzaTitle') }}</h2>
                  <span class="text-xs font-bold text-gray-500 font-sans">{{ t('pizzeria.regularFamily') }}</span>
                </div>

                <div class="space-y-4">
                  <div 
                    v-for="item in col1Pizze" 
                    :key="item.name"
                    @click="openTakeawayWithItem(item)"
                    class="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-red-50/70 transition-colors"
                  >
                    <div class="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 class="text-base font-bold text-black group-hover:text-red-600 transition-colors">
                        {{ item.name }}
                      </h3>
                      <span class="text-base font-bold text-black font-sans whitespace-nowrap">
                        {{ item.price }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-700 leading-snug font-normal">
                      {{ item.description }}
                      <span class="text-xs font-bold text-gray-500 ml-1">/ {{ item.allergens }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- ===== COLUMN 2: PIZZE (14-15) + DODATKI + PANUOZZO + NAREZEK ===== -->
              <div class="space-y-8">
                
                <!-- Pizze 14 & 15 -->
                <div class="space-y-4">
                  <div 
                    v-for="item in col2Pizze" 
                    :key="item.name"
                    @click="openTakeawayWithItem(item)"
                    class="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-red-50/70 transition-colors"
                  >
                    <div class="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 class="text-base font-bold text-black group-hover:text-red-600 transition-colors">
                        {{ item.name }}
                      </h3>
                      <span class="text-base font-bold text-black font-sans whitespace-nowrap">
                        {{ item.price }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-700 leading-snug font-normal">
                      {{ item.description }}
                      <span class="text-xs font-bold text-gray-500 ml-1">/ {{ item.allergens }}</span>
                    </p>
                  </div>

                  <!-- Dodatki Section -->
                  <div class="pt-4 border-t-2 border-dashed border-red-300">
                    <div class="space-y-3">
                      <div v-for="dodatek in dodatkiList" :key="dodatek.title" class="text-xs">
                        <div class="flex justify-between font-bold text-black mb-0.5">
                          <span>{{ dodatek.title }}</span>
                          <span class="font-sans">{{ dodatek.price }}</span>
                        </div>
                        <p class="text-gray-600 font-normal leading-tight">{{ dodatek.items }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Panuozzo Sendviči -->
                <div class="space-y-4 pt-2 border-t-2 border-dashed border-red-300 lg:border-t-0">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">{{ t('pizzeria.colPanuozzoTitle') }}</h2>
                  </div>

                  <div 
                    v-for="item in panuozzoItems" 
                    :key="item.name"
                    @click="openTakeawayWithItem(item)"
                    class="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-red-50/70 transition-colors"
                  >
                    <div class="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 class="text-base font-bold text-black group-hover:text-red-600 transition-colors">
                        {{ item.name }}
                      </h3>
                      <span class="text-base font-bold text-black font-sans whitespace-nowrap">
                        {{ item.price }}
                      </span>
                    </div>
                    <p v-if="item.description" class="text-xs text-gray-700 leading-snug font-normal">
                      {{ item.description }}
                      <span class="text-xs font-bold text-gray-500 ml-1">/ {{ item.allergens }}</span>
                    </p>
                    <p v-else class="text-xs text-gray-500 font-bold">
                      / {{ item.allergens }}
                    </p>
                  </div>
                </div>

                <!-- Narezek -->
                <div class="space-y-4 pt-4 border-t-2 border-dashed border-red-300">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">{{ t('pizzeria.colNarezekTitle') }}</h2>
                  </div>

                  <div 
                    v-for="item in narezekItems" 
                    :key="item.name"
                    @click="openTakeawayWithItem(item)"
                    class="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-red-50/70 transition-colors"
                  >
                    <div class="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 class="text-base font-bold text-black group-hover:text-red-600 transition-colors">
                        {{ item.name }}
                      </h3>
                      <span class="text-base font-bold text-black font-sans whitespace-nowrap">
                        {{ item.price }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-700 leading-snug font-normal">
                      {{ item.description }}
                      <span class="text-xs font-bold text-gray-500 ml-1">/ {{ item.allergens }}</span>
                    </p>
                  </div>
                </div>

              </div>

              <!-- ===== COLUMN 3: SOLATE + QR CARD + LEGAL INFOS ===== -->
              <div class="space-y-8">
                
                <!-- Solate -->
                <div class="space-y-4">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">{{ t('pizzeria.colSaladsTitle') }}</h2>
                  </div>

                  <div 
                    v-for="item in solateItems" 
                    :key="item.name"
                    @click="openTakeawayWithItem(item)"
                    class="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-red-50/70 transition-colors"
                  >
                    <div class="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 class="text-base font-bold text-black group-hover:text-red-600 transition-colors">
                        {{ item.name }}
                      </h3>
                      <span class="text-base font-bold text-black font-sans whitespace-nowrap">
                        {{ item.price }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-700 leading-snug font-normal">
                      {{ item.description }}
                      <span class="text-xs font-bold text-gray-500 ml-1">/ {{ item.allergens }}</span>
                    </p>
                  </div>
                </div>

                <!-- Red dashed divider -->
                <div class="border-t-2 border-dashed border-red-400"></div>

                <!-- QR Code Support Box (1:1 from menu.jpg) -->
                <div class="p-4 border-2 border-red-600 rounded-2xl bg-white flex items-center justify-between gap-3 shadow-sm">
                  <div class="flex items-center space-x-3">
                    <div class="w-14 h-14 bg-red-50 p-1 border border-red-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <img :src="assetUrl('/logo-badge.png')" :alt="t('pizzeria.qrAlt')" loading="lazy" decoding="async" width="48" height="48" class="w-12 h-12 object-contain" />
                    </div>
                    <div class="text-xs">
                      <p class="text-gray-800 leading-snug font-medium mb-1">
                        {{ t('pizzeria.qrText') }}
                      </p>
                      <p class="font-black text-red-600 uppercase tracking-wider text-xs">
                        {{ t('pizzeria.brandCastle') }}
                      </p>
                    </div>
                  </div>
                  <div class="text-3xl font-black text-red-600 font-serif flex-shrink-0 select-none">
                    K°
                  </div>
                </div>

                <!-- Red dashed divider -->
                <div class="border-t-2 border-dashed border-red-400"></div>

                <!-- Fine Print & Legal Notices (1:1 from menu.jpg) -->
                <div class="space-y-2.5 text-[11px] text-red-600 font-sans leading-tight">
                  <p class="font-medium">
                    {{ t('pizzeria.legalBarConditions') }}<br />
                    {{ t('pizzeria.legalCompanyLine') }}
                  </p>
                  
                  <div class="flex justify-between font-bold text-red-700 py-1 border-y border-red-200">
                    <span>{{ t('pizzeria.priceListValidFrom') }}</span>
                    <span>{{ t('pizzeria.pricesVat') }}</span>
                  </div>

                  <p class="font-normal text-gray-700">
                    {{ t('pizzeria.allergenBarInfo') }}
                  </p>

                  <p class="text-[10px] text-red-600 leading-tight italic">
                    {{ t('pizzeria.alcoholLawWarning') }}
                  </p>

                  <p class="text-[10px] text-red-600 leading-tight italic">
                    {{ t('pizzeria.spiritsMorningLawWarning') }}
                  </p>
                </div>

                <!-- Legenda alergenov (1:1 from menu.jpg) -->
                <div class="p-3 bg-red-50 rounded-xl border border-red-200 text-[10px] text-gray-700 font-sans leading-relaxed">
                  <span class="font-bold text-red-600 block mb-1">{{ t('pizzeria.allergenLegendTitle') }}</span>
                  <span>{{ t('pizzeria.allergenLegendText') }}</span>
                </div>

              </div>

            </div>
          </div>

          <!-- Bottom Red & White Stripe Border + Cutlery & Chef Icons -->
          <div class="relative">
            <div class="menu-stripe-border" aria-hidden="true"></div>
          </div>
        </div>

        <!-- Ingredient provenance banner (below the menu) -->
        <div class="mt-8 p-5 bg-red-600 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-3.5">
            <div class="w-11 h-11 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white text-xl flex-shrink-0">
              🛡️
            </div>
            <div>
              <h4 class="text-sm md:text-base font-serif font-black text-white uppercase tracking-wider">
                {{ t('pizzeria.provenanceTitle') }}
              </h4>
              <p class="text-xs text-red-100 font-light">
                {{ t('pizzeria.provenanceDesc') }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 text-[10px] font-mono">
            <ProvenanceBadge badge-key="san-marzano" />
            <ProvenanceBadge badge-key="bufala" />
            <ProvenanceBadge badge-key="mortadella" />
            <ProvenanceBadge badge-key="olio-bio" />
            <ProvenanceBadge badge-key="ferment-48h" />
          </div>
        </div>
      </div>

      <!-- ===== INTERACTIVE CRAFT HUD ===== -->
      <PizzeriaCraft class="my-16" />

      <!-- ===== "ZAČUTITE OBRT" / PHILOSOPHY CARDS (I Masanielli Style) ===== -->
      <section class="mb-20">
        <div class="text-center mb-12">
          <span class="text-xs uppercase tracking-[0.3em] text-red-600 font-semibold block mb-2">{{ t('pizzeria.philoSubtitle') }}</span>
          <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-gray-900 tracking-tight">{{ t('pizzeria.philoTitle') }}</h2>
          <div class="w-16 h-1 bg-red-600 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">{{ t('pizzeria.card1Tag') }}</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">{{ t('pizzeria.card1Title') }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ t('pizzeria.card1Desc') }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              {{ t('pizzeria.card1Footer') }}
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">{{ t('pizzeria.card2Tag') }}</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">{{ t('pizzeria.card2Title') }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ t('pizzeria.card2Desc') }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              {{ t('pizzeria.card2Footer') }}
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">{{ t('pizzeria.card3Tag') }}</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">{{ t('pizzeria.card3Title') }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ t('pizzeria.card3Desc') }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              {{ t('pizzeria.card3Footer') }}
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">{{ t('pizzeria.card4Tag') }}</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">{{ t('pizzeria.card4Title') }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ t('pizzeria.card4Desc') }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              {{ t('pizzeria.card4Footer') }}
            </div>
          </div>
        </div>

        <!-- Real Instagram Food Showcase Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div class="relative overflow-hidden rounded-3xl border-2 border-red-100 group shadow-xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_1, 800, 80)" :alt="t('pizzeria.showcase1Alt')" loading="lazy" decoding="async" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">{{ t('pizzeria.freshFromOven') }}</span>
                <p class="text-sm font-serif font-black text-white uppercase tracking-wider">{{ t('pizzeria.handCrafted') }}</p>
              </div>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-3xl border-2 border-red-100 group shadow-xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_2, 800, 80)" :alt="t('pizzeria.showcase2Alt')" loading="lazy" decoding="async" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">{{ t('pizzeria.houseSpecialty') }}</span>
                <h4 class="text-xl font-serif font-bold text-white uppercase">{{ t('pizzeria.panuozzoShowcaseTitle') }}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 4-COLUMN ESSENTIAL INFO BLOCK (Dove, Come, Orari, Reviews) ===== -->
      <section class="mt-20 bg-white border-2 border-gray-100 rounded-3xl p-8 md:p-12 shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          
          <!-- Dove / Kje -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              📍
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">{{ t('pizzeria.colLocTitle') }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              Grad Kodeljevo<br />
              <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="text-red-600 hover:underline font-medium">Koblarjeva ulica 34</a><br />
              1000 Ljubljana, Slovenija
            </p>
          </div>

          <!-- Come / Kontakt -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              📞
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">{{ t('pizzeria.colContactTitle') }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed mb-2">
              <strong class="text-gray-700">{{ t('pizzeria.colContactTakeaway') }}</strong><br />
              <a href="tel:+38683836740" class="text-red-600 hover:underline font-mono text-sm">+386 83 836 740</a>
            </p>
            <p class="text-xs text-gray-500 leading-relaxed">
              <strong class="text-gray-700">{{ t('pizzeria.colContactTable') }}</strong><br />
              <a href="tel:+38640175628" class="text-red-600 hover:underline font-mono text-sm">+386 40 175 628</a>
            </p>
          </div>

          <!-- Orari / Delovni Čas -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              ⏰
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">{{ t('pizzeria.colHoursTitle') }}</h4>
            <div class="text-xs text-gray-500 space-y-1">
              <p><strong class="text-gray-700">{{ t('home.monWed') }}:</strong> 09:00 – 22:00</p>
              <p><strong class="text-gray-700">{{ t('home.thu') }}:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-700">{{ t('home.fri') }}:</strong> 09:00 – 05:00</p>
              <p><strong class="text-gray-700">{{ t('home.sat') }}:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-700">{{ t('home.sun') }}:</strong> 09:00 – 20:00</p>
              <p class="text-[11px] text-red-500 italic mt-2">{{ t('footer.kitchenNote') }}</p>
            </div>
          </div>

          <!-- Certificazioni / Rating -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-yellow-50 border-2 border-yellow-100 text-yellow-500 flex items-center justify-center mb-4 text-xl">
              ⭐
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">{{ t('pizzeria.colRatingTitle') }}</h4>
            <div class="flex items-center space-x-1 text-yellow-500 mb-2">
              <span class="text-2xl font-black text-gray-900 mr-1 font-mono">4.8</span>
              <span>★★★★★</span>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed mb-3">
              {{ t('pizzeria.colRatingDesc') }}
            </p>
            <a 
              href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" 
              target="_blank" 
              rel="noopener"
              class="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              {{ t('pizzeria.colRatingWrite') }}
            </a>
          </div>

        </div>
      </section>

      <!-- ===== GOOGLE VERIFIED REVIEWS SECTION ===== -->
      <section class="mt-16 bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-100 shadow-md">
        <div class="text-center mb-10">
          <span class="text-xs uppercase tracking-[0.3em] text-red-600 font-semibold block mb-2">{{ t('pizzeria.reviewsGuestSubtitle') }}</span>
          <h2 class="text-3xl font-serif font-bold text-gray-900 uppercase">{{ t('pizzeria.reviewsTitle') }}</h2>
          <div class="w-16 h-1 bg-red-600 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="rev in googleReviews" 
            :key="rev.author" 
            class="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-red-50 border-2 border-red-100 text-red-600 font-bold flex items-center justify-center text-sm shadow-md font-serif">
                    {{ rev.author.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm flex items-center">
                      {{ rev.author }}
                      <span class="ml-1 text-xs text-blue-500" :title="t('pizzeria.googleVerified')">✓</span>
                    </h3>
                    <span class="text-xs text-gray-400 font-mono">{{ rev.date }}</span>
                  </div>
                </div>
                <div class="flex text-yellow-500 text-sm">
                  ★★★★★
                </div>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed italic mb-4 font-light">
                "{{ rev.text }}"
              </p>
            </div>
            
            <div class="pt-3 border-t-2 border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-mono">
              <span>{{ t('pizzeria.googleVerified') }}</span>
              <span class="text-red-500 font-medium">👍 {{ rev.likes }} {{ t('pizzeria.recs') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Allergen Footnote -->
      <div class="mt-12 text-center text-xs text-gray-400 space-y-2">
        <p class="font-medium text-gray-500">{{ t('pizzeria.allergenNote') }}</p>
        <p>{{ t('pizzeria.companyLine') }}</p>
      </div>

    </div>

      <!-- Bottom red stripe border (matching print menu) -->
      <div class="menu-stripe-border" aria-hidden="true"></div>
    </div><!-- end pizzeria white section -->

    <!-- Table Reservation & Takeaway Modal Instance -->
    <ReservationModal
      :is-open="isModalOpen"
      :initial-tab="modalTab"
      :preselected-item="selectedItem"
      @close="closeReservation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PhoneIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useLocale } from '~/composables/useLocale'
import { useSiteImages } from '~/composables/useSiteImages'
import { useReservationModal } from '~/composables/useReservationModal'
import { usePageSeo, EXACT_GEO, CANONICAL_ADDRESS, CANONICAL_CONTACTS } from '~/composables/usePageSeo'

const { t, locale } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const pizzeriaSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Restaurant', 'PizzaRestaurant'],
      '@id': 'https://www.kader.si/#restaurant',
      'name': 'Pizzeria Bistro Kader',
      'alternateName': 'Kader Pizza Bistro Grad Kodeljevo',
      'description': t('pizzeria.manifesto') || 'Pristna neapeljska pica z 48-urno fermentacijo testa, San Marzano D.O.P., mocarela di bufala in domači Panuozzo sendviči v ambientu Gradu Kodeljevo.',
      'url': 'https://www.kader.si/',
      'telephone': CANONICAL_CONTACTS.takeawayPhone,
      'priceRange': '€€',
      'servesCuisine': [
        'Neapolitan Pizza',
        'Italian',
        'Panuozzo',
        'Mediterranean',
        'Salads'
      ],
      'currenciesAccepted': 'EUR',
      'paymentAccepted': 'Cash, Credit Card, Debit Card, Contactless, Apple Pay, Google Pay',
      'acceptsReservations': true,
      'address': CANONICAL_ADDRESS,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': EXACT_GEO.latitude,
        'longitude': EXACT_GEO.longitude
      },
      'hasMap': CANONICAL_CONTACTS.googleMapsUrl,
      'image': [
        'https://www.kader.si/logo-banner.png',
        'https://www.kader.si/pizzeria-bg.jpg',
        'https://www.kader.si/menu-a3.jpg'
      ],
      'hasMenu': 'https://www.kader.si/',
      'menu': 'https://www.kader.si/',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          'opens': '12:00',
          'closes': '22:00',
          'description': 'Kuhinja / Pizzeria obratovalni čas'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday'],
          'opens': '09:00',
          'closes': '22:00',
          'description': 'Bistro & Kavarna bar'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Thursday', 'Saturday'],
          'opens': '09:00',
          'closes': '01:00',
          'description': 'Bistro & Nočni bar'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Friday'],
          'opens': '09:00',
          'closes': '05:00',
          'description': 'Bistro & Klubska noč'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Sunday'],
          'opens': '09:00',
          'closes': '20:00',
          'description': 'Nedeljski grajski vrt'
        }
      ],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'reviewCount': '120',
        'bestRating': '5',
        'worstRating': '1'
      },
      'potentialAction': [
        {
          '@type': 'ReserveAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'tel:+38640175628',
            'inLanguage': locale.value,
            'actionPlatform': [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform'
            ]
          },
          'result': {
            '@type': 'FoodEstablishmentReservation',
            'name': 'Rezervacija mize'
          }
        },
        {
          '@type': 'OrderAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'tel:+38683836740',
            'inLanguage': locale.value,
            'actionPlatform': [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform'
            ]
          },
          'deliveryMethod': 'http://purl.org/goodrelations/v1#DeliveryModePickUp'
        }
      ]
    }
  ]
}))

usePageSeo({
  path: '/',
  titleKey: 'seo.pizzeria.title',
  descKey: 'seo.pizzeria.description',
  ogTitleKey: 'seo.pizzeria.ogTitle',
  ogDescKey: 'seo.pizzeria.ogDescription',
  schema: pizzeriaSchema
})

const menuImageUrl = computed(() => assetUrl('/kader/menu.jpg'))

const { isModalOpen, modalTab, selectedItem, openReservation, closeReservation } = useReservationModal()

const openModal = (tab: 'table' | 'takeaway') => {
  openReservation(tab)
}

const openTakeawayWithItem = (item: { name: string; price: string }) => {
  openReservation('takeaway', item)
}

const googleReviews = computed(() => [
  {
    author: t('pizzeria.rev1_author'),
    date: t('pizzeria.rev1_date'),
    text: t('pizzeria.rev1_text'),
    likes: 14
  },
  {
    author: t('pizzeria.rev2_author'),
    date: t('pizzeria.rev2_date'),
    text: t('pizzeria.rev2_text'),
    likes: 19
  },
  {
    author: t('pizzeria.rev3_author'),
    date: t('pizzeria.rev3_date'),
    text: t('pizzeria.rev3_text'),
    likes: 11
  },
  {
    author: t('pizzeria.rev4_author'),
    date: t('pizzeria.rev4_date'),
    text: t('pizzeria.rev4_text'),
    likes: 16
  },
  {
    author: t('pizzeria.rev5_author'),
    date: t('pizzeria.rev5_date'),
    text: t('pizzeria.rev5_text'),
    likes: 8
  },
  {
    author: t('pizzeria.rev6_author'),
    date: t('pizzeria.rev6_date'),
    text: t('pizzeria.rev6_text'),
    likes: 12
  }
])

// Menu is a checked-in static image; no runtime API is required.

interface MenuItem {
  name: string
  description?: string
  price: string
  allergens?: string
}

// Column 1 Pizze (Items 1 to 13)
const col1Pizze = computed<MenuItem[]>(() => [
  {
    name: 'Marinara',
    description: t('pizzeria.m_marinara_desc'),
    price: '10 €',
    allergens: '1'
  },
  {
    name: 'Margerita',
    description: t('pizzeria.m_margerita_desc'),
    price: '11/24 €',
    allergens: '1,7'
  },
  {
    name: t('pizzeria.m_klasika_name'),
    description: t('pizzeria.m_klasika_desc'),
    price: '13/31 €',
    allergens: '1,7'
  },
  {
    name: 'Bufalina',
    description: t('pizzeria.m_bufalina_desc'),
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: 'Regina',
    description: t('pizzeria.m_regina_desc'),
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: 'Bresaola',
    description: t('pizzeria.m_bresaola_desc'),
    price: '16/37 €',
    allergens: '1,6,7'
  },
  {
    name: t('pizzeria.m_krasotica_name'),
    description: t('pizzeria.m_krasotica_desc'),
    price: '15/34 €',
    allergens: '1,7'
  },
  {
    name: 'Peperoni',
    description: t('pizzeria.m_peperoni_desc'),
    price: '14/32 €',
    allergens: '1,7'
  },
  {
    name: 'Kalabria',
    description: t('pizzeria.m_kalabria_desc'),
    price: '15/32 €',
    allergens: '1,7'
  },
  {
    name: 'Arrotolata',
    description: t('pizzeria.m_arrotolata_desc'),
    price: '15/32 €',
    allergens: '1,7'
  },
  {
    name: 'Tuna',
    description: t('pizzeria.m_tuna_desc'),
    price: '14/31 €',
    allergens: '1,4,7'
  },
  {
    name: 'Ortolana',
    description: t('pizzeria.m_ortolana_desc'),
    price: '14/29 €',
    allergens: '1,7'
  },
  {
    name: t('pizzeria.m_satarasa_name'),
    description: t('pizzeria.m_satarasa_desc'),
    price: '14/29 €',
    allergens: '1,7'
  }
])

// Column 2 Pizze (Items 14 & 15)
const col2Pizze = computed<MenuItem[]>(() => [
  {
    name: 'Tartufina',
    description: t('pizzeria.m_tartufina_desc'),
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: t('pizzeria.m_vegana_name'),
    description: t('pizzeria.m_vegana_desc'),
    price: '14/29 €',
    allergens: '1'
  }
])

// Extra toppings
const dodatkiList = computed(() => [
  {
    title: t('pizzeria.m_dodatek1_title'),
    price: '2.20 €',
    items: t('pizzeria.m_dodatek1_items')
  },
  {
    title: t('pizzeria.m_dodatek2_title'),
    price: '3 €',
    items: t('pizzeria.m_dodatek2_items')
  },
  {
    title: t('pizzeria.m_dodatek3_title'),
    price: '4 €',
    items: t('pizzeria.m_dodatek3_items')
  }
])

// Panuozzo Sendviči
const panuozzoItems = computed<MenuItem[]>(() => [
  {
    name: 'Praga',
    description: t('pizzeria.m_panPraga_desc'),
    price: '11 €',
    allergens: '1,7,8'
  },
  {
    name: 'Roastbeef',
    description: t('pizzeria.m_panRoastbeef_desc'),
    price: '13 €',
    allergens: '1,7,9'
  },
  {
    name: 'Mortadela',
    description: t('pizzeria.m_panMortadela_desc'),
    price: '12 €',
    allergens: '1,7,8'
  },
  {
    name: 'Lušt\'n',
    description: t('pizzeria.m_panLustn_desc'),
    price: '12 €',
    allergens: '1,7,8'
  },
  {
    name: t('pizzeria.m_panGarlicBread_name'),
    description: '',
    price: '7 €',
    allergens: '1,7'
  }
])

// Narezek
const narezekItems = computed<MenuItem[]>(() => [
  {
    name: t('pizzeria.m_narezek_name'),
    description: t('pizzeria.m_narezek_desc'),
    price: '25.90 €',
    allergens: '1,7'
  }
])

// Solate
const solateItems = computed<MenuItem[]>(() => [
  {
    name: t('pizzeria.m_salMesana_name'),
    description: t('pizzeria.m_salMesana_desc'),
    price: '7.50 €',
    allergens: '1'
  },
  {
    name: t('pizzeria.m_salTuna_name'),
    description: t('pizzeria.m_salTuna_desc'),
    price: '12 €',
    allergens: '1,4,7'
  },
  {
    name: t('pizzeria.m_salBuffalo_name'),
    description: t('pizzeria.m_salBuffalo_desc'),
    price: '13 €',
    allergens: '1,7'
  },
  {
    name: t('pizzeria.m_salRoastbeef_name'),
    description: t('pizzeria.m_salRoastbeef_desc'),
    price: '15 €',
    allergens: '1,7,9'
  }
])
</script>