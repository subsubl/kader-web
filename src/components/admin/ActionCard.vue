<template>
  <NuxtLink :to="to" class="action-card">
    <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-3" :class="iconColor">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <h3 class="text-lg font-semibold mb-1">{{ title }}</h3>
    <p class="text-gray-400 text-sm">{{ description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  to: string
  title: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const props = defineProps<Props>()

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-900/30 text-blue-400',
    green: 'bg-green-900/30 text-green-400',
    yellow: 'bg-yellow-900/30 text-yellow-400',
    red: 'bg-red-900/30 text-red-400',
    purple: 'bg-purple-900/30 text-purple-400'
  }
  return `w-12 h-12 rounded-lg flex items-center justify-center ${colors[props.color] || colors.blue}`
})
</script>

<style scoped>
.action-card {
  @apply block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-300;
}
</style>