<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-600 selection:text-white">
    <!-- Top red stripe border (matching print menu aesthetic) -->
    <div class="menu-stripe-border" aria-hidden="true"></div>

    <!-- ===== EDITORIAL HERO HEADER (Print Menu Aesthetic) ===== -->
    <header class="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b-2 border-red-100 bg-white py-16 px-4">
      <!-- High contrast light imagery layer -->
      <img 
        :src="getOptImg(siteImages.pizzeria_hero_bg, 1920, 85)" 
        alt="Kader Neapolitan Pizza" 
        class="absolute inset-0 w-full h-full object-cover opacity-15 filter contrast-125 saturate-75 scale-105 transform transition-transform duration-1000" 
      />
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-white z-10"></div>
      
      <!-- Subtle red radial glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] z-10 pointer-events-none"></div>

      <div class="relative z-20 text-center max-w-4xl mx-auto px-4 flex flex-col items-center">
        <!-- Brand Crest / Tagline Badge -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span class="px-3.5 py-1 bg-red-600 text-white text-[11px] font-bold uppercase tracking-[0.25em] rounded-full shadow-sm">
            48-Urna Fermentacija
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            San Marzano D.O.P
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            Mocarela Bufala D.O.P
          </span>
          <span class="px-3.5 py-1 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            Panuozzo Sendviči
          </span>
        </div>

        <!-- Main Title (Serif Editorial Style) -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-gray-900 mb-3 uppercase leading-[0.95]">
          Pizzeria Bistro<br>
          <span class="text-red-600 font-serif italic lowercase text-4xl md:text-6xl font-normal block mt-2">di Grad Kodeljevo</span>
        </h1>

        <!-- Manifesto Quote -->
        <p class="text-gray-600 text-sm md:text-lg max-w-2xl font-light italic mt-4 mb-8 leading-relaxed">
          “Zavedanje in strast sta ključni sestavini za neapeljsko pico z močno identiteto, v kateri se prepletata izročilo Kampanije in grajski ambient.”
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

        <!-- Digital vs Printed View Switcher -->
        <div class="mt-10 inline-flex p-1.5 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
          <button 
            @click="activeView = 'digital'"
            :class="['px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300', activeView === 'digital' ? 'bg-red-600 text-white shadow-md font-black' : 'text-gray-600 hover:text-red-600']"
          >
            {{ t('pizzeria.digitalMenu') }}
          </button>
          <button 
            @click="activeView = 'printed'"
            :class="['px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300', activeView === 'printed' ? 'bg-red-600 text-white shadow-md font-black' : 'text-gray-600 hover:text-red-600']"
          >
            {{ t('pizzeria.printedMenu') }}
          </button>
        </div>
      </div>
    </header>

    <!-- ===== PIZZERIA WHITE SECTION (matching print menu aesthetic) ===== -->
    <div class="relative bg-white">

    <div class="max-w-6xl mx-auto px-4 py-16">

      <!-- ===== "ZAČUTITE OBRT" / PHILOSOPHY CARDS (I Masanielli Style) ===== -->
      <section class="mb-20">
        <div class="text-center mb-12">
          <span class="text-xs uppercase tracking-[0.3em] text-red-600 font-semibold block mb-2">Filozofija & Tehnika</span>
          <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-gray-900 tracking-tight">Kultura Neapeljske Pice</h2>
          <div class="w-16 h-1 bg-red-600 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">01 / TESTO</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">48h Fermentacija</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                Pripravljamo po izročilu neapeljskih mojstrov — mehko, zračno in lahkoproprobavljivo z izrazitim vzhajanim robom (cornicione).
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              High Hydration & Dough Maturity
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">02 / SESTAVINE</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">D.O.P. Poreklo</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                Uporabljamo izključno pelate San Marzano D.O.P., Mocarelo Bufala iz Kampanije ter Mortadelo D.O.P. z mletimi pistacijami.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              100% Certified Italian Origin
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">03 / PANUOZZO</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">Grajski Sendviči</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                Domači Panuozzo sendviči iz 160g sveže pečenega pica testa, napolnjeni s svežo stracciatella burrato in vrhunskimi nadevi.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              Freshly Baked 160g Bread
            </div>
          </div>

          <div class="bg-white border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-between hover:border-red-400 hover:shadow-lg transition-all duration-500 group shadow-md">
            <div>
              <span class="font-mono text-xs text-red-600 block mb-3 font-bold">04 / AMBIENT</span>
              <h3 class="text-lg font-serif font-bold text-gray-900 mb-2 uppercase group-hover:text-red-600 transition-colors">Grad Kodeljevo</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                Zgodovinski grajski kotiček v Ljubljani s prelepim poletnim vrtom, osvežilnimi koktajli in sproščenim vzdušjem.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-red-100 text-[11px] font-mono text-red-500">
              Castle Garden & Bistro Bar
            </div>
          </div>
        </div>

        <!-- Real Instagram Food Showcase Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div class="relative overflow-hidden rounded-3xl border-2 border-red-100 group shadow-xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_1, 800, 80)" alt="Neapolitan Pizza with Prosciutto and Arugula" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">Sveže iz peči</span>
                <h4 class="text-xl font-serif font-bold text-white uppercase">Neapeljska Pica z Pršutom & Rukolo</h4>
              </div>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-3xl border-2 border-red-100 group shadow-xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_2, 800, 80)" alt="Panuozzo Mortadella Burrata e Pistacchio" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">Hišna Specialiteta</span>
                <h4 class="text-xl font-serif font-bold text-white uppercase">Panuozzo Sendvič z Mortadelo & Burrato</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== "PIZZERIA CRAFT & OVEN" FEATURE SECTION ===== -->
      <PizzeriaCraft />

      <!-- ===== PRINTED A3 MENU VIEW ===== -->
      <div v-if="activeView === 'printed'" class="mb-20 bg-white border-2 border-gray-200 p-6 rounded-3xl shadow-xl">
        <div class="flex justify-between items-center mb-6 px-2">
          <span class="text-xs text-gray-500 font-mono uppercase tracking-wider">{{ t('pizzeria.printedCaption') }}</span>
          <a href="/menu-a3.jpg" target="_blank" class="text-xs text-red-600 hover:underline font-bold uppercase tracking-wider">{{ t('pizzeria.openFullSize') }}</a>
        </div>
        <img :src="menuImageUrl" alt="Kader Grad Kodeljevo Meni A3" class="w-full h-auto rounded-2xl shadow-xl border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity" @click="zoomOpen = true" />
      </div>

      <!-- ===== DIGITAL INTERACTIVE MENU VIEW ===== -->
      <div v-else class="mb-20">
        <!-- ===== INGREDIENT PROVENANCE GUARANTEE BANNER ===== -->
        <div class="mb-10 p-5 bg-red-600 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-3.5">
            <div class="w-11 h-11 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white text-xl">
              🛡️
            </div>
            <div>
              <h4 class="text-sm md:text-base font-serif font-black text-white uppercase tracking-wider">
                Zaveza Pristnosti & Certificirano Poreklo
              </h4>
              <p class="text-xs text-red-100 font-light">
                Uporabljamo izključno certificirane italijanske sestavine (D.O.P. in I.G.P.) ter hladno stiskano ekološko oljčno olje.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 text-[10px] font-mono">
            <span class="px-2.5 py-1 rounded-lg bg-white/20 border border-white/40 text-white font-bold">
              🍅 SAN MARZANO D.O.P.
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-white/20 border border-white/40 text-white font-bold">
              🐃 BUFALA CAMPANA D.O.P.
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-white/20 border border-white/40 text-white font-bold">
              🥓 MORTADELLA I.G.P.
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-white/20 border border-white/40 text-white font-bold">
              🌿 BIO EXTRA VERGINE
            </span>
          </div>
        </div>

        <!-- Category Pill Navigation -->
        <div class="flex overflow-x-auto pb-4 mb-12 space-x-2 hide-scrollbar justify-start md:justify-center border-b-2 border-red-100">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center space-x-2 min-h-[44px]',
              activeCategory === cat.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-black' 
                : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300'
            ]"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ catName(cat) }}</span>
          </button>
        </div>

        <!-- Menu Categories & Grid -->
        <div class="space-y-16">
          <div 
            v-for="cat in filteredCategories" 
            :key="cat.id"
            class="bg-white rounded-3xl p-6 md:p-10 border-2 border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex items-center justify-between border-b-2 border-red-100 pb-4 mb-8">
              <div class="flex items-center space-x-4">
                <span class="text-3xl p-2 bg-red-50 rounded-2xl border-2 border-red-100">{{ cat.icon }}</span>
                <div>
                  <h2 class="text-2xl md:text-3xl font-serif font-black uppercase text-gray-900 tracking-wider">{{ catName(cat) }}</h2>
                  <p v-if="cat.subtitle" class="text-xs text-red-500 mt-1 font-medium italic">{{ cat.subtitle }}</p>
                </div>
              </div>
            </div>

            <!-- Grid Items -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="item in cat.items" 
                :key="item.name"
                class="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 hover:border-red-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-serif font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {{ item.name }}
                    </h3>
                    <span class="text-base font-mono font-bold text-red-600 ml-4 whitespace-nowrap bg-red-50 px-3 py-1 rounded-xl border-2 border-red-100">
                      {{ item.price }}
                    </span>
                  </div>
                  <p v-if="item.description" class="text-xs md:text-sm text-gray-500 leading-relaxed mb-4 font-light">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Interactive Provenance Badges with Flyout Tooltips -->
                <div v-if="item.badges && item.badges.length > 0" class="flex flex-wrap gap-1.5 my-3">
                  <ProvenanceBadge
                    v-for="badgeKey in item.badges"
                    :key="badgeKey"
                    :badge-key="badgeKey"
                  />
                </div>
                <div v-else-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 my-3">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag"
                    class="px-2.5 py-0.5 bg-white text-red-600 text-[10px] font-mono font-semibold rounded-md uppercase tracking-wider border border-red-200"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Item Quick Action Conversion Button -->
                <div class="mt-4 pt-3.5 border-t-2 border-gray-100 flex items-center justify-between">
                  <span class="text-[11px] font-mono text-gray-400">
                    {{ cat.id === 'pizza' ? '48h testo · peč 450°C' : cat.id === 'panuozzo' ? '160g svež kruh' : 'Kader bistro' }}
                  </span>
                  <button
                    type="button"
                    @click="openTakeawayWithItem(item)"
                    class="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-200 hover:border-red-600 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 shadow-sm min-h-[36px]"
                  >
                    <span>📞</span>
                    <span>Naroči po telefonu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 4-COLUMN ESSENTIAL INFO BLOCK (Dove, Come, Orari, Reviews) ===== -->
      <section class="mt-20 bg-white border-2 border-gray-100 rounded-3xl p-8 md:p-12 shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          
          <!-- Dove / Kje -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              📍
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">Dove / Lokacija</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              Grad Kodeljevo<br />
              <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="text-red-600 hover:underline font-medium">Ulica Carla Benza 20</a><br />
              1000 Ljubljana, Slovenija
            </p>
          </div>

          <!-- Come / Kontakt -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              📞
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">Naročila & Mizah</h4>
            <p class="text-xs text-gray-500 leading-relaxed mb-2">
              <strong class="text-gray-700">Hrana za s seboj:</strong><br />
              <a href="tel:+38683836740" class="text-red-600 hover:underline font-mono text-sm">+386 83 836 740</a>
            </p>
            <p class="text-xs text-gray-500 leading-relaxed">
              <strong class="text-gray-700">Rezervacije miz:</strong><br />
              <a href="tel:+38640175628" class="text-red-600 hover:underline font-mono text-sm">+386 40 175 628</a>
            </p>
          </div>

          <!-- Orari / Delovni Čas -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mb-4 text-xl">
              ⏰
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">Orari / Delovni Čas</h4>
            <div class="text-xs text-gray-500 space-y-1">
              <p><strong class="text-gray-700">Pon – Sre:</strong> 09:00 – 22:00</p>
              <p><strong class="text-gray-700">Četrtek:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-700">Petek (Klub):</strong> 09:00 – 05:00</p>
              <p><strong class="text-gray-700">Sobota:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-700">Nedelja:</strong> 09:00 – 20:00</p>
              <p class="text-[11px] text-red-500 italic mt-2">* Kuhinja: 12:00 – 22:00</p>
            </div>
          </div>

          <!-- Certificazioni / Rating -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-yellow-50 border-2 border-yellow-100 text-yellow-500 flex items-center justify-center mb-4 text-xl">
              ⭐
            </div>
            <h4 class="font-serif font-bold text-gray-900 text-lg uppercase mb-2">Priznanja & Mnenja</h4>
            <div class="flex items-center space-x-1 text-yellow-500 mb-2">
              <span class="text-2xl font-black text-gray-900 mr-1 font-mono">4.8</span>
              <span>★★★★★</span>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed mb-3">
              Več kot 120+ preverjenih ocen gostov na Google Maps.
            </p>
            <a 
              href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" 
              target="_blank" 
              rel="noopener"
              class="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Napišite mnenje ↗
            </a>
          </div>

        </div>
      </section>

      <!-- ===== GOOGLE VERIFIED REVIEWS SECTION ===== -->
      <section class="mt-16 bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-100 shadow-md">
        <div class="text-center mb-10">
          <span class="text-xs uppercase tracking-[0.3em] text-red-600 font-semibold block mb-2">Mnenja Obiskovalcev</span>
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
                      <span class="ml-1 text-xs text-blue-500" title="Google Verified Review">✓</span>
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
              <span>Google Verified</span>
              <span class="text-red-500 font-medium">👍 {{ rev.likes }} priporočil</span>
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

    <!-- ===== STICKY MOBILE ACTION BAR ===== -->
    <div class="fixed bottom-safe left-4 right-4 z-40 md:hidden bg-white/95 border-2 border-red-200 backdrop-blur-lg p-3 rounded-2xl shadow-2xl flex justify-between items-center">
      <a 
        href="tel:+38683836740" 
        class="flex-1 mr-2 py-3 bg-red-600 text-white rounded-xl text-[11px] font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min"
      >
        <PhoneIcon class="w-4 h-4 mr-1.5" /> Naročila (+386 83 836 740)
      </a>
      <a 
        href="tel:+38640175628" 
        class="flex-1 ml-2 py-3 bg-white text-red-600 border-2 border-red-600 rounded-xl text-[11px] font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min"
      >
        <CalendarDaysIcon class="w-4 h-4 mr-1.5" /> Rezervacije (+386 40 175 628)
      </a>
    </div>

    <!-- Lightbox Modal for Menu Image -->
    <Teleport to="body">
      <div 
        v-if="zoomOpen" 
        class="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 cursor-zoom-out"
        @click="zoomOpen = false"
      >
        <img :src="menuImageUrl" :alt="t('pizzeria.zoomedAlt')" class="max-w-full max-h-full object-contain rounded-2xl border border-zinc-800">
      </div>
    </Teleport>

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
import { PhoneIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const { t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const activeView = ref<'digital' | 'printed'>('digital')
const activeCategory = ref('all')
const menuImageUrl = ref('/menu-a3.jpg')
const zoomOpen = ref(false)

const { isModalOpen, modalTab, selectedItem, openReservation, closeReservation } = useReservationModal()

const openModal = (tab: 'table' | 'takeaway') => {
  openReservation(tab)
}

const openTakeawayWithItem = (item: { name: string; price: string }) => {
  openReservation('takeaway', item)
}

const googleReviews = [
  {
    author: 'Matej K.',
    date: 'Pred 2 tednoma',
    text: 'Vrhunska neapeljska pica v prelepem ambientu gradu Kodeljevo! Testo je izjemno rahlo in lahkotno, sestavine pa sveže in italijanske. Panuozzo sendvič je prav tako fantastičen.',
    likes: 14
  },
  {
    author: 'Ana P.',
    date: 'Pred 1 mesecem',
    text: 'Najboljša pica na gradu Kodeljevo! Ambient na terasi je čudovit, osebje zelo prijazno, pice pa imajo perfektno hrustljavo in mehko skorjico. Zelo priporočam Burrato in Pistacijo!',
    likes: 19
  },
  {
    author: 'Luka M.',
    date: 'Pred 3 tedni',
    text: 'Super ambient pod gradom, odlična izbira pijač in najboljši panuozzo sendviči v Ljubljani. Tudi pice in kava so 10/10.',
    likes: 11
  },
  {
    author: 'Elena T.',
    date: 'Pred 1 mesecem',
    text: 'Prav poseben kotiček v Ljubljani. Odlične napolitanske pice, prijazna postrežba in čudovit poletni vrt ob vikendih.',
    likes: 16
  },
  {
    author: 'Jan B.',
    date: 'Pred 2 mesecema',
    text: 'Ambijent 10/10, hraniva in pica odlični. Mortadela D.O.P. in pistacija na pici sta vrhunska kombinacija.',
    likes: 8
  },
  {
    author: 'Katarina S.',
    date: 'Pred 3 tednoma',
    text: 'Čudovita lokacija, vrhunska pica z ročno raztegnjenim testom in prijazni natakarji. Z veseljem se vračamo!',
    likes: 12
  }
]

const loadMenuConfig = async () => {
  try {
    const cfg = await $fetch<{ menuImage: string }>('/api/menu-config')
    if (cfg?.menuImage) menuImageUrl.value = cfg.menuImage
  } catch (err) {
    // fallback to local menu-a3.jpg
  }
}

onMounted(loadMenuConfig)

interface MenuItem {
  name: string
  description?: string
  price: string
  tags?: string[]
  badges?: string[]
}

interface Category {
  id: string
  name: string
  subtitle?: string
  icon: string
  items: MenuItem[]
}

const categories: Category[] = [
  {
    id: 'pizza',
    name: 'Pice / Pizzas',
    subtitle: 'Sveže ročno raztegnjeno testo, pečeno po italijanskem izročilu',
    icon: '🍕',
    items: [
      {
        name: 'Marg',
        description: 'San Marzano pelati, mocarela, origano.',
        price: '9 €',
        tags: ['Vegetarijansko', '48h Ferment'],
        badges: ['san-marzano', 'ferment-48h', 'vegetarijansko']
      },
      {
        name: 'Bufalina',
        description: 'San Marzano pelati, mocarela bufala D.O.P, sušeni paradižniki, sveža bazilika, grana padano, oljčno olje.',
        price: '12 €',
        tags: ['Bufala DOP', 'Vegetarijansko', 'Priljubljeno'],
        badges: ['san-marzano', 'bufala', 'ferment-48h', 'olio-bio']
      },
      {
        name: 'Melancan',
        description: 'San Marzano pelati, mocarela fior di latte, sušeni paradižniki, pečeni jajčevci, bučke, Taggiasca olive, rikota.',
        price: '12 €',
        tags: ['Vegetarijansko'],
        badges: ['san-marzano', 'fior-di-latte', 'vegetarijansko']
      },
      {
        name: 'Klasična',
        description: 'San Marzano pelati, mocarela fior di latte, sveži šampinjoni, dimljen kuhan pršut Praga.',
        price: '11 €',
        tags: ['Pršut Praga'],
        badges: ['san-marzano', 'fior-di-latte', 'ferment-48h']
      },
      {
        name: 'Peperoni',
        description: 'San Marzano pelati, mocarela fior di latte, sveži šampinjoni, pikantna salama, pekoč preliv.',
        price: '11 €',
        tags: ['Pikantno'],
        badges: ['san-marzano', 'fior-di-latte', 'pikantno']
      },
      {
        name: 'Parma',
        description: 'San Marzano pelati, mocarela bufala, rukola, parmski pršut.',
        price: '13 €',
        tags: ['Pršut Parma', 'Bufala DOP'],
        badges: ['parma', 'bufala', 'san-marzano']
      },
      {
        name: 'Bresaola Tartufo',
        description: 'Tartufina krema, mocarela fior di latte, sveži šampinjoni, sušeni paradižniki, bresaola, mlada špinača, grana padano, rikota, oljčno olje.',
        price: '14 €',
        tags: ['Tartufi', 'Specialiteta'],
        badges: ['specialiteta', 'fior-di-latte', 'olio-bio']
      },
      {
        name: 'Tuna',
        description: 'San Marzano pelati, mocarela fior di latte, tunina, koruza, Taggiasca olive, rdeča čebula.',
        price: '11 €',
        badges: ['san-marzano', 'fior-di-latte']
      }
    ]
  },
  {
    id: 'panuozzo',
    name: 'Panuozzo Sendviči',
    subtitle: '160g sveže pečenega pica testa z bogatimi nadevi',
    icon: '🥪',
    items: [
      {
        name: 'Praga',
        description: 'Tanke rezine dimljenega kuhanega pršuta, stracciatella, pesto rosso, rukola, Grana Padano.',
        price: '9 €',
        tags: ['Stracciatella'],
        badges: ['stracciatella', 'specialiteta']
      },
      {
        name: 'Mortadela',
        description: 'Tanke rezine Mortadele D.O.P, stracciatella, pistacijina krema in mleti pistaciji.',
        price: '9 €',
        tags: ['Mortadela DOP', 'Pistacija', 'Priljubljeno'],
        badges: ['mortadella', 'stracciatella', 'pistacchio']
      },
      {
        name: 'Roastbeef',
        description: 'Tanke rezine ohlajenega rostbifa, stracciatella, mlada špinača, honey mustard preliv.',
        price: '11 €',
        tags: ['Rostbif'],
        badges: ['stracciatella', 'specialiteta']
      },
      {
        name: 'Meatball',
        description: 'Domače mesne kroglice, pelati, mocarela, sveža bazilika, parmezan.',
        price: '10 €',
        tags: ['Hišna Specialiteta'],
        badges: ['specialiteta', 'san-marzano']
      }
    ]
  },
  {
    id: 'stews',
    name: 'Na Žlico / Obare',
    subtitle: 'Tradicionalne in eksotične jedi na žlico (servirano z basmati rižem)',
    icon: '🍲',
    items: [
      {
        name: 'Goveji Mafe',
        description: 'Počasi dušena govedina v arašidovi omaki, zahodnoafriška specialiteta. Priložen basmati riž.',
        price: '7 €',
        tags: ['Specialiteta']
      },
      {
        name: 'Vege Tajin',
        description: 'Specialna maroška obara z gomoljnicami, suhimi marelicami, limeto in orientalskimi začimbami. Priložen basmati riž.',
        price: '6 €',
        tags: ['Vegansko', 'Brez glutena']
      }
    ]
  },
  {
    id: 'mains',
    name: 'Glavne Jedi / Mains',
    subtitle: 'Hišne kulinarične specialitete',
    icon: '🍽️',
    items: [
      {
        name: 'Paradižnikova Pasta',
        description: 'Al dente sveži rezanci, domača paradižnikova omaka, stračatela burrata, pistacijev drobljenec.',
        price: '13 €',
        tags: ['Sveži rezanci', 'Burrata']
      },
      {
        name: 'Steak Argentino',
        description: 'Argentinski goveji steak, domači ocvrten pomfrit in argentinski čimičuri (chimichurri) preliv.',
        price: '20 €',
        tags: ['Premium Steak']
      },
      {
        name: 'Mesni Burger',
        description: 'Sočni polpet iz suho zorjene govedine v popečeni bombeti, serviran z domačim pomfritom.',
        price: '12 €',
        tags: ['Zorjena Govedina']
      },
      {
        name: 'Otroški Krožnik',
        description: 'Hrustljavi piščančji ocvrtki (pohanci) in hrustljav pomfrit.',
        price: '9 €'
      }
    ]
  },
  {
    id: 'salads',
    name: 'Solate / Salads',
    subtitle: 'Osvežilne in bogate solatne sklede',
    icon: '🥗',
    items: [
      {
        name: 'Tuna Solata',
        description: 'Tunina, krompir, češnjevci, rdeča čebula, mešana zelena solata, Taggiasca olive in kumare.',
        price: '9.50 €'
      },
      {
        name: 'Pršut & Burrata Solata',
        description: 'Parmski pršut, sladke hruške, mešana solata, hrustljavi orehi in stračatela burrata.',
        price: '10 €',
        tags: ['Pršut Parma', 'Burrata']
      },
      {
        name: 'Kuskus Vege Solata',
        description: 'Kuskus, češnjevi paradižniki, olive, kumare, rdeča čebula, čičerika in sladka paprika.',
        price: '8.50 €',
        tags: ['Vegetarijansko']
      }
    ]
  },
  {
    id: 'sides',
    name: 'Priloge / Sides',
    subtitle: 'Dodatki k jedem',
    icon: '🍟',
    items: [
      {
        name: 'Pomfrit',
        description: 'Sveže ocvrten domači hrustljavi pomfrit.',
        price: '4 €'
      },
      {
        name: 'Fokača (Focaccia)',
        description: 'Domača pečena fokača z oljčnim oljem in zelišči.',
        price: '3.50 €',
        tags: ['Hišni Kruh']
      },
      {
        name: 'Basmati Riž',
        description: 'Kuhan basmati riž za obare.',
        price: '2.50 €'
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Sladice / Desserts',
    subtitle: 'Domače sladke dobrote',
    icon: '🍰',
    items: [
      {
        name: 'Tedenska Pita',
        description: 'Sveže pečena sezonska sadna ali kremna pita.',
        price: '4 €'
      },
      {
        name: 'Tedenski Kolač',
        description: 'Domači dnevni kolač.',
        price: '3.50 €'
      },
      {
        name: 'Tedenski Piškot',
        description: 'Hrustljav domači piškot.',
        price: '2.50 €'
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Pijača & Koktajli / Drinks',
    subtitle: 'Osvežilne napitke, točeno pivo, vina in koktajli',
    icon: '🍹',
    items: [
      {
        name: 'Domača Limonada',
        description: 'Sveže iztisnjena limonada (0.3l / 0.5l).',
        price: '3.00 € / 3.50 €'
      },
      {
        name: 'Domača Limonada z okusom',
        description: 'Limonada z izbranim sadnim sirupom (0.3l / 0.5l).',
        price: '3.30 € / 3.80 €'
      },
      {
        name: 'Domači Ledeni Čaj',
        description: 'Hišni osvežilni ledeni čaj (0.3l).',
        price: '3.20 €'
      },
      {
        name: 'Radenska',
        description: 'Mineralna voda (0.25l).',
        price: '2.50 €'
      },
      {
        name: 'Union Pivo / Radler',
        description: 'Točeno ali steklenica (0.5l).',
        price: '3.50 €'
      },
      {
        name: 'Reset Craft Pivo',
        description: 'Lagersih ali Pejl Ejl (0.3l / 0.5l).',
        price: '3.80 € / 4.50 €'
      },
      {
        name: 'Hišno Vino (Belo / Rdeče)',
        description: 'Kakovostno odprto vino (0.1l).',
        price: '2.20 €'
      },
      {
        name: 'Spritz (Aperol / Campari / Limoncello)',
        description: 'Osvežilen italijanski spritz aperitiv.',
        price: '6.00 €'
      },
      {
        name: 'Hišni Koktajli',
        description: 'Honey Deuce, Negroni, Moscow Mule ali Po meri.',
        price: '7.50 €'
      }
    ]
  }
]

const filteredCategories = computed(() => {
  if (activeCategory.value === 'all') {
    return categories
  }
  return categories.filter(c => c.id === activeCategory.value)
})

// Map category id → translation key
const CATEGORY_KEYS: Record<string, string> = {
  pizza: 'pizzeria.catPizza',
  panuozzo: 'pizzeria.catPanuozzo',
  stews: 'pizzeria.catStews',
  mains: 'pizzeria.catMains',
  salads: 'pizzeria.catSalads',
  sides: 'pizzeria.catSides',
  desserts: 'pizzeria.catDesserts',
  drinks: 'pizzeria.catDrinks'
}
const catName = (cat: Category) => (CATEGORY_KEYS[cat.id] ? t(CATEGORY_KEYS[cat.id]) : cat.name)
</script>