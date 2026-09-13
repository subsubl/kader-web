<template>
  <div class="relative inline-block" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
    <button
      type="button"
      @click.stop="toggleTooltip"
      :class="[
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all duration-300 border focus:outline-none focus:ring-1 focus:ring-masanielli-gold/50 cursor-pointer shadow-sm',
        badgeColorClass
      ]"
      :title="badgeInfo.title"
      :aria-label="`${badgeInfo.title}: ${badgeInfo.description}`"
    >
      <span class="text-xs select-none">{{ badgeInfo.icon }}</span>
      <span class="font-semibold">{{ badgeInfo.shortName }}</span>
      <span 
        v-if="badgeInfo.cert" 
        class="text-[9px] uppercase tracking-wider font-extrabold px-1 py-0.5 rounded bg-black/40 border border-white/10 select-none"
      >
        {{ badgeInfo.cert }}
      </span>
    </button>

    <!-- Interactive Provenance Flyout / Tooltip -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-zinc-950/95 border border-masanielli-gold/40 rounded-2xl shadow-2xl z-50 text-left backdrop-blur-xl pointer-events-auto"
      >
        <div class="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
          <div class="flex items-center space-x-1.5">
            <span class="text-base">{{ badgeInfo.icon }}</span>
            <span class="text-[11px] font-mono uppercase tracking-wider text-masanielli-gold font-bold">
              {{ badgeInfo.origin }}
            </span>
          </div>
          <span 
            v-if="badgeInfo.cert" 
            :class="[
              'text-[9px] px-2 py-0.5 rounded font-mono font-black uppercase tracking-wider border',
              badgeCertPillClass
            ]"
          >
            {{ badgeInfo.cert }}
          </span>
        </div>

        <h5 class="text-xs font-serif font-bold text-white mb-1.5 leading-snug">
          {{ badgeInfo.title }}
        </h5>

        <p class="text-[11px] text-gray-300 leading-relaxed font-light mb-2">
          {{ badgeInfo.description }}
        </p>

        <div v-if="badgeInfo.fact" class="pt-2 border-t border-zinc-900 flex items-center text-[10px] text-gray-400 font-mono italic">
          <span class="text-masanielli-gold mr-1">✦</span> {{ badgeInfo.fact }}
        </div>

        <!-- Tooltip arrow caret -->
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-950 border-r border-b border-masanielli-gold/40 rotate-45"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()

export type BadgeKey =
  | 'san-marzano'
  | 'bufala'
  | 'fior-di-latte'
  | 'ferment-48h'
  | 'mortadella'
  | 'pistacchio'
  | 'olio-bio'
  | 'parma'
  | 'stracciatella'
  | 'vegetarijansko'
  | 'pikantno'
  | 'specialiteta'

interface BadgeDef {
  key: BadgeKey
  shortName: string
  cert?: string
  icon: string
  title: string
  origin: string
  category: 'dop' | 'igp' | 'bio' | 'craft' | 'dietary'
  description: string
  fact?: string
}

const props = defineProps<{
  badgeKey: string
}>()

const isOpen = ref(false)
const toggleTooltip = () => {
  isOpen.value = !isOpen.value
}

