<template>
  <section class="my-24 relative bg-white">
    <!-- Subtle Background Atmosphere Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.05)_0%,transparent_60%)] pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 px-4">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
          <span>🔥</span>
          <span>50 Top Pizza Standard · L'Arte Della Pizza</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-serif font-black uppercase text-gray-900 tracking-tight leading-tight">
          Obrt Testa & Peč na 450°C
        </h2>
        <p class="text-gray-600 text-sm md:text-base font-light mt-4 leading-relaxed">
          Pristna neapeljska pica ni le hrana — je živa znanost fermentacije in spoštovanje stoletnega izročila Kampanije. Vsak hlebec v grajski kuhinji zori 48 ur pri kontrolirani temperaturi in se v 90 sekundah speče v razbeljeni peči na bukova drva.
        </p>
        <div class="w-24 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
      </div>

      <!-- ===== 5 INTERACTIVE CRAFT METRICS HUD ===== -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-16 px-2">
        <div 
          v-for="(metric, idx) in craftMetrics" 
          :key="metric.label"
          @click="activeStep = idx"
          :class="[
            'p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer text-center relative overflow-hidden group shadow-sm',
            activeStep === idx 
              ? 'bg-red-50 border-red-600 shadow-md shadow-red-600/10 -translate-y-1' 
              : 'bg-white border-gray-100 hover:border-red-300 hover:bg-red-50/50'
          ]"
        >
          <div class="text-2xl mb-2">{{ metric.icon }}</div>
          <div class="font-serif font-black text-2xl md:text-3xl text-gray-900 group-hover:text-red-600 transition-colors">
            {{ metric.value }}
          </div>
          <div class="text-[11px] font-mono text-red-600 font-bold uppercase tracking-wider mt-1">
            {{ metric.label }}
          </div>
          <div class="text-[10px] text-gray-500 mt-1 font-light line-clamp-2">
            {{ metric.subtext }}
          </div>
          <div 
            v-if="activeStep === idx" 
            class="absolute bottom-0 inset-x-0 h-1 bg-red-600"
          ></div>
        </div>
      </div>

      <!-- ===== INTERACTIVE 5-STEP CRAFT EXPLORER ===== -->
      <div class="bg-white border-2 border-red-100 rounded-3xl p-6 md:p-10 shadow-xl">
        <!-- Step Selector Bar -->
        <div class="flex overflow-x-auto pb-4 mb-8 space-x-2 hide-scrollbar border-b-2 border-red-100">
          <button
            v-for="(step, idx) in craftSteps"
            :key="step.number"
            @click="activeStep = idx"
            :class="[
              'px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center space-x-2 min-h-[44px]',
              activeStep === idx
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-black'
                : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
            ]"
          >
            <span>{{ step.number }}</span>
            <span>{{ step.tabTitle }}</span>
          </button>
        </div>

        <!-- Active Step Deep Dive Display -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Text Details (7 cols) -->
          <div class="lg:col-span-7 space-y-5">
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 bg-red-50 border border-red-200 text-red-600 font-mono text-xs font-bold rounded-lg uppercase tracking-widest">
                Faza {{ currentStep.number }} / 05
              </span>
              <span class="text-xs font-mono text-gray-500">
                {{ currentStep.scientificLabel }}
              </span>
            </div>

            <h3 class="text-2xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
              {{ currentStep.title }}
            </h3>

            <p class="text-sm md:text-base text-gray-600 font-light leading-relaxed">
              {{ currentStep.description }}
            </p>

            <!-- Technical Highlights Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div 
                v-for="(spec, sIdx) in currentStep.specs" 
                :key="sIdx"
                class="p-4 bg-red-50/60 rounded-2xl border border-red-100"
              >
                <div class="text-xs font-mono text-red-600 font-semibold uppercase tracking-wider mb-1">
                  {{ spec.label }}
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ spec.value }}
                </div>
                <div class="text-[11px] text-gray-500 mt-1 font-light">
                  {{ spec.desc }}
                </div>
              </div>
            </div>

            <!-- Master Pizzaiolo Quote -->
            <blockquote class="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl text-xs text-gray-700 italic font-serif">
              “{{ currentStep.quote }}”
              <span class="block not-italic font-mono text-[10px] text-red-600 mt-1 uppercase font-bold tracking-wider">
                — Mojster picajol Kader Grad Kodeljevo
              </span>
            </blockquote>
          </div>

          <!-- Visual Graphic / Interactive Anatomy (5 cols) -->
          <div class="lg:col-span-5">
            <div class="relative bg-red-50/40 border-2 border-red-200 rounded-3xl p-6 shadow-lg overflow-hidden group">
              <!-- Radial badge backing -->
              <div class="text-center py-6">
                <div class="w-28 h-28 mx-auto rounded-full bg-white border-2 border-red-600 flex flex-col items-center justify-center shadow-md relative">
                  <span class="text-4xl select-none">{{ currentStep.heroIcon }}</span>
                  <span class="text-[10px] font-mono text-red-600 font-bold uppercase mt-1">
                    {{ currentStep.metricHighlight }}
                  </span>
                </div>

                <h4 class="text-xl font-serif font-bold text-gray-900 mt-4 uppercase">
                  {{ currentStep.visualCardTitle }}
                </h4>
                <p class="text-xs text-gray-500 max-w-xs mx-auto mt-1 font-light">
                  {{ currentStep.visualCardSubtitle }}
                </p>
              </div>

              <!-- Interactive Step Micro-features -->
              <div class="space-y-2.5 pt-4 border-t-2 border-red-100 text-xs font-mono">
                <div 
                  v-for="(f, fIdx) in currentStep.features" 
                  :key="fIdx"
                  class="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                  <span class="text-gray-800 flex items-center gap-2">
                    <span class="text-red-600 font-bold">✔</span> {{ f.name }}
                  </span>
                  <span class="text-red-600 font-bold">{{ f.badge }}</span>
                </div>
              </div>

              <!-- Next / Prev Quick Controls -->
              <div class="flex justify-between items-center mt-6 pt-4 border-t-2 border-red-100 text-xs font-mono">
                <button
                  type="button"
                  @click="prevStep"
                  :disabled="activeStep === 0"
                  class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-30 min-h-[36px]"
                >
                  ← Prejšnji korak
                </button>
                <span class="text-gray-500">{{ activeStep + 1 }} / 5</span>
                <button
                  type="button"
                  @click="nextStep"
                  :disabled="activeStep === craftSteps.length - 1"
                  class="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-30 min-h-[36px]"
                >
                  Naslednji korak →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeStep = ref(0)

