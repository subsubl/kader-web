<template>
  <div class="min-h-screen bg-black text-white pt-28 pb-20 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="border-b border-gray-800 pb-8 mb-10">
        <p class="text-xs uppercase tracking-widest text-red-500 font-semibold mb-2">Official Merchandise</p>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          Kader Shop
        </h1>
        <p class="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
          Kader Grad Kodeljevo merch, t-shirts, caps, and accessories.
        </p>
      </div>

      <!-- Pretix Widget Container -->
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 md:p-8 min-h-[500px]">
        <PretixWidget :event="shopUrl" />
      </div>

      <!-- Footer Info -->
      <div class="mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500">
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">Prevzem na lokaciji / Pickup</h4>
          <p>Izdelke lahko prevzamete tudi osebno v Gradu Kodeljevo med delovnim časom.</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">Varna obdelava / Safe checkout</h4>
          <p>Hitra in varna obdelava spletnih naročil in plačil.</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-300 uppercase tracking-wider mb-2">Podpora / Support</h4>
          <p>Za vprašanja glede izdelkov ali naročil pišite na <a href="mailto:info@kader.si" class="text-gray-400 hover:text-white underline">info@kader.si</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()
const shopUrl = computed(() => {
  const pretixBase = (config.public.pretixUrl as string || 'http://192.168.64.147').replace(/\/$/, '')
  return `${pretixBase}/kader/merch/`
})

useHead({
  title: 'Shop — Kader Grad Kodeljevo',
  meta: [
    { name: 'description', content: 'Uradna trgovina Kader Grad Kodeljevo — majice, kape in izdelki.' }
  ]
})
</script>
