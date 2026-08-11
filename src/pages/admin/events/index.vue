<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Events</h1>
        <p class="text-gray-400 mt-1">Manage events, flyers, and ticket links</p>
      </div>
      <NuxtLink to="/admin/events/new" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
        + New Event
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        @click="activeFilter = filter.value"
        :class="activeFilter === filter.value 
          ? 'bg-red-600 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Events Table -->
    <div class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
        <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="text-center py-16 text-gray-500">
        No events found.
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-900">
          <tr class="text-left text-sm text-gray-400">
            <th class="px-6 py-3 font-medium">Event</th>
            <th class="px-6 py-3 font-medium">Date</th>
            <th class="px-6 py-3 font-medium">Type</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-gray-700/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img 
                  v-if="event.image_url" 
                  :src="event.image_url" 
                  :alt="event.title"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div v-else class="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <CalendarIcon class="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p class="font-medium">{{ event.title }}</p>
                  <p class="text-xs text-gray-400">{{ event.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm">{{ formatDate(event.date) }}</td>
            <td class="px-6 py-4 text-sm">{{ event.type || '—' }}</td>
            <td class="px-6 py-4">
              <span :class="statusClass(event.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ event.status || 'draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <button @click="toggleStatus(event)" class="text-sm text-gray-300 hover:text-white mr-3 transition-colors">
                {{ event.status === 'published' ? 'Unpublish' : 'Publish' }}
              </button>
              <NuxtLink :to="`/admin/events/${event.id}`" class="text-sm text-red-400 hover:text-red-300 mr-3">Edit</NuxtLink>
              <button @click="deleteEvent(event)" class="text-sm text-red-500 hover:text-red-400">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarIcon } from '@heroicons/vue/24/outline'

interface EventItem {
  id: string
  title: string
  slug: string
  date: string
  type: string | null
  image_url: string | null
  status: string | null
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Upcoming', value: 'upcoming' }
]

const events = ref<EventItem[]>([])
const activeFilter = ref('all')
const loading = ref(false)

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') return events.value
  if (activeFilter.value === 'upcoming') {
    return events.value.filter(e => new Date(e.date) >= new Date())
  }
  return events.value.filter(e => e.status === activeFilter.value)
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('sl-SI', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const statusClass = (status: string | null) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-600 text-gray-200',
    published: 'bg-green-900/30 text-green-300',
    cancelled: 'bg-red-900/30 text-red-300',
    completed: 'bg-gray-600 text-gray-300'
  }
  return `px-2 py-1 text-xs font-medium rounded-full ${classes[status || 'draft'] || classes.draft}`
}

const fetchEvents = async () => {
  loading.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('events')
      .select('id, title, slug, date, type, image_url, status')
      .order('date', { ascending: false })

    if (error) throw error
    events.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch events:', err)
    alert('Failed to load events.')
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (event: EventItem) => {
  const newStatus = event.status === 'published' ? 'draft' : 'published'
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('events')
      .update({ status: newStatus })
      .eq('id', event.id)
    if (error) throw error
    event.status = newStatus
  } catch (err: any) {
    console.error('Failed to update event status:', err)
  }
}

const deleteEvent = async (event: EventItem) => {
  if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('events')
      .delete()
      .eq('id', event.id)
    if (error) throw error
    events.value = events.value.filter(e => e.id !== event.id)
  } catch (err: any) {
    console.error('Failed to delete event:', err)
    alert('Failed to delete event.')
  }
}

onMounted(fetchEvents)

definePageMeta({ layout: 'admin' })
</script>