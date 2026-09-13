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
        :aria-label="t('lightbox.galleryAria')"
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
              :aria-label="t('lightbox.closeAria')"
              :title="t('lightbox.closeTitle')"
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
            :aria-label="t('lightbox.prevAria')"
            :title="t('lightbox.prevTitle')"
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
            :aria-label="t('lightbox.nextAria')"
            :title="t('lightbox.nextTitle')"
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
              {{ t('lightbox.venueAddress') }}
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
              :aria-label="t('lightbox.showImageAria', { n: idx + 1, label: item.label })"
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
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
