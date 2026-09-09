<template>
  <div class="min-h-screen bg-black text-white pb-32">
    <header class="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 p-4 flex items-center justify-between">
      <h1 class="text-xl font-bold tracking-wider">KADER</h1>
      <div v-if="tableNum" class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        Table {{ tableNum }}
      </div>
      <div v-else class="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm font-semibold">
        Digital Menu
      </div>
    </header>

    <div v-if="success" class="p-6 mt-8 max-w-md mx-auto">
      <div class="bg-gray-900 border border-green-900 p-6 rounded-xl text-center">
        <div class="text-green-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">Order received!</h2>
        <p class="text-gray-400">Your waiter has been notified and your order will arrive shortly.</p>
      </div>
    </div>

    <template v-else>
      <div class="overflow-x-auto p-4 flex gap-2 sticky top-[65px] z-40 bg-black/95 backdrop-blur shadow-md hide-scrollbar border-b border-gray-900">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          class="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="activeCategory === cat ? 'bg-white text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'"
        >
          {{ cat }}
        </button>
      </div>

      <div class="p-4 max-w-2xl mx-auto space-y-6">
        <div v-for="item in activeItems" :key="item.id" class="bg-zinc-950 border border-gray-800 rounded-xl p-4 flex justify-between items-center gap-4">
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-100">{{ item.name }}</h3>
            <p v-if="item.description" class="text-sm text-gray-500 mt-1 line-clamp-2">{{ item.description }}</p>
            <div class="text-red-500 font-semibold mt-2">€{{ item.price.toFixed(2) }}</div>
          </div>
          
          <div v-if="tableNum" class="flex items-center gap-3 bg-black border border-gray-800 rounded-lg p-1">
            <button @click="updateQty(item, -1)" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
            </button>
            <span class="w-4 text-center font-medium">{{ getQty(item.id) }}</span>
            <button @click="updateQty(item, 1)" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Cart -->
      <div v-if="cartTotal > 0" class="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black to-transparent pointer-events-none z-50">
        <div class="max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-4 flex items-center justify-between pointer-events-auto shadow-2xl">
          <div>
            <div class="text-gray-400 text-sm">{{ cartCount }} items</div>
            <div class="text-xl font-bold text-white">€{{ cartTotal.toFixed(2) }}</div>
          </div>
          <button 
            @click="submitOrder" 
            :disabled="isSubmitting"
            class="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
          >
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Send Order</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useNuxtApp } from '#imports'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { $supabase } = useNuxtApp()

const tableNum = computed(() => {
  const t = parseInt(route.query.table)
  return isNaN(t) ? null : t
})

const menuItems = ref([])
const categories = ref([])
const activeCategory = ref('')
const cart = ref({})
const isSubmitting = ref(false)
const success = ref(false)

onMounted(async () => {
  const { data } = await $supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('name')
    
  if (data) {
    menuItems.value = data
    const cats = [...new Set(data.map(i => i.category))]
    categories.value = cats
    if (cats.length) activeCategory.value = cats[0]
  }
})

const activeItems = computed(() => {
  return menuItems.value.filter(i => i.category === activeCategory.value)
})

const getQty = (id) => cart.value[id]?.qty || 0

const updateQty = (item, delta) => {
  const current = getQty(item.id)
  const next = current + delta
  if (next < 0) return
  if (next > 10) return // max 10 per item
  
  if (next === 0) {
    const newCart = { ...cart.value }
    delete newCart[item.id]
    cart.value = newCart
  } else {
    cart.value = {
      ...cart.value,
      [item.id]: {
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        qty: next
      }
    }
  }
}

const cartCount = computed(() => {
  return Object.values(cart.value).reduce((sum, item) => sum + item.qty, 0)
})

const cartTotal = computed(() => {
  return Object.values(cart.value).reduce((sum, item) => sum + (item.price * item.qty), 0)
})

const submitOrder = async () => {
  if (!tableNum.value) {
    alert('Invalid table number. Please scan the QR code on your table again.')
    return
  }
  
  isSubmitting.value = true
  try {
    const items = Object.values(cart.value).map(i => ({
      menu_item_id: i.menu_item_id,
      name: i.name,
      qty: i.qty,
      price: i.price
    }))
    
    const res = await $fetch('/api/table-orders', {
      method: 'POST',
      body: {
        table_number: tableNum.value,
        items
      }
    })
    
    if (res.ok) {
      success.value = true
      cart.value = {}
    }
  } catch (err) {
    console.error(err)
    alert(err.data?.message || err.message || 'Failed to submit order. Please try again or ask a waiter.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
