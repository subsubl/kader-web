<template>
  <figure
    :ref="setRoot"
    class="parallax-band"
    :style="bandStyle"
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
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useParallax } from '~/composables/useParallax'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  /** Band height as a CSS length, e.g. '58vh'. */
  height?: string
}>(), {
  height: '58vh'
})

// Function refs keep the element typed as a plain node, which Vue's VNodeRef
// accepts; a Ref<HTMLElement> does not typecheck here.
let innerEl: HTMLElement | undefined
const bandHeightPx = ref(0)

const setRoot = (el: unknown) => {
  const node = (el as HTMLElement) ?? undefined
  if (node) bandHeightPx.value = node.getBoundingClientRect().height
}
const setInner = (el: unknown) => { innerEl = (el as HTMLElement) ?? undefined }

const { register, unregister, update, oversize } = useParallax()

// The oversize comes from the composable rather than the stylesheet, so the
// travel amplitude and the extra image height can never drift apart. It is
// resolved to pixels because the band height may be a vh value, and
// calc(100% + 46%) would then measure against the wrong reference.
const bandStyle = computed(() => ({
  height: props.height,
  '--oversize': `${Math.round(bandHeightPx.value * oversize)}px`
}))

const measure = () => {
  if (!innerEl) return
  const band = innerEl.parentElement
  if (band) bandHeightPx.value = band.getBoundingClientRect().height
}

onMounted(() => {
  if (innerEl) register(innerEl)
  measure()
  update()
  window.addEventListener('resize', measure, { passive: true })
})

onBeforeUnmount(() => {
  if (innerEl) unregister(innerEl)
  window.removeEventListener('resize', measure)
})
</script>