<template>
  <div class="min-h-screen bg-kader-black text-kader-cream">

    <!-- ===== Hero ===== -->
    <section class="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
      <img
        :src="getOptImg(siteImages.buyouts_hero_bg, 1920, 85)"
        alt="Grad Kodeljevo private hire terrace party"
        class="absolute inset-0 w-full h-full object-cover opacity-45 filter contrast-110 saturate-90"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-kader-black via-kader-black/60 to-transparent"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 md:pb-20 w-full">
        <p class="text-xs md:text-sm uppercase tracking-[0.35em] mb-4 text-kader-red font-semibold">{{ t('club.privateHire') }}</p>
        <h1 class="text-5xl md:text-8xl font-black leading-[0.92] mb-6 uppercase">{{ t('buyouts.pageTitle') }}</h1>
        <p class="text-lg md:text-2xl max-w-2xl text-kader-cream/80">{{ t('buyouts.pageDesc') }}</p>
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
            <p class="text-xl md:text-2xl leading-relaxed text-kader-cream/80 mb-8">{{ t('buyouts.venueP') }}</p>
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
            alt="Live Event at Grad Kodeljevo"
            class="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
          >
        </div>
      </section>

      <!-- ===== Pricing tiers ===== -->
      <section class="pb-20 md:pb-24">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">{{ t('buyouts.tieredPricing') }}</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-12 uppercase">{{ t('buyouts.choosePlan') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Basic -->
          <div class="bg-[#120607] border border-kader-red/20 rounded-3xl p-8 flex flex-col">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('buyouts.basic') }}</p>
            <div class="text-4xl font-black text-white mb-1">€1,500</div>
            <p class="text-kader-cream/40 text-sm mb-6">{{ t('buyouts.upTo', { n: 100 }) }}</p>
            <ul class="space-y-2 text-sm text-kader-cream/70 flex-1 mb-8">
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.basicCatering') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.standardSound') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.basicDecor') }}</li>
            </ul>
            <button @click="selectPlan('Basic Paket', 100)" class="w-full py-3 border border-kader-red text-kader-cream hover:bg-kader-red hover:text-kader-black rounded-xl font-bold transition-colors duration-300 text-sm uppercase tracking-wider">
              {{ t('buyouts.contactUs') }}
            </button>
          </div>

          <!-- Premium (highlighted) -->
          <div class="bg-kader-red/10 border border-kader-red rounded-3xl p-8 flex flex-col relative">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-kader-red text-white px-5 py-1 rounded-full text-xs font-black uppercase tracking-wider">{{ t('buyouts.popular') }}</div>
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('buyouts.premium') }}</p>
            <div class="text-4xl font-black text-white mb-1">€3,000</div>
            <p class="text-kader-cream/40 text-sm mb-6">{{ t('buyouts.upTo', { n: 200 }) }}</p>
            <ul class="space-y-2 text-sm text-kader-cream/80 flex-1 mb-8">
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.fullCatering') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.proSound') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.elegantDecor') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.specialistLighting') }}</li>
            </ul>
            <button @click="selectPlan('Premium Paket', 200)" class="w-full py-3 bg-kader-red hover:bg-kader-cream hover:text-kader-black rounded-xl font-bold transition-colors duration-300 text-sm uppercase tracking-wider">
              {{ t('buyouts.contactUs') }}
            </button>
          </div>

          <!-- Luxury -->
          <div class="bg-[#120607] border border-kader-red/20 rounded-3xl p-8 flex flex-col">
            <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-3">{{ t('buyouts.luxury') }}</p>
            <div class="text-4xl font-black text-white mb-1">€5,000</div>
            <p class="text-kader-cream/40 text-sm mb-6">{{ t('buyouts.upTo', { n: 300 }) }}</p>
            <ul class="space-y-2 text-sm text-kader-cream/70 flex-1 mb-8">
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.luxuryCatering') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.fullSound') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.customDecor') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.personalizedService') }}</li>
              <li class="flex items-start gap-2"><span class="text-kader-red mt-0.5">—</span>{{ t('buyouts.exclusiveAccess') }}</li>
            </ul>
            <button @click="selectPlan('Luxury Paket', 300)" class="w-full py-3 border border-kader-red text-kader-cream hover:bg-kader-red hover:text-kader-black rounded-xl font-bold transition-colors duration-300 text-sm uppercase tracking-wider">
              {{ t('buyouts.contactUs') }}
            </button>
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
                Ekskluzivni Klubski Takeover · Klipsch Sound System
              </div>
              <h3 class="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                Zasebna Klubska Noč: Grad Kodeljevo Vault
              </h3>
              <p class="text-kader-cream/80 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                Iščete prostor za nepozaben zasebni elektronski dogodek, rojstnodnevni rave ali ekskluzivni afterparty? 
                Zagotovite si celoten klubski obok s surovim opečnatim ambientom, profesionalnim ozvočenjem <strong>Klipsch La Scala</strong>, klubsko osvetlitvijo, DJ kabino in izkušenim tonskim mojstrom.
              </p>
              <div class="flex flex-wrap gap-4 text-xs font-mono text-kader-cream/60">
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> Klipsch La Scala Sound</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> DJ Oprema (CDJ-3000 / DJM-A9)</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> Zasebni Bar & Varnostna Služba</span>
                <span class="flex items-center gap-1.5"><span class="text-kader-red">✓</span> Akustična Zaščita & Do 300 Oseb</span>
              </div>
            </div>
            <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                @click="selectPlan('Klubski Takeover (Klipsch Sound System)', 300)"
                class="w-full py-4 px-6 bg-kader-red hover:bg-kader-cream hover:text-kader-black text-kader-cream rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all duration-300 shadow-lg shadow-kader-red/20"
              >
                Izberi Klubski Takeover →
              </button>
              <NuxtLink
                to="/club"
                class="w-full py-3.5 px-6 border border-kader-red/40 hover:border-kader-red hover:bg-kader-red/10 text-kader-cream/80 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all duration-300"
              >
                Razišči Klub & Akustiko ↗
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Real Venue & Catering Photo Showcase ===== -->
      <section class="pb-20 md:pb-24">
        <p class="text-xs uppercase tracking-[0.3em] text-kader-red font-semibold mb-2 text-center">Vzdušje & Katering</p>
        <h2 class="text-3xl md:text-5xl font-black text-center mb-12 uppercase">Utrinki Z Zasebnih Dogodkov</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_5.jpg', 600, 80)" alt="Zasebna zabava na poletni terasi" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">Terasa & Poletni Vrt</span>
                <h4 class="text-base font-bold text-white uppercase">Zabave Na Prostem</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_7.jpg', 600, 80)" alt="Neapeljske pice na zasebnem dogodku" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">Topli Katering</span>
                <h4 class="text-base font-bold text-white uppercase">Sveže Pečene Pice</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_13.jpg', 600, 80)" alt="Panuozzo sendviči za katering" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">Finger Food</span>
                <h4 class="text-base font-bold text-white uppercase">Grajski Panuozzo</h4>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-kader-red/20 group shadow-2xl h-80">
            <img :src="getOptImg('/images/instagram/ig_img_3.jpg', 600, 80)" alt="Živa glasba in nastopi" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span class="text-[10px] font-mono text-kader-red uppercase tracking-widest block mb-1">Oder & Glasba</span>
                <h4 class="text-base font-bold text-white uppercase">Koncerti & DJ Nastopi</h4>
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
          <div v-if="submitState === 'success'" class="bg-kader-red/10 border border-kader-red/40 rounded-3xl p-10 text-center">
            <h3 class="text-2xl font-black mb-3">{{ t('buyouts.inquiryReceived') }}</h3>
            <p class="text-kader-cream/70 mb-6">{{ t('buyouts.thankYou', { name: inquiryForm.name.split(' ')[0] }) }}</p>
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
                  placeholder="Janez Novak"
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
                  placeholder="janez@example.com"
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
                placeholder="+386 40 123 456"
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
              {{ submitting ? t('buyouts.submitting') : t('buyouts.submit') }}
            </button>
          </form>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const { t } = useLocale()
