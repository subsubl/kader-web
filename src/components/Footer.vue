<template>
  <footer class="bg-kader-red border-t border-white/25 py-10 text-white">
    <div class="max-w-5xl mx-auto px-5 text-center space-y-3 text-sm">

      <p class="font-bold">Kader Grad Kodeljevo</p>

      <p>
        <a
          href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7"
          target="_blank"
          rel="noopener noreferrer"
          class="underline underline-offset-4 hover:text-kader-black transition-colors"
        >Ulica Carla Benza 20, 1000 Ljubljana</a>
      </p>

      <p>
        <a href="mailto:info@kader.si" class="underline underline-offset-4 hover:text-kader-black transition-colors">info@kader.si</a>
      </p>

      <p>
        <a href="tel:+38683836740" class="underline underline-offset-4 hover:text-kader-black transition-colors font-mono">+386 83 836 740</a>
      </p>

      <p>
        <a href="tel:+38640175628" class="underline underline-offset-4 hover:text-kader-black transition-colors font-mono">+386 40 175 628</a>
      </p>

      <p>
        <a href="https://www.instagram.com/kader.lunapark/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @kader.lunapark" class="underline underline-offset-4 hover:text-kader-black transition-colors">
          Instagram
        </a>
      </p>

      <p class="text-xs text-white/70 pt-4">
        &copy; {{ new Date().getFullYear() }} Kader Grad Kodeljevo
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>
