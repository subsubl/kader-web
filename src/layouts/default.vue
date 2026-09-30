<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>
