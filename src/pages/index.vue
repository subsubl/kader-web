<template>
  <div class="min-h-screen bg-white text-gray-800">

    <!-- ===== INTRO ===== -->
    <section class="max-w-3xl mx-auto px-5 pt-16 pb-10 text-center">
      <img
        :src="logoUrl"
        :alt="t('header.logoAlt')"
        decoding="async"
        class="h-16 md:h-20 w-auto mx-auto mb-8 object-contain"
        width="200" height="80"
      >
      <p class="text-lg md:text-xl leading-relaxed mb-4">{{ t('site.intro') }}</p>
      <p class="text-base text-gray-600 mb-2">
        <a
          href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7"
          target="_blank"
          rel="noopener noreferrer"
          class="text-kader-red hover:underline"
        >Koblarjeva ulica 34, 1000 Ljubljana</a>
      </p>
      <p class="text-base text-gray-600 mb-6">
        <a href="https://www.instagram.com/kader.lunapark/" target="_blank" rel="noopener noreferrer" class="text-kader-red hover:underline">{{ t('site.follow') }}</a>
      </p>
      <p class="text-base text-gray-500 italic">{{ t('site.closing') }}</p>
    </section>

    <!-- ===== MENU (inline) ===== -->
    <section id="menu" class="border-t border-gray-200">
      <div class="max-w-5xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 text-center mb-3">
          {{ t('site.menuTitle') }}
        </h2>
        <p class="text-sm text-gray-500 text-center mb-12 max-w-2xl mx-auto">{{ t('site.menuNote') }}</p>

        <!-- Pizze -->
        <div class="mb-12">
          <div class="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-6">
            <h3 class="text-lg font-bold uppercase text-gray-900">{{ t('pizzeria.colPizzaTitle') }}</h3>
            <span class="text-xs text-gray-500">{{ t('pizzeria.regularFamily') }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <div v-for="item in pizze" :key="item.name" class="flex items-baseline gap-2">
              <span class="font-medium text-gray-900">{{ item.name }}</span>
              <span class="flex-1 border-b border-dotted border-gray-300"></span>
              <span class="text-gray-700 whitespace-nowrap font-mono text-sm">{{ item.price }}</span>
            </div>
          </div>
          <p v-for="item in pizzeWithDesc" :key="'d' + item.name" class="text-sm text-gray-600 mt-1 mb-4">
            <span class="font-medium text-gray-800">{{ item.name }}:</span> {{ item.description }}
          </p>
        </div>

        <!-- Panuozzo -->
        <div class="mb-12">
          <div class="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-6">
            <h3 class="text-lg font-bold uppercase text-gray-900">{{ t('pizzeria.colPanuozzoTitle') }}</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <div v-for="item in panuozzoItems" :key="item.name" class="flex items-baseline gap-2">
              <span class="font-medium text-gray-900">{{ item.name }}</span>
              <span class="flex-1 border-b border-dotted border-gray-300"></span>
              <span class="text-gray-700 whitespace-nowrap font-mono text-sm">{{ item.price }}</span>
            </div>
          </div>
        </div>

        <!-- Solate -->
        <div class="mb-12">
          <div class="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-6">
            <h3 class="text-lg font-bold uppercase text-gray-900">{{ t('pizzeria.colSaladsTitle') }}</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <div v-for="item in solateItems" :key="item.name" class="flex items-baseline gap-2">
              <span class="font-medium text-gray-900">{{ item.name }}</span>
              <span class="flex-1 border-b border-dotted border-gray-300"></span>
              <span class="text-gray-700 whitespace-nowrap font-mono text-sm">{{ item.price }}</span>
            </div>
          </div>
        </div>

        <!-- Dodatki -->
        <div class="mb-12">
          <div class="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-6">
            <h3 class="text-lg font-bold uppercase text-gray-900">{{ t('site.dodatkiTitle') }}</h3>
          </div>
          <div class="space-y-3">
            <div v-for="d in dodatkiList" :key="d.title" class="flex items-baseline gap-2">
              <span class="font-medium text-gray-900">{{ d.title }}</span>
              <span class="flex-1 border-b border-dotted border-gray-300"></span>
              <span class="text-gray-700 whitespace-nowrap font-mono text-sm">{{ d.price }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ t('pizzeria.m_dodatek1_items') }}</p>
          </div>
        </div>

        <!-- Narezek -->
        <div class="mb-10">
          <div class="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-6">
            <h3 class="text-lg font-bold uppercase text-gray-900">{{ t('pizzeria.colNarezekTitle') }}</h3>
          </div>
          <div v-for="item in narezekItems" :key="item.name" class="flex items-baseline gap-2">
            <span class="font-medium text-gray-900">{{ item.name }}</span>
            <span class="flex-1 border-b border-dotted border-gray-300"></span>
            <span class="text-gray-700 whitespace-nowrap font-mono text-sm">{{ item.price }}</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ t('pizzeria.m_narezek_desc') }}</p>
        </div>

        <!-- Legal / provenance footer notes -->
        <div class="text-xs text-gray-500 space-y-2 border-t border-gray-200 pt-6">
          <p>{{ t('pizzeria.allergenLegendTitle') }} {{ t('pizzeria.allergenLegendText') }}</p>
          <p>{{ t('pizzeria.provenanceTitle') }} — {{ t('pizzeria.provenanceDesc') }}</p>
          <p>{{ t('pizzeria.priceListValidFrom') }} · {{ t('pizzeria.pricesVat') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== UPCOMING EVENTS (RA snapshot) ===== -->
    <section class="border-t border-gray-200">
      <div class="max-w-5xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 text-center mb-3">
          {{ t('site.eventsTitle') }}
        </h2>
        <p class="text-sm text-gray-500 text-center mb-10 max-w-xl mx-auto">{{ t('site.eventsSub') }}</p>

        <ul v-if="upcomingEvents.length" class="max-w-3xl mx-auto divide-y divide-gray-200">
          <li v-for="ev in upcomingEvents" :key="ev.ra_id" class="py-4">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <a
                :href="ev.ra_url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-gray-900 hover:text-kader-red transition-colors"
              >{{ ev.title }}</a>
              <span class="text-sm font-mono text-gray-600 whitespace-nowrap">{{ formatEventDate(ev.start_time || ev.date) }}</span>
            </div>
            <p v-if="(ev.artists && ev.artists.length) || (ev.genres && ev.genres.length)" class="text-sm text-gray-500 mt-1">
              <span v-if="ev.artists && ev.artists.length">{{ ev.artists.join(', ') }}</span>
              <span v-if="ev.genres && ev.genres.length" class="text-gray-400">
                {{ ev.artists && ev.artists.length ? ' · ' : '' }}{{ ev.genres.join(' · ') }}
              </span>
            </p>
          </li>
        </ul>

        <p v-else class="text-center text-gray-500">{{ t('site.eventsEmpty') }}</p>

        <p class="text-center mt-8">
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-kader-red hover:underline"
          >{{ t('site.eventsMore') }}</a>
        </p>
      </div>
    </section>

    <!-- ===== OPENING HOURS ===== -->
    <section class="border-t border-gray-200">
      <div class="max-w-3xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 text-center mb-8">
          {{ t('site.hoursTitle') }}
        </h2>
        <ul class="max-w-md mx-auto divide-y divide-gray-200">
          <li v-for="row in hoursRows" :key="row.day" class="flex justify-between items-baseline py-3">
            <span class="text-gray-700">{{ row.day }}</span>
            <span class="text-gray-900 font-mono text-sm">{{ row.time }}</span>
          </li>
        </ul>
        <p class="text-sm text-gray-500 text-center mt-5">{{ t('site.kitchen') }}</p>
      </div>
    </section>

    <!-- ===== VENUE / ZAALVERHUUR ===== -->
    <section class="border-t border-gray-200">
      <div class="max-w-3xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 text-center mb-8">
          {{ t('site.venueTitle') }}
        </h2>
        <div class="space-y-5 text-lg leading-relaxed text-gray-700">
          <p>{{ t('site.venueP1') }}</p>
          <p>{{ t('site.venueP2') }}</p>
          <p>{{ t('site.venueP3') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT ===== -->
    <section class="border-t border-gray-200">
      <div class="max-w-3xl mx-auto px-5 py-14 text-center">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 mb-8">
          {{ t('site.contactTitle') }}
        </h2>
        <div class="space-y-2 text-lg text-gray-700">
          <p class="font-bold text-gray-900">Kader Grad Kodeljevo</p>
          <p>
            <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" rel="noopener noreferrer" class="text-kader-red hover:underline">Koblarjeva ulica 34</a><br>
            1000 Ljubljana
          </p>
          <p>
            <a href="mailto:info@kader.si" class="text-kader-red hover:underline">info@kader.si</a>
          </p>
          <p class="pt-3">
            <a :href="'tel:' + reservationsPhoneE164" class="text-kader-red hover:underline font-mono">{{ reservationsPhoneDisplay }}</a>
          </p>
          <p class="text-sm text-gray-500 pt-2">{{ t('site.reserveNote') }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { usePageSeo, CANONICAL_ADDRESS, CANONICAL_CONTACTS } from '~/composables/usePageSeo'
import eventSnapshot from '~/data/events.json'

const { t, locale } = useLocale()

interface RaEvent {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  cost: number | null
  ra_url: string
  artists: string[]
  genres: string[]
}

const dtf = computed(() =>
  new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: 'short', year: 'numeric' })
)
const formatEventDate = (iso: string | null) => (iso ? dtf.value.format(new Date(iso)) : '')

// Upcoming only, soonest first. Snapshot is refreshed at build time by CI.
const upcomingEvents = computed<RaEvent[]>(() => {
  const all = (eventSnapshot as { events?: RaEvent[] }).events ?? []
  const now = Date.now()
  return all
    .filter(e => {
      const end = e.end_time || e.date
      return end ? new Date(end).getTime() > now : false
    })
    .sort((a, b) => new Date(a.start_time || a.date).getTime() - new Date(b.start_time || b.date).getTime())
})

const logoUrl = assetUrl('/logo-k.jpg')

const reservationsPhoneDisplay = '+386 40 175 628'
const reservationsPhoneE164 = '+38640175628'

const siteSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Kader Grad Kodeljevo',
  servesCuisine: ['Italian', 'Neapolitan'],
  url: 'https://www.kader.si/',
  telephone: reservationsPhoneDisplay,
  email: CANONICAL_CONTACTS.email,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  address: CANONICAL_ADDRESS,
  hasMap: CANONICAL_CONTACTS.googleMapsUrl,
  sameAs: ['https://www.instagram.com/kader.lunapark/']
}))

