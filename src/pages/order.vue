<template>
  <div class="min-h-screen bg-black text-white pb-20">
    <header class="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-black tracking-wider text-white">KADER</h1>
        <span class="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-mono uppercase">Grad Kodeljevo</span>
      </div>
      <div class="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Digitalni Meni / Digital Menu
      </div>
    </header>

    <!-- Notice Banner -->
    <div class="bg-zinc-900/90 border-b border-zinc-800 p-4 text-center text-xs text-gray-300 flex items-center justify-center space-x-2">
      <span>🍕</span>
      <span><strong>Digitalni meni:</strong> Naročila sprejema natakar pri mizi ali šanku. / Orders are taken by staff at your table or bar.</span>
    </div>

    <!-- Category Pill Bar -->
    <div class="overflow-x-auto p-4 flex gap-2 sticky top-[65px] z-40 bg-black/95 backdrop-blur shadow-md hide-scrollbar border-b border-gray-900">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        class="whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] flex items-center"
        :class="activeCategory === cat ? 'bg-white text-black shadow-lg scale-105' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Menu Items List (View Only) -->
    <div class="p-4 max-w-2xl mx-auto space-y-4">
      <div v-for="item in activeItems" :key="item.id" class="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-zinc-700 transition-colors">
        <div class="flex-1">
          <h3 class="font-bold text-base md:text-lg text-gray-100 leading-tight">{{ item.name }}</h3>
          <p v-if="item.description" class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{{ item.description }}</p>
          <div class="text-red-500 font-black text-base mt-2">€{{ item.price.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useNuxtApp } from '#imports'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { $supabase } = useNuxtApp()

const tableNum = computed(() => {
  const t = parseInt(route.query.table as string)
  return isNaN(t) ? null : t
})

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  is_available: boolean
}

interface CartEntry {
  menu_item_id: string
  name: string
  price: number
  qty: number
}

const menuItems = ref<MenuItem[]>([])
const categories = ref<string[]>([])
const activeCategory = ref<string>('')
const cart = ref<Record<string, CartEntry>>({})
const customerNote = ref<string>('')
const showNoteInput = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const success = ref<boolean>(false)

onMounted(async () => {
  const { data } = await $supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('name')
    
  if (data) {
    menuItems.value = data
    const cats = [...new Set(data.map((i: MenuItem) => i.category))]
    categories.value = cats
    if (cats.length) activeCategory.value = cats[0]
  }
})

const activeItems = computed(() => {
  return menuItems.value.filter(i => i.category === activeCategory.value)
})

const getQty = (id: string) => cart.value[id]?.qty || 0

const updateQty = (item: MenuItem, delta: number) => {
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
    alert('Napačna številka mize. Prosimo, ponovno skenirajte QR kodo na mizi / Invalid table number.')
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
    
    const res = await $fetch<{ ok: boolean; id: string }>('/api/table-orders', {
      method: 'POST',
      body: {
        table_number: tableNum.value,
        items,
        customer_note: customerNote.value.trim() || undefined
      }
    })
    
    if (res?.ok) {
      success.value = true
      cart.value = {}
      customerNote.value = ''
      showNoteInput.value = false
    }
  } catch (err: any) {
    console.error(err)
    alert(err.data?.message || err.message || 'Napaka pri oddaji naročila. Poskusite znova ali pokličite natakarja.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

