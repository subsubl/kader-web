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

      <!-- ===== PRINTED A3 MENU VIEW ===== -->
      <div v-if="activeView === 'printed'" class="mb-20 bg-white border-2 border-gray-200 p-6 rounded-3xl shadow-xl">
        <div class="flex justify-between items-center mb-6 px-2">
          <span class="text-xs text-gray-500 font-mono uppercase tracking-wider">{{ t('pizzeria.printedCaption') }}</span>
          <a href="/kader/menu.jpg" target="_blank" class="text-xs text-red-600 hover:underline font-bold uppercase tracking-wider">{{ t('pizzeria.openFullSize') }}</a>
        </div>
        <img :src="menuImageUrl" alt="Kader Grad Kodeljevo Meni A3" class="w-full h-auto rounded-2xl shadow-xl border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity" @click="zoomOpen = true" />
      </div>

      <!-- ===== DIGITAL INTERACTIVE MENU VIEW (1:1 with menu.jpg) ===== -->
      <div v-else class="mb-20">
        <!-- Ingredient provenance banner -->
        <div class="mb-8 p-5 bg-red-600 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-3.5">
            <div class="w-11 h-11 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white text-xl flex-shrink-0">
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

        <!-- Category Pill Navigation for Mobile / Filtering -->
        <div class="flex overflow-x-auto pb-4 mb-8 space-x-2 hide-scrollbar justify-start md:justify-center border-b-2 border-red-100">
          <button
            v-for="cat in navCategories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center space-x-2 min-h-[44px]',
              activeCategory === cat.id 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-black' 
                : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300'
            ]"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>

        <!-- 1:1 DESIGNER MENU CONTAINER (Matching menu.jpg) -->
        <div class="bg-white border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden relative">
          <!-- Top Red & White Stripe Border -->
          <div class="menu-stripe-border" aria-hidden="true"></div>

          <!-- Main Content Inner Grid -->
          <div class="p-6 md:p-10">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

              <!-- ===== COLUMN 1: PIZZE (1 to 13) ===== -->
              <div v-if="activeCategory === 'all' || activeCategory === 'pizza'" class="space-y-6">
                <div class="flex items-baseline justify-between border-b-2 border-red-600 pb-2 mb-4">
                  <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">PIZZE</h2>
                  <span class="text-xs font-bold text-gray-500 font-sans">Navadna/Družinska</span>
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
              <div v-if="activeCategory === 'all' || activeCategory === 'pizza' || activeCategory === 'panuozzo' || activeCategory === 'narezek'" class="space-y-8">
                
                <!-- Pizze 14 & 15 -->
                <div v-if="activeCategory === 'all' || activeCategory === 'pizza'" class="space-y-4">
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
                <div v-if="activeCategory === 'all' || activeCategory === 'panuozzo'" class="space-y-4 pt-2 border-t-2 border-dashed border-red-300 lg:border-t-0">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">PANUOZZO SENDVIČI</h2>
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
                <div v-if="activeCategory === 'all' || activeCategory === 'narezek'" class="space-y-4 pt-4 border-t-2 border-dashed border-red-300">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">NAREZEK</h2>
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
              <div v-if="activeCategory === 'all' || activeCategory === 'solate'" class="space-y-8">
                
                <!-- Solate -->
                <div class="space-y-4">
                  <div class="border-b-2 border-red-600 pb-2 mb-4">
                    <h2 class="text-3xl font-black uppercase tracking-tight text-black font-sans">SOLATE</h2>
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
                      <img src="/logo-badge.png" alt="Kader QR Code" class="w-12 h-12 object-contain" />
                    </div>
                    <div class="text-xs">
                      <p class="text-gray-800 leading-snug font-medium mb-1">
                        Hvala, ker nas podpirate tudi na spletu in s tem širite dobro besedo o naši ponudbi!
                      </p>
                      <p class="font-black text-red-600 uppercase tracking-wider text-xs">
                        KADER GRAD KODELJEVO
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
                    Bar s pogoji za živo in mehansko glasbo in ples "Restavracija Kader" z gostinskim vrtom<br />
                    Kader d.o.o., Ulica Carla Benza 20, 1000 Ljubljana, SI45321361
                  </p>
                  
                  <div class="flex justify-between font-bold text-red-700 py-1 border-y border-red-200">
                    <span>Cenik velja od 1.6.2026</span>
                    <span>Cene so v € in vključujejo DDV</span>
                  </div>

                  <p class="font-normal text-gray-700">
                    Informacije o alergenih v hrani in pijači najdete za šankom.
                  </p>

                  <p class="text-[10px] text-red-600 leading-tight italic">
                    Osebam mlajšim od 18 let, osebam z vidnimi znaki opitosti od alkohola, osebam, za katere se domneva, da jih bodo posredovale mlajšim od 18 let je prepovedano prodajati ali nuditi alkoholne pijače, pijače, ki so jim dodane alkoholne pijače ali tobačne izdelke.
                  </p>

                  <p class="text-[10px] text-red-600 leading-tight italic">
                    Do 10. ure dopoldan je prepovedano prodajati ali nuditi žgane pijače ter jih dodajati brezalkoholnim pijačam in vsem drugim napitkom.
                  </p>
                </div>

                <!-- Legenda alergenov (1:1 from menu.jpg) -->
                <div class="p-3 bg-red-50 rounded-xl border border-red-200 text-[10px] text-gray-700 font-sans leading-relaxed">
                  <span class="font-bold text-red-600 block mb-1">Legenda alergenov:</span>
                  <span>1 gluten | 2 raki | 3 jajca | 4 ribe | 5 soja | 6 sulfiti | 7 mleko in mlečni izdelki (vključno z laktozo) | 8 oreščki | 9 gorčica | 10 sezam | 11 mehkužci</span>
                </div>

              </div>

            </div>
          </div>

          <!-- Bottom Red & White Stripe Border + Cutlery & Chef Icons -->
          <div class="relative">
            <div class="menu-stripe-border" aria-hidden="true"></div>
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
import { ref, onMounted } from 'vue'
import { PhoneIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const { t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const activeView = ref<'digital' | 'printed'>('digital')
const activeCategory = ref('all')
const menuImageUrl = ref('/kader/menu.jpg')
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
    // fallback to local /kader/menu.jpg
  }
}

