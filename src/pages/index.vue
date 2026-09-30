<template>
  <div class="min-h-screen">

    <!-- ===== HERO =========================================================
         Frame taken from the reference: copy sits in a NARROW left column
         (they use ~383px at x=135), the big links are RIGHT-ALIGNED at 40px,
         and nothing is centred. Their body copy is justified at 22px. -->
    <section class="relative overflow-hidden">
      <Clipart shape="moon" :size="240" :opacity="0.16" position="absolute left-[6%] top-10" />
      <Clipart shape="circle" :size="300" :opacity="0.18" variant="stroke" position="absolute right-[6%] bottom-6" />

      <div class="max-w-[1400px] mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-16 grid grid-cols-1 md:grid-cols-12 gap-10">

        <!-- LEFT: logo + one narrative paragraph with links inline -->
        <div class="md:col-span-7 md:pl-[100px]">
          <img
            :src="heroLogoUrl"
            :alt="t('header.logoAlt')"
            decoding="async"
            class="w-[62%] max-w-[420px] h-auto mb-10 object-contain"
            width="1920" height="349"
          >

          <!-- the reference sets its links INSIDE the sentence -->
          <p class="text-[22px] leading-[33px] text-left text-justify max-w-[420px] mb-6">
            {{ t('site.intro1') }}
          </p>
          <p class="text-[22px] leading-[33px] text-left text-justify max-w-[420px] mb-6">
            {{ t('site.intro2') }}
          </p>
          <p class="text-[22px] leading-[33px] text-left text-justify max-w-[420px] mb-4">
            {{ t('site.intro3') }}
            <a href="mailto:info@kader.si" class="hover:text-kader-black transition-colors">info@kader.si</a>
          </p>
          <p class="text-[22px] leading-[33px] text-left max-w-[420px] mb-6">
            <a
              href="https://www.instagram.com/kader.lunapark/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-kader-black transition-colors"
            >{{ t('site.intro4') }}</a>
          </p>
          <p class="text-[22px] leading-[33px] max-w-[420px] italic">{{ t('site.signoff') }}</p>
        </div>

        <!-- RIGHT: the big links, right-aligned, 40px -->
        <nav class="md:col-span-5 md:pr-[40px] flex flex-col items-end gap-4 md:gap-3">
          <a :href="menuImageUrl" target="_blank" rel="noopener noreferrer" class="text-[40px] leading-[60px] hover:text-kader-black transition-colors duration-300">{{ t('site.menuTitle') }}</a>
          <a href="#programme" class="text-[40px] leading-[60px] hover:text-kader-black transition-colors duration-300">{{ t('site.eventsTitle') }}</a>
          <a href="#hours" class="text-[40px] leading-[60px] hover:text-kader-black transition-colors duration-300">{{ t('site.hoursTitle') }}</a>
          <a href="#venue" class="text-[40px] leading-[60px] hover:text-kader-black transition-colors duration-300">{{ t('site.venueTitle') }}</a>
          <a href="#contact" class="text-[40px] leading-[60px] hover:text-kader-black transition-colors duration-300">{{ t('site.contactTitle') }}</a>
        </nav>
      </div>
    </section>

    <ArrowDivider direction="down" :height-px="150" :chevron-px="100" />

    <ParallaxBand :src="assetUrl('/images/club-red-hero.jpg')" :alt="t('site.band1Alt')" height="58vh" />

    <!-- ===== PROGRAMME ================================================= -->
    <section id="programme" class="border-t border-white/25">
      <div class="max-w-[1400px] mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div class="md:col-span-6 md:pl-[100px] relative">
          <Clipart shape="speaker" :size="180" :opacity="0.2" variant="stroke" position="absolute -left-6 top-4" />
          <h2 class="text-[33px] leading-[40px] font-normal mb-6">{{ t('site.eventsTitle') }}</h2>
          <p class="text-[22px] leading-[33px] text-left max-w-[430px]">{{ t('site.eventsSub') }}</p>
        </div>
        <div class="md:col-span-6 md:pr-[40px] flex flex-col items-end">
          <ul v-if="upcomingEvents.length" class="w-full max-w-[430px] divide-y divide-white/25">
            <li v-for="ev in upcomingEvents" :key="ev.ra_id" class="py-3">
              <div class="flex items-baseline justify-between gap-4">
                <a :href="ev.ra_url" target="_blank" rel="noopener noreferrer"
                   class="text-[22px] leading-[33px] hover:text-kader-black transition-colors">{{ ev.title }}</a>
                <span class="text-[16px] font-mono text-white/75 whitespace-nowrap">{{ formatEventDate(ev.start_time || ev.date) }}</span>
              </div>
            </li>
          </ul>
          <p v-else class="text-[22px] leading-[33px] text-right max-w-[430px]">{{ t('site.eventsEmpty') }}</p>
          <a href="https://ra.co/clubs/78778" target="_blank" rel="noopener noreferrer"
             class="text-[22px] leading-[33px] mt-6 hover:text-kader-black transition-colors">{{ t('site.eventsMore') }}</a>
        </div>
      </div>
    </section>

    <ArrowDivider direction="down" :height-px="130" :chevron-px="88" />

    <!-- ===== OPENING HOURS ==============================================
         The reference lists days one per line at 22px with "gesloten"
         markers, in a single narrow left column. -->
    <section id="hours" class="border-t border-white/25">
      <div class="max-w-[1400px] mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div class="md:col-span-6 md:pl-[100px] relative">
          <Clipart shape="circle" :size="190" :opacity="0.16" variant="stroke" position="absolute -left-8 top-2" />
          <h2 class="text-[33px] leading-[40px] font-normal mb-6">{{ t('site.hoursTitle') }}</h2>
          <ul class="max-w-[430px]">
            <li v-for="row in hoursRows" :key="row.day" class="flex justify-between items-baseline text-[22px] leading-[33px] py-1">
              <span>{{ row.day }}</span>
              <span class="font-mono text-[18px]">{{ row.time }}</span>
            </li>
          </ul>
          <p class="text-[16px] leading-[24px] text-white/75 mt-4 max-w-[430px]">{{ t('site.kitchen') }}</p>
        </div>
        <div class="md:col-span-6 md:pr-[40px]"></div>
      </div>
    </section>

    <ParallaxBand :src="assetUrl('/images/band-2.jpg')" :alt="t('site.band2Alt')" height="58vh" />

    <!-- ===== VENUE ==================================================== -->
    <section id="venue" class="border-t border-white/25">
      <div class="max-w-[1400px] mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div class="md:col-span-6 md:pl-[100px] relative">
          <Clipart shape="moon" :size="120" :opacity="0.14" position="absolute -left-8 bottom-0" />
          <h2 class="text-[33px] leading-[40px] font-normal mb-6">{{ t('site.venueTitle') }}</h2>
          <p class="text-[22px] leading-[33px] text-left text-justify max-w-[430px] mb-5">{{ t('site.venue1') }}</p>
          <p class="text-[22px] leading-[33px] text-left text-justify max-w-[430px] mb-5">{{ t('site.venue2') }}</p>
        </div>
        <div class="md:col-span-6 md:pr-[40px] flex flex-col items-end">
          <p class="text-[22px] leading-[33px] text-right mb-4">{{ t('site.venue3') }}</p>
          <a href="mailto:info@kader.si" class="text-[22px] leading-[33px] hover:text-kader-black transition-colors">info@kader.si</a>
        </div>
      </div>
    </section>

    <ParallaxBand :src="assetUrl('/buyout-bg.jpg')" :alt="t('site.band3Alt')" height="58vh" />

    <!-- ===== CONTACT =================================================== -->
    <section id="contact" class="border-t border-white/25">
      <div class="max-w-[1400px] mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div class="md:col-span-6 md:pl-[100px]">
          <h2 class="text-[33px] leading-[40px] font-normal mb-6">{{ t('site.contactTitle') }}</h2>
          <p class="text-[22px] leading-[33px] max-w-[430px]">
            <a href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7" target="_blank" rel="noopener noreferrer"
               class="hover:text-kader-black transition-colors">Ulica Carla Benza 20</a><br>
            1000 Ljubljana
          </p>
          <p class="text-[16px] leading-[24px] text-white/75 mt-4 max-w-[430px]">{{ t('site.reserveNote') }}</p>
        </div>
        <div class="md:col-span-6 md:pr-[40px] flex flex-col items-end gap-2">
          <a href="mailto:info@kader.si" class="text-[22px] leading-[33px] hover:text-kader-black transition-colors">info@kader.si</a>
          <a :href="'tel:' + orderPhoneE164" class="text-[22px] leading-[33px] font-mono hover:text-kader-black transition-colors">{{ orderPhoneDisplay }}</a>
          <a :href="'tel:' + reservationsPhoneE164" class="text-[22px] leading-[33px] font-mono hover:text-kader-black transition-colors">{{ reservationsPhoneDisplay }}</a>
          <a href="https://www.instagram.com/kader.lunapark/" target="_blank" rel="noopener noreferrer"
             class="text-[22px] leading-[33px] mt-4 hover:text-kader-black transition-colors">Instagram</a>
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

// Hero wordmark: the WHITE KADER logotype (logo-banner.png). Only the white
// variant has usable contrast on the signal-red background; the black wordmark
// is rgb(11,7,7) on rgb(237,34,36) and effectively invisible.
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