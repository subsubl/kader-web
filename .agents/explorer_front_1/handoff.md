# Milestone 1 Investigation & Architecture Report: Interactive Day/Night Mode Switcher & Home Page Elevation

**Investigator**: Explorer Front 1  
**Target Scope**: Milestone 1 (`src/pages/index.vue`, `src/components/ImageLightboxModal.vue`, `src/composables/useLocale.ts`)  
**Date**: 2026-09-10  
**Status**: Ready for Implementation (Worker)

---

## 1. Observation

### 1.1 Existing Codebase & Environment Observations
1. **Framework & Dependencies** (`package.json`, lines 16–35):
   - Nuxt 3.15.4, Vue 3.5.13, `@nuxtjs/tailwindcss` 6.12.2, `@vueuse/nuxt` 14.4.0.
   - `@heroicons/vue` 2.2.0 is installed with icons verified present: `MagnifyingGlassPlusIcon`, `XMarkIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `SunIcon`, `MoonIcon` in `@heroicons/vue/24/outline` and solid variants.
   - Typescript 5.9.3, `vue-tsc` 3.3.10.
   - Typechecking passes cleanly: `npx nuxi typecheck` returned `◆ Type check passed in 9418ms.`
   - Clean production build succeeds: `npx nuxi cleanup && npm run build` returned `✔ Nuxt Nitro server built ... ✨ Build complete!`.

2. **Current `src/pages/index.vue` Layout & Shortcomings**:
   - **Hero Section (lines 4–43)**:
     - Features static dark theme with red text and red glow.
     - Tagline (line 14–16): static `{{ t('hero.tagline') }}`.
     - No ambient mode toggle exists.
     - Call-to-actions are static: `/events`, `/pizzeria`, `/club`.
   - **Dual Messaging Section (lines 46–88)**:
     - Two static equal-weight columns: `🍕 {{ t('home.dayTitle') }}` ("Podnevi") and `🪩 {{ t('home.nightTitle') }}` ("Zvečer").
     - No interactive state or visual lighting reaction.
   - **Gallery Section ("KADER V SLIKAH", lines 246–290)**:
     - Uses `siteImages.gallery_items` (6 images from `useSiteImages.ts`).
     - Line 271–276: Every image is wrapped in `<a href="https://www.instagram.com/kader.lunapark/" target="_blank">`.
     - **Defect/Gap**: Clicking any gallery image immediately navigates away to Instagram in a new tab. There is **no modal dialog, no full-screen zoom, no image switching, and no lightbox viewer**.
     - No keyboard navigation or touch gestures exist for photo viewing.

3. **Current Image Pipeline & Composables**:
   - `useSiteImages.ts` exposes `getOptImg(src, width, quality, format)` proxying to `/api/img?src=...&w=...&q=...&format=...`.
   - `public/images/instagram/` contains 13 downloaded Instagram images (`ig_img_1.jpg` through `ig_img_13.jpg`).
   - `gallery_items` provides:
     - `/images/instagram/ig_img_7.jpg` (Pizza with arugula)
     - `/images/instagram/ig_img_13.jpg` (Panuozzo mortadella)
     - `/images/instagram/ig_img_5.jpg` (Summer terrace party)
     - `/images/instagram/ig_img_3.jpg` (Live concert)
     - `/pizzeria-bg.jpg` (Pizzeria interior)
     - `/buyout-bg.jpg` (Castle garden)

4. **Modern Web Best Practice Standards (`modern-web-guidance`)**:
   - **Light Dismiss**: Clicking outside modal backdrop closes it (`@click.self` / backdrop click).
   - **Keyboard Navigation**: Native `Escape` key close and `ArrowLeft` / `ArrowRight` image stepping.
   - **Focus & Scroll Containment**: Lock `document.body.style.overflow = 'hidden'` when modal is active; restore upon exit.
   - **Teleportation**: Modals must teleport to `body` to avoid parent clipping and CSS transform stacking contexts.
   - **Mobile Touch Targets**: All interactive buttons must maintain `min-height: 44px; min-width: 44px`.
   - **Transitions**: Smooth top-layer and backdrop blur transitions (`backdrop-blur-2xl`).

---

## 2. Logic Chain

1. **Ambient Dual Identity State Architecture**:
   - Kader Grad Kodeljevo serves two distinct functions: a sunlit Neapolitan pizza bistro by day, and an underground Berlin-style audiophile club by night.
   - Therefore, introducing `ambientMode = ref<'day' | 'night'>('day')` in `src/pages/index.vue` enables the home page to immediately communicate this dual identity.
   - **Smart Defaulting Logic**: On client mount, inspect `localStorage.getItem('kader_ambient_mode')`. If not set, check `new Date().getHours()`: hours 08:00–18:00 default to `'day'`, hours 18:00–08:00 default to `'night'`.
   - **Persistent User Choice**: When the user toggles ambient mode, persist to `localStorage.setItem('kader_ambient_mode', mode)` so navigation between pages or reload honors their selection.

2. **Visual Toggle & Responsive Placement**:
   - The primary switch must sit prominently in the Hero section (between tagline/address and CTAs) as an interactive pill with icons (🍕 Dnevni Bistro vs 🪩 Nočni Klub).
   - A floating pill at `fixed bottom-6 right-6 z-40` should appear when the user scrolls past the hero, allowing instantaneous ambient switching from anywhere on the page without scrolling back up.

3. **Lighting & Content Shift Mechanics**:
   - **Day Mode (Pizzeria Bistro)**:
     - Warm ambient radial gradient over hero: `from-amber-950/30 via-black/70 to-black/90`.
     - Hero badge: `🍕 50 TOP PIZZA STANDARD · NEAPELJSKI BISTRO` (warm amber/gold).
     - Hero tagline: `"Pristna neapeljska pizza, panuozzo sendviči in sončen grajski vrt v Ljubljani."`
     - Hero CTA #1: `Naročim in pridem iskat` (terracotta/amber gradient button).
     - Dual Messaging: The "Podnevi" card is illuminated (`border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40 bg-gradient-to-b from-amber-950/30 to-zinc-900/90`) with an `✓ AKTIVNI AMBIENT` badge, while the "Zvečer" card displays a switch prompt.
   - **Night Mode (Dance Club)**:
     - Deep neon red & club purple ambient radial gradient: `from-red-950/40 via-purple-950/30 to-black`.
     - Hero badge: `🪩 BERLIN SOUND · KLIPSCH LA SCALA AUDIO SYSTEM` (neon red).
     - Hero tagline: `"Avdiofilska klubska kultura, petkovi & sobotni seti do 05:00 in varno plesišče."`
     - Hero CTA #1: `Koledar Dogodkov & Vstopnice` (neon red gradient button).
     - Dual Messaging: The "Zvečer" card is illuminated (`border-red-600/70 shadow-[0_0_50px_rgba(239,68,68,0.3)] ring-1 ring-red-500/40 bg-gradient-to-b from-red-950/30 to-zinc-900/90`) with an `✓ AKTIVNI AMBIENT` badge, while the "Podnevi" card displays a switch prompt.

4. **Gallery Lightbox Modal Component Architecture**:
   - Rather than embedding 150+ lines of modal logic directly in `index.vue`, create a dedicated, reusable component: `src/components/ImageLightboxModal.vue`.
   - In `index.vue`, convert gallery `<a>` tags to accessible `<button>` triggers with a hover overlay containing a zoom icon (`MagnifyingGlassPlusIcon`).
   - Clicking a photo triggers `openLightbox(idx)`, passing the items and initial index to `<ImageLightboxModal>`.
   - The modal renders inside `<Teleport to="body">` with `<Transition>`.
   - Supports:
     - High-res image display with `getOptImg(item.src, 1600, 85, 'webp')`.
     - ESC key and backdrop click to close.
     - ArrowLeft and ArrowRight keyboard controls.
     - Prev / Next touch buttons and mobile touch swipe gestures (`@touchstart`, `@touchend`).
     - Bottom thumbnail filmstrip allowing instant 1-tap jumping to any photo.
     - Image counter badge (`Foto X / Y`) and external Instagram link.
     - Body scroll lock during open state.

---

## 3. Caveats

1. **Image Dimensions**: The gallery items in `useSiteImages.ts` are high-resolution local images in `public/images/instagram/` and `public/`. Using `getOptImg(src, 1600, 85, 'webp')` routes through the cached `/api/img` Sharp pipeline, ensuring optimal load times on retina screens.
2. **SSR Hydration**: `localStorage` and `window` access must be gated with `typeof window !== 'undefined'` or in `onMounted()` to guarantee zero SSR hydration mismatches.
3. **No External Network Dependencies**: All icons come from existing `@heroicons/vue` package. No third-party lightbox npm packages are required, ensuring 0 bundle bloat.

---

## 4. Conclusion & Detailed Implementation Specifications

The architecture for Milestone 1 is fully validated. Below are the exact code specifications for the Worker implementer.

### 4.1 New Component: `src/components/ImageLightboxModal.vue`

Create file `/home/ator/Kader/src/components/ImageLightboxModal.vue`:

```vue
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
        v-if="modelValue && currentItem"
        class="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-2xl text-white select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="t('gallery.title', 'Kader Galerija Slik')"
        @click="onBackdropClick"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between px-4 md:px-8 py-4 z-20 bg-gradient-to-b from-black/80 to-transparent" @click.stop>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-zinc-800/90 border border-zinc-700/80 rounded-full text-xs font-mono font-bold text-zinc-300">
              {{ currentIndex + 1 }} / {{ items.length }}
            </span>
            <span class="hidden sm:inline-block text-xs font-mono text-zinc-400">
              @kader.lunapark
            </span>
          </div>

          <div class="flex items-center space-x-3">
            <a
              href="https://www.instagram.com/kader.lunapark/"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 hover:text-white transition-colors min-h-[44px]"
            >
              <span>Instagram</span>
              <span class="text-xs">↗</span>
            </a>
            <button
              type="button"
              @click="close"
              class="w-11 h-11 rounded-full bg-zinc-900/80 hover:bg-red-600/90 border border-zinc-700/80 hover:border-red-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
              aria-label="Zapri galerijo (Esc)"
              title="Zapri (Esc)"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Main Stage (Image + Side Controls) -->
        <div class="relative flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <!-- Previous Button -->
          <button
            type="button"
            @click.stop="prev"
            class="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-white flex items-center justify-center transition-all hover:scale-110 shadow-xl min-h-[44px] min-w-[44px]"
            aria-label="Prejšnja slika (Leva puščica)"
            title="Prejšnja (←)"
          >
            <ChevronLeftIcon class="w-6 h-6" />
          </button>

          <!-- Current Image Container -->
          <div class="relative max-w-5xl max-h-[75vh] flex items-center justify-center" @click.stop>
            <Transition name="fade-img" mode="out-in">
              <img
                :key="currentIndex"
                :src="getOptImg(currentItem.src, 1600, 85, 'webp')"
                :alt="currentItem.label"
                class="max-h-[70vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-zinc-800/80 shadow-2xl shadow-black/80"
              />
            </Transition>
          </div>

          <!-- Next Button -->
          <button
            type="button"
            @click.stop="next"
            class="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-white flex items-center justify-center transition-all hover:scale-110 shadow-xl min-h-[44px] min-w-[44px]"
            aria-label="Naslednja slika (Desna puščica)"
            title="Naslednja (→)"
          >
            <ChevronRightIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Bottom Caption & Filmstrip Strip -->
        <div class="z-20 bg-gradient-to-t from-black via-black/90 to-transparent px-4 py-4 md:py-6 flex flex-col items-center gap-3" @click.stop>
          <div class="text-center max-w-2xl px-4">
            <h3 class="text-base md:text-xl font-bold tracking-tight text-white mb-1">
              {{ currentItem.label }}
            </h3>
            <p class="text-xs text-zinc-400 font-medium">
              Grad Kodeljevo · Ulica Carla Benza 20, Ljubljana
            </p>
          </div>

          <!-- Filmstrip Thumbnails -->
          <div class="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 hide-scrollbar">
            <button
              v-for="(item, idx) in items"
              :key="idx"
              type="button"
              @click="goTo(idx)"
              class="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border transition-all duration-300 min-h-[44px] min-w-[44px]"
              :class="idx === currentIndex ? 'border-red-500 scale-105 ring-2 ring-red-500/50' : 'border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600'"
              :aria-label="`Prikaži sliko ${idx + 1}: ${item.label}`"
            >
              <img :src="getOptImg(item.src, 120, 70, 'webp')" :alt="item.label" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface GalleryItem {
  src: string
  label: string
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  items: GalleryItem[]
  initialIndex?: number
}>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'change', index: number): void
}>()