onMounted(loadMenuConfig)

interface MenuItem {
  name: string
  description?: string
  price: string
  allergens?: string
}

const navCategories = [
  { id: 'all', name: 'Vse', icon: '🍽️' },
  { id: 'pizza', name: 'Pizze', icon: '🍕' },
  { id: 'panuozzo', name: 'Panuozzo Sendviči', icon: '🥪' },
  { id: 'narezek', name: 'Narezek', icon: '🥩' },
  { id: 'solate', name: 'Solate', icon: '🥗' }
]

// Column 1 Pizze (Items 1 to 13)
const col1Pizze: MenuItem[] = [
  {
    name: 'Marinara',
    description: 'Pelati San Marzano DOP, bazilika, origano, konfitiran česen',
    price: '10 €',
    allergens: '1'
  },
  {
    name: 'Margerita',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, origano',
    price: '11/24 €',
    allergens: '1,7'
  },
  {
    name: 'Klasika',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, kuhan pršut, sveži šampinjoni, origano',
    price: '13/31 €',
    allergens: '1,7'
  },
  {
    name: 'Bufalina',
    description: 'Pelati San Marzano DOP, sveža bazilika, mozzarella di bufala DOP, Grana Padano DOP, češnjev paradižnik',
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: 'Regina',
    description: 'Pelati San Marzano DOP, sveža bazilika, Parmigiano Reggiano, sušeni paradižniki, stracciatella',
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: 'Bresaola',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, bresaola, mlada špinača, Grana Padano DOP, češnjev paradižnik, stracciatella, reduciran balzamični kis',
    price: '16/37 €',
    allergens: '1,6,7'
  },
  {
    name: 'Krasotica',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, Grana Padano DOP, pršut, konfitiran česen, rukola',
    price: '15/34 €',
    allergens: '1,7'
  },
  {
    name: 'Peperoni',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, pikantna salama, rdeča čebula',
    price: '14/32 €',
    allergens: '1,7'
  },
  {
    name: 'Kalabria',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, \'nduja, marinirane artičoke, sušeni paradižniki, rukola, Grana Padano DOP',
    price: '15/32 €',
    allergens: '1,7'
  },
  {
    name: 'Arrotolata',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, panceta arrotolata, mlada špinača, dimljena rikota',
    price: '15/32 €',
    allergens: '1,7'
  },
  {
    name: 'Tuna',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, tuna, rdeča čebula, olive taggiasce',
    price: '14/31 €',
    allergens: '1,4,7'
  },
  {
    name: 'Ortolana',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, bučke, melancani, šampinjoni, rukola, Grana Padano DOP',
    price: '14/29 €',
    allergens: '1,7'
  },
  {
    name: 'Sataraša',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, peperonata, konfitiran česen, rukola, dimljena rikota',
    price: '14/29 €',
    allergens: '1,7'
  }
]

