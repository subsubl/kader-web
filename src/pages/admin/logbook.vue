<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold">Manager Logbook</h1>
        <p class="text-gray-400 mt-1">Daily handover, incidents, maintenance & VIP notes — searchable ops journal</p>
      </div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium">+ New Entry</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <select v-model="filterCategory" class="filter-select">
        <option value="">All categories</option>
        <option value="handover">Handover</option>
        <option value="incident">Incident</option>
        <option value="maintenance">Maintenance</option>
        <option value="vip">VIP</option>
        <option value="general">General</option>
      </select>
      <input v-model="search" type="search" placeholder="Search entries…" class="filter-select max-w-xs" />
      <span class="text-sm text-gray-500">{{ filteredEntries.length }} entries</span>
    </div>

    <!-- New entry form -->
    <div v-if="showForm" class="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label class="block">
          <span class="text-xs text-gray-400 block mb-1">Date</span>
          <input v-model="form.entry_date" type="date" class="filter-select w-full" />
        </label>
        <label class="block">
          <span class="text-xs text-gray-400 block mb-1">Category</span>
          <select v-model="form.category" class="filter-select w-full">
            <option value="handover">Handover</option>
            <option value="incident">Incident</option>
            <option value="maintenance">Maintenance</option>
            <option value="vip">VIP</option>
            <option value="general">General</option>
          </select>
        </label>
        <label class="block">
          <span class="text-xs text-gray-400 block mb-1">Link to event (optional)</span>
          <select v-model="form.event_id" class="filter-select w-full">
            <option :value="null">— none —</option>
            <option v-for="e in events" :key="e.id" :value="e.id">{{ e.title }}</option>
          </select>
        </label>
      </div>
      <textarea v-model="form.content" rows="3" placeholder="What happened? Handover notes, incidents, broken equipment, VIP arrivals…" class="filter-select w-full"></textarea>
      <div class="flex items-center gap-2">
        <button @click="saveEntry" :disabled="!form.content.trim() || saving"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-lg text-sm font-medium">
          {{ saving ? 'Saving…' : 'Save entry' }}
        </button>
        <button @click="showForm = false" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">Cancel</button>
      </div>
    </div>

    <!-- Entries timeline -->
    <div v-if="loading" class="text-center py-16 text-gray-400">Loading…</div>
    <div v-else-if="filteredEntries.length === 0" class="text-center py-16 text-gray-500">
      No entries{{ filterCategory || search ? ' match your filters' : ' yet' }}.
    </div>
    <div v-else class="space-y-3">
      <article v-for="e in filteredEntries" :key="e.id"
               class="bg-gray-800 border rounded-xl p-4"
               :class="categoryBorder(e.category)">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border" :class="categoryChip(e.category)">
                {{ e.category }}
              </span>
              <span class="text-sm font-semibold">{{ prettyDate(e.entry_date) }}</span>
              <span v-if="e.event_title" class="text-xs text-gray-400">→ {{ e.event_title }}</span>
            </div>
            <p class="text-sm text-gray-200 whitespace-pre-line">{{ e.content }}</p>
            <p class="text-[11px] text-gray-500 mt-2">{{ e.author_name || 'staff' }} · {{ fmtDateTime(e.created_at) }}</p>
          </div>
          <button @click="deleteEntry(e)" class="text-red-500 hover:text-red-400 text-sm shrink-0">Delete</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()

interface LogEntry {
  id: string
  entry_date: string
  category: string
  content: string
  event_id: string | null
  author_id: string | null
  author_name: string | null
  created_at: string | null
  event_title?: string | null
}

interface EventItem { id: string; title: string }

const entries = ref<LogEntry[]>([])
const events = ref<EventItem[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const filterCategory = ref('')
const search = ref('')

const form = ref({
  entry_date: new Date().toISOString().slice(0, 10),
  category: 'handover',
  content: '',
  event_id: null as string | null
})

const filteredEntries = computed(() => {
  const q = search.value.trim().toLowerCase()
  return entries.value.filter((e) => {
    if (filterCategory.value && e.category !== filterCategory.value) return false
    if (q && !(`${e.content} ${e.author_name ?? ''}`.toLowerCase().includes(q))) return false
    return true
  })
})

const prettyDate = (d: string) => {
  const dt = new Date(d + (d.length === 10 ? 'T12:00:00' : ''))
  return dt.toLocaleDateString('sl-SI', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
const fmtDateTime = (d: string | null) =>
  d ? new Date(d).toLocaleString('sl-SI', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''

const categoryChip = (c: string) => ({
  handover: 'bg-blue-900/40 border-blue-700/60 text-blue-300',
  incident: 'bg-red-900/40 border-red-700/60 text-red-300',
  maintenance: 'bg-yellow-900/40 border-yellow-700/60 text-yellow-300',
  vip: 'bg-purple-900/40 border-purple-700/60 text-purple-300',
  general: 'bg-gray-900/60 border-gray-600 text-gray-300'
}[c] || 'bg-gray-900/60 border-gray-600 text-gray-300')

const categoryBorder = (c: string) => ({
  incident: 'border-red-900/70',
  maintenance: 'border-yellow-900/70',
  vip: 'border-purple-900/70'
}[c] || 'border-gray-700')

async function fetchEntries() {
  loading.value = true
  try {
    const { data, error } = await $supabase
      .from('logbook_entries')
      .select('id, entry_date, category, content, event_id, author_id, author_name, created_at, events(title)')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(300)
    if (error) throw error
    entries.value = ((data || []) as any[]).map((n) => ({ ...n, event_title: n.events?.title ?? null }))
  } catch (err: any) {
    console.error('Failed to load logbook:', err)
  } finally {
    loading.value = false
  }
}

async function fetchEvents() {
  try {
    const { data } = await $supabase.from('events').select('id, title').order('date', { ascending: false }).limit(100)
    events.value = (data || []) as EventItem[]
  } catch { /* optional */ }
}

async function saveEntry() {
  saving.value = true
  try {
    let authorName: string | null = null
    let authorId: string | null = null
    const { data: { user } } = await $supabase.auth.getUser()
    if (user) {
      authorId = user.id
      const meta: any = user.user_metadata || {}
      authorName = meta.full_name || meta.name || user.email || null
    }
    const { data, error } = await $supabase
      .from('logbook_entries')
      .insert({
        entry_date: form.value.entry_date,
        category: form.value.category,
        content: form.value.content.trim(),
        event_id: form.value.event_id,
        author_id: authorId,
        author_name: authorName
      })
      .select('id, entry_date, category, content, event_id, author_id, author_name, created_at')
      .single()
    if (error) throw error
    const row = data as LogEntry
    const evTitle = events.value.find((e) => e.id === row.event_id)?.title ?? null
    entries.value.unshift({ ...row, event_title: evTitle })
    form.value.content = ''
    showForm.value = false
  } catch (err: any) {
    alert('Failed to save entry: ' + (err?.message || 'unknown'))
  } finally {
    saving.value = false
  }
}

async function deleteEntry(e: LogEntry) {
  if (!confirm('Delete this entry?')) return
  const { error } = await $supabase.from('logbook_entries').delete().eq('id', e.id)
  if (!error) entries.value = entries.value.filter((x) => x.id !== e.id)
}

onMounted(() => {
  fetchEntries()
  fetchEvents()
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.filter-select {
  @apply px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>