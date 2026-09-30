<template>
  <!--
    Decorative clipart, in the spirit of the reference template (which sets a
    crescent moon, a circle and arrow dividers into the page).

    Sources are permissively licensed and inlined as SVG so there is no runtime
    dependency:
      moon   : OpenMoji "waxing crescent moon" (1F312)  — CC-BY-SA 4.0 / CC0
      arrow  : Tabler Icons (outline)                    — MIT
      circle : Tabler Icons (outline)                    — MIT
    Recoloured to currentColor so the clipart inherits the white type colour.
  -->
  <div
    class="pointer-events-none select-none"
    :class="positionClass"
    :style="boxStyle"
    aria-hidden="true"
  >
    <svg
      v-if="shape === 'moon'"
      viewBox="0 0 72 72"
      :style="svgStyle"
      fill="none"
    >
      <path
        d="M55 35A28 28 0 0 1 28.45 62.96 28 28 0 1 0 36 8q-.73 0-1.45.04A28 28 0 0 1 55 35Z"
        :fill="color"
      />
    </svg>

    <svg
      v-else-if="shape === 'circle'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
    >
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
    </svg>

    <svg
      v-else-if="shape === 'arrow-down'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M18 13l-6 6" />
      <path d="M6 13l6 6" />
    </svg>

    <svg
      v-else-if="shape === 'arrow-up'"
      viewBox="0 0 24 24"
      :style="svgStyle"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 19V5" />
      <path d="M18 11l-6-6" />
      <path d="M6 11l6-6" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Shape = 'moon' | 'circle' | 'arrow-down' | 'arrow-up'

const props = withDefaults(defineProps<{
  shape: Shape
  /** Rendered size in px. */
  size?: number
  /** 'fill' = ink colour, 'stroke' = hairline outline. */
  variant?: 'fill' | 'stroke'
  /** CSS positioning shorthand, e.g. 'top-8 right-10'. */
  position?: string
  /** Opacity 0-1. */
  opacity?: number
  /** Override the colour (defaults to currentColor for stroke variants). */
  color?: string
}>(), {
  size: 120,
  variant: 'fill',
  position: '',
  opacity: 0.14,
  color: '#ffffff'
})

const positionClass = computed(() => props.position)
const boxStyle = computed(() => ({
  opacity: props.opacity
}))
const svgStyle = computed(() => ({
  width: `${props.size}px`,
  height: props.size === 0 ? undefined : `${props.size}px`,
  display: 'block',
  color: props.variant === 'stroke' ? props.color : undefined
}))
</script>
