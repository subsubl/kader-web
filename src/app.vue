<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { locale } = useLocale()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
    class: 'dark'
  }
})
</script>
