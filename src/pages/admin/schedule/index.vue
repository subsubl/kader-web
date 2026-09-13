<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl Monospace font-bold">Staff Scheduling</h1>
        <p class="text-gray-400 mt-1">Week view · shift templates · assignments · conflict detection</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button @click="prevWeek" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">←</button>
        <span class="px-3 py-2 text-sm text-gray-300">{{ weekLabel }}</span>
        <button @click="nextWeek" class="px-3 py-2 bg-gray-700 hover:bg-660 rounded-lg text-sm">→</button>
        <button @click="goToday" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">Today</button>
        <button @click="generateFromTemplates" :disabled="generating" class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-lg text-sm font-medium">
          {{ generating ? 'Generating…' : 'Generate from templates' }}
        </button>
        <button @click="exportCsv" class="CSV px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">Export CSV</button>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span v-for="r in ROLES" :key="r" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs">
        <span class="w-2.5 h-2.5 rounded-full" :class="roleColor(r)"></span>{{ r }}
      </span>
    </div>

    <!-- Week grid: one row per role, one column per day -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto mb-8">
      <div class="grid grid-cols-[140px_repeat(7,minmax(120px,1fr))] min-w-[1080px]">
        <!-- Header row -->
        <div class="p-3 text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-700 bg-gray-900 sticky left-0 z-10">Shifts / Role</div>
        <div v-for="d in weekDays" :key="d.iso" class="p-3 border-b border-l border-gray-700 bg-gray-900">
          <p class="font-semibold">{{ d.label }}</p>
          <p class="text-xs text-gray-400">{{ d.dateNum }}.</p>
        </div>

        <!-- One row per role -->
        <template v-for="role in ROLES" :key="role">
          <div class="p-3 border-b border-gray-700 bg-gray-900/50 flex items-center gap-2 sticky left-0 z-10">
            <span class="w-2.5 h-2.5 rounded-full" :class="roleColor(role)"></span>
            <span class="text-sm capitalize">{{ role }}</span>
          </div>
          <div
            v-for="day in weekDays"
            :key="role + day.iso"
            class="border-b border-l border-gray-700 p-2 space-y-2 min-h-[96px]"
            @dragover.prevent
            @drop="onDrop($event, day.iso, role)"
          >
            <div
              v-for="shift in shiftsFor(day.iso, role)"
              :key="shift.id"
              class="bg-gray-900 border rounded-lg p-2 cursor-grab active:cursor-grabbing"
              :class="shift.status === 'cancelled' ? 'border-gray-800 opacity-50' : understaffed(shift) ? 'border-yellow-600/70' : 'border-gray-700'"
              draggable="true"
              @dragstart="onDragStart($event, shift)"
            >
              <div class="flex justify-between items-start gap-1">
                <span class="text-xs font-mono">{{ fmtTime(shift.start_time) }}–{{ fmtTime(shift.end_time) }}</span>
                <button @click.stop="deleteShift(shift)" class="text-red-500 hover:text-red-400 leading-none">×</button>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">{{ shift.location || '—' }}</p>
              <div class="mt-1.5 flex flex-wrap gap-1">
                <span
                  v-for="a in (assignmentsByShift[shift.id] || [])"
                  :key="a.id"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-800 border text-[10px]"
                  :class="assignmentBorder(a.status)"
                >
                  {{ a.user_name }}
                  <button @click.stop="removeAssignment(a)" class="hover:text-red-400">×</button>
                </span>
                <span v-if="understaffed(shift)" class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/40 border border-yellow-700/60 text-yellow-300">
                  needs {{ shift.required_count - (assignmentsByShift[shift.id] || []).length }}
                </span>
              </div>
            </div>
            <button @click="openNewShift(day.iso, role)" class="w-full text-left text-xs text-gray-500 hover:text-gray-300 px-1">+ add shift</button>
          </div>
        </template>
      </div>
    </div>

    <!-- Templates + conflicts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Templates -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Shift Templates</h2>
          <button @click="showTemplateForm = !showTemplateForm" class="px-3 py-1.5 text-sm bg-red-6 hover:bg-red-700 rounded-lg">+ New</button>
        </div>
        <div v-if="showTemplateForm" class="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
          <input v-model="tplForm.name" placeholder="Template name" class="input-field" />
          <div class="grid grid-cols-2 gap-3">
            <select v-model.number="tplForm.day_of_week" class="input-field">
              <option v-for="(n, i) in DAY_NAMES" :key="i" :value="i">{{ n }}</option>
            </select>
            <select v-model="tplForm.role" class="input-field">
              <option v-for="r in ROLES" :key="r" :value="r" class="capitalize">{{ r }}</option>
            </select>
            <input v-model="tplForm.start_time" type="time" class="input-field" />
            <input v-model="tplForm.end_time" type="time" class="input-field" />
            <input v-model.number="tplForm.required_count" type="number" min="1" class="input-field" placeholder="Staff count" />
            <input v-model="tplForm.location" placeholder="Location (optional)" class="input-field" />
          </div>
          <button @click="saveTemplate" :disabled="!tplForm.name || savingTpl" class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-lg text-sm font-medium">
            {{ savingTpl ? 'Saving…' : 'Save template' }}
          </button>
        </div>
        <div v-if="templates.length === 0" class="text-center py-6 text-gray-500 text-sm">No templates yet.</div>
        <div v-else class="space-y-2 max-h-[420px] overflow-auto pr-1">
          <div v-for="t in templates" :key="t.id" class="flex items-center justify-between gap-2 p-3 bg-gray-700 rounded-lg">
            <div>
              <p class="text-sm font-medium">{{ t.name }}</p>
              <p class="text-xs text-gray-400">
                {{ DAY_NAMES[tplDayIdx(t.day_of_week)] }} · {{ fmtTime(t.start_time) }}–{{ fmtTime(t.end_time) }} · {{ t.role }} ×{{ t.required_count }}{{ t.location ? ' · ' + t.location : '' }}
              </p>
            </div>
            <button @click="deleteTemplate(t)" class="text-red-500 hover:text-red-400 text-sm shrink-0">Delete</button>
          </div>
        </div>
      </div>

      <!-- Conflict report -->
      <div panel class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Conflict Report</h2>
        <div v-if="conflicts.length === 0" class="text-center py-6 text-green-400 text-sm">✓ No conflicts this week</div>
        <div v-else class="space-y-2 max-h-[420px] m-auto pr-1">
          <div v-for="(c, i) in conflicts" :key="i" class="p-3 bg-red-900/30 border border-red-800/60 rounded-lg text-sm">
            <p class="font-medium text-red-300">{{ conflictTitle(c.type) }}</p>
            <p class="text-gray-300 mt-0.5">{{ c.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New-shift modal -->
    <Teleport to="body">
      <div v-if="newShiftOpen" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="newShiftOpen = false">
        <div class="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">New Shift — {{ prettyDate(newShiftForm.date) }} · {{ newShiftForm.role }}</h3>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <label class="text-xs text-gray-400 block">Start<input v-model="newShiftForm.start_time" type="time" class="input-field mt-1" /></label>
              <label class="text-xs text-gray-400 block">End<input v-model="newShiftForm.end_time" type="time" class="input-field mt-1" /></label>
              <label class="text-xs text-gray-400 block">Staff needed<input v-model.number="newShiftForm.required_count" type="number" min="1" class="input-field mt-1" /></label>
              <label class="text-xs text-gray-400 block">Location<input v-model="newShiftForm.location" class="input-field mt-1" /></label>
            </div>
            <label class="block text-xs text-gray-400">Assign staff member
              <select v-model="newShiftForm.assigneeId" class="input-field mt-1">
                <option value="">— none —</option>
                <option v-for="s in staffOptions" :key="s.id" :value="s.id">{{ s.name }} ({{ s.email }})</option>
              </select>
            </label>
            <p v-if="assignWarn" class="text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-800/60 rounded p-2">{{ assignWarn }}</p>
            <div class="flex gap-2 pt-1">
              <button @click="createShift" :disabled="!validNewShift" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-gray-400 rounded-lg text-sm font-medium">Create</button>
              <button @click="newShiftOpen = false" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { DbStaffRole } from '~/types/database'

const { $supabase } = useNuxtApp()

const ROLES: DbStaffRole[] = ['bar', 'door', 'kitchen', 'floor', 'manager', 'security', 'cleanup']
// Template day_of_week stored 0=Sun..6=Sat (matches Postgres EXTRACT(DOW)); display Monday-first.
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Template { id: string; name: string; description: string | null; day_of_week: number; start_time: string; end_time: string; role: DbStaffRole; required_count: number; location: string | null; is_active: boolean | null }
interface Shift { id: string; template_id: string | null; date: string; start_time: string; end_time: string; role: DbStaffRole; required_count: number; location: string | null; status: string | null; notes: string | null }
interface Assignment { id: string; shift_id: string; user_id: string; user_name: string; user_email: string; status: string | null }
interface Conflict { type: 'overlap' | 'double' | 'understaffed'; message: string }

const templates = ref<Template[]>([])
const shifts = ref<Shift[]>([])
const assignments = ref<Assignment[]>([])
const generating = ref(false)
const savingTpl = ref(false)
const showTemplateForm = ref(false)

// ── Week navigation (Monday-based) ──
function mondayOf(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}
const pad = (n: number) => String(n).padStart(2, '0')
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const weekStart = ref<Date>(mondayOf(new Date()))

const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + i)
  return { iso: isoDate(d), label: DAY_NAMES[i].slice(0, 3), dateNum: `${d.getDate()}.${d.getMonth() + 1}` }
}))

