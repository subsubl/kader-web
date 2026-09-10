<template>
  <div class="min-h-screen bg-black text-gray-100 font-sans selection:bg-masanielli-gold selection:text-black">
    <!-- ===== EDITORIAL HERO HEADER (Inspired by Pizzeria I Masanielli) ===== -->
    <header class="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-masanielli-gold/20 bg-black py-20 px-4">
      <!-- High contrast dark imagery layer -->
      <img 
        :src="getOptImg(siteImages.pizzeria_hero_bg, 1920, 85)" 
        alt="Kader Neapolitan Pizza" 
        class="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 saturate-75 scale-105 transform transition-transform duration-1000" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10"></div>
      
      <!-- Subtle gold radial glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,176,131,0.08)_0%,transparent_70%)] z-10 pointer-events-none"></div>

      <div class="relative z-20 text-center max-w-4xl mx-auto px-4 flex flex-col items-center">
        <!-- Brand Crest / Tagline Badge -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span class="px-3.5 py-1 bg-masanielli-gold/10 border border-masanielli-gold/40 text-masanielli-gold text-[11px] font-bold uppercase tracking-[0.25em] rounded-full shadow-sm">
            48-Urna Fermentacija
          </span>
          <span class="px-3.5 py-1 bg-zinc-900/80 border border-zinc-700/80 text-gray-300 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            San Marzano D.O.P
          </span>
          <span class="px-3.5 py-1 bg-zinc-900/80 border border-zinc-700/80 text-gray-300 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            Mocarela Bufala D.O.P
          </span>
          <span class="px-3.5 py-1 bg-zinc-900/80 border border-zinc-700/80 text-gray-300 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
            Panuozzo Sendviči
          </span>
        </div>

        <!-- Main Title (Serif Editorial Style) -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-white mb-3 uppercase leading-[0.95]">
          Pizzeria Bistro<br>
          <span class="text-masanielli-gold font-serif italic lowercase text-4xl md:text-6xl font-normal block mt-2">di Grad Kodeljevo</span>
        </h1>

        <!-- Manifesto Quote (In the style of Francesco Martucci) -->
        <p class="text-gray-300 text-sm md:text-lg max-w-2xl font-light italic mt-4 mb-8 leading-relaxed">
          “Zavedanje in strast sta ključni sestavini za neapeljsko pico z močno identiteto, v kateri se prepletata izročilo Kampanije in grajski ambient.”
        </p>

        <!-- Direct Action Buttons (Gold bordered, refined) -->
        <div class="flex flex-wrap gap-4 justify-center w-full max-w-xl">
          <a 
            href="tel:+38683836740" 
            class="px-8 py-4 bg-masanielli-gold text-black hover:bg-masanielli-goldLight font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-masanielli-gold/10 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px]"
          >
            <PhoneIcon class="w-4 h-4 mr-2" />
            {{ t('pizzeria.pickUp') }}
          </a>
          <a 
            href="tel:+38640175628" 
            class="px-8 py-4 bg-zinc-950 border border-masanielli-gold/40 text-masanielli-gold hover:bg-zinc-900 hover:border-masanielli-gold font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px]"
          >
            <CalendarDaysIcon class="w-4 h-4 mr-2" />
            {{ t('pizzeria.tableRes') }}
          </a>
        </div>

        <!-- Digital vs Printed View Switcher -->
        <div class="mt-10 inline-flex p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <button 
            @click="activeView = 'digital'"
            :class="['px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300', activeView === 'digital' ? 'bg-masanielli-gold text-black shadow-lg font-black' : 'text-gray-400 hover:text-white']"
          >
            {{ t('pizzeria.digitalMenu') }}
          </button>
          <button 
            @click="activeView = 'printed'"
            :class="['px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300', activeView === 'printed' ? 'bg-masanielli-gold text-black shadow-lg font-black' : 'text-gray-400 hover:text-white']"
          >
            {{ t('pizzeria.printedMenu') }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 py-16">

      <!-- ===== "ZAČUTITE OBRT" / PHILOSOPHY CARDS (I Masanielli Style) ===== -->
      <section class="mb-20">
        <div class="text-center mb-12">
          <span class="text-xs uppercase tracking-[0.3em] text-masanielli-gold font-semibold block mb-2">Filozofija & Tehnika</span>
          <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-white tracking-tight">Kultura Neapeljske Pice</h2>
          <div class="w-16 h-0.5 bg-masanielli-gold mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 flex flex-col justify-between hover:border-masanielli-gold/50 transition-all duration-500 group shadow-xl">
            <div>
              <span class="font-mono text-xs text-masanielli-gold block mb-3">01 / TESTO</span>
              <h3 class="text-lg font-serif font-bold text-white mb-2 uppercase group-hover:text-masanielli-gold transition-colors">48h Fermentacija</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Pripravljamo po izročilu neapeljskih mojstrov — mehko, zračno in lahkoproprobavljivo z izrazitim vzhajanim robom (cornicione).
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-900 text-[11px] font-mono text-masanielli-gold/70">
              High Hydration & Dough Maturity
            </div>
          </div>

          <div class="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 flex flex-col justify-between hover:border-masanielli-gold/50 transition-all duration-500 group shadow-xl">
            <div>
              <span class="font-mono text-xs text-masanielli-gold block mb-3">02 / SESTAVINE</span>
              <h3 class="text-lg font-serif font-bold text-white mb-2 uppercase group-hover:text-masanielli-gold transition-colors">D.O.P. Poreklo</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Uporabljamo izključno pelate San Marzano D.O.P., Mocarelo Bufala iz Kampanije ter Mortadelo D.O.P. z mletimi pistacijami.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-900 text-[11px] font-mono text-masanielli-gold/70">
              100% Certified Italian Origin
            </div>
          </div>

          <div class="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 flex flex-col justify-between hover:border-masanielli-gold/50 transition-all duration-500 group shadow-xl">
            <div>
              <span class="font-mono text-xs text-masanielli-gold block mb-3">03 / PANUOZZO</span>
              <h3 class="text-lg font-serif font-bold text-white mb-2 uppercase group-hover:text-masanielli-gold transition-colors">Grajski Sendviči</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Domači Panuozzo sendviči iz 160g sveže pečenega pica testa, napolnjeni s svežo stracciatella burrato in vrhunskimi nadevi.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-900 text-[11px] font-mono text-masanielli-gold/70">
              Freshly Baked 160g Bread
            </div>
          </div>

          <div class="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 flex flex-col justify-between hover:border-masanielli-gold/50 transition-all duration-500 group shadow-xl">
            <div>
              <span class="font-mono text-xs text-masanielli-gold block mb-3">04 / AMBIENT</span>
              <h3 class="text-lg font-serif font-bold text-white mb-2 uppercase group-hover:text-masanielli-gold transition-colors">Grad Kodeljevo</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Zgodovinski grajski kotiček v Ljubljani s prelepim poletnim vrtom, osvežilnimi koktajli in sproščenim vzdušjem.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-900 text-[11px] font-mono text-masanielli-gold/70">
              Castle Garden & Bistro Bar
            </div>
          </div>
        </div>

        <!-- Real Instagram Food Showcase Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div class="relative overflow-hidden rounded-3xl border border-masanielli-gold/30 group shadow-2xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_1, 800, 80)" alt="Neapolitan Pizza with Prosciutto and Arugula" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-masanielli-gold uppercase tracking-widest block mb-1">Sveže iz peči</span>
                <h4 class="text-xl font-serif font-bold text-white uppercase">Neapeljska Pica z Pršutom & Rukolo</h4>
              </div>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-3xl border border-masanielli-gold/30 group shadow-2xl">
            <img :src="getOptImg(siteImages.pizzeria_showcase_2, 800, 80)" alt="Panuozzo Mortadella Burrata e Pistacchio" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[11px] font-mono text-masanielli-gold uppercase tracking-widest block mb-1">Hišna Specialiteta</span>
                <h4 class="text-xl font-serif font-bold text-white uppercase">Panuozzo Sendvič z Mortadelo & Burrato</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== PRINTED A3 MENU VIEW ===== -->
      <div v-if="activeView === 'printed'" class="mb-20 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
        <div class="flex justify-between items-center mb-6 px-2">
          <span class="text-xs text-gray-400 font-mono uppercase tracking-wider">{{ t('pizzeria.printedCaption') }}</span>
          <a href="/menu-a3.jpg" target="_blank" class="text-xs text-masanielli-gold hover:underline font-bold uppercase tracking-wider">{{ t('pizzeria.openFullSize') }}</a>
        </div>
        <img :src="menuImageUrl" alt="Kader Grad Kodeljevo Meni A3" class="w-full h-auto rounded-2xl shadow-2xl border border-zinc-800 cursor-zoom-in hover:opacity-95 transition-opacity" @click="zoomOpen = true" />
      </div>

      <!-- ===== DIGITAL INTERACTIVE MENU VIEW ===== -->
      <div v-else class="mb-20">
        <!-- Category Pill Navigation -->
        <div class="flex overflow-x-auto pb-4 mb-12 space-x-2 hide-scrollbar justify-start md:justify-center border-b border-zinc-900">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center space-x-2 min-h-[44px]',
              activeCategory === cat.id 
                ? 'bg-masanielli-gold text-black shadow-lg shadow-masanielli-gold/10 font-black' 
                : 'bg-zinc-950 text-gray-400 hover:bg-zinc-900 hover:text-white border border-zinc-800/80'
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
            class="bg-zinc-950/90 rounded-3xl p-6 md:p-10 border border-zinc-800/80 shadow-2xl"
          >
            <div class="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-8">
              <div class="flex items-center space-x-4">
                <span class="text-3xl p-2 bg-zinc-900 rounded-2xl border border-zinc-800">{{ cat.icon }}</span>
                <div>
                  <h2 class="text-2xl md:text-3xl font-serif font-black uppercase text-white tracking-wider">{{ catName(cat) }}</h2>
                  <p v-if="cat.subtitle" class="text-xs text-masanielli-gold mt-1 font-medium italic">{{ cat.subtitle }}</p>
                </div>
              </div>
            </div>

            <!-- Grid Items -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="item in cat.items" 
                :key="item.name"
                class="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800/60 hover:border-masanielli-gold/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-serif font-bold text-white group-hover:text-masanielli-gold transition-colors">
                      {{ item.name }}
                    </h3>
                    <span class="text-base font-mono font-bold text-masanielli-gold ml-4 whitespace-nowrap bg-masanielli-gold/10 px-3 py-1 rounded-xl border border-masanielli-gold/30">
                      {{ item.price }}
                    </span>
                  </div>
                  <p v-if="item.description" class="text-xs md:text-sm text-gray-300 leading-relaxed mb-4 font-light">
                    {{ item.description }}
                  </p>
                </div>

                <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag"
                    class="px-2.5 py-0.5 bg-zinc-950 text-masanielli-gold/90 text-[10px] font-mono font-semibold rounded-md uppercase tracking-wider border border-masanielli-gold/20"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 4-COLUMN ESSENTIAL INFO BLOCK (Dove, Come, Orari, Reviews) ===== -->
      <section class="mt-20 bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          
          <!-- Dove / Kje -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-masanielli-gold flex items-center justify-center mb-4 text-xl">
              📍
            </div>
            <h4 class="font-serif font-bold text-white text-lg uppercase mb-2">Dove / Lokacija</h4>
            <p class="text-xs text-gray-400 leading-relaxed">
              Grad Kodeljevo<br />
              <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" class="text-masanielli-gold hover:underline font-medium">Ulica Carla Benza 20</a><br />
              1000 Ljubljana, Slovenija
            </p>
          </div>

          <!-- Come / Kontakt -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-masanielli-gold flex items-center justify-center mb-4 text-xl">
              📞
            </div>
            <h4 class="font-serif font-bold text-white text-lg uppercase mb-2">Naročila & Mizah</h4>
            <p class="text-xs text-gray-400 leading-relaxed mb-2">
              <strong class="text-gray-200">Hrana za s seboj:</strong><br />
              <a href="tel:+38683836740" class="text-masanielli-gold hover:underline font-mono text-sm">+386 83 836 740</a>
            </p>
            <p class="text-xs text-gray-400 leading-relaxed">
              <strong class="text-gray-200">Rezervacije miz:</strong><br />
              <a href="tel:+38640175628" class="text-masanielli-gold hover:underline font-mono text-sm">+386 40 175 628</a>
            </p>
          </div>

          <!-- Orari / Delovni Čas -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-masanielli-gold flex items-center justify-center mb-4 text-xl">
              ⏰
            </div>
            <h4 class="font-serif font-bold text-white text-lg uppercase mb-2">Orari / Delovni Čas</h4>
            <div class="text-xs text-gray-400 space-y-1">
              <p><strong class="text-gray-200">Pon – Sre:</strong> 09:00 – 22:00</p>
              <p><strong class="text-gray-200">Četrtek:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-200">Petek (Klub):</strong> 09:00 – 05:00</p>
              <p><strong class="text-gray-200">Sobota:</strong> 09:00 – 01:00</p>
              <p><strong class="text-gray-200">Nedelja:</strong> 09:00 – 20:00</p>
              <p class="text-[11px] text-masanielli-gold italic mt-2">* Kuhinja: 12:00 – 22:00</p>
            </div>
          </div>

          <!-- Certificazioni / Rating -->
          <div class="flex flex-col items-center md:items-start">
            <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-yellow-400 flex items-center justify-center mb-4 text-xl">
              ⭐
            </div>
            <h4 class="font-serif font-bold text-white text-lg uppercase mb-2">Priznanja & Mnenja</h4>
            <div class="flex items-center space-x-1 text-yellow-400 mb-2">
              <span class="text-2xl font-black text-white mr-1 font-mono">4.8</span>
              <span>★★★★★</span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed mb-3">
              Več kot 120+ preverjenih ocen gostov na Google Maps.
            </p>
            <a 
              href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" 
              target="_blank" 
              rel="noopener"
              class="px-4 py-2 bg-masanielli-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-masanielli-goldLight transition-colors"
            >
              Napišite mnenje ↗
            </a>
          </div>

        </div>
      </section>

      <!-- ===== GOOGLE VERIFIED REVIEWS SECTION ===== -->
      <section class="mt-16 bg-zinc-950/80 rounded-3xl p-8 md:p-10 border border-zinc-800/80 shadow-2xl">
        <div class="text-center mb-10">
          <span class="text-xs uppercase tracking-[0.3em] text-masanielli-gold font-semibold block mb-2">Mnenja Obiskovalcev</span>
          <h2 class="text-3xl font-serif font-bold text-white uppercase">{{ t('pizzeria.reviewsTitle') }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="rev in googleReviews" 
            :key="rev.author" 
            class="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80 hover:border-masanielli-gold/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-zinc-800 border border-masanielli-gold/40 text-masanielli-gold font-bold flex items-center justify-center text-sm shadow-md font-serif">
                    {{ rev.author.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-sm flex items-center">
                      {{ rev.author }}
                      <span class="ml-1 text-xs text-blue-400" title="Google Verified Review">✓</span>
                    </h3>
                    <span class="text-xs text-gray-500 font-mono">{{ rev.date }}</span>
                  </div>
                </div>
                <div class="flex text-yellow-400 text-sm">
                  ★★★★★
                </div>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed italic mb-4 font-light">
                “{{ rev.text }}”
              </p>
            </div>
            
            <div class="pt-3 border-t border-zinc-800/50 flex justify-between items-center text-[11px] text-gray-500 font-mono">
              <span>Google Verified</span>
              <span class="text-masanielli-gold font-medium">👍 {{ rev.likes }} priporočil</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Allergen Footnote -->
      <div class="mt-12 text-center text-xs text-gray-500 space-y-2">
        <p class="font-medium text-gray-400">{{ t('pizzeria.allergenNote') }}</p>
        <p>{{ t('pizzeria.companyLine') }}</p>
      </div>

    </div>

    <!-- ===== STICKY MOBILE ACTION BAR ===== -->
    <div class="fixed bottom-safe left-4 right-4 z-40 md:hidden bg-zinc-950/95 border border-masanielli-gold/40 backdrop-blur-lg p-3 rounded-2xl shadow-2xl flex justify-between items-center">
      <a href="tel:+38683836740" class="flex-1 mr-2 py-3 bg-masanielli-gold text-black rounded-xl text-xs font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min">
        <PhoneIcon class="w-4 h-4 mr-1.5" /> Naročim Za S Seboj
      </a>
      <a href="tel:+38640175628" class="flex-1 ml-2 py-3 bg-zinc-900 text-masanielli-gold border border-masanielli-gold/40 rounded-xl text-xs font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min">
        <CalendarDaysIcon class="w-4 h-4 mr-1.5" /> Rezervacija
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
        tags: ['Vegetarijansko', '48h Ferment']
      },
      {
        name: 'Bufalina',
        description: 'San Marzano pelati, mocarela bufala D.O.P, sušeni paradižniki, sveža bazilika, grana padano, oljčno olje.',
        price: '12 €',
        tags: ['Bufala DOP', 'Vegetarijansko', 'Priljubljeno']
      },
      {
        name: 'Melancan',
        description: 'San Marzano pelati, mocarela fior di latte, sušeni paradižniki, pečeni jajčevci, bučke, Taggiasca olive, rikota.',
        price: '12 €',
        tags: ['Vegetarijansko']
      },
      {
        name: 'Klasična',
        description: 'San Marzano pelati, mocarela fior di latte, sveži šampinjoni, dimljen kuhan pršut Praga.',
        price: '11 €',
        tags: ['Pršut Praga']
      },
      {
        name: 'Peperoni',
        description: 'San Marzano pelati, mocarela fior di latte, sveži šampinjoni, pikantna salama, pekoč preliv.',
        price: '11 €',
        tags: ['Pikantno']
      },
      {
        name: 'Parma',
        description: 'San Marzano pelati, mocarela bufala, rukola, parmski pršut.',
        price: '13 €',
        tags: ['Pršut Parma', 'Bufala DOP']
      },
      {
        name: 'Bresaola Tartufo',
        description: 'Tartufina krema, mocarela fior di latte, sveži šampinjoni, sušeni paradižniki, bresaola, mlada špinača, grana padano, rikota, oljčno olje.',
        price: '14 €',
        tags: ['Tartufi', 'Specialiteta']
      },
      {
        name: 'Tuna',
        description: 'San Marzano pelati, mocarela fior di latte, tunina, koruza, Taggiasca olive, rdeča čebula.',
        price: '11 €'
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
        tags: ['Stracciatella']
      },
      {
        name: 'Mortadela',
        description: 'Tanke rezine Mortadele D.O.P, stracciatella, pistacijina krema in mleti pistaciji.',
        price: '9 €',
        tags: ['Mortadela DOP', 'Pistacija', 'Priljubljeno']
      },
      {
        name: 'Roastbeef',
        description: 'Tanke rezine ohlajenega rostbifa, stracciatella, mlada špinača, honey mustard preliv.',
        price: '11 €',
        tags: ['Rostbif']
      },
      {
        name: 'Meatball',
        description: 'Domače mesne kroglice, pelati, mocarela, sveža bazilika, parmezan.',
        price: '10 €',
        tags: ['Hišna Specialiteta']
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