<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono tracking-wider">
            SECURITY & ACCESS CONTROL
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-white mt-1 tracking-tight">Team Accounts & Access Rights (RBAC)</h1>
        <p class="text-xs text-gray-400">Manage venue staff accounts, role assignments, and feature permissions.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="fetchTeam" 
          class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" /> Refresh Team
        </button>

        <button 
          @click="showCreateModal = true" 
          class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <UserPlusIcon class="w-4 h-4" /> Create Team Account
        </button>
      </div>
    </div>

    <!-- Role Rights Summary Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-red-400 uppercase font-mono">Admin</span>
          <ShieldCheckIcon class="w-4 h-4 text-red-400" />
        </div>
        <p class="text-sm font-bold text-white">Full System Rights</p>
        <p class="text-[11px] text-gray-400">P&L, Settings, User Management, Tasks, Calendar Notes, All APIs.</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-400 uppercase font-mono">Manager</span>
          <BriefcaseIcon class="w-4 h-4 text-amber-400" />
        </div>
        <p class="text-sm font-bold text-white">Operations & Staffing</p>
        <p class="text-[11px] text-gray-400">BI Dashboard, Shifts, Calendar Notes, Tasks, Door & KDS Supervision.</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-blue-400 uppercase font-mono">Door / Security</span>
          <KeyIcon class="w-4 h-4 text-blue-400" />
        </div>
        <p class="text-sm font-bold text-white">Door Check-In & Scans</p>
        <p class="text-[11px] text-gray-400">Guestlists, QR ticket validation, walk-ins, capacity tracking.</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 uppercase font-mono">Bar / Kitchen</span>
          <BuildingStorefrontIcon class="w-4 h-4 text-emerald-400" />
        </div>
        <p class="text-sm font-bold text-white">Order Queue & Checklists</p>
        <p class="text-[11px] text-gray-400">Kitchen Display System (KDS), Microgramm orders, daily task list.</p>
      </div>
    </div>

    <!-- Team Members Table -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-base font-bold text-white">Team Members ({{ team.length }})</h2>
        <span class="text-xs text-gray-400">Click dropdown to update role permissions</span>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-400">
        Loading team members...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-800/60 text-gray-400 uppercase tracking-wider font-mono">
            <tr>
              <th class="p-3.5">Member</th>
              <th class="p-3.5">Email</th>
              <th class="p-3.5">Current Role</th>
              <th class="p-3.5">Rights Level</th>
              <th class="p-3.5">Last Login</th>
              <th class="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/60 text-gray-200">
            <tr v-for="member in team" :key="member.id" class="hover:bg-gray-800/40 transition-colors">
              <td class="p-3.5 font-bold text-white">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-red-950 border border-red-800/60 flex items-center justify-center font-bold text-red-400 text-xs uppercase">
                    {{ member.name.slice(0, 2) }}
                  </div>
                  <div>
                    <div>{{ member.name }}</div>
                    <div class="text-[10px] text-gray-500 font-mono">ID: {{ member.id.slice(0, 8) }}...</div>
                  </div>
                </div>
              </td>
              <td class="p-3.5 font-mono text-gray-300">{{ member.email }}</td>
              <td class="p-3.5">
                <span :class="getRoleBadgeClass(member.role)" class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase font-mono tracking-wider">
                  {{ member.role }}
                </span>
              </td>
              <td class="p-3.5 text-gray-400">
                {{ getRoleRightsDescription(member.role) }}
              </td>
              <td class="p-3.5 font-mono text-gray-400">
                {{ member.last_sign_in ? formatDate(member.last_sign_in) : 'Never' }}
              </td>
              <td class="p-3.5">
                <select 
                  :value="member.role" 
                  @change="handleRoleChange(member, ($event.target as HTMLSelectElement).value)"
                  class="bg-black border border-gray-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="door">door</option>
                  <option value="bar">bar</option>
                  <option value="kitchen">kitchen</option>
                  <option value="promoter">promoter</option>
                  <option value="staff">staff</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Team Account Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <UserPlusIcon class="w-5 h-5 text-red-500" /> Create Team Account
          </h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Full Name</label>
            <input v-model="form.name" type="text" placeholder="e.g. Marko Novak" class="w-full bg-black border border-gray-700 rounded p-2 text-white" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Email Address</label>
            <input v-model="form.email" type="email" placeholder="marko@kader.si" class="w-full bg-black border border-gray-700 rounded p-2 text-white font-mono" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="w-full bg-black border border-gray-700 rounded p-2 text-white font-mono" />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Assign Role Rights</label>
            <select v-model="form.role" class="w-full bg-black border border-gray-700 rounded p-2 text-white font-mono">
              <option value="admin">admin — Full System Rights</option>
              <option value="manager">manager — Shift &amp; Venue Manager</option>
              <option value="door">door — Door Staff &amp; Check-ins</option>
              <option value="bar">bar — Bar Staff &amp; Microgramm POS</option>
              <option value="kitchen">kitchen — Kitchen Staff (KDS)</option>
              <option value="promoter">promoter — Promoter Guestlists</option>
              <option value="staff">staff — General Venue Staff</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
          <button @click="showCreateModal = false" class="px-4 py-2 bg-gray-800 text-gray-300 rounded text-xs">Cancel</button>
          <button @click="createAccount" :disabled="creating" class="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-bold rounded text-xs">
            {{ creating ? 'Creating...' : 'Create Account' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ArrowPathIcon, 
  UserPlusIcon, 
  ShieldCheckIcon, 
  BriefcaseIcon, 
  KeyIcon, 
  BuildingStorefrontIcon 
} from '@heroicons/vue/24/outline'

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  last_sign_in: string | null
  created_at: string
}

