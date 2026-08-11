<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Internal Calendar</h1>
      <p class="text-gray-400 mt-1">Staff scheduling & Banquet Event Order (BEO) notes</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendar + events -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Month navigation -->
        <div v-if="upcomingEvents && upcomingEvents.length > 0" class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 class="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div class="space-y-3">
            <NuxtLink 
              v-for="event in upcomingEvents" 
              :key="event.id"
              :to="`/admin/events/${event.id}`"
              class="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div>
                <p class="font-medium">{{ event.title }}</p>
                <p class="text-sm text-gray-400">{{ formatFullDate(event.date) }} • {{ event.type }}</p>
              </div>
              <span class="text-red-400 text-sm">View →</span>
            </NuxtLink>
          </div>
        </div>

        <!-- BEO Notes -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">BEO Notes</h2>
            <button @click="showNewNote = !showNewNote" class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
              + Add Note
            </button>
          </div>

          <!-- Add note form -->
          <div v-if="showNewNote" class="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
            <select v-model="newNote.event_id" class="input-field">
              <option :value="null" disabled>Link to event (optional)</option>
              <option v-for="e in allEvents" :key="e.id" :value="e.id">{{ e.title }}</option>
            </select>
            <textarea v-model="newNote.note_text" rows="2" placeholder="e.g. DJ requires extra monitors, VIP table arriving at midnight" class="input-field"></textarea>
            <button @click="addNote" :disabled="!newNote.note_text.trim() || savingNote" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium disabled:bg-red-800 transition-colors">
              {{ savingNote ? 'Saving...' : 'Save Note' }}
            </button>
          </div>

          <div v-if="loadingNotes" class="text-center py-8 text-gray-400">Loading...</div>
          <div v-else-if="notes.length === 0" class="text-center py-8 text-gray-500">
            No BEO notes yet.
          </div>
          <div v-else class="space-y-3">
            <div v-for="note in notes" :key="note.id" class="flex items-start justify-between gap-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <p class="text-sm">{{ note.note_text }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ note.event_title ? '→ ' + note.event_title : 'General' }} • {{ formatDate(note.created_at) }}
                </p>
              </div>
              <button @click="deleteNote(note)" class="text-red-500 hover:text-red-400 text-sm shrink-0">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini stats sidebar -->
      <div class="space-y-6">
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 class="text-lg font-semibold mb-4">This Week</h2>
          <div v-if="weekEvents.length === 0" class="text-gray-500 text-sm">No events scheduled this week.</div>
          <div v-else class="space-y-3">
            <div v-for="event in weekEvents" :key="event.id" class="text-sm">
              <p class="font-medium">{{ event.title }}</p>
              <p class="text-gray-400">{{ formatWeekday(event.date) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 class="text-lg font-semibold mb-4">Quick Stats</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-400">Upcoming events</span><span class="font-semibold">{{ upcomingEvents.length }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">BEO notes</span><span class="font-semibold">{{ notes.length }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Capacity</span><span class="font-semibold">450</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface EventItem { id: string; title: string; date: string; type: string | null; }
interface Note {
  id: string
  event_id: string | null
  note_text: string | null
  created_at: string | null
  event_title?: string | null
}

const upcomingEvents = ref<EventItem[]>([])
const allEvents = ref<EventItem[]>([])
const notes = ref<Note[]>([])
const loadingNotes = ref(false)
const savingNote = ref(false)
const showNewNote = ref(false)

const newNote = ref({ event_id: null as string | null, note_text: '' })

const today = new Date()
const weekEvents = computed(() => 
  upcomingEvents.value.filter(e => {
    const d = new Date(e.date)
    const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    return d >= today && d <= weekEnd
  })
)

const formatFullDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'long' })
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' }) : ''
const formatWeekday = (d: string) => new Date(d).toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'short' })

const fetchEvents = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data } = await $supabase
      .from('events')
      .select('id, title, date, type')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
    upcomingEvents.value = data || []
    allEvents.value = data || []
  } catch (e) { console.error('Failed to fetch events:', e) }
}

const fetchNotes = async () => {
  loadingNotes.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('internal_notes')
      .select('id, event_id, note_text, created_at, events(title)')
      .order('created_at', { ascending: false })

    if (error) throw error
    notes.value = (data || []).map((n: any) => ({
      ...n,
      event_title: n.events?.title ?? null
    }))
  } catch (err: any) {
    console.error('Failed to fetch notes:', err)
  } finally {
    loadingNotes.value = false
  }
}

const addNote = async () => {
  savingNote.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('internal_notes')
      .insert({ event_id: newNote.value.event_id, note_text: newNote.value.note_text.trim() })
      .select('event_id, note_text, created_at, events(title)')
      .single()

    if (error) throw error
    if (data) notes.value.unshift({ ...(data as any), event_title: (data as any).events?.title ?? null })
    newNote.value = { event_id: null, note_text: '' }
    showNewNote.value = false
  } catch (err: any) {
    console.error('Failed to add note:', err)
    alert('Failed to add note.')
  } finally {
    savingNote.value = false
  }
}

const deleteNote = async (note: Note) => {
  if (!confirm('Delete this note?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('internal_notes').delete().eq('id', note.id)
    if (error) throw error
    notes.value = notes.value.filter(n => n.id !== note.id)
  } catch (err: any) {
    console.error('Failed to delete note:', err)
  }
}

onMounted(() => {
  fetchEvents()
  fetchNotes()
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>