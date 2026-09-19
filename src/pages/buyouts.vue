<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">

    <!-- ===== Hero ===== -->
    <section class="relative h-[38vh] min-h-[280px] md:min-h-[340px] flex items-center overflow-hidden">
      <img
        :src="getOptImg(siteImages.buyouts_hero_bg, 1920, 90)"
        :alt="t('buyouts.heroAlt')"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-110 opacity-80 transition-transform duration-700"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/40 to-black/30"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-2 text-kader-red font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">{{ t('club.privateHire') }}</p>
        <h1 class="text-4xl md:text-6xl font-black leading-tight mb-3 uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] [text-shadow:_0_4px_20px_rgb(0_0_0_/_90%)]">{{ t('buyouts.pageTitle') }}</h1>
        <p class="text-sm md:text-lg max-w-2xl text-kader-cream/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">{{ t('buyouts.pageDesc') }}</p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4">

      <!-- ===== Venue overview + event types ===== -->
      <section class="py-20 md:py-28">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div class="lg:col-span-4">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('buyouts.venueOverview') }}</p>
            <h2 class="text-3xl md:text-5xl font-black leading-tight">{{ t('buyouts.venueTitle') }}</h2>
          </div>
          <div class="lg:col-span-8">
            <p class="text-xl md:text-2xl leading-relaxed text-kader-cream/80 mb-6">{{ t('buyouts.venueP') }}</p>
            <p class="text-lg md:text-xl leading-relaxed text-kader-cream/80 mb-6">{{ t('buyouts.venueP2') }}</p>
            <p class="text-lg md:text-xl leading-relaxed text-kader-cream/80 mb-8">{{ t('buyouts.venueP3') }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="i in 5" :key="i"
                class="px-3 py-1.5 bg-kader-red/10 border border-kader-red/30 text-kader-cream/80 text-xs font-bold uppercase tracking-wider rounded-full"
              >{{ t(`buyouts.feat${i}`) }}</span>
            </div>
          </div>
        </div>

        <!-- Event type cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-kader-red/20 border border-kader-red/20 rounded-2xl overflow-hidden">
          <div v-for="type in eventTypesList" :key="type.key" class="bg-[#120607] p-8 group hover:bg-[#1a0a0b] transition-colors duration-300">
            <p class="font-mono text-sm text-kader-red mb-4">{{ type.index }}</p>
            <h3 class="text-lg md:text-xl font-bold mb-2">{{ t(type.titleKey) }}</h3>
            <p class="text-kader-cream/60 text-sm leading-relaxed">{{ t(type.descKey) }}</p>
          </div>
        </div>
      </section>

      <!-- ===== Booking process + photo ===== -->
      <section class="pb-20 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('buyouts.bookingProcess') }}</p>
          <h2 class="text-3xl md:text-4xl font-black leading-tight mb-8">{{ t('buyouts.howItWorks') }}</h2>
          <ol class="space-y-5">
            <li v-for="n in 5" :key="n" class="flex items-start gap-4 border-b border-kader-cream/10 pb-5 last:border-b-0">
              <span class="font-mono text-kader-red text-sm shrink-0 mt-0.5">0{{ n }}</span>
              <span class="text-kader-cream/80 leading-relaxed">{{ t(`buyouts.booking${n}`) }}</span>
            </li>
          </ol>
        </div>
        <div class="rounded-3xl overflow-hidden border border-kader-red/30 shadow-2xl">
          <img
            :src="getOptImg(siteImages.buyouts_booking_bg, 1000, 80)"
            :alt="t('buyouts.bookingImgAlt')"
            loading="lazy"
            decoding="async"
            class="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
          >
        </div>
      </section>

      <!-- ===== Venue FAQ Accordion ===== -->
      <section class="pb-20 md:pb-24">
        <div class="max-w-4xl mx-auto">
          <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('buyouts.venueOverview') }}</p>
          <h2 class="text-3xl md:text-5xl font-black text-center mb-12 uppercase">{{ t('buyouts.faqTitle') }}</h2>
          <div class="space-y-4">
            <div
              v-for="(item, idx) in buyoutsFaq"
              :key="idx"
              class="rounded-2xl border transition-all duration-300 overflow-hidden"
              :class="openFaqIndex === idx ? 'bg-[#18090a] border-kader-red/60 shadow-[0_0_25px_rgba(237,34,36,0.15)]' : 'bg-[#0f0405] border-kader-cream/10 hover:border-kader-red/30'"
            >
              <button
                type="button"
                @click="toggleFaq(idx)"
                class="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-kader-red cursor-pointer"
                :aria-expanded="openFaqIndex === idx"
                :aria-controls="'buyouts-faq-content-' + idx"
              >
                <div class="flex items-center gap-4 md:gap-6 min-w-0">
                  <span class="font-mono text-sm md:text-base font-bold text-kader-red shrink-0">0{{ idx + 1 }}</span>
                  <h3 class="text-lg md:text-xl font-bold text-white tracking-tight text-left">{{ item.question }}</h3>
                </div>
                <div
                  class="w-8 h-8 rounded-full border border-kader-cream/20 flex items-center justify-center shrink-0 transition-transform duration-300"
                  :class="openFaqIndex === idx ? 'rotate-180 bg-kader-red border-kader-red text-white' : 'text-kader-cream/60 group-hover:text-white'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </button>
              <div
                :id="'buyouts-faq-content-' + idx"
                class="grid transition-all duration-300 ease-out"
                :style="{ gridTemplateRows: openFaqIndex === idx ? '1fr' : '0fr' }"
              >
                <div class="overflow-hidden">
                  <div class="px-6 pb-6 md:px-8 md:pb-8 pt-2 border-t border-kader-cream/10 text-kader-cream/80 text-sm md:text-base leading-relaxed">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Club & Sound System Takeover Banner ===== -->
      <section class="pb-20 md:pb-24">
        <div class="relative overflow-hidden rounded-3xl border border-kader-red/40 bg-gradient-to-br from-[#1a0507] via-kader-black to-[#120405] p-8 md:p-12 shadow-2xl">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-kader-red/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kader-red/20 border border-kader-red/40 text-kader-red text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <span class="w-2 h-2 rounded-full bg-kader-red animate-ping"></span>
                {{ t('buyouts.takeoverPill') }}
              </div>
              <h3 class="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                {{ t('buyouts.takeoverHeading') }}
              </h3>
              <p class="text-kader-cream/80 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                {{ t('buyouts.takeoverText') }}
              </p>
              <div class="flex flex-wrap gap-4 text-xs font-mono text-kader-cream/60">
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> {{ t('buyouts.takeoverF1') }}</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> {{ t('buyouts.takeoverF2') }}</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> {{ t('buyouts.takeoverF3') }}</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> {{ t('buyouts.takeoverF4') }}</span>
              </div>
            </div>
            <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                @click="selectPlan(t('buyouts.takeoverTierName'), 300)"
                class="w-full py-4 px-6 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-kader-cream rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all duration-300 shadow-lg shadow-kader-red/20"
              >
                {{ t('buyouts.takeoverCta') }}
              </button>
              <NuxtLink
                to="/club"
                class="w-full py-3.5 px-6 border border-kader-red/40 hover:border-kader-red hover:bg-kader-red/10 text-kader-cream/80 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all duration-300"
              >
                {{ t('buyouts.takeoverExploreClub') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Real Venue & Catering Photo Showcase ===== -->
      <section class="pb-20 md:pb-24">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('buyouts.showcaseSubtitle') }}</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-12 uppercase">{{ t('buyouts.showcaseTitle') }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_5.jpg', 600, 80)" :alt="t('buyouts.showcase1Alt')" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">{{ t('buyouts.showcase1Tag') }}</span>
                <h4 class="text-base font-bold text-white uppercase">{{ t('buyouts.showcase1Title') }}</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_7.jpg', 600, 80)" :alt="t('buyouts.showcase2Alt')" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">{{ t('buyouts.showcase2Tag') }}</span>
                <h4 class="text-base font-bold text-white uppercase">{{ t('buyouts.showcase2Title') }}</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_13.jpg', 600, 80)" :alt="t('buyouts.showcase3Alt')" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">{{ t('buyouts.showcase3Tag') }}</span>
                <h4 class="text-base font-bold text-white uppercase">{{ t('buyouts.showcase3Title') }}</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_3.jpg', 600, 80)" :alt="t('buyouts.showcase4Alt')" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">{{ t('buyouts.showcase4Tag') }}</span>
                <h4 class="text-base font-bold text-white uppercase">{{ t('buyouts.showcase4Title') }}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Inquiry form ===== -->
      <section id="inquiry-form" class="pb-28">
        <div class="max-w-2xl mx-auto">
          <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('buyouts.requestQuote') }}</p>
          <h2 class="text-3xl md:text-5xl font-black text-center mb-10 uppercase">{{ t('buyouts.getInTouch') }}</h2>

          <!-- Success state -->
          <div v-if="emailDraftOpened" class="bg-kader-red/10 border border-kader-red/40 rounded-3xl p-10 text-center">
            <h3 class="text-2xl font-black mb-3">{{ locale === 'sl' ? 'Pošljite e-pošto' : 'Send your email' }}</h3>
            <p class="text-kader-cream/70 mb-6">{{ locale === 'sl' ? 'Odprite e-poštni program in pošljite osnutek na info@kader.si. Spletna stran povpraševanja ni poslala.' : 'Send the draft in your email app to info@kader.si. This website has not sent your enquiry.' }}</p>
            <button @click="resetForm" class="px-6 py-2.5 border border-kader-red text-kader-cream hover:bg-kader-red rounded-xl font-bold text-sm uppercase tracking-wider transition-colors">
              {{ t('buyouts.sendAnother') }}
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitInquiry" novalidate class="space-y-6 bg-[#0e0404] border border-kader-red/20 rounded-3xl p-8 md:p-10">
            <div v-if="submitState === 'error'" role="alert" class="bg-kader-red/10 border border-kader-red/40 text-kader-cream/80 px-4 py-3 rounded-xl text-sm">
              {{ submitError }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.fullName') }} <span class="text-kader-red">*</span></label>
                <input
                  type="text"
                  id="name"
                  v-model="inquiryForm.name"
                  autocomplete="name"
                  :aria-invalid="!!fieldErrors.name"
                  aria-describedby="name-error"
                  :class="inputClass('name')"
                  :placeholder="t('buyouts.placeholderName')"
                >
                <p v-if="fieldErrors.name" id="name-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.name }}</p>
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.email') }} <span class="text-kader-red">*</span></label>
                <input
                  type="email"
                  id="email"
                  v-model="inquiryForm.email"
                  autocomplete="email"
                  :aria-invalid="!!fieldErrors.email"
                  aria-describedby="email-error"
                  :class="inputClass('email')"
                  :placeholder="t('buyouts.placeholderEmail')"
                >
                <p v-if="fieldErrors.email" id="email-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.email }}</p>
              </div>
            </div>

            <div>
              <label for="phone" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.phone') }} <span class="text-kader-red">*</span></label>
              <input
                type="tel"
                id="phone"
                v-model="inquiryForm.phone"
                autocomplete="tel"
                :aria-invalid="!!fieldErrors.phone"
                aria-describedby="phone-error"
                :class="inputClass('phone')"
                :placeholder="t('buyouts.placeholderPhone')"
              >
              <p v-if="fieldErrors.phone" id="phone-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.phone }}</p>
            </div>

            <div>
              <label for="event-type" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.eventType') }} <span class="text-kader-red">*</span></label>
              <select
                id="event-type"
                v-model="inquiryForm.eventType"
                :aria-invalid="!!fieldErrors.eventType"
                aria-describedby="event-type-error"
                :class="inputClass('eventType')"
              >
                <option value="">{{ t('buyouts.selectEventType') }}</option>
                <option value="wedding">{{ t('buyouts.optWedding') }}</option>
                <option value="corporate">{{ t('buyouts.optCorporate') }}</option>
                <option value="private-party">{{ t('buyouts.optPrivate') }}</option>
                <option value="cultural">{{ t('buyouts.optCultural') }}</option>
                <option value="other">{{ t('buyouts.optOther') }}</option>
              </select>
              <p v-if="fieldErrors.eventType" id="event-type-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.eventType }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="guests" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.guests') }} <span class="text-kader-red">*</span></label>
                <input
                  type="number"
                  id="guests"
                  v-model.number="inquiryForm.guests"
                  min="1"
                  max="500"
                  :aria-invalid="!!fieldErrors.guests"
                  aria-describedby="guests-error"
                  :class="inputClass('guests')"
                >
                <p v-if="fieldErrors.guests" id="guests-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.guests }}</p>
              </div>
              <div>
                <label for="date" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.preferredDate') }} <span class="text-kader-red">*</span></label>
                <input
                  type="date"
                  id="date"
                  v-model="inquiryForm.date"
                  :min="todayString"
                  :aria-invalid="!!fieldErrors.date"
                  aria-describedby="date-error"
                  :class="inputClass('date')"
                >
                <p v-if="fieldErrors.date" id="date-error" role="alert" class="mt-1 text-xs text-kader-red">{{ fieldErrors.date }}</p>
              </div>
            </div>

            <div>
              <label for="message" class="block mb-2 text-sm font-bold uppercase tracking-wider text-kader-cream/70">{{ t('buyouts.additionalInfo') }}</label>
              <textarea
                id="message"
                v-model="inquiryForm.message"
                rows="4"
                class="w-full px-4 py-3 bg-kader-black/60 border border-kader-cream/20 rounded-xl text-kader-cream focus:ring-2 focus:ring-kader-red focus:border-transparent outline-none transition-all text-sm leading-relaxed resize-none"
              ></textarea>
            </div>

            <button type="submit" :disabled="submitting" class="w-full py-4 bg-kader-red hover:bg-kader-cream hover:text-kader-black disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300">
              {{ locale === 'sl' ? 'Pripravi e-pošto' : 'Prepare email' }}
            </button>
          </form>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useSiteImages } from '~/composables/useSiteImages'
import { usePageSeo, EXACT_GEO, CANONICAL_ADDRESS, CANONICAL_CONTACTS } from '~/composables/usePageSeo'

const { t, locale } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const venueSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'EventVenue'],
      '@id': 'https://www.kader.si/buyouts#venue',
      'name': 'Kader Grad Kodeljevo — Prizorišče',
      'alternateName': 'Dvorec Grad Kodeljevo — Prizorišče',
      'description': t('buyouts.pageDesc') || 'Zgodovinski baročni dvorec iz 17. stoletja z letnim vrtom, klubskim obokom in celovito gostinsko ter avdio ponudbo za poroke, poslovna srečanja in zasebne zabave v Ljubljani.',
      'url': 'https://www.kader.si/buyouts',
      'telephone': CANONICAL_CONTACTS.reservationsPhone,
      'email': CANONICAL_CONTACTS.email,
      'priceRange': '€€€',
      'currenciesAccepted': 'EUR',
      'paymentAccepted': 'Bank Transfer, Credit Card, Cash',
      'address': CANONICAL_ADDRESS,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': EXACT_GEO.latitude,
        'longitude': EXACT_GEO.longitude
      },
      'hasMap': CANONICAL_CONTACTS.googleMapsUrl,
      'image': [
        'https://www.kader.si/logo-banner.png',
        'https://www.kader.si/buyout-bg.jpg',
        'https://www.kader.si/hero-bg.jpg'
      ],
      'maximumAttendeeCapacity': 500,
      'amenityFeature': [
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Historical Castle Architecture',
          'value': '17th-century baroque manor (Codelli estate) and historic courtyard'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Castle Garden & Terrace',
          'value': 'Expansive outdoor summer garden accommodating 100 to 300 guests'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Professional Audio & Stage',
          'value': 'Audiophile Klipsch La Scala AL6 club sound system and CDJ-3000 / DJM-A9 setup'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'In-house Gourmet Catering',
          'value': 'Neapolitan pizza oven, freshly baked Panuozzo sandwiches, charcuterie, and signature cocktail bar'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Dedicated Parking',
          'value': 'Free on-site parking for event attendees'
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Security & Wardrobe',
          'value': 'Dedicated event security personnel and staffed cloakroom'
        }
      ],
      'potentialAction': {
        '@type': 'CommunicateAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://www.kader.si/buyouts#inquiry-form',
          'inLanguage': locale.value,
          'actionPlatform': [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform'
          ]
        },
        'name': 'Oddaj povpraševanje za najem dvorca'
      }
    }
  ]
}))

