<template>
  <div class="min-h-screen">

    <!-- ===== INTRO ===== -->
    <section class="max-w-3xl mx-auto px-5 pt-14 pb-12 text-center">
      <img
        :src="heroLogoUrl"
        :alt="t('header.logoAlt')"
        decoding="async"
        class="w-[78%] max-w-[560px] h-auto mx-auto mb-10 object-contain"
        width="1115" height="375"
      >
      <p class="text-2xl md:text-3xl leading-snug mb-6">{{ t('site.intro') }}</p>
      <p class="text-base mb-2">
        <a
          href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7"
          target="_blank"
          rel="noopener noreferrer"
          class="underline underline-offset-4 hover:text-kader-black transition-colors"
        >Ulica Carla Benza 20, 1000 Ljubljana</a>
      </p>
      <p class="text-base mb-6">
        <a href="https://www.instagram.com/kader.lunapark/" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4 hover:text-kader-black transition-colors">{{ t('site.follow') }}</a>
      </p>
      <a
        href="#menu"
        class="inline-block px-8 py-3.5 bg-white text-kader-red text-sm md:text-base font-semibold uppercase tracking-widest border-2 border-kader-black hover:bg-kader-black hover:text-white transition-colors duration-300"
      >{{ t('site.menuCta') }}</a>
    </section>

    <!-- ===== MENU (the real menu sheet) ===== -->
    <section id="menu" class="border-t border-white/25">
      <div class="max-w-4xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-center mb-3">
          {{ t('site.menuTitle') }}
        </h2>
        <p class="text-sm text-white/80 text-center mb-10 max-w-2xl mx-auto">{{ t('site.menuNote') }}</p>

        <img
          :src="menuImageUrl"
          :alt="t('site.menuImageAlt')"
          decoding="async"
          class="w-full h-auto shadow-2xl"
          width="3000" height="2121"
        >

        <div class="text-xs text-white/70 space-y-2 mt-10 text-center">
          <p>{{ t('pizzeria.allergenLegendTitle') }} {{ t('pizzeria.allergenLegendText') }}</p>
          <p>{{ t('pizzeria.priceListValidFrom') }} · {{ t('pizzeria.pricesVat') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== PARALLAX BAND ===== -->
    <ParallaxBand
      :src="assetUrl('/images/club-red-hero.jpg')"
      :alt="t('site.band1Alt')"
      :height="'52vh'"
    />

    <!-- ===== UPCOMING EVENTS (RA snapshot) ===== -->
    <section class="border-t border-white/25">
      <div class="max-w-5xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-center mb-3">
          {{ t('site.eventsTitle') }}
        </h2>
        <p class="text-sm text-white/80 text-center mb-10 max-w-xl mx-auto">{{ t('site.eventsSub') }}</p>

        <ul v-if="upcomingEvents.length" class="max-w-3xl mx-auto divide-y divide-white/25">
          <li v-for="ev in upcomingEvents" :key="ev.ra_id" class="py-4">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <a
                :href="ev.ra_url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-white hover:text-kader-black transition-colors"
              >{{ ev.title }}</a>
              <span class="text-sm font-mono text-white/80 whitespace-nowrap">{{ formatEventDate(ev.start_time || ev.date) }}</span>
            </div>
            <p v-if="(ev.artists && ev.artists.length) || (ev.genres && ev.genres.length)" class="text-sm text-white/70 mt-1">
              <span v-if="ev.artists && ev.artists.length">{{ ev.artists.join(', ') }}</span>
              <span v-if="ev.genres && ev.genres.length" class="text-white/50">
                {{ ev.artists && ev.artists.length ? ' · ' : '' }}{{ ev.genres.join(' · ') }}
              </span>
            </p>
          </li>
        </ul>

        <p v-else class="text-center text-white/80">{{ t('site.eventsEmpty') }}</p>

        <p class="text-center mt-8">
          <a
            href="https://ra.co/clubs/78778"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm underline underline-offset-4 hover:text-kader-black transition-colors"
          >{{ t('site.eventsMore') }}</a>
        </p>
      </div>
    </section>

    <!-- ===== PARALLAX BAND ===== -->
    <ParallaxBand
      :src="assetUrl('/pizzeria-bg.jpg')"
      :alt="t('site.band2Alt')"
      :height="'52vh'"
    />

    <!-- ===== OPENING HOURS ===== -->
    <section class="border-t border-white/25">
      <div class="max-w-3xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-center mb-8">
          {{ t('site.hoursTitle') }}
        </h2>
        <ul class="max-w-md mx-auto divide-y divide-white/25">
          <li v-for="row in hoursRows" :key="row.day" class="flex justify-between items-baseline py-3">
            <span>{{ row.day }}</span>
            <span class="font-mono text-sm">{{ row.time }}</span>
          </li>
        </ul>
        <p class="text-sm text-white/70 text-center mt-5">{{ t('site.kitchen') }}</p>
      </div>
    </section>

    <!-- ===== VENUE / ZAALVERHUUR ===== -->
    <section class="border-t border-white/25">
      <div class="max-w-3xl mx-auto px-5 py-14">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-center mb-8">
          {{ t('site.venueTitle') }}
        </h2>
        <div class="space-y-5 text-lg leading-relaxed text-white/90">
          <p>{{ t('site.venueP1') }}</p>
          <p>{{ t('site.venueP2') }}</p>
          <p>{{ t('site.venueP3') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== PARALLAX BAND ===== -->
    <ParallaxBand
      :src="assetUrl('/buyout-bg.jpg')"
      :alt="t('site.band3Alt')"
      :height="'52vh'"
    />

    <!-- ===== CONTACT ===== -->
    <section class="border-t border-white/25">
      <div class="max-w-3xl mx-auto px-5 py-14 text-center">
        <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
          {{ t('site.contactTitle') }}
        </h2>
        <div class="space-y-2 text-lg">
          <p class="font-bold">Kader Grad Kodeljevo</p>
          <p>
            <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4 hover:text-kader-black transition-colors">Ulica Carla Benza 20</a><br>
            1000 Ljubljana
          </p>
          <p>
            <a href="mailto:info@kader.si" class="underline underline-offset-4 hover:text-kader-black transition-colors">info@kader.si</a>
          </p>
          <p class="pt-3">
            <a :href="'tel:' + orderPhoneE164" class="underline underline-offset-4 hover:text-kader-black transition-colors font-mono">{{ orderPhoneDisplay }}</a>
          </p>
          <p class="pt-1">
            <a :href="'tel:' + reservationsPhoneE164" class="underline underline-offset-4 hover:text-kader-black transition-colors font-mono">{{ reservationsPhoneDisplay }}</a>
          </p>
          <p class="text-sm text-white/70 pt-2">{{ t('site.reserveNote') }}</p>
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

// Hero wordmark: the WHITE KADER logotype (logo-banner.png). The hero sits on
// the signal-red background, so only the white variant has usable contrast —
// the black wordmark (logo-asset2.png) rendered at rgb(11,7,7) on red, which
// is effectively invisible. The 1:1 badge used previously is only ~7% visible
// pixels, so it looked like a speck rather than a logo.
const heroLogoUrl = assetUrl('/logo-banner.png')
const menuImageUrl = assetUrl('/menu-a3.jpg')

const orderPhoneDisplay = '+386 83 836 740'
const orderPhoneE164 = '+38683836740'
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

const hoursRows = computed(() => [
  { day: t('home.monWed'), time: '09:00 – 22:00' },
  { day: t('home.thu'), time: '09:00 – 01:00' },
  { day: t('home.fri'), time: '09:00 – 05:00' },
  { day: t('home.sat'), time: '09:00 – 01:00' },
  { day: t('home.sun'), time: '09:00 – 20:00' }
])
</script>
