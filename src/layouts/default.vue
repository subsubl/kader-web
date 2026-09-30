<template>
  <div class="min-h-screen flex flex-col bg-kader-red text-white">
    <!-- Language picker only: a small fixed control in the top-right corner,
         with no header bar. -->
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>
