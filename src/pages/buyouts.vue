<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('buyouts.pageTitle') }}</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">{{ t('buyouts.pageDesc') }}</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 class="text-3xl font-bold mb-6">{{ t('buyouts.venueOverview') }}</h2>
          <p class="text-lg mb-6">{{ t('buyouts.venueP') }}</p>
          
          <div class="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 class="text-xl font-bold mb-4">{{ t('buyouts.venueFeatures') }}</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{{ t('buyouts.feat1') }}</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{{ t('buyouts.feat2') }}</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{{ t('buyouts.feat3') }}</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{{ t('buyouts.feat4') }}</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{{ t('buyouts.feat5') }}</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">{{ t('buyouts.eventTypes') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">{{ t('buyouts.weddings') }}</h4>
                <p class="text-sm">{{ t('buyouts.weddingsDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">{{ t('buyouts.corporate') }}</h4>
                <p class="text-sm">{{ t('buyouts.corporateDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">{{ t('buyouts.privateParties') }}</h4>
                <p class="text-sm">{{ t('buyouts.privatePartiesDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">{{ t('buyouts.cultural') }}</h4>
                <p class="text-sm">{{ t('buyouts.culturalDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" alt="Buyout Venue" class="rounded-xl shadow-2xl w-full h-96 object-cover">
          <div class="mt-6 bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">{{ t('buyouts.bookingProcess') }}</h3>
            <ol class="space-y-3">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">1</span>
                <span>{{ t('buyouts.booking1') }}</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">2</span>
                <span>{{ t('buyouts.booking2') }}</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">3</span>
                <span>{{ t('buyouts.booking3') }}</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">4</span>
                <span>{{ t('buyouts.booking4') }}</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">5</span>
                <span>{{ t('buyouts.booking5') }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8 mb-12">
        <h2 class="text-3xl font-bold mb-6 text-center">{{ t('buyouts.tieredPricing') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-900 rounded-lg p-6 text-center">
            <h3 class="text-xl font-bold mb-2">{{ t('buyouts.basic') }}</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€1,500</div>
            <ul class="space-y-2 mb-6">
              <li>{{ t('buyouts.upTo', { n: 100 }) }}</li>
              <li>{{ t('buyouts.basicCatering') }}</li>
              <li>{{ t('buyouts.standardSound') }}</li>
              <li>{{ t('buyouts.basicDecor') }}</li>
            </ul>
            <button class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
              {{ t('buyouts.contactUs') }}
            </button>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-6 text-center border-2 border-red-500 relative">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              {{ t('buyouts.popular') }}
            </div>
            <h3 class="text-xl font-bold mb-2">{{ t('buyouts.premium') }}</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€3,000</div>
            <ul class="space-y-2 mb-6">
              <li>{{ t('buyouts.upTo', { n: 200 }) }}</li>
              <li>{{ t('buyouts.fullCatering') }}</li>
              <li>{{ t('buyouts.proSound') }}</li>
              <li>{{ t('buyouts.elegantDecor') }}</li>
              <li>{{ t('buyouts.specialistLighting') }}</li>
            </ul>
            <button class="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
              {{ t('buyouts.contactUs') }}
            </button>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-6 text-center">
            <h3 class="text-xl font-bold mb-2">{{ t('buyouts.luxury') }}</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€5,000</div>
            <ul class="space-y-2 mb-6">
              <li>{{ t('buyouts.upTo', { n: 300 }) }}</li>
              <li>{{ t('buyouts.luxuryCatering') }}</li>
              <li>{{ t('buyouts.fullSound') }}</li>
              <li>{{ t('buyouts.customDecor') }}</li>
              <li>{{ t('buyouts.personalizedService') }}</li>
              <li>{{ t('buyouts.exclusiveAccess') }}</li>
            </ul>
            <button class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
              {{ t('buyouts.contactUs') }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-center">{{ t('buyouts.requestQuote') }}</h2>
        <div class="max-w-2xl mx-auto">
          <div v-if="submitState === 'success'" class="bg-green-900/40 border border-green-700 text-green-300 rounded-lg p-6 text-center mb-6">
            <h3 class="text-xl font-semibold mb-2">{{ t('buyouts.inquiryReceived') }}</h3>
            <p>{{ t('buyouts.thankYou', { name: inquiryForm.name.split(' ')[0] }) }}</p>
            <button @click="resetForm" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
              {{ t('buyouts.sendAnother') }}
            </button>
          </div>

          <form v-else @submit.prevent="submitInquiry" novalidate class="space-y-6">
            <div v-if="submitState === 'error'" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {{ submitError }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block mb-2 font-medium">{{ t('buyouts.fullName') }} <span class="text-red-500">*</span></label>
                <input type="text" id="name" v-model="inquiryForm.name" :class="inputClass('name')" placeholder="Janez Novak">
                <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-400">{{ fieldErrors.name }}</p>
              </div>
              <div>
                <label for="email" class="block mb-2 font-medium">{{ t('buyouts.email') }} <span class="text-red-500">*</span></label>
                <input type="email" id="email" v-model="inquiryForm.email" :class="inputClass('email')" placeholder="janez@example.com">
                <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-400">{{ fieldErrors.email }}</p>
              </div>
            </div>
            <div>
              <label for="phone" class="block mb-2 font-medium">{{ t('buyouts.phone') }} <span class="text-red-500">*</span></label>
              <input type="tel" id="phone" v-model="inquiryForm.phone" :class="inputClass('phone')" placeholder="+386 40 123 456">
              <p v-if="fieldErrors.phone" class="mt-1 text-sm text-red-400">{{ fieldErrors.phone }}</p>
            </div>
            <div>
              <label for="event-type" class="block mb-2 font-medium">{{ t('buyouts.eventType') }} <span class="text-red-500">*</span></label>
              <select id="event-type" v-model="inquiryForm.eventType" :class="inputClass('eventType')">
                <option value="">{{ t('buyouts.selectEventType') }}</option>
                <option value="wedding">{{ t('buyouts.optWedding') }}</option>
                <option value="corporate">{{ t('buyouts.optCorporate') }}</option>
                <option value="private-party">{{ t('buyouts.optPrivate') }}</option>
                <option value="cultural">{{ t('buyouts.optCultural') }}</option>
                <option value="other">{{ t('buyouts.optOther') }}</option>
              </select>
              <p v-if="fieldErrors.eventType" class="mt-1 text-sm text-red-400">{{ fieldErrors.eventType }}</p>
            </div>
            <div>
              <label for="guests" class="block mb-2 font-medium">{{ t('buyouts.guests') }} <span class="text-red-500">*</span></label>
              <input type="number" id="guests" v-model.number="inquiryForm.guests" min="1" max="500" :class="inputClass('guests')">
              <p v-if="fieldErrors.guests" class="mt-1 text-sm text-red-400">{{ fieldErrors.guests }}</p>
            </div>
            <div>
              <label for="date" class="block mb-2 font-medium">{{ t('buyouts.preferredDate') }} <span class="text-red-500">*</span></label>
              <input type="date" id="date" v-model="inquiryForm.date" :min="todayString" :class="inputClass('date')">
              <p v-if="fieldErrors.date" class="mt-1 text-sm text-red-400">{{ fieldErrors.date }}</p>
            </div>
            <div>
              <label for="message" class="block mb-2 font-medium">{{ t('buyouts.additionalInfo') }}</label>
              <textarea id="message" v-model="inquiryForm.message" rows="4" class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
            </div>
            <button type="submit" :disabled="submitting" class="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-300">
              {{ submitting ? t('buyouts.submitting') : t('buyouts.submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const { t } = useLocale()

const inquiryForm = reactive({
  name: '',
  email: '',
  phone: '',
  eventType: '',
  guests: 100,
  date: '',
  message: ''
})

const fieldErrors = reactive<Record<string, string>>({})
const submitState = ref<'idle' | 'success' | 'error'>('idle')
const submitError = ref('')
const submitting = ref(false)

const todayString = new Date().toISOString().slice(0, 10)

// Per-field client validation (mirrors the server route)
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
  const base = 'w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
  return fieldErrors[field]
    ? `${base} border-red-500`
    : `${base} border-gray-600`
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