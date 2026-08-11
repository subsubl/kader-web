<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">CRM Pipeline</h1>
      <p class="text-gray-400 mt-1">Track buyout & table inquiries: New → Discussion → Contracted → Invoiced</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
      <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
    </div>

    <!-- Empty -->
    <div v-else-if="inquiries.length === 0" class="bg-gray-800 rounded-xl p-16 text-center border border-gray-700">
      <p class="text-gray-400">No inquiries yet. Buyout/table leads will appear here.</p>
    </div>

    <!-- Kanban Columns -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="column in columns" :key="column.value" class="bg-gray-800 rounded-xl p-4 border border-gray-700 min-h-[300px]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-300">{{ column.label }}</h2>
          <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
            {{ columnInquiries(column.value).length }}
          </span>
        </div>

        <div 
          class="space-y-3"
          @dragover.prevent
          @drop="onDrop($event, column.value)"
        >
          <div 
            v-for="inq in columnInquiries(column.value)" 
            :key="inq.id"
            draggable="true"
            @dragstart="onDragStart($event, inq)"
            class="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 cursor-grab active:cursor-grabbing transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-medium">{{ inq.name }}</p>
                <p class="text-xs text-gray-400">{{ inq.email }}</p>
              </div>
              <span class="px-2 py-0.5 text-xs font-medium rounded-full capitalize" :class="typeClass(inq.type)">
                {{ inq.type }}
              </span>
            </div>
            <div v-if="inq.party_size" class="text-sm text-gray-400 mb-1">👥 {{ inq.party_size }} guests</div>
            <div v-if="inq.date" class="text-sm text-gray-400 mb-2">📅 {{ formatDate(inq.date) }}</div>
            <p v-if="inq.notes" class="text-sm text-gray-300 mb-3 line-clamp-2">{{ inq.notes }}</p>
            <div class="flex items-center justify-between text-xs">
              <span :class="statusDot(inq.status)" class="text-gray-400">{{ inq.status }}</span>
              <button @click="deleteInquiry(inq)" class="text-red-500 hover:text-red-400 transition-colors">Delete</button>
            </div>
          </div>

          <div v-if="columnInquiries(column.value).length === 0" class="text-center py-6 text-gray-600 text-sm border border-dashed border-gray-700 rounded-lg">
            Drop here
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Inquiry {
  id: string
  name: string
  email: string
  type: string | null
  party_size: number | null
  date: string | null
  notes: string | null
  status: string | null
}

const columns = [
  { label: 'New Inquiry', value: 'new' },
  { label: 'In Discussion', value: 'discussion' },
  { label: 'Contracted', value: 'contracted' },
  { label: 'Invoiced', value: 'invoiced' }
]

const inquiries = ref<Inquiry[]>([])
const loading = ref(false)
let draggedInquiry: Inquiry | null = null

const columnInquiries = (col: string) => inquiries.value.filter(i => (i.status || 'new') === col)

const typeClass = (type: string | null) => {
  const classes: Record<string, string> = {
    buyout: 'bg-purple-900/30 text-purple-300',
    table: 'bg-blue-900/30 text-blue-300',
    corporate: 'bg-yellow-900/30 text-yellow-300',
    private: 'bg-green-900/30 text-green-300'
  }
  return `px-2 py-0.5 text-xs font-medium rounded-full capitalize ${classes[type || 'table'] || classes.table}`
}

const statusDot = (status: string | null) => {
  const colors: Record<string, string> = {
    new: 'text-blue-400',
    discussion: 'text-yellow-400',
    contracted: 'text-green-400',
    invoiced: 'text-red-400'
  }
  return colors[status || 'new'] || 'text-gray-400'
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })
}

const onDragStart = (e: DragEvent, inq: Inquiry) => {
  draggedInquiry = inq
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const onDrop = async (e: DragEvent, targetColumn: string) => {
  if (!draggedInquiry) return
  e.preventDefault()

  const newStatus = targetColumn
  const inq = draggedInquiry
  draggedInquiry = null

  if ((inq.status || 'new') === newStatus) return

  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('inquiries').update({ status: newStatus }).eq('id', inq.id)
    if (error) throw error
    inq.status = newStatus
  } catch (err: any) {
    console.error('Failed to move inquiry:', err)
    alert('Failed to move inquiry.')
  }
}

const deleteInquiry = async (inq: Inquiry) => {
  if (!confirm(`Delete lead "${inq.name}"?`)) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('inquiries').delete().eq('id', inq.id)
    if (error) throw error
    inquiries.value = inquiries.value.filter(i => i.id !== inq.id)
  } catch (err: any) {
    console.error('Failed to delete inquiry:', err)
  }
}

const fetchInquiries = async () => {
  loading.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    inquiries.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch inquiries:', err)
    alert('Failed to load inquiries.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchInquiries)

definePageMeta({ layout: 'admin' })
</script>