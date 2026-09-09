<template>
  <div class="flex items-center gap-3 bg-gray-800/90 hover:bg-gray-800 border border-gray-700/80 rounded-lg px-3 py-1.5 shadow-sm transition-all duration-200">
    <!-- Radio Branding & Live Indicator -->
    <div class="flex items-center gap-2">
      <div class="relative flex h-2.5 w-2.5 items-center justify-center">
        <span 
          v-if="isPlaying" 
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        ></span>
        <span 
          :class="isPlaying ? 'bg-red-500' : isError ? 'bg-amber-500' : 'bg-gray-500'" 
          class="relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-300"
        ></span>
      </div>

      <div class="flex flex-col">
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold tracking-wide text-white font-mono">RADIO MEUH</span>
          <span class="text-[10px] uppercase font-semibold px-1 py-0.2 bg-red-950/80 text-red-400 border border-red-800/60 rounded">
            LIVE
          </span>
        </div>
        <span class="text-[10px] text-gray-400 truncate max-w-[110px] sm:max-w-[160px]">
          {{ isError ? 'Reconnecting stream...' : isPlaying ? 'Reblochonland Stream' : 'Ready' }}
        </span>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-6 w-px bg-gray-700 mx-0.5"></div>

    <!-- Play / Pause Button -->
    <button 
      @click="togglePlay"
      :disabled="isLoading"
      class="p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      :title="isPlaying ? 'Pause Radio Meuh' : 'Play Radio Meuh'"
    >
      <ArrowPathIcon v-if="isLoading" class="w-4 h-4 animate-spin" />
      <PauseIcon v-else-if="isPlaying" class="w-4 h-4" />
      <PlayIcon v-else class="w-4 h-4 translate-x-0.5" />
    </button>

    <!-- Reload Stream Button -->
    <button 
      @click="reloadStream"
      class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/70 transition-colors"
      title="Reload / Reconnect Radio Stream"
    >
      <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isReloading }" />
    </button>

    <!-- Volume Control -->
    <div class="hidden sm:flex items-center gap-1.5 group relative">
      <button 
        @click="toggleMute"
        class="text-gray-400 hover:text-white p-1 rounded transition-colors"
        :title="isMuted ? 'Unmute' : 'Mute'"
      >
        <SpeakerXMarkIcon v-if="isMuted || volume === 0" class="w-4 h-4 text-red-400" />
        <SpeakerWaveIcon v-else class="w-4 h-4" />
      </button>

      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        v-model.number="volume" 
        @input="updateVolume"
        class="w-16 sm:w-20 accent-red-500 bg-gray-700 h-1.5 rounded-lg cursor-pointer appearance-none"
        title="Volume"
      />
    </div>

    <!-- Hidden Audio Element -->
    <audio 
      ref="audioRef"
      preload="none"
      @playing="onPlaying"
      @pause="onPause"
      @waiting="onWaiting"
      @error="onError"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { PlayIcon, PauseIcon, ArrowPathIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid'

const STREAM_URL = 'https://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3'

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isLoading = ref(false)
const isReloading = ref(false)
const isError = ref(false)
const isMuted = ref(false)
const volume = ref(0.8)
const lastVolume = ref(0.8)

const togglePlay = async () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    try {
      isLoading.value = true
      isError.value = false
      if (!audioRef.value.src) {
        audioRef.value.src = STREAM_URL
      }
      await audioRef.value.play()
    } catch (err) {
      console.error('Radio Meuh playback error:', err)
      isError.value = true
      isPlaying.value = false
    } finally {
      isLoading.value = false
    }
  }
}

const reloadStream = async () => {
  if (!audioRef.value) return
  isReloading.value = true
  isError.value = false
  
  try {
    const wasPlaying = isPlaying.value
    audioRef.value.pause()
    // Append timestamp cache-buster to force fresh stream reconnect
    audioRef.value.src = `${STREAM_URL}?t=${Date.now()}`
    audioRef.value.load()
    
    if (wasPlaying) {
      await audioRef.value.play()
    }
  } catch (err) {
    console.error('Failed to reload Radio Meuh stream:', err)
    isError.value = true
  } finally {
    setTimeout(() => {
      isReloading.value = false
    }, 500)
  }
}

const updateVolume = () => {
  if (!audioRef.value) return
  audioRef.value.volume = volume.value
  if (volume.value > 0) {
    isMuted.value = false
    audioRef.value.muted = false
  }
}

const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
  if (isMuted.value) {
    lastVolume.value = volume.value
  } else {
    volume.value = lastVolume.value > 0 ? lastVolume.value : 0.8
    audioRef.value.volume = volume.value
  }
}

const onPlaying = () => {
  isPlaying.value = true
  isLoading.value = false
  isError.value = false
}

const onPause = () => {
  isPlaying.value = false
  isLoading.value = false
}

const onWaiting = () => {
  isLoading.value = true
}

const onError = () => {
  isError.value = true
  isPlaying.value = false
  isLoading.value = false
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>
