<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 font-sans">
    <header class="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
      <h1 class="text-3xl font-bold tracking-wider text-red-600">KITCHEN DISPLAY</h1>
      <div class="flex items-center gap-4 text-sm font-medium">
        <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
          {{ isConnected ? '● Live' : '○ Offline' }}
        </span>
        <button @click="fetchOrders" class="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700">Refresh</button>
      </div>
    </header>

    <div v-if="orders.length === 0" class="text-center text-gray-500 mt-20 text-xl">
      No active orders.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="rounded-xl border flex flex-col shadow-lg overflow-hidden transition-colors"
        :class="statusColors[order.status]"
      >
        <div class="p-4 border-b border-black/20 flex justify-between items-center bg-black/20">
          <div class="text-4xl font-black">Table {{ order.table_number }}</div>
          <div class="text-xl font-bold opacity-80">{{ getElapsed(order.created_at) }}</div>
        </div>
        
        <div class="p-4 flex-1 bg-black/10">
          <ul class="space-y-3 mb-4 text-2xl font-medium">
            <li v-for="(item, idx) in order.items" :key="idx" class="flex items-start gap-3 border-b border-white/10 pb-2">
              <span class="bg-white/20 px-2 py-1 rounded text-xl font-bold min-w-[3rem] text-center">{{ item.qty }}x</span>
              <span>{{ item.name }}</span>
            </li>
          </ul>
          <div v-if="order.customer_note" class="mt-4 p-3 bg-yellow-900/40 border border-yellow-700/50 rounded-lg text-yellow-100 text-lg font-semibold italic">
            "{{ order.customer_note }}"
          </div>
        </div>

        <div class="p-4 grid grid-cols-2 gap-2 bg-black/30 mt-auto">
          <button 
            v-if="order.status === 'pending'"
            @click="updateStatus(order, 'preparing')"
            class="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-lg text-2xl font-bold uppercase tracking-wider shadow-lg"
          >
            Start Preparing
          </button>

          <template v-if="order.status === 'preparing'">
            <button 
              @click="updateStatus(order, 'pending')"
              class="bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-lg text-xl font-bold uppercase shadow-lg"
            >
              Back
            </button>
            <button 
              @click="updateStatus(order, 'ready')"
              class="bg-green-600 hover:bg-green-500 text-white py-6 rounded-lg text-xl font-bold uppercase shadow-lg"
            >
              Ready
            </button>
          </template>

          <template v-if="order.status === 'ready'">
            <button 
              @click="updateStatus(order, 'preparing')"
              class="bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-lg text-xl font-bold uppercase shadow-lg"
            >
              Back
            </button>
            <button 
              @click="updateStatus(order, 'served')"
              class="bg-gray-500 hover:bg-gray-400 text-white py-6 rounded-lg text-xl font-bold uppercase shadow-lg"
            >
              Served
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: 'admin' })

const orders = ref([])
const isConnected = ref(false)
let pollInterval = null
let timeInterval = null
const now = ref(Date.now())

const statusColors = {
  pending: 'bg-yellow-900 border-yellow-500 text-yellow-50',
  preparing: 'bg-blue-900 border-blue-500 text-blue-50',
  ready: 'bg-green-900 border-green-500 text-green-50',
  served: 'bg-gray-800 border-gray-600 text-gray-300'
}

const getElapsed = (dateString) => {
  const diff = now.value - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '< 1m'
  return `${mins}m`
}

const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch(e) {}
}

const fetchOrders = async () => {
  try {
    const data = await $fetch('/api/admin/kitchen')
    isConnected.value = true
    
    // Check if there are new pending orders
    const oldPendingIds = new Set(orders.value.filter(o => o.status === 'pending').map(o => o.id))
    const newPending = data.filter(o => o.status === 'pending')
    
    let hasNew = false
    for (const o of newPending) {
      if (!oldPendingIds.has(o.id)) hasNew = true
    }
    
    if (hasNew && orders.value.length > 0) {
      playChime()
    }
    
    orders.value = data
  } catch (err) {
    console.error(err)
    isConnected.value = false
  }
}

const updateStatus = async (order, newStatus) => {
  try {
    await $fetch('/api/admin/kitchen', {
      method: 'PATCH',
      body: { id: order.id, status: newStatus }
    })
    
    if (newStatus === 'served' || newStatus === 'cancelled') {
      orders.value = orders.value.filter(o => o.id !== order.id)
    } else {
      const idx = orders.value.findIndex(o => o.id === order.id)
      if (idx !== -1) {
        orders.value[idx].status = newStatus
      }
    }
  } catch (err) {
    alert('Failed to update status')
  }
}

onMounted(() => {
  fetchOrders()
  pollInterval = setInterval(fetchOrders, 8000)
  timeInterval = setInterval(() => { now.value = Date.now() }, 30000)
})

onUnmounted(() => {
  clearInterval(pollInterval)
  clearInterval(timeInterval)
})
</script>
