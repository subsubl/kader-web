<template>
  <!-- Slim closing bar: just the copyright. All contact details live in the
       contact section, so repeating them here was redundant. -->
  <footer class="bg-kader-red border-t border-white/25 py-6 text-center text-white/70">
    <p class="text-xs">
      &copy; {{ new Date().getFullYear() }} Kader Grad Kodeljevo
    </p>
  </footer>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>
