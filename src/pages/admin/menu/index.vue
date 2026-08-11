<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Menu Manager</h1>
        <p class="text-gray-400 mt-1">Edit items, prices, and availability</p>
      </div>
      <NuxtLink to="/admin/menu/new" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300">
        + New Item
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
      <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
    </div>

    <!-- Empty -->
    <div v-else-if="menuItems.length === 0" class="bg-gray-800 rounded-xl p-16 text-center border border-gray-700">
      <p class="text-gray-400 mb-4">No menu items yet.</p>
      <NuxtLink to="/admin/menu/new" class="text-red-400 hover:text-red-300">+ Add your first item</NuxtLink>
    </div>

    <!-- Grouped by category -->
    <div v-else>
      <div v-for="(group, category) in groupedItems" :key="category" class="mb-8">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b border-gray-700 pb-2">{{ category }}</h2>
        <div class="space-y-3">
          <div v-for="item in group" :key="item.id" class="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="font-medium">{{ item.name }}</h3>
                <span v-if="item.is_available" class="px-2 py-0.5 text-xs font-medium rounded-full bg-green-900/30 text-green-300">Available</span>
                <span v-else class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-900/30 text-red-300">Sold out</span>
              </div>
              <p v-if="item.description" class="text-sm text-gray-400 mt-1 line-clamp-1">{{ item.description }}</p>
            </div>
            <div class="text-lg font-bold">€{{ item.price.toFixed(2) }}</div>
            <div class="flex items-center gap-3">
              <button 
                @click="toggleAvailability(item)"
                :class="item.is_available ? 'text-amber-400 hover:text-amber-300' : 'text-green-400 hover:text-green-300'"
                class="text-sm transition-colors"
              >
                {{ item.is_available ? 'Sold out' : 'Mark available' }}
              </button>
              <NuxtLink :to="`/admin/menu/${item.id}`" class="text-sm text-red-400 hover:text-red-300">Edit</NuxtLink>
              <button @click="deleteItem(item)" class="text-sm text-red-500 hover:text-red-400">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface MenuItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number
  is_available: boolean | null
}

const menuItems = ref<MenuItem[]>([])
const loading = ref(false)

const groupedItems = computed(() => {
  const groups: Record<string, MenuItem[]> = {}
  for (const item of menuItems.value) {
    const cat = item.category || 'uncategorized'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return groups
})

const fetchItems = async () => {
  loading.value = true
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    menuItems.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch menu:', err)
    alert('Failed to load menu.')
  } finally {
    loading.value = false
  }
}

const toggleAvailability = async (item: MenuItem) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id)
    if (error) throw error
    item.is_available = !item.is_available
  } catch (err: any) {
    console.error('Failed to toggle availability:', err)
  }
}

const deleteItem = async (item: MenuItem) => {
  if (!confirm(`Delete "${item.name}"?`)) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('menu_items').delete().eq('id', item.id)
    if (error) throw error
    menuItems.value = menuItems.value.filter(i => i.id !== item.id)
  } catch (err: any) {
    console.error('Failed to delete item:', err)
    alert('Failed to delete item.')
  }
}

onMounted(fetchItems)

definePageMeta({ layout: 'admin' })
</script>