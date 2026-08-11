<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Door Operations</h1>
        <p class="text-gray-400 mt-1">Guestlist check-in & capacity — mobile friendly</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-400">Live Capacity</p>
        <p class="text-2xl font-bold" :class="capacityClass">{{ checkedInCount }} / {{ venueCapacity }}</p>
      </div>
    </div>

    <!-- Event selector -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">Active Event</label>
      <select v-model="selectedEventId" @change="fetchGuestlist" class="input-field max-w-md">
        <option :value="null" disabled>Select an event</option>
        <option v-for="event in upcomingEvents" :key="event.id" :value="event.id">{{ event.title }}</option>
      </select>
    </div>

    <!-- Add guest -->
    <div v-if="selectedEventId" class="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-8">
      <h2 class="text-lg font-semibold mb-4">Add Guest</h2>
      <div class="flex flex-col md:flex-row gap-3">
        <input v-model="newGuest.name" type="text" placeholder="Guest name *" class="input-field flex-1" @keyup.enter="addGuest" />
        <select v-model="newGuest.category" class="input-field md:w-40">
          <option value="standard">Standard</option>
          <option value="vip">VIP</option>
          <option value="press">Press</option>
          <option value="artist">Artist</option>
        </select>
        <button 
          @click="addGuest"
          :disabled="!newGuest.name.trim() || adding"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg font-semibold transition-colors whitespace-nowrap"
        >
          {{ adding ? 'Adding...' : '+ Add' }}
        </button>
      </div>
      <div v-if="addError" class="text-red-400 text-sm mt-2">{{ addError }}</div>
    </div>

    <!-- Capacity bar -->
    <div v-if="selectedEventId" class="mb-8">
      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>{{ checkedInCount }} checked in</span>
        <span>{{ guestlist.length }} on list • {{ percentage }}%</span>
      </div>
      <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>

    <!-- Guestlist -->
    <div v-if="selectedEventId" class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <div class="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
        <h2 class="font-semibold">Guestlist</h2>
        <input v-model="search" type="text" placeholder="Search..." class="input-field max-w-xs" />
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12 text-gray-400">
        <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
      </div>
      <div v-else-if="filteredGuestlist.length === 0" class="text-center py-12 text-gray-500">
        No guests found.
      </div>
      <div v-else class="divide-y divide-gray-700">
        <div v-for="guest in filteredGuestlist" :key="guest.id" class="flex items-center gap-4 px-5 py-3">
          <button
            @click="toggleCheckIn(guest)"
            :class="guest.status === 'checked_in' 
              ? 'w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white'
              : 'w-6 h-6 rounded-full border-2 border-gray-500 hover:border-green-400 transition-colors'"
            :aria-label="guest.status === 'checked_in' ? 'Check out' : 'Check in'"
          >
            <svg v-if="guest.status === 'checked_in'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </button>
          <div class="flex-1">
            <p class="font-medium">{{ guest.guest_name }}</p>
            <p class="text-xs text-gray-400">@{{ guest.promoter_name || 'walk-in' }}</p>
          </div>
          <span :class="categoryClass(guest.category)" class="px-2 py-0.5 text-xs font-medium rounded-full">
            {{ guest.category || 'standard' }}
          </span>
          <button @click="removeGuest(guest)" class="text-red-500 hover:text-red-400 text-sm">Remove</button>
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-800 rounded-xl p-16 text-center border border-gray-700">
      <p class="text-gray-400">Select an event to manage its guestlist.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface EventItem { id: string; title: string; }
interface Guest {
  id: string
  event_id: string | null
  guest_name: string
  category: string | null
  status: string | null
  promoter_id: string | null
  promoter_name?: string | null
}

const venueCapacity = 450
const upcomingEvents = ref<EventItem[]>([])
const selectedEventId = ref<string | null>(null)
const guestlist = ref<Guest[]>([])
const search = ref('')
const loading = ref(false)
const adding = ref(false)
const addError = ref('')

const newGuest = ref({ name: '', category: 'standard' })

const filteredGuestlist = computed(() => {
  if (!search.value.trim()) return guestlist.value
  const q = search.value.toLowerCase()
  return guestlist.value.filter(g => g.guest_name.toLowerCase().includes(q))
})

const checkedInCount = computed(() => guestlist.value.filter(g => g.status === 'checked_in').length)
const percentage = computed(() => Math.min(100, Math.round((checkedInCount.value / venueCapacity) * 100)))
const capacityClass = computed(() => checkedInCount.value >= venueCapacity ? 'text-red-400' : 'text-green-400')

const categoryClass = (cat: string | null) => {
  const classes: Record<string, string> = {
    vip: 'bg-purple-900/30 text-purple-300',
    press: 'bg-blue-900/30 text-blue-300',
    artist: 'bg-yellow-900/30 text-yellow-300',
    standard: 'bg-gray-700 text-gray-300'
  }
  return `px-2 py-0.5 text-xs font-medium rounded-full ${classes[cat || 'standard'] || classes.standard}`
}

const fetchEvents = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data } = await $supabase
      .from('events')
      .select('id, title')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
    upcomingEvents.value = data || []
  } catch (e) {
    console.error('Failed to fetch events:', e)
  }
}

const fetchGuestlist = async () => {
  if (!selectedEventId.value) { guestlist.value = []; return }
  loading.value = true
  try {
    const { $supabase } = useNuxtApp()
    // Fetch via RPC or direct join — using a subquery for promoter_name is complex with RLS;
    // here we just fetch guest entries. Promoter names resolved below where needed.
    const { data, error } = await $supabase
      .from('guestlists')
      .select('*')
      .eq('event_id', selectedEventId.value)
      .order('created_at', { ascending: true })

    if (error) throw error
    guestlist.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch guestlist:', err)
  } finally {
    loading.value = false
  }
}

const addGuest = async () => {
  addError.value = ''
  if (!newGuest.value.name.trim()) return
  if (!selectedEventId.value) return

  adding.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('guestlists')
      .insert({
        event_id: selectedEventId.value,
        guest_name: newGuest.value.name.trim(),
        category: newGuest.value.category,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    if (data) guestlist.value.push(data)
    newGuest.value.name = ''
  } catch (err: any) {
    addError.value = err?.message || 'Failed to add guest.'
    console.error(err)
  } finally {
    adding.value = false
  }
}

const toggleCheckIn = async (guest: Guest) => {
  const newStatus = guest.status === 'checked_in' ? 'pending' : 'checked_in'
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('guestlists').update({ status: newStatus }).eq('id', guest.id)
    if (error) throw error
    guest.status = newStatus
  } catch (err: any) {
    console.error('Failed to toggle check-in:', err)
  }
}

const removeGuest = async (guest: Guest) => {
  if (!confirm(`Remove "${guest.guest_name}" from the list?`)) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('guestlists').delete().eq('id', guest.id)
    if (error) throw error
    guestlist.value = guestlist.value.filter(g => g.id !== guest.id)
  } catch (err: any) {
    console.error('Failed to remove guest:', err)
  }
}

onMounted(fetchEvents)

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>