const { t } = useLocale()
const { getOptImg } = useSiteImages()

const currentIndex = ref(props.initialIndex)

watch(() => props.initialIndex, (newIdx) => {
  if (newIdx >= 0 && newIdx < props.items.length) {
    currentIndex.value = newIdx
  }
})

watch(() => props.modelValue, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const currentItem = computed<GalleryItem | undefined>(() => {
  if (!props.items || props.items.length === 0) return undefined
  return props.items[currentIndex.value] || props.items[0]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const next = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value + 1) % props.items.length
  emit('change', currentIndex.value)
}

const prev = () => {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  emit('change', currentIndex.value)
}

const goTo = (idx: number) => {
  if (idx >= 0 && idx < props.items.length) {
    currentIndex.value = idx
    emit('change', idx)
  }
}

const onBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    close()
  }
}

// Touch swipe gestures
let touchStartX = 0
let touchStartY = 0
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].clientX
  touchStartY = e.changedTouches[0].clientY
}
const onTouchEnd = (e: TouchEvent) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) next()
    else prev()
  }
}

// Keyboard handling (Escape, ArrowLeft, ArrowRight)
const onKeydown = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.fade-img-enter-active,
.fade-img-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-img-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-img-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
```

---

### 4.2 Elevation of `src/pages/index.vue`

The following modifications must be applied to `src/pages/index.vue`:

1. **State & Imports**:
```ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  CheckIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MagnifyingGlassPlusIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