// Column 2 Pizze (Items 14 & 15)
const col2Pizze: MenuItem[] = [
  {
    name: 'Tartufina',
    description: 'Pelati San Marzano DOP, mozzarella fior di latte, šampinjoni, tartufata, rukola, stracciatella, Grana Padano DOP',
    price: '14/31 €',
    allergens: '1,7'
  },
  {
    name: 'Vegana',
    description: 'Pelati San Marzano DOP, sveža bazilika, sicilijanska caponata, sušeni paradižnik, mlada špinača, rukola, olive taggiasche',
    price: '14/29 €',
    allergens: '1'
  }
]

// Extra toppings
const dodatkiList = [
  {
    title: 'Dodatek I',
    price: '2.20 €',
    items: 'Pelati, šampinjoni, rdeča čebula, jajce, sveža bazilika, koruza'
  },
  {
    title: 'Dodatek II',
    price: '3 €',
    items: 'Mozzarella, dimljena rikota, sušeni paradižniki, Grana Padano, jajčevci, bučke, olive taggiasche, špinača, rukola, tuna, artičoke'
  },
  {
    title: 'Dodatek III',
    price: '4 €',
    items: 'Stracciatella, kuhan pršut Praga, bresaola, pikantna salama, pršut, panceta, \'nduja, tartufata, mortadela'
  }
]

// Panuozzo Sendviči
const panuozzoItems: MenuItem[] = [
  {
    name: 'Praga',
    description: 'Stracciatella, kuhan pršut Praga, rukola, pesto rosso, Grana Padano DOP',
    price: '11 €',
    allergens: '1,7,8'
  },
  {
    name: 'Roastbeef',
    description: 'Stracciatella, roastbeef, rukola, Grana Padano DOP, sveže mlet poper, gorčični preliv',
    price: '13 €',
    allergens: '1,7,9'
  },
  {
    name: 'Mortadela',
    description: 'Stracciatella, mortadela, pistacijev pesto',
    price: '12 €',
    allergens: '1,7,8'
  },
  {
    name: 'Lušt\'n',
    description: 'Mozzarella fior di latte, Lušt paradižnik, bazilika, pesto iz češnjevcev in mandlja, ekstra deviško olivno olje, solni cvet, poper, glazura balzamičnega kisa',
    price: '12 €',
    allergens: '1,7,8'
  },
  {
    name: 'Česnov kruh s parmezanom',
    description: '',
    price: '7 €',
    allergens: '1,7'
  }
]

// Narezek
const narezekItems: MenuItem[] = [
  {
    name: 'Narezek (za 2 osebi)',
    description: 'Pršut, rolana panceta, mortadela, pikantna salama, bresaola (goveji pršut), olive taggiasce, Grana Padano DOP, focaccia z rožmarinom',
    price: '25.90 €',
    allergens: '1,7'
  }
]

// Solate
const solateItems: MenuItem[] = [
  {
    name: 'Mešana solata',
    description: 'Mešana sezonska solata, češnjev paradižnik, koruza z balzamičnim kisom, olivnim oljem in kruhom',
    price: '7.50 €',
    allergens: '1'
  },
  {
    name: 'Tuna solata',
    description: 'Mešana sezonska solata, češnjev paradižnik, tuna, koruza, olive z jogurtovim prelivom in kruhom',
    price: '12 €',
    allergens: '1,4,7'
  },
  {
    name: 'Buffalo solata',
    description: 'Mešana sezonska solata, češnjev paradižnik, sušeni paradižnik, bivolja mozzarella DOP z jogurtovim prelivom in kruhom',
    price: '13 €',
    allergens: '1,7'
  },
  {
    name: 'Solata z roastbeefom',
    description: 'Mešana sezonska solata, tanke rezine hladnega roastbeefa, češnjev paradižnik, olive, Grana Padano DOP z gorčičnim prelivom',
    price: '15 €',
    allergens: '1,7,9'
  }
]
</script>