// Canonical Registry of World-Class Neapolitan Provenance Badges
const BADGE_REGISTRY: Record<string, BadgeDef> = {
  'san-marzano': {
    key: 'san-marzano',
    shortName: 'San Marzano',
    cert: 'D.O.P.',
    icon: '🍅',
    title: 'Pelati San Marzano dell’Agro Sarnese-Nocerino D.O.P.',
    origin: 'Campania (Vezuv)',
    category: 'dop',
    description: 'Pristni pelati, ročno obrani na vulkanskih tleh pod Vezuvom. Značilna podolgovata oblika, gosta sočna mesnatost in nizka naravna kislost.',
    fact: 'Certificirano z edinstveno D.O.P. številko konzorcija'
  },
  'bufala': {
    key: 'bufala',
    shortName: 'Bufala Campana',
    cert: 'D.O.P.',
    icon: '🐃',
    title: 'Mozzarella di Bufala Campana D.O.P.',
    origin: 'Caserta & Salerno',
    category: 'dop',
    description: '100% sveže mleko vodnih bivolic iz Kampanije. Izjemna mlečna kremoznost, prožna tekstura in nežen kiselkast podton, ki oživi v peči.',
    fact: 'Pripravljeno sveže vsak teden neposredno iz Kampanije'
  },
  'fior-di-latte': {
    key: 'fior-di-latte',
    shortName: 'Fior di Latte',
    cert: 'AGEROLA',
    icon: '🧀',
    title: 'Fior di Latte dei Monti Lattari d’Agerola',
    origin: 'Amalfi Coast, ITA',
    category: 'craft',
    description: 'Vlečena mocarela iz polnomastnega gorskega mleka obale Amalfi. Po neapeljski tradiciji pred peko narezana na trakove in odcejena za suh vrh pice.',
    fact: 'Optimalno taljenje brez sproščanja odvečne vode'
  },
  'ferment-48h': {
    key: 'ferment-48h',
    shortName: '48h Ferment',
    cert: 'CRAFT',
    icon: '⏳',
    title: '48-Urno Hladno Zorenje & Fermentacija',
    origin: 'Hišna Obrt Grad Kodeljevo',
    category: 'craft',
    description: 'Dvodnevno kontrolirano vzhajanje pri 4°C z minimalno vsebnostjo kvasa (<0.1%). Encimi predhodno razgradijo škrob za popolno prebavljivost.',
    fact: 'Brez občutka teže v želodcu ali nočne žeje'
  },
  'mortadella': {
    key: 'mortadella',
    shortName: 'Mortadella',
    cert: 'I.G.P.',
    icon: '🥓',
    title: 'Mortadella Bologna I.G.P.',
    origin: 'Emilia-Romagna',
    category: 'igp',
    description: 'Tradicionalna emilijska mortadela z zaščiteno geografsko označbo. Fino mleta pleča z začimbami in kockami slanine, nežno kuhana v pečeh na vroč zrak.',
    fact: 'Dodana v Panuozzo sendviče v bogatih hladnih rezinah'
  },
  'pistacchio': {
    key: 'pistacchio',
    shortName: 'Pistacchio Bronte',
    cert: 'D.O.P.',
    icon: '🌱',
    title: 'Pistacchio Verde di Bronte D.O.P.',
    origin: 'Bronte, Etna (Sicilija)',
    category: 'dop',
    description: 'Smaragdno zeleni pistaciji, ročno obrani na vulkanski lavi pobočij Etne. Intenzivna aroma, praženi in grobo mleti za hrustljav kontrast.',
    fact: 'Zeleno zlato Sicilije z D.O.P. certifikatom'
  },
  'olio-bio': {
    key: 'olio-bio',
    shortName: 'Bio Oljčno Olje',
    cert: 'BIO',
    icon: '🌿',
    title: 'Ekološko Ekstra Deviško Oljčno Olje',
    origin: 'Hladno stiskano',
    category: 'bio',
    description: 'Vrhunsko hladno stiskano ekstra deviško olje prvega obiranja z visoko vsebnostjo polifenolov. Doda se surovo po peki za svežino.',
    fact: '100% organska pridelava brez kemičnih dodatkov'
  },
  'parma': {
    key: 'parma',
    shortName: 'Pršut Parma 24m',
    cert: 'D.O.P.',
    icon: '🍖',
    title: 'Prosciutto di Parma D.O.P. (24 mesecev)',
    origin: 'Parma, Emilia-Romagna',
    category: 'dop',
    description: '24 mesecev naravno zorjen na svežem vetru apeninskih gora. Zgolj svinjsko stegno in morska sol, brez konzervansov ali nitritov.',
    fact: 'Žlahten pršut s kraljevsko krono konzorcija Parma'
  },
  'stracciatella': {
    key: 'stracciatella',
    shortName: 'Stracciatella',
    cert: 'PUGLIA',
    icon: '🥛',
    title: 'Sveža Stracciatella & Burrata di Puglia',
    origin: 'Puglia, Italija',
    category: 'craft',
    description: 'Ročno trgana mocarelina vlakna, prepojena z bogato svežo mlečno smetano. Polni se v tople sendviče Panuozzo za razkošno sočnost.',
    fact: 'Srce burrate s 100% italijanskega mleka'
  },
  'vegetarijansko': {
    key: 'vegetarijansko',
    shortName: 'Vegetarijansko',
    cert: 'VEGE',
    icon: '🥗',
    title: 'Vegetarijanska Izbira',
    origin: 'Brez mesa',
    category: 'dietary',
    description: 'Brezmesna jed, pripravljena z vrhunskimi svežimi siri, zelenjavo in oljčnim oljem.',
    fact: 'Primerno za vegetarijance'
  },
  'pikantno': {
    key: 'pikantno',
    shortName: 'Pikantno',
    cert: 'HOT',
    icon: '🌶️',
    title: 'Pikantna Specialiteta',
    origin: 'Kalabrijski čili',
    category: 'dietary',
    description: 'Pripravljeno s pikantno italijansko salamo in pekočim prelivom iz kalabrijskih feferonov.',
    fact: 'Izrazito pekoč značaj'
  },
  'specialiteta': {
    key: 'specialiteta',
    shortName: 'Hišna Specialiteta',
    cert: 'KADER',
    icon: '👑',
    title: 'Hišna Specialiteta Grad Kodeljevo',
    origin: 'Kader Receptura',
    category: 'craft',
    description: 'Avtorska kombinacija sestavin po izboru našega glavnega picopeka, ki združuje grajsko tradicijo in neapeljsko šolo.',
    fact: 'Najbolj priporočena jed po mnenju obiskovalcev'
  }
}