const { siteImages, getOptImg } = useSiteImages()

const eventTypesList = [
  { key: 'weddings', index: '01', titleKey: 'buyouts.weddings', descKey: 'buyouts.weddingsDesc' },
  { key: 'corporate', index: '02', titleKey: 'buyouts.corporate', descKey: 'buyouts.corporateDesc' },
  { key: 'privateParties', index: '03', titleKey: 'buyouts.privateParties', descKey: 'buyouts.privatePartiesDesc' },
  { key: 'cultural', index: '04', titleKey: 'buyouts.cultural', descKey: 'buyouts.culturalDesc' }
]

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
  inquiryForm.message = `Zanimam se za paket ${tierName} (do ${guestCount} oseb). Prosimo za ponudbo in razpoložljivost.`
  if (tierName.includes('Klubski Takeover')) {
    inquiryForm.eventType = 'private-party'
  }
  scrollToForm()
}

const fieldErrors = reactive<Record<string, string>>({})
const submitState = ref<'idle' | 'success' | 'error'>('idle')
const submitError = ref('')
const submitting = ref(false)

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

  submitting.value = true
  try {
    const res = await $fetch<{ ok: boolean; id: string }>('/api/inquiries', {
      method: 'POST',
      body: { ...inquiryForm }
    })
    if (res?.ok) {
      submitState.value = 'success'
    } else {
      submitError.value = t('buyouts.errGeneric')
      submitState.value = 'error'
    }
  } catch (err: any) {
    if (err?.statusCode === 422 && err?.data?.errors) {
      Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
      Object.assign(fieldErrors, err.data.errors)
      submitError.value = t('buyouts.errFixFields')
      submitState.value = 'error'
    } else {
      submitError.value = err?.data?.statusMessage || err?.statusMessage || t('buyouts.errNetwork')
      submitState.value = 'error'
    }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
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