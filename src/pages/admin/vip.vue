<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold">VIP &amp; Guests</h1>
        <p class="text-gray-400 mt-1">Bottle-service reservations · table inventory · guest profiles</p>
      </div>
      <button @click="openNewReservation" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium">+ New Reservation</button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-700">
      <button v-for="t in tabs" :key="t.key" @click="activeTab = t.key"
              class="px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors"
              :class="activeTab === t.key ? 'border-red-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'">
        {{ t.label }}
        <span v-if="t.count !== undefined" class="ml-1.5 text-xs text-gray-500">{{ t.count }}</span>
      </button>
    </div>

    <!-- ══════════ RESERVATIONS TAB ══════════ -->
    <div v-if="activeTab === 'reservations'">
      <!-- Status columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="col in RES_COLUMNS" :key="col.key" class="bg-gray-800 rounded-xl p-4 border border-gray-700 min-h-[160px]"
             @dragover.prevent @drop="onDropStatus($event, col.key)">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide" :class="col.text">{{ col.label }}</h3>
            <span class="text-xs text-gray-500">{{ byStatus(col.key).length }}</span>
          </div>
          <div class="space-y-2">
            <article v-for="r in byStatus(col.key)" :key="r.id" draggable="true"
                     @dragstart="onDragStartRes($event, r)"
                     class="bg-gray-900 border rounded-lg p-3 cursor-grab active:cursor-grabbing"
                     :class="blacklistBorder(r)">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ r.guest_name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ r.event_label || 'No event' }}</p>
                </div>
                <button @click="removeReservation(r)" class="text-gray-600 hover:text-red-400 leading-none shrink-0">×</button>
              </div>
              <p class="text-[11px] text-gray-500 mt-1.5">
                {{ tableName(r.table_id) }} · {{ r.party_size || '?' }}p
                <template v-if="r.min_spend"> · min {{ fmtEur(r.min_spend) }}</template>
              </p>
              <p v-if="r.bottles_note" class="text-[11px] text-gray-400 mt-0.5 truncate">🍷 {{ r.bottles_note }}</p>
            </article>
            <p v-if="byStatus(col.key).length === 0" class="text-xs text-gray-600 text-center py-4">Drop here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ TABLES TAB ══════════ -->
    <div v-else-if="activeTab === 'tables'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="t in tables" :key="t.id" class="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold">{{ t.name }}</h3>
            <p class="text-xs text-gray-400">{{ t.location || '—' }}</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full border" :class="t.is_active ? 'bg-green-900/40 border-green-700/60 text-green-300' : 'bg-gray-900/60 border-gray-600 text-gray-400'">
            {{ t.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-500 block text-xs">Capacity</span>{{ t.capacity ?? '—' }} ppl</div>
          <div><span class="text-gray-500 block text-xs">Min spend</span><template v-if="t.min_spend">{{ fmtEur(t.min_spend) }}</template><template v-else>—</template></div>
        </div>
        <button @click="deleteTable(t)" class="mt-4 text-xs text-red-500 hover:text-red-400">Delete table</button>
      </div>

      <!-- Add table -->
      <div class="bg-gray-800/50 rounded-xl p-5 border border-dashed border-gray-700">
        <h3 class="font-semibold mb-3 text-sm">Add table</h3>
        <div class="space-y-2">
          <input v-model="tableForm.name" placeholder="Name (e.g. Stage Left)" class="vip-input" />
          <input v-model="tableForm.location" placeholder="Location (e.g. Mezzanine)" class="vip-input" />
          <div class="grid grid-cols-2 gap-2">
            <input v-model.number="tableForm.capacity" type="number" min="1" placeholder="Capacity" class="vip-input" />
            <input v-model.number="tableForm.min_spend" type="number" min="0" step="10" placeholder="Min spend €" class="vip-input" />
          </div>
          <button @click="saveTable" :disabled="!tableForm.name" class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-gray-400 rounded-lg text-sm font-medium">Add table</button>
        </div>
      </div>
    </div>

    <!-- ══════════ GUESTS TAB ══════════ -->
    <div v-else>
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <input v-model="guestSearch" type="search" placeholder="Search guests…" class="vip-input max-w-xs" />
        <label class="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" v-model="showBlacklisted" class="accent-red-500" />
          Show blacklisted only
        </label>
      </div>
      <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-900 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th class="px-4 py-3 text-left font-medium">Guest</th>
              <th class="px-4 py-3 text-left font-medium hidden md:table-cell">Contact</th>
              <th class="px-4 py-3 text-left font-medium">Tags</th>
              <th class="px-4 py-3 text-left font-medium">Visits</th>
              <th class="px-4 py-3 text-left font-medium hidden lg:table-cell">Last visit</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="g in filteredGuests" :key="g.id" :class="g.is_blacklisted ? 'opacity-60' : ''">
              <td class="px-4 py-3">
                <p class="font-medium">{{ g.name }}
                  <span v-if="g.is_blacklisted" class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-900/60 border border-red-700 text-red-300 align-middle">BLACKLISTED</span>
                </p>
                <p v-if="g.is_blacklisted && g.blacklist_reason" class="text-xs text-red-400 mt-0.5">{{ g.blacklist_reason }}</p>
              </td>
              <td class="px-4 py-3 text-gray-400 hidden md:table-cell">{{ g.email || g.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span v-for="tag in (g.tags || [])" :key="tag" class="inline-block mr-1 mb-0.5 text-[11px] px-2 py-0.5 rounded-full bg-gray-700 border border-gray-600 text-gray-300">{{ tag }}</span>
              </td>
              <td class="px-4 py-3 font-semibold">{{ g.visit_count ?? 0 }}</td>
              <td class="px-4 py-3 text-gray-400 hidden lg:table-cell">{{ fmtDate(g.last_visit_at) }}</td>
              <td class="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                <button v-if="!g.is_blacklisted" @click="toggleBlacklist(g, true)" class="text-yellow-500 hover:text-yellow-400 text-xs">Blacklist</button>
                <button v-else @click="toggleBlacklist(g, false)" class="text-green-500 hover:text-green-400 text-xs">Un-blacklist</button>
                <button @click="deleteGuest(g)" class="text-red-500 hover:text-red-400 text-xs">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredGuests.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">No guests{{ guestSearch ? ' match your search' : ' yet' }}.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New reservation modal -->
    <Teleport to="body">
      <div v-if="newResOpen" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="newResOpen = false">
        <div class="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">New Table Reservation</h3>
          <div class="space-y-3">
            <label class="block"><span class="text-xs text-gray-400 block mb-1">Event</span>
              <select v-model="resForm.eventKey" class="vip-input w-full">
                <option value="">— general / no event —</option>
                <option v-for="ev in raEvents" :key="ev.ra_id" :value="String(ev.ra_id)">{{ ev.title }} ({{ fmtDate(ev.date) }})</option>
              </select>
            </label>
            <label class="block"><span class="text-xs text-gray-400 block mb-1">Guest name *</span>
              <input v-model="resForm.guest_name" list="guest-names" class="vip-input w-full" placeholder="Type to search known guests…" />
              <datalist id="guest-names">
                <option v-for="g in guests" :key="g.id" :value="g.name" />
              </datalist>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="block"><span class="text-xs text-gray-400 block mb-1">Phone</span>
                <input v-model="resForm.guest_phone" class="vip-input w-full" placeholder="+386 …" />
              </label>
              <label class="block"><span class="text-xs text-gray-400 block mb-1">Table</span>
                <select v-model="resForm.table_id" class="vip-input w-full">
                  <option :value="''">— any —</option>
                  <option v-for="t in activeTables" :key="t.id" :value="t.id">{{ t.name }} ({{ t.capacity }}p)</option>
                </select>
              </label>
              <label class="block"><span class="text-xs text-gray-400 block mb-1">Party size</span>
                <input v-model.number="resForm.party_size" type="number" min="1" class="vip-input w-full" />
              </label>
              <label class="block"><span class="text-xs text-gray-400 block mb-1">Min spend €</span>
                <input v-model.number="resForm.min_spend" type="number" min="0" step="50" class="vip-input w-full" />
              </label>
            </div>
            <label class="block"><span class="text-xs text-gray-400 block mb-1">Bottles / notes</span>
              <textarea v-model="resForm.bottles_note" rows="2" class="vip-input w-full" placeholder="e.g. 1× Grey Goose, 1× champagne at midnight"></textarea>
            </label>
            <p v-if="resWarn" class="text-xs text-red-300 bg-red-900/40 border border-red-800/60 rounded p-2">{{ resWarn }}</p>
            <div class="flex gap-2 pt-1">
              <button @click="createReservation" :disabled="!validRes" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-gray-400 rounded-lg text-sm font-medium">Create</button>
              <button @click="newResOpen = false" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()

interface Guest { id: string; name: string; email: string | null; phone: string | null; tags: string[] | null; is_blacklisted: boolean | null; blacklist_reason: string | null; visit_count: number | null; last_visit_at: string | null }
interface VipTable { id: string; name: string; location: string | null; capacity: number | null; min_spend: number | null; is_active: boolean | null }
interface Reservation { id: string; event_ra_id: number | null; event_label: string | null; guest_id: string | null; guest_name: string; guest_phone: string | null; table_id: string | null; party_size: number | null; min_spend: number | null; bottles_note: string | null; status: string | null }
interface RaEventLite { ra_id: number; title: string; date: string }

const tabsDef = [
  { key: 'reservations', label: 'Reservations' },
  { key: 'tables', label: 'Tables' },
  { key: 'guests', label: 'Guests' }
] as const
type TabKey = (typeof tabsDef)[number]['key']

const activeTab = ref<TabKey>('reservations')

const reservations = ref<Reservation[]>([])
const tables = ref<VipTable[]>([])
const guests = ref<Guest[]>([])
const raEvents = ref<RaEventLite[]>([])
const loadingAll = ref(true)

const RES_COLUMNS = [
  { key: 'held', label: 'Held', text: 'text-gray-300' },
  { key: 'confirmed', label: 'Confirmed', text: 'text-blue-300' },
  { key: 'seated', label: 'Seated', text: 'text-green-300' },
  { key: 'cancelled', label: 'Cancelled / No-show', text: 'text-red-300' }
]

const tabs = computed(() => tabsDef.map((t) => ({
  ...t,
  count: t.key === 'reservations'
    ? reservations.value.filter((r) => !['cancelled', 'no-show'].includes(r.status || '')).length
    : t.key === 'tables' ? tables.value.filter((x) => x.is_active !== false).length
    : guests.value.length
})))

// ── Reservations board ──
const byStatus = (status: string) =>
  reservations.value.filter((r) =>
    status === 'cancelled' ? ['cancelled', 'no-show'].includes(r.status || '') : (r.status || 'held') === status
  )

let draggedResId: string | null = null
function onDragStartRes(e: DragEvent, r: Reservation) {
  draggedResId = r.id
}

async function onDropStatus(e: DragEvent, status: string) {
  e.preventDefault()
  if (!draggedResId) return
  const res = reservations.value.find((r) => r.id === draggedResId)
  draggedResId = null
  if (!res || res.status === status) return
  const { error } = await $supabase.from('table_reservations').update({ status }).eq('id', res.id)
  if (!error) res.status = status
}

async function removeReservation(r: Reservation) {
  if (!confirm(`Delete reservation for ${r.guest_name}?`)) return
  const { error } = await $supabase.from('table_reservations').delete().eq('id', r.id)
  if (!error) reservations.value = reservations.value.filter((x) => x.id !== r.id)
}

const tableName = (id: string | null) => {
  const t = tables.value.find((x) => x.id === id)
  return t ? t.name : 'Any table'
}

const blacklistBorder = (r: Reservation) => {
  const g = guests.value.find((x) => x.id === r.guest_id || x.name.toLowerCase() === r.guest_name.toLowerCase())
  return g?.is_blacklisted ? 'border-red-700/80' : 'border-gray-700'
}

// ── New reservation ──
const newResOpen = ref(false)
const resForm = ref({ eventKey: '', guest_name: '', guest_phone: '', table_id: '', party_size: 4, min_spend: 500, bottles_note: '' })

function openNewReservation() {
  resForm.value = { eventKey: '', guest_name: '', guest_phone: '', table_id: '', party_size: 4, min_spend: 500, bottles_note: '' }
  newResOpen.value = true
}

const matchedBlacklistedGuest = computed(() =>
  guests.value.find((g) => g.is_blacklisted && g.name.trim().toLowerCase() === resForm.value.guest_name.trim().toLowerCase())
)

const resWarn = computed(() => {
  if (matchedBlacklistedGuest.value) {
    return `⚠ ${matchedBlacklistedGuest.value.name} is BLACKLISTED${matchedBlacklistedGuest.value.blacklist_reason ? ' — ' + matchedBlacklistedGuest.value.blacklist_reason : ''}.`
  }
  return ''
})

const validRes = computed(() => resForm.value.guest_name.trim().length >= 2)

async function createReservation() {
  const f = resForm.value
  const ev = raEvents.value.find((x) => String(x.ra_id) === f.eventKey)
  const known = guests.value.find((g) => g.name.trim().toLowerCase() === f.guest_name.trim().toLowerCase())
  const payload = {
    event_ra_id: ev ? ev.ra_id : null,
    event_label: ev ? `${ev.title} — ${new Date(ev.date).toLocaleDateString('sl-SI')}` : null,
    guest_id: known?.id ?? null,
    guest_name: f.guest_name.trim(),
    guest_phone: f.guest_phone || null,
    table_id: f.table_id || null,
    party_size: f.party_size,
    min_spend: f.min_spend || null,
    bottles_note: f.bottles_note || null,
    status: 'held'
  }
  const { data, error } = await $supabase.from('table_reservations').insert(payload).select().single()
  if (error) {
    alert('Failed to create reservation: ' + error.message)
    return
  }
  reservations.value.unshift(data as unknown as Reservation)
  newResOpen.value = false
}

// ── Tables CRUD ──
const tableForm = ref({ name: '', location: '', capacity: 4, min_spend: undefined as number | undefined })
const activeTables = computed(() => tables.value.filter((t) => t.is_active !== false))

async function saveTable() {
  if (!tableForm.value.name) return
  const { data, error } = await $supabase.from('vip_tables')
    .insert({
      name: tableForm.value.name,
      location: tableForm.value.location || null,
      capacity: tableForm.value.capacity || 4,
      min_spend: tableForm.value.min_spend ?? null,
      is_active: true
    })
    .select().single()
  if (error) {
    alert('Failed to add table: ' + error.message)
    return
  }
  tables.value.push(data as unknown as VipTable)
  tableForm.value = { name: '', location: '', capacity: 4, min_spend: undefined }
}

async function deleteTable(t: VipTable) {
  if (!confirm(`Delete table "${t.name}"? Existing reservations keep their reference.`)) return
  const { error } = await $supabase.from('vip_tables').delete().eq('id', t.id)
  if (!error) tables.value = tables.value.filter((x) => x.id !== t.id)
}

// ── Guests tab ──
const guestSearch = ref('')
const showBlacklisted = ref(false)

const filteredGuests = computed(() =>
  guests.value.filter((g) => {
    if (showBlacklisted.value && !g.is_blacklisted) return false
    const q = guestSearch.value.trim().toLowerCase()
    if (!q) return true
    return `${g.name} ${g.email ?? ''} ${g.phone ?? ''} ${(g.tags || []).join(' ')}`.toLowerCase().includes(q)
  })
)

async function toggleBlacklist(g: Guest, blacklisted: boolean) {
  let reason = g.blacklist_reason
  if (blacklisted) {
    reason = prompt(`Reason for blacklisting ${g.name}?`) || reason || ''
    if (!reason) return
  }
  const { error } = await $supabase.from('guests')
    .update({ is_blacklisted: blacklisted, blacklist_reason: blacklisted ? reason : null })
    .eq('id', g.id)
  if (!error) {
    g.is_blacklisted = blacklisted
    g.blacklist_reason = blacklisted ? reason : null
  }
}

async function deleteGuest(g: Guest) {
  if (!confirm(`Delete ${g.name} permanently?`)) return
  const { error } = await $supabase.from('guests').delete().eq('id', g.id)
  if (!error) guests.value = guests.value.filter((x) => x.id !== g.id)
}

const fmtEur = (n: number) => new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(async () => {
  try {
    const [res, tbl, gst, ev] = await Promise.all([
      $supabase.from('table_reservations').select('*').order('created_at', { ascending: false }).limit(200),
      $supabase.from('vip_tables').select('*').order('name'),
      $supabase.from('guests').select('*').order('visit_count', { ascending: false }).limit(500),
      $supabase.from('ra_events').select('ra_id, title, date').gte('date', new Date().toISOString()).order('date').limit(30)
    ])
    if (!res.error) reservations.value = (res.data || []) as unknown as Reservation[]
    if (!tbl.error) tables.value = (tbl.data || []) as unknown as VipTable[]
    if (!gst.error) guests.value = (gst.data || []) as unknown as Guest[]
    if (!ev.error) raEvents.value = (ev.data || []) as unknown as RaEventLite[]
  } finally {
    loadingAll.value = false
  }
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.vip-input {
  @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>