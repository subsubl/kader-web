<script setup lang="ts">
definePageMeta({
  middleware: [
    (to) => {
      return navigateTo(
        { path: '/club', query: to.query, hash: to.hash },
        { redirectCode: 301 }
      )
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-kader-black text-kader-cream flex items-center justify-center">
    <p class="text-kader-cream/60 text-sm">Preusmerjanje na Klub &amp; Dogodke...</p>
  </div>
</template>