export type AmbientMode = 'day' | 'night'

const ambientMode = ref<AmbientMode>('day')
const scrolledPastHero = ref(false)

// Lightbox state
const lightboxOpen = ref(false)
const selectedImageIndex = ref(0)

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  lightboxOpen.value = true
}

const setAmbientMode = (mode: AmbientMode) => {
  ambientMode.value = mode
  if (typeof window !== 'undefined') {
    localStorage.setItem('kader_ambient_mode', mode)
  }
}

const toggleAmbientMode = () => {
  setAmbientMode(ambientMode.value === 'day' ? 'night' : 'day')
}

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    scrolledPastHero.value = window.scrollY > 400
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    const saved = localStorage.getItem('kader_ambient_mode') as AmbientMode | null
    if (saved === 'day' || saved === 'night') {
      ambientMode.value = saved
    } else {
      const hour = new Date().getHours()
      ambientMode.value = (hour >= 8 && hour < 18) ? 'day' : 'night'
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
```

2. **Hero Ambient Mode Switcher Template**:
Place directly above the Address & Contact Quick Badge (around line 18):
```html
<!-- Interactive Ambient Mode Switcher (Day vs Night) -->
<div 
  class="inline-flex items-center p-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-xl shadow-2xl mb-8 relative transition-all duration-500"
  :class="ambientMode === 'day' ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'"
  role="radiogroup"
  aria-label="Izbira ambienta: Dnevni bistro ali Nočni klub"
>
  <button
    type="button"
    role="radio"
    :aria-checked="ambientMode === 'day'"
    @click="setAmbientMode('day')"
    class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 min-h-[44px]"
    :class="ambientMode === 'day' 
      ? 'text-white bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 shadow-lg shadow-amber-950/60' 
      : 'text-zinc-400 hover:text-zinc-200'"
  >
    <span class="text-base">🍕</span>
    <span>Dnevni Bistro</span>
    <span v-if="ambientMode === 'day'" class="w-2 h-2 rounded-full bg-amber-200 animate-pulse"></span>
  </button>

  <button
    type="button"
    role="radio"
    :aria-checked="ambientMode === 'night'"
    @click="setAmbientMode('night')"
    class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 min-h-[44px]"
    :class="ambientMode === 'night' 
      ? 'text-white bg-gradient-to-r from-red-600 via-red-500 to-purple-700 shadow-lg shadow-red-950/80' 
      : 'text-zinc-400 hover:text-zinc-200'"
  >
    <span class="text-base">🪩</span>
    <span>Nočni Klub</span>
    <span v-if="ambientMode === 'night'" class="w-2 h-2 rounded-full bg-red-200 animate-pulse"></span>
  </button>
</div>
```

3. **Dynamic Hero Glow, Tagline & CTAs**:
- Background Gradient:
  ```html
  <div 
    class="absolute inset-0 z-10 transition-colors duration-700 pointer-events-none"
    :class="ambientMode === 'day' 
      ? 'bg-gradient-to-t from-black via-amber-950/20 to-black/70' 
      : 'bg-gradient-to-t from-black via-red-950/30 to-purple-950/20'"
  ></div>
  ```
- Dynamic Tagline:
  ```html
  <p 
    class="text-xl md:text-2xl font-bold mb-8 tracking-widest uppercase transition-colors duration-500"
    :class="ambientMode === 'day' ? 'text-amber-400' : 'text-red-500'"
  >
    “{{ ambientMode === 'day' ? 'Pristna neapeljska pica & sproščeni grajski vrt' : t('hero.tagline') }}”
  </p>
  ```
- Dynamic CTAs:
  ```html
  <div class="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
    <NuxtLink 
      v-if="ambientMode === 'day'" 
      to="/pizzeria" 
      class="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-950 text-center flex-1 min-w-[170px]"
    >
      Naročim & pridem iskat →
    </NuxtLink>
    <NuxtLink 
      v-else 
      to="/events" 
      class="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-950 text-center flex-1 min-w-[170px]"
    >
      {{ t('hero.events') }} (RA) →
    </NuxtLink>

    <NuxtLink 
      to="/pizzeria" 
      class="px-8 py-3.5 bg-zinc-900 border hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]"
      :class="ambientMode === 'day' ? 'border-amber-500/50 text-amber-200' : 'border-zinc-700'"
    >
      {{ t('nav.pizzeria') }}
    </NuxtLink>
    <NuxtLink 
      to="/club" 
      class="px-8 py-3.5 bg-zinc-900 border hover:bg-zinc-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-center flex-1 min-w-[150px]"
      :class="ambientMode === 'night' ? 'border-red-500/50 text-red-200' : 'border-zinc-700'"
    >
      {{ t('nav.club') }}
    </NuxtLink>
  </div>
  ```

4. **Elevated Dual Messaging Section**:
```html
<section class="py-20 px-4 bg-zinc-950 border-y border-zinc-900 transition-colors duration-700">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
    <!-- Day Card (Pizzeria Bistro) -->
    <div 
      class="p-8 rounded-3xl flex flex-col justify-between transition-all duration-500"
      :class="ambientMode === 'day' 
        ? 'bg-gradient-to-b from-amber-950/30 to-zinc-900/90 border-2 border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.2)] scale-[1.01]' 
        : 'bg-zinc-900/60 border border-zinc-800/80 opacity-80 hover:opacity-100 hover:border-amber-800/50'"
    >
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <span class="text-4xl">🍕</span>
            <h2 class="text-3xl font-black uppercase text-white">{{ t('home.dayTitle') }}</h2>
          </div>
          <span 
            v-if="ambientMode === 'day'" 
            class="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full"
          >
            ● Aktiven Ambient
          </span>
          <button 
            v-else 
            type="button" 
            @click="setAmbientMode('day')" 
            class="text-xs text-amber-400 hover:underline font-bold"
          >
            Preklopi sem ↗
          </button>
        </div>
        <p class="text-gray-300 text-lg mb-6 leading-relaxed">
          {{ t('home.dayP') }}
        </p>
        <ul class="space-y-3 mb-8 text-sm text-gray-300">
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" /> {{ t('home.dayF1') }}</li>
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" /> {{ t('home.dayF2') }}</li>
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" /> {{ t('home.dayF3') }}</li>
        </ul>
      </div>
      <NuxtLink 
        to="/pizzeria" 
        class="inline-block text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 min-h-[44px]"
        :class="ambientMode === 'day' 
          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950' 
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'"
      >
        {{ t('home.dayCta') }}
      </NuxtLink>
    </div>

    <!-- Night Card (Dance Club) -->
    <div 
      class="p-8 rounded-3xl flex flex-col justify-between transition-all duration-500"
      :class="ambientMode === 'night' 
        ? 'bg-gradient-to-b from-red-950/30 via-purple-950/20 to-zinc-900/90 border-2 border-red-600/70 shadow-[0_0_50px_rgba(239,68,68,0.25)] scale-[1.01]' 
        : 'bg-zinc-900/60 border border-zinc-800/80 opacity-80 hover:opacity-100 hover:border-purple-800/50'"
    >
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <span class="text-4xl">🪩</span>
            <h2 class="text-3xl font-black uppercase text-white">{{ t('home.nightTitle') }}</h2>
          </div>
          <span 
            v-if="ambientMode === 'night'" 
            class="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full"
          >
            ● Aktiven Ambient
          </span>
          <button 
            v-else 
            type="button" 
            @click="setAmbientMode('night')" 
            class="text-xs text-purple-400 hover:underline font-bold"
          >
            Preklopi sem ↗
          </button>
        </div>
        <p class="text-gray-300 text-lg mb-6 leading-relaxed">
          {{ t('home.nightP') }}
        </p>
        <ul class="space-y-3 mb-8 text-sm text-gray-300">
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF1') }}</li>
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF2') }}</li>
          <li class="flex items-center"><CheckIcon class="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" /> {{ t('home.nightF3') }}</li>
        </ul>
      </div>
      <NuxtLink 
        to="/events" 
        class="inline-block text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 min-h-[44px]"
        :class="ambientMode === 'night' 
          ? 'bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 text-white shadow-lg shadow-red-950' 
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'"
      >
        {{ t('home.nightCta') }}
      </NuxtLink>
    </div>
  </div>
</section>
```

5. **Gallery Section Elevation with Lightbox Button Triggers**:
Replace lines 270–288 in `src/pages/index.vue`:
```html
<!-- Image Grid (Interactive Lightbox Triggers) -->
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
  <button 
    v-for="(item, idx) in siteImages.gallery_items" 
    :key="idx"
    type="button"
    @click="openLightbox(idx)"
    class="relative group aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-600/60 transition-all duration-500 text-left focus:outline-none focus:ring-2 focus:ring-red-500 cursor-zoom-in"
    :aria-label="`Poglej sliko v polni velikosti: ${item.label}`"
  >
    <img 
      :src="getOptImg(item.src, 640, 80)" 
      :alt="item.label" 
      loading="lazy"
      decoding="async"
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
    />
    <!-- Hover Glass Overlay with Zoom Icon & Label -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
      <div class="flex justify-end">
        <span class="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
          <MagnifyingGlassPlusIcon class="w-5 h-5" />
        </span>
      </div>
      <div>
        <span class="text-xs font-bold text-white uppercase tracking-wider block mb-1">{{ item.label }}</span>
        <span class="text-[10px] text-red-400 font-mono flex items-center gap-1">
          <span>Odpri v polni resoluciji</span>
          <span>↗</span>
        </span>
      </div>
    </div>
  </button>
</div>

<!-- Lightbox Modal Instance -->
<ImageLightboxModal
  v-model="lightboxOpen"
  :items="siteImages.gallery_items"
  :initial-index="selectedImageIndex"
/>

<!-- Floating Ambient Mode Pill (Sticky on Scroll) -->
<aside 
  class="fixed bottom-6 right-6 z-40 transition-all duration-500 transform"
  :class="scrolledPastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
>
  <button
    type="button"
    @click="toggleAmbientMode"
    class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-950/95 border backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 min-h-[44px]"
    :class="ambientMode === 'day' 
      ? 'border-amber-500/60 text-amber-300 hover:border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' 
      : 'border-red-500/60 text-red-300 hover:border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]'"
    :aria-label="ambientMode === 'day' ? 'Preklopi na Nočni Klub' : 'Preklopi na Dnevni Bistro'"
  >
    <span class="text-base">{{ ambientMode === 'day' ? '☀️' : '🌙' }}</span>
    <span class="text-xs font-black uppercase tracking-wider text-white">
      {{ ambientMode === 'day' ? 'Dnevni Bistro' : 'Nočni Klub' }}
    </span>
    <span 
      class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
      :class="ambientMode === 'day' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'"
    >
      {{ ambientMode === 'day' ? 'PICA' : 'KLUB' }}
    </span>
  </button>
</aside>
```

---

## 5. Verification Method

To verify the implementation independently:

1. **Static Typecheck**:
   ```bash
   npx nuxi typecheck
   ```
   *Pass criteria*: Exit code 0, 0 TypeScript or Vue template errors.

2. **Full Production Build**:
   ```bash
   npx nuxi cleanup && npm run build
   ```
   *Pass criteria*: Exit code 0, `.output/server/index.mjs` successfully generated.

3. **Interactive & Responsive Behavioral Verification**:
   - **Hero Ambient Switcher**:
     - Clicking "Dnevni Bistro" sets `ambientMode = 'day'`, displays warm amber radial glow, updates tagline to bistro focus, sets primary CTA to pizza order, and highlights the "Podnevi" card.
     - Clicking "Nočni Klub" sets `ambientMode = 'night'`, displays neon red/purple glow, updates tagline to club focus, sets primary CTA to RA events, and highlights the "Zvečer" card.
     - Reloading preserves the selection via `localStorage`.
   - **Floating Quick Switcher**:
     - Scrolling down past 400px reveals the sticky floating pill at the bottom-right.
     - Clicking toggles between Day and Night instantly.
   - **Gallery Lightbox Modal**:
     - Clicking any gallery photo opens the full-screen modal in `<Teleport to="body">`.
     - Background body scroll is locked (`overflow: hidden`).
     - Image displays in high resolution (`1600px WebP`).
     - Pressing `Escape` or clicking the backdrop closes the modal and unlocks body scroll.
     - Pressing `ArrowLeft` / `ArrowRight` cycles through the photos.
     - Clicking next/prev buttons cycles through photos in circular fashion.
     - Clicking any thumbnail in the filmstrip jumps directly to that photo.
     - Mobile swipe gestures advance or reverse the photos.