usePageSeo({
  path: '/',
  titleKey: 'site.seoTitle',
  descKey: 'site.seoDesc',
  ogTitleKey: 'site.seoTitle',
  ogDescKey: 'site.seoDesc',
  schema: siteSchema
})

interface MenuItem {
  name: string
  description?: string
  price: string
  allergens?: string
}

const pizze = computed<MenuItem[]>(() => [
  { name: 'Marinara', price: '10 €' },
  { name: 'Margerita', price: '11/24 €' },
  { name: t('pizzeria.m_klasika_name'), price: '13/31 €' },
  { name: 'Bufalina', price: '14/31 €' },
  { name: 'Regina', price: '14/31 €' },
  { name: 'Bresaola', price: '16/37 €' },
  { name: t('pizzeria.m_krasotica_name'), price: '15/34 €' },
  { name: 'Peperoni', price: '14/32 €' },
  { name: 'Kalabria', price: '15/32 €' },
  { name: 'Arrotolata', price: '15/32 €' },
  { name: 'Tuna', price: '14/31 €' },
  { name: 'Ortolana', price: '14/29 €' },
  { name: t('pizzeria.m_satarasa_name'), price: '14/29 €' },
  { name: 'Tartufina', price: '14/31 €' },
  { name: t('pizzeria.m_vegana_name'), price: '14/29 €' }
])

