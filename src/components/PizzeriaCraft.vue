<template>
  <section class="my-24 relative bg-white">
    <!-- Subtle Background Atmosphere Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.05)_0%,transparent_60%)] pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 px-4">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-4">
          <span>🔥</span>
          <span>{{ t('craft.standardBadge') }}</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-serif font-black uppercase text-gray-900 tracking-tight leading-tight">
          {{ t('craft.mainHeading') }}
        </h2>
        <p class="text-gray-600 text-sm md:text-base font-light mt-4 leading-relaxed">
          {{ t('craft.mainDescription') }}
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
                {{ t('craft.phaseBadge', { n: currentStep.number }) }}
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
                {{ t('craft.pizzaioloQuoteAttribution') }}
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
                  {{ t('craft.prevStep') }}
                </button>
                <span class="text-gray-500">{{ activeStep + 1 }} / 5</span>
                <button
                  type="button"
                  @click="nextStep"
                  :disabled="activeStep === craftSteps.length - 1"
                  class="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-30 min-h-[36px]"
                >
                  {{ t('craft.nextStep') }}
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
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
const activeStep = ref(0)

const craftMetrics = computed(() => [
  {
    icon: '🔥',
    value: '450°C',
    label: t('craft.m1Label'),
    subtext: t('craft.m1Sub')
  },
  {
    icon: '💧',
    value: '72%',
    label: t('craft.m2Label'),
    subtext: t('craft.m2Sub')
  },
  {
    icon: '⏳',
    value: t('craft.m3Val'),
    label: t('craft.m3Label'),
    subtext: t('craft.m3Sub')
  },
  {
    icon: '⚡',
    value: t('craft.m4Val'),
    label: t('craft.m4Label'),
    subtext: t('craft.m4Sub')
  },
  {
    icon: '🌾',
    value: 'Caputo 00',
    label: t('craft.m5Label'),
    subtext: t('craft.m5Sub')
  }
])

const craftSteps = computed(() => [
  {
    number: '01',
    tabTitle: t('craft.step1Tab'),
    scientificLabel: t('craft.step1Sci'),
    title: t('craft.step1Title'),
    description: t('craft.step1Desc'),
    heroIcon: '🌾',
    metricHighlight: 'Caputo Tipo 00',
    visualCardTitle: t('craft.step1CardTitle'),
    visualCardSubtitle: t('craft.step1CardSub'),
    specs: [
      { label: t('craft.step1Spec1Label'), value: 'W 280 – 320', desc: t('craft.step1Spec1Desc') },
      { label: t('craft.step1Spec2Label'), value: '0.50 – 0.60', desc: t('craft.step1Spec2Desc') }
    ],
    features: [
      { name: t('craft.step1Feat1Name'), badge: 'Caputo Pizzeria' },
      { name: t('craft.step1Feat2Name'), badge: '< 0.1%' },
      { name: t('craft.step1Feat3Name'), badge: t('craft.step1Feat3Badge') }
    ],
    quote: t('craft.step1Quote')
  },
  {
    number: '02',
    tabTitle: t('craft.step2Tab'),
    scientificLabel: t('craft.step2Sci'),
    title: t('craft.step2Title'),
    description: t('craft.step2Desc'),
    heroIcon: '💧',
    metricHighlight: '72% H₂O',
    visualCardTitle: t('craft.step2CardTitle'),
    visualCardSubtitle: t('craft.step2CardSub'),
    specs: [
      { label: t('craft.step2Spec1Label'), value: '720 ml / 1 kg', desc: t('craft.step2Spec1Desc') },
      { label: t('craft.step2Spec2Label'), value: '14°C – 16°C', desc: t('craft.step2Spec2Desc') }
    ],
    features: [
      { name: t('craft.step2Feat1Name'), badge: t('craft.step2Feat1Badge') },
      { name: t('craft.step2Feat2Name'), badge: t('craft.step2Feat2Badge') },
      { name: t('craft.step2Feat3Name'), badge: t('craft.step2Feat3Badge') }
    ],
    quote: t('craft.step2Quote')
  },
  {
    number: '03',
    tabTitle: t('craft.step3Tab'),
    scientificLabel: t('craft.step3Sci'),
    title: t('craft.step3Title'),
    description: t('craft.step3Desc'),
    heroIcon: '⏳',
    metricHighlight: '48 Ur / 4°C',
    visualCardTitle: t('craft.step3CardTitle'),
    visualCardSubtitle: t('craft.step3CardSub'),
    specs: [
      { label: t('craft.step3Spec1Label'), value: '4°C – 6°C', desc: t('craft.step3Spec1Desc') },
      { label: t('craft.step3Spec2Label'), value: 'Low GI', desc: t('craft.step3Spec2Desc') }
    ],
    features: [
      { name: t('craft.step3Feat1Name'), badge: t('craft.step3Feat1Badge') },
      { name: t('craft.step3Feat2Name'), badge: t('craft.step3Feat2Badge') },
      { name: t('craft.step3Feat3Name'), badge: t('craft.step3Feat3Badge') }
    ],
    quote: t('craft.step3Quote')
  },
  {
    number: '04',
    tabTitle: t('craft.step4Tab'),
    scientificLabel: t('craft.step4Sci'),
    title: t('craft.step4Title'),
    description: t('craft.step4Desc'),
    heroIcon: '👐',
    metricHighlight: '0% Valjar',
    visualCardTitle: t('craft.step4CardTitle'),
    visualCardSubtitle: t('craft.step4CardSub'),
    specs: [
      { label: t('craft.step4Spec1Label'), value: '2 – 3 mm', desc: t('craft.step4Spec1Desc') },
      { label: t('craft.step4Spec2Label'), value: '20 – 30 mm', desc: t('craft.step4Spec2Desc') }
    ],
    features: [
      { name: t('craft.step4Feat1Name'), badge: t('craft.step4Feat1Badge') },
      { name: t('craft.step4Feat2Name'), badge: t('craft.step4Feat2Badge') },
      { name: t('craft.step4Feat3Name'), badge: t('craft.step4Feat3Badge') }
    ],
    quote: t('craft.step4Quote')
  },
  {
    number: '05',
    tabTitle: t('craft.step5Tab'),
    scientificLabel: t('craft.step5Sci'),
    title: t('craft.step5Title'),
    description: t('craft.step5Desc'),
    heroIcon: '🔥',
    metricHighlight: '450°C / 90s',
    visualCardTitle: t('craft.step5CardTitle'),
    visualCardSubtitle: t('craft.step5CardSub'),
    specs: [
      { label: t('craft.step5Spec1Label'), value: '60 – 90 s', desc: t('craft.step5Spec1Desc') },
      { label: t('craft.step5Spec2Label'), value: 'Fagus sylvatica', desc: t('craft.step5Spec2Desc') }
    ],
    features: [
      { name: t('craft.step5Feat1Name'), badge: 'Biscotto' },
      { name: t('craft.step5Feat2Name'), badge: 'Maculatura' },
      { name: t('craft.step5Feat3Name'), badge: t('craft.step5Feat3Badge') }
    ],
    quote: t('craft.step5Quote')
  }
])

const currentStep = computed(() => {
  const step = craftSteps.value[activeStep.value] ?? craftSteps.value[0]
  if (!step) throw new Error('At least one craft step must be configured')
  return step
})

const nextStep = () => {
  if (activeStep.value < craftSteps.value.length - 1) {
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