usePageSeo({
  path: '/buyouts',
  titleKey: 'seo.buyouts.title',
  descKey: 'seo.buyouts.description',
  ogTitleKey: 'seo.buyouts.ogTitle',
  ogDescKey: 'seo.buyouts.ogDescription',
  schema: venueSchema
})

const eventTypesList = [
  { key: 'weddings', index: '01', titleKey: 'buyouts.weddings', descKey: 'buyouts.weddingsDesc' },
  { key: 'corporate', index: '02', titleKey: 'buyouts.corporate', descKey: 'buyouts.corporateDesc' },
  { key: 'privateParties', index: '03', titleKey: 'buyouts.privateParties', descKey: 'buyouts.privatePartiesDesc' },
  { key: 'cultural', index: '04', titleKey: 'buyouts.cultural', descKey: 'buyouts.culturalDesc' }
]

// Venue FAQ accordion state
const openFaqIndex = ref<number | null>(0)
const toggleFaq = (idx: number) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx
}
const buyoutsFaq = computed(() => [
  { question: t('buyouts.faqQ1'), answer: t('buyouts.faqA1') },
  { question: t('buyouts.faqQ2'), answer: t('buyouts.faqA2') },
  { question: t('buyouts.faqQ3'), answer: t('buyouts.faqA3') },
  { question: t('buyouts.faqQ4'), answer: t('buyouts.faqA4') },
  { question: t('buyouts.faqQ5'), answer: t('buyouts.faqA5') }
])

