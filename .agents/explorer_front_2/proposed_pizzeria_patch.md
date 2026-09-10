# Pizzeria Elevation Implementation Specifications (`src/pages/pizzeria.vue`)

This guide details the exact code modifications for the Worker to elevate `src/pages/pizzeria.vue` to 50 Top Pizza standards.

## 1. Components to Import
In `<script setup lang="ts">` of `src/pages/pizzeria.vue`:
```ts
import ProvenanceBadge from '~/components/ProvenanceBadge.vue'
import ReservationModal from '~/components/ReservationModal.vue'
import PizzeriaCraft from '~/components/PizzeriaCraft.vue'
import { useReservationModal } from '~/composables/useReservationModal'
```
(Note: Nuxt 3 auto-imports components in `src/components/`, but explicit or auto-import both work cleanly).

## 2. Modal Reactive State & Methods
```ts
const { isModalOpen, modalTab, selectedItem, openReservation, closeReservation } = useReservationModal()

// Direct helpers
const openModal = (tab: 'table' | 'takeaway') => {
  openReservation(tab)
}

const openTakeawayWithItem = (item: { name: string; price: string }) => {
  openReservation('takeaway', item)
}
```

## 3. Template Enhancements

### 3.1 Hero CTA Buttons (lines 45-60)
Replace direct `<a>` phone links with smart interactive buttons that open the modal, while retaining phone fallback:
```html
<div class="flex flex-wrap gap-4 justify-center w-full max-w-xl">
  <button 
    type="button"
    @click="openModal('takeaway')" 
    class="px-8 py-4 bg-masanielli-gold text-black hover:bg-masanielli-goldLight font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-masanielli-gold/10 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px] cursor-pointer"
  >
    <PhoneIcon class="w-4 h-4 mr-2" />
    {{ t('pizzeria.pickUp') }}
  </button>
  <button 
    type="button"
    @click="openModal('table')" 
    class="px-8 py-4 bg-zinc-950 border border-masanielli-gold/40 text-masanielli-gold hover:bg-zinc-900 hover:border-masanielli-gold font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-h-[48px] flex-1 min-w-[200px] cursor-pointer"
  >
    <CalendarDaysIcon class="w-4 h-4 mr-2" />
    {{ t('pizzeria.tableRes') }}
  </button>
</div>
```

### 3.2 Artisanal Craft & Oven Section Placement
Insert `<PizzeriaCraft />` directly after the showcase images (after line 165), before the menu view:
```html
<!-- ===== "PIZZERIA CRAFT & OVEN" FEATURE SECTION ===== -->
<PizzeriaCraft />
```

### 3.3 Provenance Guarantee Banner (Above Digital Menu)
Insert right before the Category Navigation or above the Pizza category:
```html
<!-- ===== INGREDIENT PROVENANCE GUARANTEE BANNER ===== -->
<div class="mb-10 p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-masanielli-gold/30 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
  <div class="flex items-center space-x-3.5">
    <div class="w-11 h-11 rounded-2xl bg-masanielli-gold/15 border border-masanielli-gold/40 flex items-center justify-center text-masanielli-gold text-xl">
      🛡️
    </div>
    <div>
      <h4 class="text-sm md:text-base font-serif font-black text-white uppercase tracking-wider">
        Zaveza Pristnosti & Certificirano Poreklo
      </h4>
      <p class="text-xs text-gray-300 font-light">
        Uporabljamo izključno certificirane italijanske sestavine (D.O.P. in I.G.P.) ter hladno stiskano ekološko oljčno olje.
      </p>
    </div>
  </div>
  <div class="flex flex-wrap gap-2 text-[10px] font-mono">
    <span class="px-2.5 py-1 rounded-lg bg-masanielli-gold/15 border border-masanielli-gold/50 text-masanielli-gold font-bold">
      🍅 SAN MARZANO D.O.P.
    </span>
    <span class="px-2.5 py-1 rounded-lg bg-masanielli-gold/15 border border-masanielli-gold/50 text-masanielli-gold font-bold">
      🐃 BUFALA CAMPANA D.O.P.
    </span>
    <span class="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold">
      🥓 MORTADELLA I.G.P.
    </span>
    <span class="px-2.5 py-1 rounded-lg bg-teal-950/60 border border-teal-500/50 text-teal-300 font-bold">
      🌿 BIO EXTRA VERGINE
    </span>
  </div>
</div>
```

