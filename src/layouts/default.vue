<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>