const weekLabel = computed(() => {
  const end = new Date(weekStart.value); end.setDate(end.getDate() + 6)
  const f = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`
  return `${f(weekStart.value)} – ${f(end)} ${end.getFullYear()}`
})

const prevWeek = () => { const d = new Date(weekStart.value); d.setDate(d.getDate() - 7); weekStart.value = d }
const nextWeek = () => { const d = new Date(weekStart.value); d.setDate(d.getDate() + 7); weekStart.value = d }
function goToday() { weekStart.value = mondayOf(new Date()) }

const prettyDate = (iso: string) => {
  const [y, m, dd] = iso.split('-').map(Number)
  void y
  return `${dd}.${m}.`
}
const fmtTime = (t: string | null) => (t ? t.slice(0, 5) : '')
const tplDayIdx = (dow: number) => (dow + 6) % 7 // DB 0=Sun → Monday-first index

// ── Data access ──
async function fetchTemplates() {
  const { data, error } = await $supabase.from('shift_templates').select('*').order('day_of_week').order('start_time')
  if (!error) templates.value = (data || []) as unknown as Template[]
}

async function fetchWeekData() {
  const startIso = isoDate(weekStart.value)
  const endD = new Date(weekStart.value); endD.setDate(endD.getDate() + 7)
  const endIso = isoDate(endD)
  const [sh, asg] = await Promise.all([
    $supabase.from('shifts').select('*').gte('date', startIso).lt('date', endIso).order('start_time'),
    $supabase.from('shift_assignments').select('*')
  ])
  if (!sh.error) shifts.value = (sh.data || []) as unknown as Shift[]
  if (!asg.error) assignments.value = (asg.data || []) as unknown as Assignment[]
}

async function refreshAll() {
  await Promise.all([fetchTemplates(), fetchWeekData()])
}

const assignmentsByShift = computed<Record<string, Assignment[]>>(() => {
  const map: Record<string, Assignment[]> = {}
  for (const a of assignments.value) (map[a.shift_id] ||= []).push(a)
  return map
})

function shiftsFor(iso: string, role: DbStaffRole) {
  return shifts.value.filter(s => s.date === iso && s.role === role)
}

const understaffed = (s: Shift) =>
  (assignmentsByShift.value[s.id] || []).length < s.required_count

const assignmentBorder = (status: string | null) =>
  status === 'pending' ? 'border-yellow-600 text-yellow-300' : status === 'declined' ? 'border-red-700 text-red-300 line-through' : 'border-green-700 text-green-300'

const roleColor = (role: string) => ({
  bar: 'bg-yellow-500',
  door: 'bg-blue-500',
  kitchen: 'bg-orange-500',
  floor: 'bg-green-500',
  manager: 'bg-purple-500',
  security: 'bg-red-500',
  cleanup: 'bg-gray-500'
}[role] || 'bg-gray-500')

const conflictTitle = (type: Conflict['type']) =>
  type === 'overlap' ? 'Overlapping shifts' : type === 'double' ? 'Double-booked staff' : 'Understaffed shift'

// ── Drag & drop: move a shift to another cell (same role) ──
let draggedShiftId: string | null = null

function onDragStart(_e: DragEvent, shift: Shift) {
  draggedShiftId = shift.id
}

async function onDrop(e: DragEvent, iso: string, role: DbStaffRole) {
  e.preventDefault()
  if (!draggedShiftId) return
  const source = shifts.value.find(s => s.id === draggedShiftId)
  draggedShiftId = null
  if (!source) return
  if (source.role !== role) {
    alert('Cannot move a shift between different roles.')
    return
  }
  if (source.date === iso) return
  // Conflict check for each assigned user against the target day
  const assigned = assignmentsByShift.value[source.id] || []
  for (const a of assigned) {
    const warn = detectConflictsFor(iso, source.start_time, source.end_time, a.user_email, source.id)
    if (warn) {
      if (!confirm(`${warn}\n\nMove anyway?`)) return
      break
    }
  }
  const { error } = await $supabase.from('shifts').update({ date: iso }).eq('id', source.id)
  if (error) {
    alert('Failed to move shift: ' + error.message)
    return
  }
  await fetchWeekData()
}

// ── New shift modal ──
const newShiftOpen = ref(false)
const newShiftForm = ref({ date: '', role: 'bar' as DbStaffRole, start_time: '21:00', end_time: '04:00', required_count: 1, location: '', assigneeId: '' })

function openNewShift(iso: string, role: DbStaffRole) {
  newShiftForm.value = { date: iso, role, start_time: '21:00', end_time: '04:00', required_count: 1, location: '', assigneeId: '' }
  newShiftOpen.value = true
}

const staffById = computed<Record<string, { id: string; email: string; name: string }>>(() => {
  const map: Record<string, { id: string; email: string; name: string }> = {}
  for (const s of staffOptions.value) map[s.id] = s
  return map
})

const assignWarn = computed(() => {
  const f = newShiftForm.value
  if (!f.assigneeId) return ''
  const st = staffById.value[f.assigneeId]
  if (!st) return ''
  return detectConflictsFor(f.date, f.start_time, f.end_time, st.email, null)
})

const validNewShift = computed(() => {
  const f = newShiftForm.value
  return !!f.date && f.start_time < f.end_time && f.required_count >= 1
})

async function createShift() {
  const f = newShiftForm.value
  const { data, error } = await $supabase
    .from('shifts')
    .insert({
      date: f.date,
      start_time: f.start_time,
      end_time: f.end_time,
      role: f.role,
      required_count: f.required_count,
      location: f.location || null,
      status: 'open'
    })
    .select()
    .single()
  if (error) {
    alert('Failed to create shift: ' + error.message)
    return
  }
  const shift = data as unknown as Shift
  if (f.assigneeId && shift) {
    const ins = await assignStaff(shift.id, f.assigneeId)
    if (ins) alert(ins)
  }
  newShiftOpen.value = false
  await fetchWeekData()
}

async function assignStaff(shiftId: string, userId: string): Promise<string | null> {
  const st = staffById.value[userId]
  if (!st) return 'Unknown staff member.'
  const { error } = await $supabase.from('shift_assignments').insert({
    shift_id: shiftId,
    user_id: st.id,
    user_name: st.name,
    user_email: st.email
  })
  return error ? ('Assignment failed: ' + error.message) : null
}

async function deleteShift(shift: Shift) {
  if (!confirm('Delete this shift?')) return
  const { error } = await $supabase.from('shifts').delete().eq('id', shift.id)
  if (!error) {
    shifts.value = shifts.value.filter(s => s.id !== shift.id)
    assignments.value = assignments.value.filter(a => a.shift_id !== shift.id)
  }
}

async function removeAssignment(a: Assignment) {
  const { error } = await $supabase.from('shift_assignments').delete().eq('id', a.id)
  if (!error) assignments.value = assignments.value.filter(x => x.id !== a.id)
}

// ── Templates CRUD ──
const tplForm = ref({ name: '', day_of_week: 5, role: 'bar' as DbStaffRole, start_time: '21:00', end_time: '04:00', required_count: 1, location: '' })

async function saveTemplate() {
  savingTpl.value = true
  try {
    const { error } = await $supabase.from('shift_templates').insert({
      name: tplForm.value.name,
      description: null,
      day_of_week: tplForm.value.day_of_week,
      start_time: tplForm.value.start_time,
      end_time: tplForm.value.end_time,
      role: tplForm.value.role,
      required_count: tplForm.value.required_count,
      location: tplForm.value.location || null
    })
    if (error) throw error
    tplForm.value = { name: '', day_of_week: 5, role: 'bar', start_time: '21:00', end_time: '04:00', required_count: 1, location: '' }
    showTemplateForm.value = false
    await fetchTemplates()
  } catch (e: any) {
    alert('Failed to save template: ' + (e?.message || 'unknown error'))
  } finally {
    savingTpl.value = false
  }
}

async function deleteTemplate(t: Template) {
  if (!confirm('Delete this template?')) return
  const { error } = await $supabase.from('shift_templates').delete().eq('id', t.id)
  if (!error) templates.value = templates.value.filter(x => x.id !== t.id)
}

// ── Generate the visible week from active templates ──
async function generateFromTemplates() {
  generating.value = true
  try {
    const rows = templates.value
      .filter(t => t.is_active !== false)
      .map(t => {
        // DB day_of_week 0=Sun..6=Sat → offset from Monday
        const offset = (t.day_of_week + 6) % 7
        const d = new Date(weekStart.value)
        d.setDate(d.getDate() + offset)
        return {
          template_id: t.id,
          date: isoDate(d),
          start_time: t.start_time,
          end_time: t.end_time,
          role: t.role,
          required_count: t.required_count,
          location: t.location,
          status: 'open'
        }
      })
    if (rows.length === 0) {
      alert('No active templates found.')
      return
    }
    const { error } = await $supabase
      .from('shifts')
      .upsert(rows, { onConflict: 'date,start_time,end_time,role,location', ignoreDuplicates: true })
    if (error) throw error
    await fetchWeekData()
    alert(`Generated ${rows.length} shifts for ${weekLabel.value}`)
  } catch (e: any) {
    alert('Failed to generate shifts: ' + (e?.message || 'unknown'))
  } finally {
    generating.value = false
  }
}

// ── Conflict detection ──
const conflicts = computed<Conflict[]>(() => {
  const list: Conflict[] = []
  for (const s of shifts.value) {
    if (understaffed(s)) {
      const n = (assignmentsByShift.value[s.id] || []).length
      list.push({ type: 'understaffed', message: `${prettyDate(s.date)} · ${fmtTime(s.start_time)}–${fmtTime(s.end_time)} (${s.role}) needs ${s.required_count - n} more` })
    }
  }
  const byUser: Record<string, Shift[]> = {}
  for (const s of shifts.value) {
    for (const a of (assignmentsByShift.value[s.id] || [])) {
      (byUser[a.user_email] ||= []).push(s)
    }
  }
  for (const [email, userShifts] of Object.entries(byUser)) {
    const sorted = [...userShifts].sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const A = sorted[i], B = sorted[j]
        if (A.date !== B.date) continue
        if (A.start_time < B.end_time && B.start_time < A.end_time) {
          list.push({ type: 'double', message: `${email} double-booked on ${prettyDate(A.date)} (${fmtTime(A.start_time)}–${fmtTime(A.end_time)} overlaps ${fmtTime(B.start_time)}–${fmtTime(B.end_time)})` })
        }
      }
    }
  }
  return list
})

function detectConflictsFor(date: string, start: string, end: string, email: string, excludeShiftId: string | null): string {
  if (!email) return ''
  for (const s of shifts.value) {
    if (s.id === excludeShiftId || s.date !== date) continue
    if (start < s.end_time && s.start_time < end) {
      const emails = (assignmentsByShift.value[s.id] || []).map(a => a.user_email)
      if (emails.includes(email)) {
        return `⚠ ${email} already has an overlapping shift (${fmtTime(s.start_time)}–${fmtTime(s.end_time)}) on ${prettyDate(date)}.`
      }
    }
  }
  return ''
}

// ── CSV export ──
function exportCsv() {
  const header = ['date', 'weekday', 'role', 'start', 'end', 'location', 'required', 'assigned_count', 'assigned_to']
  const lines = [header.join(',')]
  const sorted = [...shifts.value].sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))
  for (const s of sorted) {
    const assigned = assignmentsByShift.value[s.id] || []
    const wd = DAY_NAMES[(new Date(s.date + 'T12:00:00').getDay() + 6) % 7]
    lines.push([
      s.date, wd, s.role, s.start_time, s.end_time, s.location || '', String(s.required_count), String(assigned.length),
      '"' + assigned.map(a => a.user_name).join('; ') + '"'
    ].join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kader-schedule-${isoDate(weekStart.value)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Staff directory + initial load ──
const staffOptions = ref<Array<{ id: string; email: string; name: string }>>([])

onMounted(async () => {
  try {
    const res = (await $fetch('/api/admin/staff')) as Array<{ id: string; email: string; name: string }>
    staffOptions.value = res || []
  } catch {
    staffOptions.value = []
  }
  await refreshAll()
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>