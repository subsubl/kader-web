<template>
  <div class="min-h-screen bg-black text-white pb-36">
    <header class="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-black tracking-wider text-white">KADER</h1>
        <span class="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-mono uppercase">Grad Kodeljevo</span>
      </div>
      <div v-if="tableNum" class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
        Miza / Table {{ tableNum }}
      </div>
      <div v-else class="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Digital Menu
      </div>
    </header>

    <div v-if="success" class="p-6 mt-12 max-w-md mx-auto">
      <div class="bg-zinc-900 border border-green-800/80 p-8 rounded-3xl text-center shadow-2xl">
        <div class="w-16 h-16 bg-green-950/80 border border-green-700/60 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-black mb-2 text-white uppercase tracking-tight">Order Received!</h2>
        <p class="text-gray-300 text-sm leading-relaxed mb-6">Naročilo prejeto! Natakar je obveščen in vaš vrč/pijača prispeta kmalu do mize {{ tableNum }}.</p>
        <button @click="success = false" class="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors">
          Naroči še kaj / Order more
        </button>
      </div>
    </div>

    <template v-else>
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

      <div class="p-4 max-w-2xl mx-auto space-y-4">
        <div v-for="item in activeItems" :key="item.id" class="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-zinc-700 transition-colors">
          <div class="flex-1">
            <h3 class="font-bold text-base md:text-lg text-gray-100 leading-tight">{{ item.name }}</h3>
            <p v-if="item.description" class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{{ item.description }}</p>
            <div class="text-red-500 font-black text-base mt-2">€{{ item.price.toFixed(2) }}</div>
          </div>
          
          <div v-if="tableNum" class="flex items-center gap-2 bg-black border border-zinc-800 rounded-xl p-1 shadow-inner">
            <button 
              @click="updateQty(item, -1)" 
              aria-label="Decrease quantity"
              class="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors touch-target-min"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>
            </button>
            <span class="w-6 text-center font-bold text-white text-base">{{ getQty(item.id) }}</span>
            <button 
              @click="updateQty(item, 1)" 
              aria-label="Increase quantity"
              class="w-11 h-11 flex items-center justify-center text-red-500 hover:text-white rounded-lg hover:bg-red-600/20 active:bg-red-600 transition-colors touch-target-min"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div v-else class="text-xs text-gray-500 italic">
            Scan QR on table to order
          </div>
        </div>
      </div>

      <!-- Floating Cart Bar (With Safe Area Insets & Customer Note) -->
      <div v-if="cartTotal > 0" class="fixed bottom-0 inset-x-0 p-4 pb-safe bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none z-50">
        <div class="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 space-y-3 pointer-events-auto shadow-2xl">
          <!-- Optional Note Input -->
          <div v-if="showNoteInput">
            <input 
              v-model="customerNote" 
              type="text" 
              placeholder="Opomba natakarju (npr. brez ledu, ekstra kozarec)..." 
              maxlength="200"
              class="w-full px-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">{{ cartCount }} izdelkov / items</span>
                <button @click="showNoteInput = !showNoteInput" class="text-[11px] text-red-400 hover:underline font-semibold">
                  {{ showNoteInput ? 'Skrij opombo' : '+ Opomba' }}
                </button>
              </div>
              <div class="text-2xl font-black text-white tracking-tight">€{{ cartTotal.toFixed(2) }}</div>
            </div>
            <button 
              @click="submitOrder" 
              :disabled="isSubmitting"
              class="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-red-950 touch-target-min"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Pošiljanje...
              </span>
              <span v-else>Oddaj Naročilo →</span>
            </button>
          </div>
        </div>
      </div>
    </template>
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

