<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Private Hire & Buyouts</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">Transform your special occasion into an unforgettable experience in our historic castle venue.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 class="text-3xl font-bold mb-6">Venue Overview</h2>
          <p class="text-lg mb-6">Our castle venue offers a unique blend of historic charm and modern amenities for your private event. With its stunning architecture and intimate atmosphere, it's the perfect setting for weddings, corporate events, or special celebrations.</p>
          
          <div class="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 class="text-xl font-bold mb-4">Venue Features</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Historic castle setting with stone walls and vaulted ceilings</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Capacity for 100-300 guests depending on event type</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Professional catering services available</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>On-site parking and accessibility</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Sound system and lighting equipment included</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">Event Types</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">Weddings</h4>
                <p class="text-sm">Elegant ceremonies and receptions in our historic castle halls.</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">Corporate Events</h4>
                <p class="text-sm">Professional gatherings with unique historical backdrop.</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">Private Parties</h4>
                <p class="text-sm">Intimate celebrations with personalized service.</p>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <h4 class="font-bold mb-2">Cultural Events</h4>
                <p class="text-sm">Art exhibitions, concerts, and educational programs.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <img src="/images/buyout-venue.jpg" alt="Buyout Venue" class="rounded-xl shadow-2xl w-full h-96 object-cover">
          <div class="mt-6 bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold mb-4">Booking Process</h3>
            <ol class="space-y-3">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">1</span>
                <span>Submit inquiry with event details and dates</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">2</span>
                <span>Receive venue availability confirmation</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">3</span>
                <span>Discuss customization options and pricing</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">4</span>
                <span>Sign contract and secure deposit</span>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">5</span>
                <span>Enjoy your special event!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8 mb-12">
        <h2 class="text-3xl font-bold mb-6 text-center">Tiered Pricing</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-900 rounded-lg p-6 text-center">
            <h3 class="text-xl font-bold mb-2">Basic Package</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€1,500</div>
            <ul class="space-y-2 mb-6">
              <li>Up to 100 guests</li>
              <li>Basic catering</li>
              <li>Standard sound system</li>
              <li>Basic decoration</li>
            </ul>
            <button class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
              Contact Us
            </button>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-6 text-center border-2 border-red-500 relative">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 class="text-xl font-bold mb-2">Premium Package</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€3,000</div>
            <ul class="space-y-2 mb-6">
              <li>Up to 200 guests</li>
              <li>Full catering service</li>
              <li>Professional sound system</li>
              <li>Elegant decoration</li>
              <li>Specialist lighting</li>
            </ul>
            <button class="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
              Contact Us
            </button>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-6 text-center">
            <h3 class="text-xl font-bold mb-2">Luxury Package</h3>
            <div class="text-3xl font-bold text-red-500 mb-4">€5,000</div>
            <ul class="space-y-2 mb-6">
              <li>Up to 300 guests</li>
              <li>Luxury catering</li>
              <li>Full sound & lighting</li>
              <li>Custom decoration</li>
              <li>Personalized service</li>
              <li>Exclusive access</li>
            </ul>
            <button class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Request a Quote</h2>
        <div class="max-w-2xl mx-auto">
          <form @submit.prevent="submitInquiry" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block mb-2 font-medium">Full Name</label>
                <input type="text" id="name" v-model="inquiryForm.name" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              </div>
              <div>
                <label for="email" class="block mb-2 font-medium">Email Address</label>
                <input type="email" id="email" v-model="inquiryForm.email" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              </div>
            </div>
            <div>
              <label for="phone" class="block mb-2 font-medium">Phone Number</label>
              <input type="tel" id="phone" v-model="inquiryForm.phone" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="event-type" class="block mb-2 font-medium">Event Type</label>
              <select id="event-type" v-model="inquiryForm.eventType" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="private-party">Private Party</option>
                <option value="cultural">Cultural Event</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label for="guests" class="block mb-2 font-medium">Expected Number of Guests</label>
              <input type="number" id="guests" v-model.number="inquiryForm.guests" min="1" max="500" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="date" class="block mb-2 font-medium">Preferred Date</label>
              <input type="date" id="date" v-model="inquiryForm.date" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="message" class="block mb-2 font-medium">Additional Information</label>
              <textarea id="message" v-model="inquiryForm.message" rows="4" class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
            </div>
            <button type="submit" class="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

const inquiryForm = reactive({
  name: '',
  email: '',
  phone: '',
  eventType: '',
  guests: 100,
  date: '',
  message: ''
})

const submitInquiry = () => {
  console.log('Inquiry submitted:', inquiryForm)
  alert('Inquiry submitted successfully! We will contact you shortly.')
  inquiryForm.name = ''
  inquiryForm.email = ''
  inquiryForm.phone = ''
  inquiryForm.eventType = ''
  inquiryForm.guests = 100
  inquiryForm.date = ''
  inquiryForm.message = ''
}
</script>