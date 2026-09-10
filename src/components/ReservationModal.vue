<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="activeTab === 'table' ? 'modal-table-title' : 'modal-takeaway-title'"
        @click.self="closeModal"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-xl bg-zinc-950 border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden text-gray-100 my-auto transform transition-all"
        >
          <!-- Top Accent Line -->
          <div class="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

          <!-- Header & Close Button -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between border-b border-zinc-800/80">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <span v-if="activeTab === 'table'" class="text-xl">📅</span>
                <span v-else class="text-xl">🛍️</span>
              </div>
              <div>
                <h3 
                  :id="activeTab === 'table' ? 'modal-table-title' : 'modal-takeaway-title'"
                  class="text-xl md:text-2xl font-serif font-black uppercase text-white tracking-wide"
                >
                  {{ activeTab === 'table' ? 'Rezervacija Mize' : 'Naročilo Za S Seboj' }}
                </h3>
                <p class="text-xs text-red-400 font-mono tracking-wider">
                  Kader Grad Kodeljevo · Telefonska Naročila & Rezervacije
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              aria-label="Zapri okno"
              class="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Tab Navigation Switcher -->
          <div class="px-6 pt-4 pb-2">
            <div class="grid grid-cols-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl gap-1">
              <button
                type="button"
                @click="switchTab('takeaway')"
                :class="[
                  'py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]',
                  activeTab === 'takeaway'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-black'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                ]"
              >
                <span>🛍️</span>
                <span>Naročilo Pice</span>
              </button>

              <button
                type="button"
                @click="switchTab('table')"
                :class="[
                  'py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]',
                  activeTab === 'table'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-black'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                ]"
              >
                <span>📅</span>
                <span>Rezervacija Mize</span>
              </button>
            </div>
          </div>

          <!-- ==================== TAB: TAKEAWAY (NAROČILA PICE) ==================== -->
          <div v-if="activeTab === 'takeaway'" class="p-6 space-y-5">
            <!-- Notice Box -->
            <div class="p-4 bg-zinc-900 border border-red-500/30 rounded-2xl text-center space-y-2">
              <div class="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                📞
              </div>
              <h4 class="text-lg font-serif font-bold text-white uppercase">Naročila sprejemamo po telefonu</h4>
              <p class="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                Za naročilo pice in hrano za s seboj nas pokličite direktno na telefonsko številko picerije. Naročila in pripravljeni prevzemi potekajo izključno preko telefonskega klica.
              </p>
            </div>

            <!-- Preselected Item Context if opened from a specific pizza item -->
            <div v-if="preselectedItem && preselectedItem.name" class="p-4 bg-zinc-900/90 border border-amber-500/40 rounded-2xl flex items-center justify-between font-mono text-xs">
              <div>
                <span class="text-gray-400 block text-[10px] uppercase">Izbrana jed iz menija:</span>
                <span class="text-amber-400 font-bold text-sm">{{ preselectedItem.name }}</span>
              </div>
              <span class="text-white font-bold text-sm bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700">
                {{ preselectedItem.price }}
              </span>
            </div>

            <!-- Direct Call CTA Button -->
            <a
              href="tel:+38683836740"
              class="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-serif font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-red-950/50 flex items-center justify-center space-x-3 group min-h-[52px]"
            >
              <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
              <span>Pokliči za Naročilo: +386 83 836 740</span>
            </a>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
              <div class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span class="text-gray-400 block text-[10px] uppercase">Delovni čas kuhinje:</span>
                <span class="text-white font-bold">12:00 – 22:00</span>
              </div>
              <div class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span class="text-gray-400 block text-[10px] uppercase">Prevzemno mesto:</span>
                <span class="text-white font-bold">Grad Kodeljevo (Benza 20)</span>
              </div>
            </div>
          </div>

          <!-- ==================== TAB: TABLE RESERVATION (REZERVACIJA MIZE) ==================== -->
          <div v-else class="p-6 space-y-5">
            <!-- Notice Box -->
            <div class="p-4 bg-zinc-900 border border-red-500/30 rounded-2xl text-center space-y-2">
              <div class="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                📞
              </div>
              <h4 class="text-lg font-serif font-bold text-white uppercase">Rezervacije sprejemamo po telefonu</h4>
              <p class="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                Za rezervacijo mize v restavraciji ali na poletnem grajskem vrtu nas pokličite na telefonsko številko za rezervacije.
              </p>
            </div>

            <!-- Direct Call CTA Button -->
            <a
              href="tel:+38640175628"
              class="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-serif font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-red-950/50 flex items-center justify-center space-x-3 group min-h-[52px]"
            >
              <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
              <span>Pokliči za Rezervacijo: +386 40 175 628</span>
            </a>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
              <div class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span class="text-gray-400 block text-[10px] uppercase">Telefon rezervacije:</span>
                <span class="text-white font-bold">+386 40 175 628</span>
              </div>
              <div class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span class="text-gray-400 block text-[10px] uppercase">Lokacija:</span>
                <span class="text-white font-bold">Grad Kodeljevo, Ljubljana</span>
              </div>
            </div>
          </div>

          <!-- Footer close button -->
          <div class="px-6 py-4 bg-zinc-900/60 border-t border-zinc-800/80 flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px]"
            >
              Zapri
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  initialTab?: 'table' | 'takeaway'
  preselectedItem?: { name: string; price: string; quantity?: number } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'table' | 'takeaway'>(props.initialTab || 'takeaway')

watch(
  () => props.initialTab,
  (newTab) => {
    if (newTab) activeTab.value = newTab
  }
)

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  }
)

const switchTab = (tab: 'table' | 'takeaway') => {
  activeTab.value = tab
}

const closeModal = () => {
  emit('close')
}
</script>
