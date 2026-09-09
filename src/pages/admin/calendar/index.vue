<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950/80 text-purple-400 border border-purple-800/60 font-mono tracking-wider">
            VENUE CALENDAR &amp; BEO LOG
          </span>
          <span class="text-xs text-gray-400 font-mono">Current Month: {{ monthName }} {{ currentYear }}</span>
        </div>
        <h1 class="text-2xl font-extrabold text-white mt-1 tracking-tight">Interactive Calendar &amp; Team Notes</h1>
        <p class="text-xs text-gray-400">Team schedule, date-specific notes, and Banquet Event Orders (BEO).</p>
      </div>

      <div class="flex items-center gap-2">
        <button @click="prevMonth" class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold transition-colors">
          ← Prev
        </button>
        <button @click="todayMonth" class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold transition-colors">
          Today
        </button>
        <button @click="nextMonth" class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold transition-colors">
          Next →
        </button>
        <button @click="openAddNoteModal(selectedDateStr)" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors">
          + Add Date Note
        </button>
      </div>
    </div>

    <!-- Calendar & Notes Grid Split View -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Interactive Month Grid (8 Cols) -->
      <div class="lg:col-span-8 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon class="w-5 h-5 text-purple-400" />
            {{ monthName }} {{ currentYear }}
          </h2>
          <span class="text-xs text-gray-400">Click any date to view &amp; add notes</span>
        </div>

        <!-- Month Grid Header (Mon to Sun) -->
        <div class="grid grid-cols-7 text-center text-xs font-bold text-gray-400 border-b border-gray-800 pb-2 font-mono">
          <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
        </div>

        <!-- Month Grid Days -->
        <div class="grid grid-cols-7 gap-1.5">
          <!-- Empty lead cells -->
          <div v-for="blank in leadingBlanks" :key="`blank-${blank}`" class="min-h-[85px] bg-gray-950/40 rounded-lg border border-gray-900 opacity-30"></div>

          <!-- Active Day Cells -->
          <div 
            v-for="dayObj in monthDays" 
            :key="dayObj.dateStr"
            @click="selectDate(dayObj.dateStr)"
            class="min-h-[85px] p-2 bg-gray-800/60 hover:bg-gray-800 border rounded-lg cursor-pointer transition-all flex flex-col justify-between"
            :class="[
              selectedDateStr === dayObj.dateStr ? 'border-red-500 bg-gray-800 ring-2 ring-red-500/50' : 'border-gray-700/60',
              dayObj.isToday ? 'bg-red-950/20 border-red-800/80' : ''
            ]"
          >
            <div class="flex justify-between items-start">
              <span 
                class="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                :class="dayObj.isToday ? 'bg-red-600 text-white' : 'text-gray-200'"
              >
                {{ dayObj.dayNum }}
              </span>

              <div class="flex items-center gap-1">
                <!-- Events Indicator Badge -->
                <span v-if="dayObj.eventsCount > 0" class="w-2 h-2 rounded-full bg-blue-500" :title="`${dayObj.eventsCount} events`"></span>
                <!-- Notes Indicator Badge -->
                <span v-if="dayObj.notesCount > 0" class="w-2 h-2 rounded-full bg-amber-400" :title="`${dayObj.notesCount} notes`"></span>
              </div>
            </div>

            <!-- Previews -->
            <div class="space-y-1 mt-1">
              <div v-for="evt in dayObj.eventsPreview.slice(0, 1)" :key="evt.id" class="text-[10px] bg-blue-950/80 border border-blue-800/60 text-blue-300 px-1 py-0.5 rounded truncate font-medium">
                📅 {{ evt.title }}
              </div>
              <div v-for="note in dayObj.notesPreview.slice(0, 1)" :key="note.id" class="text-[10px] bg-amber-950/80 border border-amber-800/60 text-amber-300 px-1 py-0.5 rounded truncate font-medium">
                📝 {{ note.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Side Panel: Notes & Events for Selected Date (4 Cols) -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <span class="text-[10px] font-mono text-gray-400 uppercase">Selected Date</span>
              <h3 class="font-bold text-white text-base">{{ formatSelectedDate }}</h3>
            </div>
            <button @click="openAddNoteModal(selectedDateStr)" class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold">
              + Add Note
            </button>
          </div>

          <!-- Events on Date -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">Scheduled Events</h4>
            <div v-if="selectedDateEvents.length === 0" class="text-xs text-gray-500 italic p-3 bg-black/40 rounded border border-gray-800">
              No public events scheduled for this date.
            </div>
            <div v-else class="space-y-2">
              <div v-for="evt in selectedDateEvents" :key="evt.id" class="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg text-xs space-y-1">
                <div class="font-bold text-white flex justify-between">
                  <span>{{ evt.title }}</span>
                  <span class="text-[10px] text-blue-400 uppercase font-mono">{{ evt.type }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Calendar Notes on Date -->
          <div class="space-y-2 pt-2">
            <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">Team Calendar Notes</h4>
            <div v-if="selectedDateNotes.length === 0" class="text-xs text-gray-500 italic p-3 bg-black/40 rounded border border-gray-800">
              No notes for this date. Click "+ Add Note" to leave instructions for staff.
            </div>
            <div v-else class="space-y-2">
              <div v-for="note in selectedDateNotes" :key="note.id" class="p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-xs space-y-1 relative group">
                <div class="flex justify-between items-start">
                  <span class="font-bold text-white">{{ note.title }}</span>
                  <button @click="deleteNote(note.id)" class="text-gray-500 hover:text-red-400 text-xs">✕</button>
                </div>
                <p v-if="note.content" class="text-gray-300 text-xs">{{ note.content }}</p>
                <div class="flex justify-between items-center text-[10px] text-gray-400 font-mono pt-1">
                  <span class="px-1.5 py-0.5 bg-gray-900 border border-gray-700 rounded uppercase">{{ note.category }}</span>
                  <span>By {{ note.author_name || 'Staff' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Note Modal -->
    <div v-if="showAddNoteModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="font-bold text-white text-base">Add Note for {{ formatNoteDateModal }}</h3>
          <button @click="showAddNoteModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Date</label>
            <input v-model="noteForm.date" type="date" class="w-full bg-black border border-gray-700 rounded p-2 text-white font-mono" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Note Title *</label>
            <input v-model="noteForm.title" type="text" placeholder="e.g. VIP Soundcheck at 17:00 / Pizzeria extra dough prep" class="w-full bg-black border border-gray-700 rounded p-2 text-white" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Category Tag</label>
            <select v-model="noteForm.category" class="w-full bg-black border border-gray-700 rounded p-2 text-white">
              <option value="general">General</option>
              <option value="pizzeria">Pizzeria</option>
              <option value="club">Club Night</option>
              <option value="maintenance">Maintenance &amp; Sound</option>
              <option value="vip">VIP Table</option>
              <option value="private_event">Private Buyout</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Detailed Content</label>
            <textarea v-model="noteForm.content" rows="3" placeholder="Additional details for staff on duty..." class="w-full bg-black border border-gray-700 rounded p-2 text-white"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
          <button @click="showAddNoteModal = false" class="px-4 py-2 bg-gray-800 text-gray-300 rounded text-xs">Cancel</button>
          <button @click="saveNote" :disabled="savingNote" class="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-bold rounded text-xs">
            {{ savingNote ? 'Saving...' : 'Save Note' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CalendarIcon } from '@heroicons/vue/24/outline'

interface EventItem { id: string; title: string; date: string; type: string | null; }
interface CalendarNote {
  id: string
  date: string
  title: string
  content: string | null
  category: string
  author_name: string | null
  created_at: string
}

const currentDate = ref(new Date())
const selectedDateStr = ref(new Date().toISOString().split('T')[0])
const events = ref<EventItem[]>([])
const notes = ref<CalendarNote[]>([])
const loading = ref(false)
const showAddNoteModal = ref(false)
const savingNote = ref(false)

const noteForm = ref({
  date: new Date().toISOString().split('T')[0],
  title: '',
  content: '',
  category: 'general'
})

const currentYear = computed(() => currentDate.value.getFullYear())
const monthName = computed(() => currentDate.value.toLocaleDateString('en-US', { month: 'long' }))

const formatSelectedDate = computed(() => new Date(selectedDateStr.value).toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
const formatNoteDateModal = computed(() => new Date(noteForm.value.date).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' }))

const leadingBlanks = computed(() => {
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const day = firstDay.getDay() // 0=Sun, 1=Mon...
  return day === 0 ? 6 : day - 1
})

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = new Date().toISOString().split('T')[0]

  const list = []
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(d).padStart(2, '0')
    const dateStr = `${year}-${monthStr}-${dayStr}`

    const dayEvents = events.value.filter((e) => e.date.startsWith(dateStr))
    const dayNotes = notes.value.filter((n) => n.date === dateStr)

    list.push({
      dayNum: d,
      dateStr,
      isToday: dateStr === todayStr,
      eventsCount: dayEvents.length,
      notesCount: dayNotes.length,
      eventsPreview: dayEvents,
      notesPreview: dayNotes,
    })
  }
  return list
})

const selectedDateEvents = computed(() => events.value.filter((e) => e.date.startsWith(selectedDateStr.value)))
const selectedDateNotes = computed(() => notes.value.filter((n) => n.date === selectedDateStr.value))

const fetchMonthData = async () => {
  loading.value = true
  try {
    const year = currentDate.value.getFullYear()
    const monthStr = String(currentDate.value.getMonth() + 1).padStart(2, '0')
    const start = `${year}-${monthStr}-01`
    const end = `${year}-${monthStr}-31`

    const { $supabase } = useNuxtApp()
    const { data: evtData } = await $supabase
      .from('events')
      .select('id, title, date, type')
      .gte('date', start)
      .lte('date', end)
    events.value = evtData || []

    const notesData = await $fetch<CalendarNote[]>(`/api/admin/calendar-notes?start=${start}&end=${end}`)
    notes.value = notesData || []
  } catch (err) {
    console.error('Failed to fetch calendar month data:', err)
  } finally {
    loading.value = false
  }
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  fetchMonthData()
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  fetchMonthData()
}

const todayMonth = () => {
  currentDate.value = new Date()
  selectedDateStr.value = new Date().toISOString().split('T')[0]
  fetchMonthData()
}

const selectDate = (dateStr: string) => {
  selectedDateStr.value = dateStr
}

const openAddNoteModal = (dateStr: string) => {
  noteForm.value.date = dateStr
  noteForm.value.title = ''
  noteForm.value.content = ''
  noteForm.value.category = 'general'
  showAddNoteModal.value = true
}

const saveNote = async () => {
  if (!noteForm.value.title) {
    alert('Note title is required.')
    return
  }
  savingNote.value = true
  try {
    await $fetch('/api/admin/calendar-notes', {
      method: 'POST',
      body: noteForm.value
    })
    showAddNoteModal.value = false
    fetchMonthData()
  } catch (err: any) {
    alert(`Failed to save note: ${err.message}`)
  } finally {
    savingNote.value = false
  }
}

const deleteNote = async (id: string) => {
  if (!confirm('Delete this calendar note?')) return
  try {
    await $fetch(`/api/admin/calendar-notes?id=${id}`, { method: 'DELETE' })
    fetchMonthData()
  } catch (err: any) {
    alert(`Failed to delete note: ${err.message}`)
  }
}

onMounted(() => {
  fetchMonthData()
})

definePageMeta({ layout: 'admin' })
</script>