const team = ref<TeamMember[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const creating = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'staff'
})

const fetchTeam = async () => {
  loading.value = true
  try {
    const data = (await $fetch('/api/admin/team')) as TeamMember[]
    team.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch team members:', err)
  } finally {
    loading.value = false
  }
}

const handleRoleChange = async (member: TeamMember, newRole: string) => {
  try {
    await $fetch('/api/admin/team-role', {
      method: 'PATCH',
      body: { user_id: member.id, role: newRole }
    })
    member.role = newRole
  } catch (err: any) {
    alert(`Failed to update role: ${err.message}`)
    fetchTeam()
  }
}

const createAccount = async () => {
  if (!form.value.email || !form.value.password) {
    alert('Email and Password are required.')
    return
  }
  creating.value = true
  try {
    await $fetch('/api/admin/team', {
      method: 'POST',
      body: form.value
    })
    showCreateModal.value = false
    form.value = { name: '', email: '', password: '', role: 'staff' }
    fetchTeam()
  } catch (err: any) {
    alert(`Failed to create account: ${err.data?.statusMessage || err.message}`)
  } finally {
    creating.value = false
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-950/80 text-red-400 border border-red-800/60'
    case 'manager': return 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
    case 'door': return 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
    case 'bar':
    case 'kitchen': return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
    case 'promoter': return 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
    default: return 'bg-gray-800 text-gray-300 border border-gray-700'
  }
}

const getRoleRightsDescription = (role: string) => {
  switch (role) {
    case 'admin': return 'All APIs, P&L Reports, User RBAC, Settings, Tasks & Calendar Notes'
    case 'manager': return 'BI Dashboard, Shifts, Calendar Notes, Door & KDS Supervision'
    case 'door': return 'Door Guestlists, Ticket Scanning, Capacity Tracker'
    case 'bar': return 'Microgramm Bar POS, Drink Menu Management, Daily Checklist'
    case 'kitchen': return 'Tablet Kitchen Display System (KDS), Menu Availability'
    case 'promoter': return 'Promoter Guestlists & Verified Check-in Tracking'
    default: return 'General Staff Portal Access'
  }
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  fetchTeam()
})

definePageMeta({ layout: 'admin' })
</script>
