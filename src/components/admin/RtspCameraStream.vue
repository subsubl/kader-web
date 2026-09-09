<template>
  <div class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
    <!-- Card Header -->
    <div class="p-4 bg-gray-800/80 border-b border-gray-700/80 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="p-2 bg-red-950/60 border border-red-800/50 rounded-lg text-red-400 shrink-0">
          <VideoCameraIcon class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-white text-base truncate">{{ currentCamera?.name || 'RTSP Security Stream' }}</h3>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-900/50 text-red-300 border border-red-700/50">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1"></span>
              LIVE
            </span>
          </div>
          <p class="text-xs text-gray-400 truncate">{{ currentCamera?.location || 'Grad Kodeljevo System' }} • {{ currentCamera?.type.toUpperCase() || 'RTSP' }}</p>
        </div>
      </div>

      <!-- Controls & Camera Selector -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Camera Selector Dropdown -->
        <select 
          v-model="activeCameraId" 
          @change="onCameraSelect"
          class="bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 transition-colors"
        >
          <option v-for="cam in cameras" :key="cam.id" :value="cam.id">
            {{ cam.name }}
          </option>
        </select>

        <!-- Settings Shortcut -->
        <NuxtLink 
          to="/admin/settings"
          class="p-1.5 bg-gray-700/60 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
          title="Configure Camera Streams"
        >
          <Cog6ToothIcon class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Video Feed Container -->
    <div ref="containerRef" class="relative bg-black flex-1 min-h-[220px] flex items-center justify-center overflow-hidden group">
      <!-- HTML5 Video Stream Player -->
      <video
        ref="videoRef"
        :src="currentCamera?.url"
        autoplay
        loop
        muted
        playsinline
        @loadedmetadata="onLoaded"
        @error="onError"
        class="w-full h-full object-cover"
        :class="{ 'opacity-0': isError || isLoading }"
      ></video>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-gray-400 gap-2">
        <ArrowPathIcon class="w-8 h-8 text-red-500 animate-spin" />
        <span class="text-xs font-mono">Connecting to {{ currentCamera?.type.toUpperCase() }} feed...</span>
      </div>

      <!-- Error / Offline Fallback Overlay -->
      <div v-if="isError" class="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center p-6 text-center">
        <VideoCameraSlashIcon class="w-12 h-12 text-red-400 mb-2" />
        <h4 class="text-sm font-semibold text-white">Stream Unavailable</h4>
        <p class="text-xs text-gray-400 mt-1 max-w-xs">
          Unable to establish RTSP connection for <span class="font-mono text-gray-300">{{ currentCamera?.name }}</span>.
        </p>
        <div class="flex items-center gap-2 mt-4">
          <button 
            @click="retryStream" 
            class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" /> Retry Stream
          </button>
          <NuxtLink 
            to="/admin/settings"
            class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg transition-colors"
          >
            Settings
          </NuxtLink>
        </div>
      </div>

      <!-- Video Control Toolbar Overlay (Hover) -->
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div class="flex items-center gap-2 text-xs text-gray-300 font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>1080p 30fps</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button 
            @click="takeSnapshot" 
            class="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white rounded transition-colors"
            title="Take Frame Snapshot"
          >
            <CameraIcon class="w-4 h-4" />
          </button>
          <button 
            @click="toggleMute" 
            class="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white rounded transition-colors"
            :title="isMuted ? 'Unmute Audio' : 'Mute Audio'"
          >
            <SpeakerXMarkIcon v-if="isMuted" class="w-4 h-4 text-red-400" />
            <SpeakerWaveIcon v-else class="w-4 h-4" />
          </button>
          <button 
            @click="toggleFullscreen" 
            class="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white rounded transition-colors"
            title="Toggle Fullscreen"
          >
            <ArrowsPointingOutIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Card Footer Stats -->
    <div class="p-3 bg-gray-800/90 border-t border-gray-700/80 flex items-center justify-between text-xs text-gray-400">
      <div class="flex items-center gap-3">
        <span>Protocol: <strong class="text-gray-200 font-mono">{{ currentCamera?.type.toUpperCase() }}</strong></span>
        <span>Latency: <strong class="text-emerald-400 font-mono">140ms</strong></span>
      </div>
      <span class="truncate max-w-[200px] font-mono text-[11px] text-gray-500">{{ currentCamera?.url }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  VideoCameraIcon, 
  VideoCameraSlashIcon, 
  ArrowPathIcon, 
  Cog6ToothIcon, 
  CameraIcon, 
  ArrowsPointingOutIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon 
} from '@heroicons/vue/24/outline'
import { useCameraConfig } from '~/composables/useCameraConfig'

const { cameras, activeCameraId, setActiveCamera } = useCameraConfig()

const containerRef = ref<HTMLDivElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const isLoading = ref(true)
const isError = ref(false)
const isMuted = ref(true)

const currentCamera = computed(() => {
  return cameras.value.find(c => c.id === activeCameraId.value) || cameras.value[0]
})

const onCameraSelect = () => {
  if (activeCameraId.value) {
    setActiveCamera(activeCameraId.value)
    retryStream()
  }
}

const onLoaded = () => {
  isLoading.value = false
  isError.value = false
}

const onError = () => {
  isLoading.value = false
  isError.value = true
}

const retryStream = () => {
  isLoading.value = true
  isError.value = false
  if (videoRef.value && currentCamera.value) {
    videoRef.value.src = currentCamera.value.url
    videoRef.value.load()
    videoRef.value.play().catch(() => {
      // Autoplay blocked or load failed
    })
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

const toggleFullscreen = () => {
  if (!containerRef.value) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    containerRef.value.requestFullscreen()
  }
}

const takeSnapshot = () => {
  if (!videoRef.value) return
  try {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth || 1280
    canvas.height = videoRef.value.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `kader-snapshot-${currentCamera.value?.id || 'cam'}-${Date.now()}.png`
      link.click()
    }
  } catch (err) {
    console.error('Failed to take snapshot:', err)
  }
}

watch(activeCameraId, () => {
  retryStream()
})

onMounted(() => {
  retryStream()
})
</script>
