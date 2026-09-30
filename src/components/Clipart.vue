<template>
  <!--
    Decorative clipart for the page, in the spirit of the reference template
    (which sets a moon, a circle and arrow dividers into the page).

    Sources are permissively licensed and inlined, so there is no runtime asset
    dependency and the shapes recolour to the surrounding type:

      vinyl  : Tabler Icons "vinyl"  (MIT)
      pizza  : Tabler Icons "pizza"  (MIT)
      bike   : Tabler Icons "bike"   (MIT)
      speaker: Tabler Icons "volume-2" (MIT)
      arrows : Tabler Icons "chevron-down" / "chevron-up" (MIT)

    Everything is drawn in white (currentColor, which the page sets to white on
    the signal-red background) and used at low opacity so it reads as texture
    rather than as an icon.
  -->
  <div
    :class="['clipart', position, { '-z-10': behind }]"
    :style="wrapperStyle"
    aria-hidden="true"
  >
    <!-- Vinyl record with a stylus -->
    <svg
      v-if="shape === 'vinyl'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M16 3.937a9 9 0 1 0 5 8.063" />
      <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
      <path d="M19 4a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
      <path d="M20 4l-3.5 10l-2.5 2" />
    </svg>

    <!-- Pizza slice -->
    <svg
      v-else-if="shape === 'pizza'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 21.5c-3.04 0-5.952-.714-8.5-1.983l8.5-16.517 8.5 16.517a19.09 19.09 0 0 1-8.5 1.983" />
      <path d="M5.38 15.866a14.94 14.94 0 0 0 6.815 1.634 14.944 14.944 0 0 0 6.502-1.479" />
      <path d="M13 11.01h-.01" />
      <path d="M11 14h-.01" />
    </svg>

    <!-- Bicycle -->
    <svg
      v-else-if="shape === 'bike'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M2 18a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
      <path d="M16 18a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
      <path d="M12 19v-4l-3-3l5-4l2 3h3" />
      <path d="M13.007 5a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
    </svg>

    <!-- Speaker with sound waves -->
    <svg
      v-else-if="shape === 'speaker'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5a.8.8 0 0 1 1.5.5v14a.8.8 0 0 1-1.5.5L6 15Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </svg>

    <!-- Arrows: used by the divider bands, white on the red background -->
    <svg
      v-else-if="shape === 'arrow-down' || shape === 'arrow-up'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-if="shape === 'arrow-down'">
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
import { computed, type CSSProperties } from 'vue'

type Shape = 'vinyl' | 'pizza' | 'bike' | 'speaker' | 'arrow-down' | 'arrow-up'

const props = withDefaults(defineProps<{
  shape: Shape
  /** Rendered size in pixels. */
  size?: number
  /** 0-1; the page uses low values so the shapes read as texture. */
  opacity?: number
  /** Tailwind position classes, e.g. "absolute -left-6 top-4". */
  position?: string
  /** Kept for call sites that pass it; stroke is the house style. */
  variant?: 'stroke' | 'fill'
  /** Send behind the surrounding content. */
  behind?: boolean
}>(), {
  size: 180,
  opacity: 0.18,
  position: 'absolute',
  variant: 'stroke',
  behind: false
})

const wrapperStyle = computed<CSSProperties>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  opacity: props.opacity,
  color: '#ffffff',
  pointerEvents: 'none'
}))

const svgStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  display: 'block'
}))
</script>