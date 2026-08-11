<template>
  <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-300">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-gray-400 font-medium mb-1">{{ title }}</p>
        <p class="text-3xl font-bold">{{ value }}</p>
      </div>
      <div :class="iconColor" class="w-12 h-12 rounded-lg flex items-center justify-center">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
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