### 3.4 Menu Items Card Upgrade
Update `MenuItem` interface:
```ts
interface MenuItem {
  name: string
  description?: string
  price: string
  tags?: string[]
  badges?: string[]
}
```
Update card rendering:
```html
<div 
  v-for="item in cat.items" 
  :key="item.name"
  class="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/60 hover:border-masanielli-gold/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
>
  <div>
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-serif font-bold text-white group-hover:text-masanielli-gold transition-colors">
        {{ item.name }}
      </h3>
      <span class="text-base font-mono font-bold text-masanielli-gold ml-4 whitespace-nowrap bg-masanielli-gold/10 px-3 py-1 rounded-xl border border-masanielli-gold/30">
        {{ item.price }}
      </span>
    </div>
    <p v-if="item.description" class="text-xs md:text-sm text-gray-300 leading-relaxed mb-4 font-light">
      {{ item.description }}
    </p>
  </div>

  <!-- Interactive Provenance Badges with Flyout Tooltips -->
  <div v-if="item.badges && item.badges.length > 0" class="flex flex-wrap gap-1.5 my-3">
    <ProvenanceBadge
      v-for="badgeKey in item.badges"
      :key="badgeKey"
      :badge-key="badgeKey"
    />
  </div>
  <div v-else-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 my-3">
    <span 
      v-for="tag in item.tags" 
      :key="tag"
      class="px-2.5 py-0.5 bg-zinc-950 text-masanielli-gold/90 text-[10px] font-mono font-semibold rounded-md uppercase tracking-wider border border-masanielli-gold/20"
    >
      {{ tag }}
    </span>
  </div>

  <!-- Item Quick Action Conversion Button -->
  <div class="mt-4 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between">
    <span class="text-[11px] font-mono text-gray-400">
      {{ cat.id === 'pizza' ? '48h testo · peč 450°C' : cat.id === 'panuozzo' ? '160g svež kruh' : 'Kader bistro' }}
    </span>
    <button
      type="button"
      @click="openTakeawayWithItem(item)"
      class="px-3.5 py-1.5 rounded-xl bg-masanielli-gold/15 hover:bg-masanielli-gold text-masanielli-gold hover:text-black border border-masanielli-gold/40 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 shadow-sm min-h-[36px]"
    >
      <span>+</span>
      <span>Naroči za s seboj</span>
    </button>
  </div>
</div>
```

### 3.5 Sticky Mobile Bar (lines 377-384)
Wire the buttons to `openModal('takeaway')` and `openModal('table')`:
```html
<div class="fixed bottom-safe left-4 right-4 z-40 md:hidden bg-zinc-950/95 border border-masanielli-gold/40 backdrop-blur-lg p-3 rounded-2xl shadow-2xl flex justify-between items-center">
  <button 
    type="button"
    @click="openModal('takeaway')" 
    class="flex-1 mr-2 py-3 bg-masanielli-gold text-black rounded-xl text-xs font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min"
  >
    <PhoneIcon class="w-4 h-4 mr-1.5" /> Naročim Za S Seboj
  </button>
  <button 
    type="button"
    @click="openModal('table')" 
    class="flex-1 ml-2 py-3 bg-zinc-900 text-masanielli-gold border border-masanielli-gold/40 rounded-xl text-xs font-black uppercase text-center flex items-center justify-center min-h-[44px] touch-target-min"
  >
    <CalendarDaysIcon class="w-4 h-4 mr-1.5" /> Rezervacija
  </button>
</div>
```

### 3.6 Modal Integration (At bottom of template)
```html
<ReservationModal
  :is-open="isModalOpen"
  :initial-tab="modalTab"
  :preselected-item="selectedItem"
  @close="closeReservation"
/>
```