const pizzeWithDesc = computed<MenuItem[]>(() => [
  { name: 'Marinara', description: t('pizzeria.m_marinara_desc'), price: '' },
  { name: 'Margerita', description: t('pizzeria.m_margerita_desc'), price: '' },
  { name: t('pizzeria.m_klasika_name'), description: t('pizzeria.m_klasika_desc'), price: '' },
  { name: 'Bufalina', description: t('pizzeria.m_bufalina_desc'), price: '' },
  { name: 'Regina', description: t('pizzeria.m_regina_desc'), price: '' },
  { name: 'Bresaola', description: t('pizzeria.m_bresaola_desc'), price: '' },
  { name: t('pizzeria.m_krasotica_name'), description: t('pizzeria.m_krasotica_desc'), price: '' },
  { name: 'Peperoni', description: t('pizzeria.m_peperoni_desc'), price: '' },
  { name: 'Kalabria', description: t('pizzeria.m_kalabria_desc'), price: '' },
  { name: 'Arrotolata', description: t('pizzeria.m_arrotolata_desc'), price: '' },
  { name: 'Tuna', description: t('pizzeria.m_tuna_desc'), price: '' },
  { name: 'Ortolana', description: t('pizzeria.m_ortolana_desc'), price: '' },
  { name: t('pizzeria.m_satarasa_name'), description: t('pizzeria.m_satarasa_desc'), price: '' },
  { name: 'Tartufina', description: t('pizzeria.m_tartufina_desc'), price: '' },
  { name: t('pizzeria.m_vegana_name'), description: t('pizzeria.m_vegana_desc'), price: '' }
])

const panuozzoItems = computed<MenuItem[]>(() => [
  { name: 'Praga', price: '11 €' },
  { name: 'Roastbeef', price: '13 €' },
  { name: 'Mortadela', price: '12 €' },
  { name: 'Lušt\'n', price: '12 €' },
  { name: t('pizzeria.m_panGarlicBread_name'), price: '7 €' }
])

const solateItems = computed<MenuItem[]>(() => [
  { name: t('pizzeria.m_salMesana_name'), price: '7.50 €' },
  { name: t('pizzeria.m_salTuna_name'), price: '12 €' },
  { name: t('pizzeria.m_salBuffalo_name'), price: '13 €' },
  { name: t('pizzeria.m_salRoastbeef_name'), price: '15 €' }
])

const dodatkiList = computed(() => [
  { title: t('pizzeria.m_dodatek1_title'), price: '2.20 €' },
  { title: t('pizzeria.m_dodatek2_title'), price: '3 €' },
  { title: t('pizzeria.m_dodatek3_title'), price: '4 €' }
])

const narezekItems = computed<MenuItem[]>(() => [
  { name: t('pizzeria.m_narezek_name'), price: '25.90 €' }
])

const hoursRows = computed(() => [
  { day: t('home.monWed'), time: '09:00 – 22:00' },
  { day: t('home.thu'), time: '09:00 – 01:00' },
  { day: t('home.fri'), time: '09:00 – 05:00' },
  { day: t('home.sat'), time: '09:00 – 01:00' },
  { day: t('home.sun'), time: '09:00 – 20:00' }
])
</script>
