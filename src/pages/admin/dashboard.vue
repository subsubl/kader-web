<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="text-gray-400 mt-1">Kader Grad Kodeljevo — Overview</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Upcoming Events"
        :value="stats.upcomingEvents"
        icon="CalendarIcon"
        color="blue"
      />
      <StatsCard
        title="Menu Items"
        :value="stats.menuItems"
        icon="Bars3Icon"
        color="green"
      />
      <StatsCard
        title="Pending Inquiries"
        :value="stats.pendingInquiries"
        icon="UserGroupIcon"
        color="yellow"
      />
      <StatsCard
        title="Active Guestlist"
        :value="stats.activeGuestlist"
        icon="ShieldCheckIcon"
        color="red"
      />
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <NuxtLink to="/admin/events" class="action-card">
        <CalendarIcon class="w-8 h-8 text-blue-400 mb-3" />
        <h3 class="text-lg font-semibold">Manage Events</h3>
        <p class="text-gray-400 text-sm mt-1">Create, edit, delete events</p>
      </NuxtLink>

      <NuxtLink to="/admin/menu" class="action-card">
        <Bars3Icon class="w-8 h-8 text-green-400 mb-3" />
        <h3 class="text-lg font-semibold">Manage Menu</h3>
        <p class="text-gray-400 text-sm mt-1">Edit items, prices, availability</p>
      </NuxtLink>

      <NuxtLink to="/admin/crm" class="action-card">
        <UserGroupIcon class="w-8 h-8 text-yellow-400 mb-3" />
        <h3 class="text-lg font-semibold">CRM Pipeline</h3>
        <p class="text-gray-400 text-sm mt-1">New → Discussion → Contracted</p>
      </NuxtLink>

      <NuxtLink to="/admin/door" class="action-card">
        <ShieldCheckIcon class="w-8 h-8 text-red-400 mb-3" />
        <h3 class="text-lg font-semibold">Door Operations</h3>
        <p class="text-gray-400 text-sm mt-1">Guestlist, capacity, walk-ins</p>
      </NuxtLink>

      <NuxtLink to="/admin/calendar" class="action-card">
        <ClockIcon class="w-8 h-8 text-purple-400 mb-3" />
        <h3 class="text-lg font-semibold">Internal Calendar</h3>
        <p class="text-gray-400 text-sm mt-1">Staff schedule, BEO notes</p>
      </NuxtLink>
    </div>

    <!-- Recent Activity -->
    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Recent Activity</h2>
        <NuxtLink to="/admin/events" class="text-sm text-red-400 hover:text-red-300">View All</NuxtLink>
      </div>
      <div v-if="recentEvents.length === 0" class="text-center py-8 text-gray-500">
        No recent events. <NuxtLink to="/admin/events" class="text-red-400 hover:underline">Create one</NuxtLink>
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="event in recentEvents" 
          :key="event.id" 
          class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
              <CalendarIcon class="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <p class="font-medium">{{ event.title }}</p>
              <p class="text-sm text-gray-400">{{ formatDate(event.date) }} • {{ event.status }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="statusClass(event.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ event.status }}
            </span>
            <NuxtLink :to="`/admin/events/${event.id}`" class="text-sm text-red-400 hover:text-red-300">Edit</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CalendarIcon, Bars3Icon, UserGroupIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/vue/24/outline'
import StatsCard from '~/components/admin/StatsCard.vue'
import ActionCard from '~/components/admin/ActionCard.vue'

interface Event {
  id: string
  title: string
  date: string
  status: string | null
}

const stats = ref({
  upcomingEvents: 0,
  menuItems: 0,
  pendingInquiries: 0,
  activeGuestlist: 0
})

const recentEvents = ref<Event[]>([])

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

const fetchStats = async () => {
  try {
    const { $supabase } = useNuxtApp()
    
    const [eventsRes, menuRes, inquiriesRes, guestlistRes] = await Promise.all([
      $supabase.from('events').select('id', { count: 'exact', head: true }).gte('date', new Date().toISOString()),
      $supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('is_available', true),
      $supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      $supabase.from('guestlists').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ])
    
    stats.value.upcomingEvents = eventsRes.count || 0
    stats.value.menuItems = menuRes.count || 0
    stats.value.pendingInquiries = inquiriesRes.count || 0
    stats.value.activeGuestlist = guestlistRes.count || 0
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

const fetchRecentEvents = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data } = await $supabase
      .from('events')
      .select('id, title, date, status')
      .order('created_at', { ascending: false })
      .limit(5)
    
    recentEvents.value = data || []
  } catch (err) {
    console.error('Failed to fetch recent events:', err)
  }
}

onMounted(async () => {
  await Promise.all([fetchStats(), fetchRecentEvents()])
})

definePageMeta({ layout: 'admin' })
</script>