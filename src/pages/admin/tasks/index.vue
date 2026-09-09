<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono tracking-wider">
            VENUE OPERATIONAL CHECKLISTS
          </span>
          <span class="text-xs text-gray-400 font-mono">Today: {{ todayFormatted }}</span>
        </div>
        <h1 class="text-2xl font-extrabold text-white mt-1 tracking-tight">Internal Operational Tasks</h1>
        <p class="text-xs text-gray-400">Daily, one-time, and repeating venue maintenance & shift tasks.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="fetchTasks" 
          class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" /> Refresh Tasks
        </button>

        <button 
          @click="showCreateModal = true" 
          class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <PlusIcon class="w-4 h-4" /> Add Task
        </button>
      </div>
    </div>

    <!-- Tabs & Filter Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="flex gap-2 border-b sm:border-b-0 border-gray-800 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto">
        <button 
          @click="viewMode = 'today'"
          :class="viewMode === 'today' ? 'bg-red-600 text-white font-bold' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
          class="px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2"
        >
          <CheckCircleIcon class="w-4 h-4 text-emerald-300" />
          Today's Tasks ({{ todayTasks.length }})
        </button>

        <button 
          @click="viewMode = 'all'"
          :class="viewMode === 'all' ? 'bg-red-600 text-white font-bold' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
          class="px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2"
        >
          <ListBulletIcon class="w-4 h-4 text-blue-300" />
          All Tasks Manager ({{ allTasks.length }})
        </button>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-gray-400">Category:</span>
        <select v-model="selectedCategory" class="bg-black border border-gray-700 text-white rounded px-3 py-1.5 font-mono focus:outline-none focus:border-red-500">
          <option value="all">All Categories</option>
          <option value="bar">Bar &amp; Beverages</option>
          <option value="door">Door &amp; Reception</option>
          <option value="kitchen">Kitchen &amp; Food</option>
          <option value="maintenance">Sound &amp; Maintenance</option>
          <option value="security">Security</option>
          <option value="general">General</option>
        </select>
      </div>
    </div>

    <!-- Tasks List Container -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <ClipboardDocumentCheckIcon class="w-5 h-5 text-emerald-400" />
          {{ viewMode === 'today' ? "Today's Checklist" : "Master Task Directory" }}
        </h2>
        <span class="text-xs text-gray-400 font-mono">
          Completed: {{ completedCount }} / {{ displayedTasks.length }}
        </span>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-400">
        Loading tasks...
      </div>

      <div v-else-if="displayedTasks.length === 0" class="p-12 text-center text-gray-500 space-y-2">
        <CheckCircleIcon class="w-12 h-12 mx-auto text-gray-600" />
        <p class="text-base font-bold text-gray-400">No tasks found for this view.</p>
        <p class="text-xs text-gray-500">Click "Add Task" above to assign daily or recurring duties to venue staff.</p>
      </div>

      <div v-else class="divide-y divide-gray-800/60">
        <div 
          v-for="task in displayedTasks" 
          :key="task.id"
          class="p-4 flex items-start justify-between gap-4 hover:bg-gray-800/40 transition-colors"
          :class="{ 'opacity-60 bg-gray-950/40': task.is_completed_today }"
        >
          <div class="flex items-start gap-3.5 min-w-0">
            <!-- Toggle Checkbox -->
            <button 
              @click="toggleTask(task)"
              class="mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0"
              :class="task.is_completed_today ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-600 bg-gray-800 hover:border-emerald-500'"
            >
              <svg v-if="task.is_completed_today" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <!-- Task Info -->
            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm text-white" :class="{ 'line-through text-gray-400': task.is_completed_today }">
                  {{ task.title }}
                </span>

                <!-- Type Badge -->
                <span :class="getTaskTypeBadge(task.task_type)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
                  {{ task.task_type === 'one_time' ? 'One-Time' : task.task_type }}
                </span>

                <!-- Category Badge -->
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-300 border border-gray-700">
                  {{ task.category }}
                </span>

                <!-- Assigned Role -->
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-950 text-gray-400 border border-gray-800">
                  Role: {{ task.assigned_role }}
                </span>
              </div>

              <p v-if="task.description" class="text-xs text-gray-400">{{ task.description }}</p>

              <div class="flex items-center gap-3 text-[11px] text-gray-500 font-mono flex-wrap">
                <span v-if="task.task_type === 'one_time' && task.due_date">Due: {{ task.due_date }}</span>
                <span v-if="task.task_type === 'repeating' && task.recurrence_days">
                  Days: {{ formatRecurrenceDays(task.recurrence_days) }}
                </span>
                <span v-if="task.is_completed_today" class="text-emerald-400 font-bold">
                  ✓ Completed by {{ task.completed_by_name || 'Staff' }} at {{ formatTime(task.completed_at) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button 
              @click="deleteTask(task)"
              class="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
              title="Delete Task"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <PlusIcon class="w-5 h-5 text-red-500" /> Create Internal Task
          </h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Task Title *</label>
            <input v-model="form.title" type="text" placeholder="e.g. Clean &amp; sanitize bar ice machine" class="w-full bg-black border border-gray-700 rounded p-2 text-white" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Description / Instructions</label>
            <textarea v-model="form.description" rows="2" placeholder="Step-by-step notes for venue staff..." class="w-full bg-black border border-gray-700 rounded p-2 text-white"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-300 font-semibold mb-1">Category</label>
              <select v-model="form.category" class="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="general">General</option>
                <option value="bar">Bar &amp; Beverage</option>
                <option value="door">Door &amp; Reception</option>
                <option value="kitchen">Kitchen &amp; Food</option>
                <option value="maintenance">Sound &amp; Maintenance</option>
                <option value="security">Security</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-300 font-semibold mb-1">Assigned Role Rights</label>
              <select v-model="form.assigned_role" class="w-full bg-black border border-gray-700 rounded p-2 text-white">
                <option value="all">All Roles (Everyone)</option>
                <option value="bar">Bar Staff</option>
                <option value="door">Door Staff</option>
                <option value="kitchen">Kitchen Staff</option>
                <option value="manager">Managers</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Task Recurrence Type *</label>
            <div class="flex items-center gap-4 bg-black p-2 rounded border border-gray-800">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" v-model="form.task_type" value="daily" class="text-red-600" />
                <span class="text-gray-200">Daily (Every Day)</span>
              </label>

              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" v-model="form.task_type" value="one_time" class="text-red-600" />
                <span class="text-gray-200">One-Time</span>
              </label>

              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" v-model="form.task_type" value="repeating" class="text-red-600" />
                <span class="text-gray-200">Repeating Days</span>
              </label>
            </div>
          </div>

          <!-- If One-Time: Due Date -->
          <div v-if="form.task_type === 'one_time'">
            <label class="block text-gray-300 font-semibold mb-1">Target Due Date *</label>
            <input v-model="form.due_date" type="date" class="w-full bg-black border border-gray-700 rounded p-2 text-white font-mono" />
          </div>

          <!-- If Repeating: Days Selector -->
          <div v-if="form.task_type === 'repeating'" class="space-y-1">
            <label class="block text-gray-300 font-semibold mb-1">Active Days of Week</label>
            <div class="flex flex-wrap gap-2">
              <label v-for="day in weekDays" :key="day.val" class="px-2.5 py-1 bg-black border border-gray-700 rounded text-xs cursor-pointer flex items-center gap-1">
                <input type="checkbox" :value="day.val" v-model="form.recurrence_days" class="text-red-600" />
                <span class="text-gray-300">{{ day.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
          <button @click="showCreateModal = false" class="px-4 py-2 bg-gray-800 text-gray-300 rounded text-xs">Cancel</button>
          <button @click="createTask" :disabled="creating" class="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-bold rounded text-xs">
            {{ creating ? 'Saving...' : 'Save Task' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  ArrowPathIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  ListBulletIcon, 
  ClipboardDocumentCheckIcon 
} from '@heroicons/vue/24/outline'

interface TaskItem {
  id: string
  title: string
  description: string | null
  category: string
  assigned_role: string
  task_type: 'daily' | 'one_time' | 'repeating'
  due_date: string | null
  recurrence_days: number[] | null
  is_active: boolean
  is_completed_today: boolean
  completed_by_name: string | null
  completed_at: string | null
}

const todayTasks = ref<TaskItem[]>([])
const allTasks = ref<TaskItem[]>([])
const loading = ref(false)
const viewMode = ref<'today' | 'all'>('today')
const selectedCategory = ref('all')
const showCreateModal = ref(false)
const creating = ref(false)

const todayFormatted = new Date().toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const weekDays = [
  { val: 1, label: 'Mon' },
  { val: 2, label: 'Tue' },
  { val: 3, label: 'Wed' },
  { val: 4, label: 'Thu' },
  { val: 5, label: 'Fri' },
  { val: 6, label: 'Sat' },
  { val: 0, label: 'Sun' },
]

const form = ref({
  title: '',
  description: '',
  category: 'general',
  assigned_role: 'all',
  task_type: 'daily' as 'daily' | 'one_time' | 'repeating',
  due_date: new Date().toISOString().split('T')[0],
  recurrence_days: [1, 5, 6] as number[]
})

const displayedTasks = computed(() => {
  const list = viewMode.value === 'today' ? todayTasks.value : allTasks.value
  if (selectedCategory.value === 'all') return list
  return list.filter((t) => t.category === selectedCategory.value)
})

const completedCount = computed(() => displayedTasks.value.filter((t) => t.is_completed_today).length)

const fetchTasks = async () => {
  loading.value = true
  try {
    const todayData = await $fetch<TaskItem[]>('/api/admin/tasks')
    const masterData = await $fetch<TaskItem[]>('/api/admin/tasks?all=true')
    todayTasks.value = todayData || []
    allTasks.value = masterData || []
  } catch (err: any) {
    console.error('Failed to fetch tasks:', err)
  } finally {
    loading.value = false
  }
}

const toggleTask = async (task: TaskItem) => {
  const targetState = !task.is_completed_today
  task.is_completed_today = targetState
  try {
    await $fetch('/api/admin/tasks-toggle', {
      method: 'PATCH',
      body: {
        task_id: task.id,
        completed: targetState
      }
    })
    fetchTasks()
  } catch (err: any) {
    task.is_completed_today = !targetState
    alert(`Failed to toggle task: ${err.message}`)
  }
}

const createTask = async () => {
  if (!form.value.title) {
    alert('Task Title is required.')
    return
  }
  creating.value = true
  try {
    await $fetch('/api/admin/tasks', {
      method: 'POST',
      body: form.value
    })
    showCreateModal.value = false
    form.value = {
      title: '',
      description: '',
      category: 'general',
      assigned_role: 'all',
      task_type: 'daily',
      due_date: new Date().toISOString().split('T')[0],
      recurrence_days: [1, 5, 6]
    }
    fetchTasks()
  } catch (err: any) {
    alert(`Failed to create task: ${err.data?.statusMessage || err.message}`)
  } finally {
    creating.value = false
  }
}

const deleteTask = async (task: TaskItem) => {
  if (!confirm(`Delete task "${task.title}"?`)) return
  try {
    await $fetch(`/api/admin/tasks?id=${task.id}`, { method: 'DELETE' })
    fetchTasks()
  } catch (err: any) {
    alert(`Failed to delete task: ${err.message}`)
  }
}

const getTaskTypeBadge = (type: string) => {
  switch (type) {
    case 'daily': return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
    case 'one_time': return 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
    case 'repeating': return 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
    default: return 'bg-gray-800 text-gray-300'
  }
}

const formatRecurrenceDays = (days: any) => {
  if (!Array.isArray(days)) return ''
  const map: Record<number, string> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' }
  return days.map((d) => map[d] || d).join(', ')
}

const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' }) : ''

onMounted(() => {
  fetchTasks()
})

definePageMeta({ layout: 'admin' })
</script>