const scrollToForm = () => {
  document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })
}

const inquiryForm = reactive({
  name: '',
  email: '',
  phone: '',
  eventType: '',
  guests: 100,
  date: '',
  message: ''
})

const selectPlan = (tierName: string, guestCount: number) => {
  inquiryForm.guests = guestCount
  inquiryForm.message = t('buyouts.inquiryMessagePrefill', { tier: tierName, guests: guestCount, tierName, guestCount })
  if (tierName === t('buyouts.takeoverTierName') || tierName.includes('Takeover')) {
    inquiryForm.eventType = 'private-party'
  }
  scrollToForm()
}

const fieldErrors = reactive<Record<string, string>>({})
const submitState = ref<'idle' | 'success' | 'error'>('idle')
const submitError = ref('')
const submitting = ref(false)
const emailDraftOpened = ref(false)

const todayString = new Date().toISOString().slice(0, 10)

const validate = () => {
  const errors: Record<string, string> = {}

  if (inquiryForm.name.trim().length < 2) errors.name = t('buyouts.errName')
  if (!inquiryForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email.trim())) {
    errors.email = t('buyouts.errEmail')
  }
  if (!inquiryForm.phone.trim() || inquiryForm.phone.replace(/\D/g, '').length < 6) {
    errors.phone = t('buyouts.errPhone')
  }
  if (!inquiryForm.eventType) errors.eventType = t('buyouts.errEventType')
  if (!Number.isFinite(inquiryForm.guests) || inquiryForm.guests < 1 || inquiryForm.guests > 500) {
    errors.guests = t('buyouts.errGuests')
  }
  if (!inquiryForm.date) {
    errors.date = t('buyouts.errDateRequired')
  } else if (new Date(inquiryForm.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
    errors.date = t('buyouts.errDateFuture')
  }

  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
  Object.assign(fieldErrors, errors)
  return Object.keys(errors).length === 0
}

const inputClass = (field: string) => {
  const base = 'w-full px-4 py-3 bg-kader-black/60 border rounded-xl text-kader-cream focus:ring-2 focus:ring-kader-red focus:border-transparent outline-none transition-all text-sm'
  return fieldErrors[field]
    ? `${base} border-kader-red`
    : `${base} border-kader-cream/20`
}

const submitInquiry = async () => {
  submitState.value = 'idle'
  if (!validate()) return

  const body = Object.entries(inquiryForm).map(([key, value]) => `${key}: ${value}`).join('\n')
  window.location.href = `mailto:info@kader.si?subject=${encodeURIComponent('Kader — ' + inquiryForm.eventType)}&body=${encodeURIComponent(body)}`
  // Opening an email draft is not a confirmed submission.
  emailDraftOpened.value = true
}

const resetForm = () => {
  emailDraftOpened.value = false
  inquiryForm.name = ''
  inquiryForm.email = ''
  inquiryForm.phone = ''
  inquiryForm.eventType = ''
  inquiryForm.guests = 100
  inquiryForm.date = ''
  inquiryForm.message = ''
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
  submitError.value = ''
  submitState.value = 'idle'
}
</script>