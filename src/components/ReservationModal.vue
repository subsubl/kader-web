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
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="activeTab === 'table' ? 'modal-table-title' : 'modal-takeaway-title'"
        @click.self="closeModal"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-xl bg-white border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden text-gray-900 my-auto transform transition-all"
        >
          <!-- Top Red Stripe Border -->
          <div class="menu-stripe-border" aria-hidden="true"></div>

          <!-- Header & Close Button -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between border-b-2 border-red-100">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm">
                <span v-if="activeTab === 'table'" class="text-xl">📅</span>
                <span v-else class="text-xl">🛍️</span>
              </div>
              <div>
                <h3 
                  :id="activeTab === 'table' ? 'modal-table-title' : 'modal-takeaway-title'"
                  class="text-xl md:text-2xl font-serif font-black uppercase text-gray-900 tracking-wide"
                >
                  {{ activeTab === 'table' ? 'Rezervacija Mize' : 'Naročilo Za S Seboj' }}
                </h3>
                <p class="text-xs text-red-600 font-mono tracking-wider font-semibold">
                  Kader Grad Kodeljevo · Telefonska Naročila & Rezervacije
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              aria-label="Zapri okno"
              class="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-gray-600 hover:text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Tab Navigation Switcher -->
          <div class="px-6 pt-4 pb-2">
            <div class="grid grid-cols-2 p-1.5 bg-red-50/70 border border-red-200 rounded-2xl gap-1">
              <button
                type="button"
                @click="switchTab('takeaway')"
                :class="[
                  'py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]',
                  activeTab === 'takeaway'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-black'
                    : 'text-gray-700 hover:text-red-600 hover:bg-white/80'
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
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-black'
                    : 'text-gray-700 hover:text-red-600 hover:bg-white/80'
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
            <div class="p-4 bg-red-50/60 border-2 border-red-100 rounded-2xl text-center space-y-2">
              <div class="w-12 h-12 bg-white border border-red-300 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
                📞
              </div>
              <h4 class="text-lg font-serif font-bold text-gray-900 uppercase">Naročila sprejemamo po telefonu</h4>
              <p class="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                Za naročilo pice in hrano za s seboj nas pokličite direktno na telefonsko številko picerije. Naročila in pripravljeni prevzemi potekajo izključno preko telefonskega klica.
              </p>
            </div>

            <!-- Preselected Item Context if opened from a specific pizza item -->
            <div v-if="preselectedItem && preselectedItem.name" class="p-4 bg-white border-2 border-red-500 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span class="text-gray-500 block text-[10px] uppercase font-mono">Izbrana jed iz menija:</span>
                <span class="text-red-600 font-serif font-black text-base uppercase">{{ preselectedItem.name }}</span>
              </div>
              <span class="text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 font-sans">
                {{ preselectedItem.price }}
              </span>
            </div>

            <!-- Direct Call CTA Button -->
            <a
              href="tel:+38683836740"
              class="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-serif font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-red-600/20 flex items-center justify-center space-x-3 group min-h-[52px]"
            >
              <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
              <span>Pokliči za Naročilo: +386 83 836 740</span>
            </a>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
              <div class="p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <span class="text-gray-500 block text-[10px] uppercase">Delovni čas kuhinje:</span>
                <span class="text-gray-900 font-bold">12:00 – 22:00</span>
              </div>
              <div class="p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <span class="text-gray-500 block text-[10px] uppercase">Prevzemno mesto:</span>
                <span class="text-gray-900 font-bold">Grad Kodeljevo (Benza 20)</span>
              </div>
            </div>
          </div>

          <!-- ==================== TAB: TABLE RESERVATION (REZERVACIJA MIZE) ==================== -->
          <div v-else class="p-6 space-y-5">
            <!-- Notice Box -->
            <div class="p-4 bg-red-50/60 border-2 border-red-100 rounded-2xl text-center space-y-2">
              <div class="w-12 h-12 bg-white border border-red-300 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
                📞
              </div>
              <h4 class="text-lg font-serif font-bold text-gray-900 uppercase">Rezervacije sprejemamo po telefonu</h4>
              <p class="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                Za rezervacijo mize v restavraciji ali na poletnem grajskem vrtu nas pokličite na telefonsko številko za rezervacije.
              </p>
            </div>

            <!-- Direct Call CTA Button -->
            <a
              href="tel:+38640175628"
              class="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-serif font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-red-600/20 flex items-center justify-center space-x-3 group min-h-[52px]"
            >
              <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
              <span>Pokliči za Rezervacijo: +386 40 175 628</span>
            </a>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
              <div class="p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <span class="text-gray-500 block text-[10px] uppercase">Telefon rezervacije:</span>
                <span class="text-gray-900 font-bold">+386 40 175 628</span>
              </div>
              <div class="p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <span class="text-gray-500 block text-[10px] uppercase">Lokacija:</span>
                <span class="text-gray-900 font-bold">Grad Kodeljevo, Ljubljana</span>
              </div>
            </div>
          </div>

          <!-- Footer close button -->
          <div class="px-6 py-4 bg-red-50/40 border-t-2 border-red-100 flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 bg-white border border-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px]"
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
