<template>
  <div class="min-h-screen bg-kader-red text-kader-black">
    <!-- Hero -- Kader brand banner -->
    <section class="px-6 py-14 md:py-20 text-center">
      <img 
        :src="logoUrl" 
        alt="Kader"
        class="mx-auto max-w-[80%] md:max-w-md h-auto mb-6"
      >
      <h1 class="text-4xl md:text-5xl font-black mb-3">Meni / Menu</h1>
      <p class="text-lg md:text-xl max-w-2xl mx-auto font-medium">
        Pica bistro in plesni bar na gradu Kodeljevo
      </p>
    </section>

    <!-- Menu Image (single image by design) -->
    <section class="px-4 md:px-8 pb-16">
      <div class="max-w-5xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-32 text-kader-black">
          <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="bg-kader-black/5 border border-kader-black/40 rounded-2xl p-10 text-center">
          <p class="text-lg mb-4">{{ loadError }}</p>
          <button @click="loadMenu" class="px-6 py-3 bg-kader-black text-kader-cream rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Retry
          </button>
        </div>

        <!-- Menu image -->
        <div v-else class="shadow-2xl ring-1 ring-kader-black/30 rounded-xl overflow-hidden bg-white">
          <img
            :src="menuImage"
            alt="Kader pizzeria menu"
            class="w-full h-auto cursor-zoom-in"
            @click="zoomOpen = true"
            :class="{ 'blur-2xl': !imageLoaded }"
            @load="imageLoaded = true"
            @error="onImageError"
          >
        </div>
        <p class="text-center text-sm mt-3 italic text-kader-black/70">Tap/click the menu to zoom</p>
      </div>
    </section>

    <!-- Kitchen philosophy / contact -->
    <section class="bg-kader-black text-kader-cream py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-black mb-6">Pizza bistro na gradu Kodeljevo</h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto">
          Doživite pristen okus italijanske pice v Gradu Kodeljevo. Sveže sestavine, ročno raztegnjeno testo
          in popolno pečena pica.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div class="bg-white/5 rounded-xl p-6">
            <h3 class="font-bold mb-2">📍 Kje / Where</h3>
            <p>Ulica Carla Benza 20,<br>1000 Ljubljana</p>
          </div>
          <div class="bg-white/5 rounded-xl p-6">
            <h3 class="font-bold mb-2">📞 Naročim in pridem iskat</h3>
            <p>+386 83 866 740</p>
          </div>
          <div class="bg-white/5 rounded-xl p-6">
            <h3 class="font-bold mb-2">🎫 Rezervacije</h3>
            <p>+386 68 655 628</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Zoom lightbox -->
    <Teleport to="body">
      <div 
        v-if="zoomOpen" 
        class="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4 cursor-zoom-out"
        @click="zoomOpen = false"
        @keydown.esc="zoomOpen = false"
      >
        <img :src="menuImage" alt="Kader pizzeria menu (zoomed)" class="max-w-full max-h-full object-contain">
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const logoUrl = '/kader/asset-6100.png'
const menuImage = ref('/kader/menu.jpg')
const loading = ref(true)
const loadError = ref('')
const zoomOpen = ref(false)
const imageLoaded = ref(false)

const onImageError = () => {
  menuImage.value = '/kader/menu.jpg'
}

const loadMenu = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const cfg = await $fetch<{ menuImage: string }>('/api/menu-config')
    if (cfg?.menuImage) menuImage.value = cfg.menuImage
  } catch (err: any) {
    console.error('Failed to load menu config:', err)
    loadError.value = 'We couldn\u2019t load the menu right now. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMenu)
</script>