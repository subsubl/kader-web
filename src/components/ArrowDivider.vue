<template>
  <!--
    Full-bleed arrow divider. The reference template separates its blocks with a
    1440x232 arrow image; here the same role is played by a full-width band that
    fades the background and carries a large chevron, so the section boundaries
    read as strongly as they do there.
  -->
  <div
    class="relative w-full overflow-hidden select-none pointer-events-none"
    :style="{ height: heightPx + 'px' }"
    aria-hidden="true"
  >
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 232"
      preserveAspectRatio="none"
      fill="none"
    >
      <!-- gradient wash so the band is a seam, not a hard edge -->
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ed2224" stop-opacity="0" />
          <stop offset="50%" stop-color="#ed2224" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#ed2224" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="232" :fill="`url(#${gradId})`" />
    </svg>

    <svg
      class="absolute left-1/2 -translate-x-1/2"
      :style="{ top: `${(heightPx - chevronPx) / 2}px`, color: '#ffffff', opacity: 0.5 }"
      :width="chevronPx"
      :height="chevronPx"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.1"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-if="direction === 'down'">
        <path d="M12 5v14" />
        <path d="M18 13l-6 6" />
        <path d="M6 13l6 6" />
      </template>
      <template v-else>
        <path d="M12 19V5" />
        <path d="M18 11l-6-6" />
        <path d="M6 11l6-6" />
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  direction?: 'down' | 'up'
  heightPx?: number
  chevronPx?: number
}>(), {
  direction: 'down',
  heightPx: 140,
  chevronPx: 96
})

// Unique gradient id per instance so multiple dividers do not collide.
const gradId = computed(() => `div-grad-${Math.random().toString(36).slice(2, 9)}`)
</script>
