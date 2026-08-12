<template>
  <div class="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header Banner -->
      <header class="mb-12 text-center relative overflow-hidden rounded-2xl py-10 px-6 border border-zinc-800 bg-zinc-950">
        <img src="/pizzeria-bg.jpg" alt="Kader Pizzeria" class="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex justify-center mb-6">
            <img src="/logo-banner.png" alt="Kader Logo" class="h-16 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
          </div>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
            Meni / Menu
          </h1>
          <p class="text-lg md:text-xl text-red-500 font-semibold max-w-2xl mx-auto uppercase tracking-widest">
            {{ t('pizzeria.tagline') }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            {{ t('pizzeria.locationLine') }}
          </p>

          <!-- Direct Contact Action Cards -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a href="tel:+38683836740" class="flex items-center justify-center p-4 bg-red-950/40 border border-red-800/60 rounded-xl hover:bg-red-900/50 transition-all duration-300 group">
              <PhoneIcon class="w-6 h-6 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
              <div class="text-left">
                <span class="text-xs text-gray-400 block uppercase font-medium">{{ t('pizzeria.pickUp') }}</span>
                <span class="text-lg font-bold text-white tracking-wider">+386 83 836 740</span>
              </div>
            </a>
            <a href="tel:+38640175628" class="flex items-center justify-center p-4 bg-zinc-900 border border-zinc-700/80 rounded-xl hover:bg-zinc-800 transition-all duration-300 group">
              <CalendarDaysIcon class="w-6 h-6 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
              <div class="text-left">
                <span class="text-xs text-gray-400 block uppercase font-medium">{{ t('pizzeria.tableRes') }}</span>
                <span class="text-lg font-bold text-white tracking-wider">+386 40 175 628</span>
              </div>
            </a>
          </div>

          <!-- Toggle View: Interactive Menu vs Printed Menu Image -->
          <div class="mt-8 flex justify-center space-x-3">
            <button 
              @click="activeView = 'digital'"
              :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300', activeView === 'digital' ? 'bg-red-600 text-white shadow-lg shadow-red-950' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800']"
            >
              {{ t('pizzeria.digitalMenu') }}
            </button>
            <button 
              @click="activeView = 'printed'"
              :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300', activeView === 'printed' ? 'bg-red-600 text-white shadow-lg shadow-red-950' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800']"
            >
              {{ t('pizzeria.printedMenu') }}
            </button>
          </div>
        </div>
      </header>

      <!-- VIEW 1: PRINTED MENU IMAGE -->
      <div v-if="activeView === 'printed'" class="mb-16 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-2xl">
        <div class="flex justify-between items-center mb-4 px-2">
          <span class="text-sm text-gray-400">{{ t('pizzeria.printedCaption') }}</span>
          <a href="/menu-a3.jpg" target="_blank" class="text-xs text-red-400 hover:underline">{{ t('pizzeria.openFullSize') }}</a>
        </div>
        <img :src="menuImageUrl" alt="Kader Grad Kodeljevo Meni A3" class="w-full h-auto rounded-xl shadow-inner border border-zinc-800 cursor-zoom-in" @click="zoomOpen = true" />
      </div>

      <!-- VIEW 2: DIGITAL INTERACTIVE MENU -->
      <div v-else>
        <!-- Category Navigation Tabs -->
        <div class="flex overflow-x-auto pb-4 mb-10 space-x-2 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-zinc-900 justify-start md:justify-center">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="['px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center space-x-2', activeCategory === cat.id ? 'bg-red-600 text-white shadow-md' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800']"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ catName(cat) }}</span>
          </button>
        </div>

        <!-- Menu Sections -->
        <div class="space-y-16">
          <div 
            v-for="cat in filteredCategories" 
            :key="cat.id"
            class="bg-zinc-950/80 rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-xl"
          >
            <div class="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
              <div class="flex items-center space-x-3">
                <span class="text-3xl">{{ cat.icon }}</span>
                <div>
                  <h2 class="text-2xl md:text-3xl font-black uppercase text-white tracking-wider">{{ catName(cat) }}</h2>
                  <p v-if="cat.subtitle" class="text-xs text-red-400 mt-0.5 font-medium">{{ cat.subtitle }}</p>
                </div>
              </div>
            </div>

            <!-- Grid Items -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="item in cat.items" 
                :key="item.name"
                class="bg-zinc-900/60 p-5 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-black text-white group-hover:text-red-400 transition-colors">
                      {{ item.name }}
                    </h3>
                    <span class="text-lg font-black text-red-500 ml-4 whitespace-nowrap bg-red-950/40 px-2.5 py-1 rounded-md border border-red-900/40">
                      {{ item.price }}
                    </span>
                  </div>
                  <p v-if="item.description" class="text-sm text-gray-300 leading-relaxed mb-3">
                    {{ item.description }}
                  </p>
                </div>

                <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag"
                    class="px-2 py-0.5 bg-zinc-800 text-gray-400 text-[11px] font-semibold rounded uppercase tracking-wider"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GOOGLE BUSINESS REVIEWS SECTION -->
      <section class="mt-16 bg-zinc-950/90 rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <h2 class="text-2xl md:text-3xl font-black uppercase text-white tracking-wider">{{ t('pizzeria.reviewsTitle') }}</h2>
            </div>
            <p class="text-sm text-gray-400">{{ t('pizzeria.reviewsSubtitle') }}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl">
            <div class="flex items-center space-x-3">
              <!-- Google G Logo -->
              <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29B11.86 11.86 0 000 12c0 1.92.46 3.74 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <div>
                <div class="flex items-center space-x-1 text-yellow-400">
                  <span class="text-xl font-black text-white mr-1">4.8</span>
                  <span>★★★★★</span>
                </div>
                <span class="text-xs text-gray-400">120+ Google Reviews</span>
              </div>
            </div>
            <a 
              href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" 
              target="_blank" 
              rel="noopener"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap shadow-md"
            >
              {{ t('pizzeria.viewGoogle') }}
            </a>
          </div>
        </div>

        <!-- REVIEWS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="rev in googleReviews" 
            :key="rev.author" 
            class="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {{ rev.author.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-sm flex items-center">
                      {{ rev.author }}
                      <span class="ml-1 text-xs text-blue-400" title="Google Verified Review">✓</span>
                    </h3>
                    <span class="text-xs text-gray-500">{{ rev.date }}</span>
                  </div>
                </div>
                <div class="flex text-yellow-400 text-sm">
                  ★★★★★
                </div>
              </div>
              <p class="text-sm text-gray-300 leading-relaxed italic mb-4">
                “{{ rev.text }}”
              </p>
            </div>
            
            <div class="pt-3 border-t border-zinc-800/50 flex justify-between items-center text-xs text-gray-500">
              <span>Google Verified</span>
              <span class="text-red-400 font-medium">👍 {{ rev.likes }} priporočil</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Allergen & Info Footnote -->
      <div class="mt-16 bg-zinc-950 p-6 rounded-xl border border-zinc-900 text-center text-xs text-gray-400 space-y-2">
        <p class="font-semibold text-gray-300">
          {{ t('pizzeria.allergenNote') }}
        </p>
        <p>
          {{ t('pizzeria.hoursNote') }}
        </p>
        <p class="text-gray-500 text-[11px]">
          {{ t('pizzeria.companyLine') }}
        </p>
      </div>

      <!-- Lightbox modal for menu image -->
      <Teleport to="body">
        <div 
          v-if="zoomOpen" 
          class="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 cursor-zoom-out"
          @click="zoomOpen = false"
        >
          <img :src="menuImageUrl" :alt="t('pizzeria.zoomedAlt')" class="max-w-full max-h-full object-contain rounded-xl">
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PhoneIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const { t } = useLocale()

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
        tags: ['Vegetarijansko']
      },
      {
        name: 'Bufalina',
        description: 'San Marzano pelati, mocarela bufala D.O.P, sušeni paradižniki, sveža bazilika, grana padano, oljčno olje.',
        price: '12 €',
        tags: ['Bufala DOP', 'Vegetarijansko']
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
        price: '11 €'
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
        tags: ['Pršut Parma']
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
        price: '9 €'
      },
      {
        name: 'Mortadela',
        description: 'Tanke rezine Mortadele D.O.P, stracciatella, pistacijina krema in mleti pistaciji.',
        price: '9 €',
        tags: ['Pistacija', 'Priljubljeno']
      },
      {
        name: 'Roastbeef',
        description: 'Tanke rezine ohlajenega rostbifa, stracciatella, mlada špinača, honey mustard preliv.',
        price: '11 €'
      },
      {
        name: 'Meatball',
        description: 'Domače mesne kroglice, pelati, mocarela, sveža bazilika, parmezan.',
        price: '10 €'
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
        tags: ['Sveži rezanci']
      },
      {
        name: 'Steak Argentino',
        description: 'Argentinski goveji steak, domači ocvrten pomfrit in argentinski čimičuri (chimichurri) preliv.',
        price: '20 €',
        tags: ['Premium']
      },
      {
        name: 'Mesni Burger',
        description: 'Sočni polpet iz suho zorjene govedine v popečeni bombeti, serviran z domačim pomfritom.',
        price: '12 €'
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
        price: '10 €'
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
        price: '3.50 €'
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