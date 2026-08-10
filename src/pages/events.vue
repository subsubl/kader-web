<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Events Calendar</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">Join us for exciting events at Kader Grad Kodeljevo - from live music to cultural evenings.</p>
      </header>

      <div class="mb-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">Upcoming Events</h2>
            <p class="text-gray-300">Browse our upcoming events and book your tickets now</p>
          </div>
          <div class="flex gap-2">
            <button @click="filterEvents('all')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300">
              All Events
            </button>
            <button @click="filterEvents('pizzeria')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300">
              Pizzeria
            </button>
            <button @click="filterEvents('club')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300">
              Club
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="event in filteredEvents" :key="event.id" class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <div class="relative">
              <img :src="event.image" :alt="event.title" class="w-full h-48 object-cover">
              <div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {{ event.type }}
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold">{{ event.title }}</h3>
                <span class="text-xl font-bold text-red-500">€{{ event.price }}</span>
              </div>
              <p class="text-gray-300 mb-2">{{ event.date }} • {{ event.time }}</p>
              <p class="mb-4">{{ event.description }}</p>
              <div class="flex gap-2 mb-4">
                <span v-for="tag in event.tags" :key="tag" class="px-2 py-1 bg-gray-700 text-xs rounded">
                  {{ tag }}
                </span>
              </div>
              <NuxtLink :to="`/events/${event.slug}`" class="inline-block w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-center transition-colors duration-300">
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Event Booking</h2>
        <div class="max-w-2xl mx-auto">
          <form @submit.prevent="submitBooking" class="space-y-6">
            <div>
              <label for="name" class="block mb-2 font-medium">Full Name</label>
              <input type="text" id="name" v-model="bookingForm.name" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="email" class="block mb-2 font-medium">Email Address</label>
              <input type="email" id="email" v-model="bookingForm.email" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div>
              <label for="event" class="block mb-2 font-medium">Select Event</label>
              <select id="event" v-model="bookingForm.eventId" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="">Choose an event</option>
                <option v-for="event in upcomingEvents" :key="event.id" :value="event.id">{{ event.title }}</option>
              </select>
            </div>
            <div>
              <label for="tickets" class="block mb-2 font-medium">Number of Tickets</label>
              <input type="number" id="tickets" v-model.number="bookingForm.tickets" min="1" max="10" required class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <button type="submit" class="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
              Book Tickets
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  image: string;
  type: 'pizzeria' | 'club';
  slug: string;
  tags: string[];
}

const filter = ref<'all' | 'pizzeria' | 'club'>('all')
const bookingForm = reactive({
  name: '',
  email: '',
  eventId: '',
  tickets: 1
})

const events: Event[] = [
  {
    id: '1',
    title: 'Live Jazz Night',
    description: 'Enjoy live jazz performances by local musicians in our historic castle.',
    date: 'June 15, 2023',
    time: '9:00 PM',
    price: 15,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    type: 'pizzeria',
    slug: 'live-jazz-night',
    tags: ['Music', 'Evening']
  },
  {
    id: '2',
    title: 'Italian Wine Tasting',
    description: 'Discover the finest Italian wines paired with our signature pizzas.',
    date: 'June 22, 2023',
    time: '7:00 PM',
    price: 25,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    type: 'pizzeria',
    slug: 'italian-wine-tasting',
    tags: ['Food', 'Wine']
  },
  {
    id: '3',
    title: 'Underground Dance Party',
    description: 'Our monthly dance party featuring top DJs from Slovenia and beyond.',
    date: 'June 29, 2023',
    time: '10:00 PM',
    price: 20,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    type: 'club',
    slug: 'underground-dance-party',
    tags: ['Dance', 'Nightlife']
  },
  {
    id: '4',
    title: 'Cultural Evening',
    description: 'An evening of poetry, storytelling, and local artists.',
    date: 'July 6, 2023',
    time: '8:00 PM',
    price: 10,
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    type: 'pizzeria',
    slug: 'cultural-evening',
    tags: ['Culture', 'Art']
  }
]

const upcomingEvents = computed(() => events.filter(event => new Date(event.date) > new Date()))

const filteredEvents = computed(() => {
  if (filter.value === 'all') return upcomingEvents.value
  return upcomingEvents.value.filter(event => event.type === filter.value)
})

const filterEvents = (type: 'all' | 'pizzeria' | 'club') => {
  filter.value = type
}

const submitBooking = () => {
  console.log('Booking submitted:', bookingForm)
  alert('Booking submitted successfully!')
  bookingForm.name = ''
  bookingForm.email = ''
  bookingForm.eventId = ''
  bookingForm.tickets = 1
}
</script>