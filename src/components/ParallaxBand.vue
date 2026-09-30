<template>
  <figure
    :ref="setRoot"
    class="parallax-band"
    :style="{ height: typeof height === 'number' ? height + 'px' : height }"
  >
    <div :ref="setInner" class="parallax-band__inner">
      <img
        :src="src"
        :alt="alt"
        loading="lazy"
        decoding="async"
      >
    </div>
  </figure>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useParallax } from '~/composables/useParallax'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  /** Band height in px, or a CSS length such as '52vh'. */
  height?: number | string
}>(), {
  height: 320
})

// Function refs keep the element typed as a plain node, which Vue's VNodeRef
// accepts; a Ref<HTMLElement> does not typecheck here.
let rootEl: HTMLElement | undefined
let innerEl: HTMLElement | undefined

const setRoot = (el: unknown) => { rootEl = (el as HTMLElement) ?? undefined }
const setInner = (el: unknown) => { innerEl = (el as HTMLElement) ?? undefined }

const { register, unregister, update } = useParallax()

onMounted(() => {
  if (innerEl) register(innerEl)
  update()
})

onBeforeUnmount(() => {
  if (innerEl) unregister(innerEl)
})
</script>