const craftMetrics = [
  {
    icon: '🔥',
    value: '450°C',
    label: 'Peč na Drva',
    subtext: 'Zidana kupola na bukov les za bliskovito peko'
  },
  {
    icon: '💧',
    value: '72%',
    label: 'Hidracija',
    subtext: 'Visok delež vode za maksimalno mehkobo'
  },
  {
    icon: '⏳',
    value: '48 Ur',
    label: 'Fermentacija',
    subtext: 'Dvodnevno kontrolirano hladno zorenje pri 4°C'
  },
  {
    icon: '⚡',
    value: '90 Sek',
    label: 'Čas Peke',
    subtext: 'Hipna peka ohrani svežino pelatov in sira'
  },
  {
    icon: '🌾',
    value: 'Caputo 00',
    label: 'Moka Poreklo',
    subtext: 'Mleta v Neaplju z visoko elastičnostjo (W 300)'
  }
]

const craftSteps = [
  {
    number: '01',
    tabTitle: 'Moka Caputo & Kvas',
    scientificLabel: 'Zrnata sestava & naravni kvas',
    title: 'Italijanska Moka Caputo Tipo "00" & Minimalen Kvas',
    description: 'Osnova našega testa je legendarna moka Mulino Caputo iz Neaplja z visoko vsebnostjo beljakovin in močjo W 300. Uporabljamo izredno majhno količino svežega kvasa (< 0.1%), saj okus gradi čas in ne kvasovke.',
    heroIcon: '🌾',
    metricHighlight: 'Caputo Tipo 00',
    visualCardTitle: 'Moka & Kvas',
    visualCardSubtitle: 'Pristna zrnata struktura iz Neaplja',
    specs: [
      { label: 'Moč Moke (W-indeks)', value: 'W 280 – 320', desc: 'Močna glutenska mreža za ujetje plinov' },
      { label: 'Razmerje P/L', value: '0.50 – 0.60', desc: 'Popolno ravnovesje med elastičnostjo in raztegljivostjo' }
    ],
    features: [
      { name: '100% Neapeljsko mletje', badge: 'Caputo Pizzeria' },
      { name: 'Nizka vsebnost kvasa', badge: '< 0.1%' },
      { name: 'Piranska morska sol', badge: 'Čista sol' }
    ],
    quote: 'Dobra pica se začne z razumevanjem zrnja. Prava moka omogoča testu, da diha.'
  },
  {
    number: '02',
    tabTitle: '72% Visoka Hidracija',
    scientificLabel: 'Vezava vode & struktura',
    title: 'Izjemno Mehko Testo z Visokim Deležem Vode',
    description: 'Medtem ko klasične industrijske pice uporabljajo le 50–55% hidracijo, pri Kaderju testo mešamo z natanko 70% do 72% čiste filtrirane vode. Visoka hidracija ustvari zračne komore (alveole), ki testu dajejo svilnato, zračno in peresno lahko strukturo.',
    heroIcon: '💧',
    metricHighlight: '72% H₂O',
    visualCardTitle: 'Hidracija Testa',
    visualCardSubtitle: 'Zračnost in peresna lahkost',
    specs: [
      { label: 'Delež Tekočine', value: '720 ml na 1 kg moke', desc: 'Skoraj dvakrat več kot pri običajnih picah' },
      { label: 'Temperatura Vode', value: '14°C – 16°C', desc: 'Nadzor trenja pri počasnem spiralnem mešanju' }
    ],
    features: [
      { name: 'Počasno spiralno gnetenje', badge: '20 minut' },
      { name: 'Rahlost sredice', badge: 'Puhasta' },
      { name: 'Elastičnost mehurčkov', badge: 'Popolna' }
    ],
    quote: 'Voda v testu pomeni življenje. Več vode pomeni več mehkobe in manj ogljikovih hidratov na grižljaj.'
  },
  {
    number: '03',
    tabTitle: '48h Hladno Zorenje',
    scientificLabel: 'Maturacija & encimska razgradnja',
    title: '48-Urna Kontrolirana Hladna Fermentacija pri 4°C',
    description: 'Hlebčki testa počivajo natanko 48 ur v posebni hladilni komori. V tem času encimi (amilaze in proteaze) kompleksne škrobe in beljakovine razgradijo v enostavne sladkorje in aminokisline. Testo je "predhodno prebavljeno", zato vas po obroku nikoli ne bo tiščalo v želodcu.',
    heroIcon: '⏳',
    metricHighlight: '48 Ur / 4°C',
    visualCardTitle: 'Maturacija',
    visualCardSubtitle: 'Encimsko zorenje brez naglice',
    specs: [
      { label: 'Temperatura Komore', value: '4°C – 6°C', desc: 'Upočasnjeno delovanje kvasovk za razvoj arom' },
      { label: 'Glikemični Vpliv', value: 'Bistveno nižji', desc: 'Kompleksni škrobi so že razgrajeni' }
    ],
    features: [
      { name: 'Razvoj mlečne kisline', badge: 'Bogata aroma' },
      { name: 'Nič napihnjenosti', badge: 'Lahka prebava' },
      { name: 'Naravna zračnost', badge: 'Alveoli' }
    ],
    quote: 'Čas je tista sestavina, ki je ne morete kupiti ali pospešiti. Po 48 urah testo dobi pravo dušo.'
  },
  {
    number: '04',
    tabTitle: 'Schiaffo Napoletano',
    scientificLabel: 'Ročno raztegovanje brez orodja',
    title: 'Tehnika "Schiaffo": Ročno Raztegovanje Brez Valjarja',
    description: 'Pravi neapeljski picopek nikoli ne uporablja valjarja! Z značilnimi ritmičnimi gibi dlani in tehnike "schiaffo" (neapeljski klofutanec) picopek zrak iz sredice nežno potisne navzven v rob. Sredica ostane tanka (2 mm), rob pa postane visok in zračen.',
    heroIcon: '👐',
    metricHighlight: '0% Valjar',
    visualCardTitle: 'Ročna Obrt',
    visualCardSubtitle: 'Schiaffo napoletano tehnika',
    specs: [
      { label: 'Debelina Sredice', value: '2 – 3 mm', desc: 'Mehka, voljna in upogljiva "a portafoglio"' },
      { label: 'Višina Roba (Cornicione)', value: '20 – 30 mm', desc: 'Napihnjen in votel zračni mehur' }
    ],
    features: [
      { name: '100% Ročno oblikovano', badge: 'Brez strojev' },
      { name: 'Ohranitev ujetega plina', badge: 'CO₂ mehurji' },
      { name: 'Neapeljska tradicija', badge: 'UNESCO kultura' }
    ],
    quote: 'Z rokami se začuti napetost testa. Z valjarjem bi uničili vse mehurčke, ki so nastajali dva dni.'
  },
  {
    number: '05',
    tabTitle: '450°C Peč na Drva',
    scientificLabel: 'Termodinamični šok & maculatura',
    title: '450°C Krušna Peč: 60 do 90 Sekund Ognjenega Krsta',
    description: 'Naša zidana kupolasta peč se kuri z izbranimi bukovimi drvmi, ki dosegajo temperaturo med 450°C in 485°C. Zaradi ekstremne vročine in šamotnega dna Biscotto se pica speče v zgolj 60 do 90 sekundah. Pelati ohranijo svežo sadno kislost, mocarela se stopi v kremo, rob pa dobi znamenite leopardje pike.',
    heroIcon: '🔥',
    metricHighlight: '450°C / 90s',
    visualCardTitle: 'Krušna Peč',
    visualCardSubtitle: 'Biscotto šamot in bukov plamen',
    specs: [
      { label: 'Čas Peke', value: '60 – 90 sekund', desc: 'Bliskovita toplotna obdelava ohrani hranila' },
      { label: 'Gorivo', value: 'Suhi bukov les', desc: 'Čist plamen brez smol za pristno dimno noto' }
    ],
    features: [
      { name: 'Šamotna podlaga', badge: 'Biscotto' },
      { name: 'Leopardji vzorec', badge: 'Maculatura' },
      { name: 'Svežina nadeva', badge: '100% sočnost' }
    ],
    quote: 'Devetdeset sekund v 450 stopinjah. Vse sestavine zaživijo hkrati — sir se stopi, a se ne prismodi.'
  }
]

const currentStep = computed(() => craftSteps[activeStep.value] || craftSteps[0])

const nextStep = () => {
  if (activeStep.value < craftSteps.length - 1) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
