<template>
  <footer class="bg-white border-t border-gray-200 py-10 text-gray-500">
    <div class="max-w-5xl mx-auto px-5 text-center space-y-3 text-sm">

      <p class="font-bold text-gray-900">Kader Grad Kodeljevo</p>

      <p>
        <a
          href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7"
          target="_blank"
          rel="noopener noreferrer"
          class="text-kader-red hover:underline"
        >Koblarjeva ulica 34, 1000 Ljubljana</a>
      </p>

      <p>
        <a href="mailto:info@kader.si" class="text-kader-red hover:underline">info@kader.si</a>
      </p>

      <p>
        <a href="https://www.instagram.com/kader.lunapark/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @kader.lunapark" class="text-kader-red hover:underline">
          Instagram
        </a>
      </p>

      <p class="text-xs pt-4">
        &copy; {{ new Date().getFullYear() }} Kader Grad Kodeljevo
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>