const badgeInfo = computed<BadgeDef>(() => {
  const normKey = props.badgeKey.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
  let baseDef: BadgeDef
  if (BADGE_REGISTRY[normKey]) baseDef = BADGE_REGISTRY[normKey]
  else if (normKey.includes('marzano')) baseDef = BADGE_REGISTRY['san-marzano']
  else if (normKey.includes('bufala')) baseDef = BADGE_REGISTRY['bufala']
  else if (normKey.includes('fior') || normKey.includes('latte')) baseDef = BADGE_REGISTRY['fior-di-latte']
  else if (normKey.includes('ferment') || normKey.includes('48h')) baseDef = BADGE_REGISTRY['ferment-48h']
  else if (normKey.includes('mortadela') || normKey.includes('mortadella')) baseDef = BADGE_REGISTRY['mortadella']
  else if (normKey.includes('pistac') || normKey.includes('bronte')) baseDef = BADGE_REGISTRY['pistacchio']
  else if (normKey.includes('olj') || normKey.includes('bio')) baseDef = BADGE_REGISTRY['olio-bio']
  else if (normKey.includes('parma') || normKey.includes('pršut parma')) baseDef = BADGE_REGISTRY['parma']
  else if (normKey.includes('stracciatella') || normKey.includes('burrata')) baseDef = BADGE_REGISTRY['stracciatella']
  else if (normKey.includes('vege')) baseDef = BADGE_REGISTRY['vegetarijansko']
  else if (normKey.includes('pikant')) baseDef = BADGE_REGISTRY['pikantno']
  else {
    baseDef = {
      key: 'specialiteta',
      shortName: props.badgeKey,
      cert: 'PREMIUM',
      icon: '✦',
      title: props.badgeKey,
      origin: t('provenance.badges.fallback.origin') !== 'provenance.badges.fallback.origin' ? t('provenance.badges.fallback.origin') : 'Izbrane Sestavine',
      category: 'craft',
      description: t('provenance.badges.fallback.description') !== 'provenance.badges.fallback.description' ? t('provenance.badges.fallback.description') : 'Vrhunska sestavina, pripravljena po tradicionalnih kulinaričnih postopkih.'
    }
  }

  const k = baseDef.key
  const transShort = t(`provenance.badges.${k}.shortName`)
  const transTitle = t(`provenance.badges.${k}.title`)
  const transOrigin = t(`provenance.badges.${k}.origin`)
  const transDesc = t(`provenance.badges.${k}.description`)
  const transFact = t(`provenance.badges.${k}.fact`)

  return {
    ...baseDef,
    shortName: transShort !== `provenance.badges.${k}.shortName` ? transShort : baseDef.shortName,
    title: transTitle !== `provenance.badges.${k}.title` ? transTitle : baseDef.title,
    origin: transOrigin !== `provenance.badges.${k}.origin` ? transOrigin : baseDef.origin,
    description: transDesc !== `provenance.badges.${k}.description` ? transDesc : baseDef.description,
    fact: transFact !== `provenance.badges.${k}.fact` ? transFact : baseDef.fact
  }
})

const badgeColorClass = computed(() => {
  switch (badgeInfo.value.category) {
    case 'dop':
      return 'border-masanielli-gold/60 text-masanielli-gold bg-masanielli-gold/10 hover:bg-masanielli-gold/20 hover:border-masanielli-gold shadow-masanielli-gold/10'
    case 'igp':
      return 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 hover:border-emerald-400 shadow-emerald-500/10'
    case 'bio':
      return 'border-teal-500/50 text-teal-300 bg-teal-950/40 hover:bg-teal-900/40 hover:border-teal-400 shadow-teal-500/10'
    case 'craft':
      return 'border-amber-500/50 text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 hover:border-amber-400 shadow-amber-500/10'
    case 'dietary':
      return 'border-zinc-700 text-gray-300 bg-zinc-900/80 hover:bg-zinc-800'
    default:
      return 'border-zinc-800 text-gray-300 bg-zinc-950'
  }
})

const badgeCertPillClass = computed(() => {
  switch (badgeInfo.value.category) {
    case 'dop':
      return 'border-masanielli-gold/40 bg-masanielli-gold/20 text-masanielli-gold'
    case 'igp':
      return 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
    case 'bio':
      return 'border-teal-500/40 bg-teal-500/20 text-teal-300'
    case 'craft':
      return 'border-amber-500/40 bg-amber-500/20 text-amber-300'
    default:
      return 'border-zinc-700 bg-zinc-800 text-gray-300'
  }
})
</script>
