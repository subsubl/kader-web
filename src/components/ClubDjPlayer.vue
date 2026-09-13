<template>
  <div class="relative w-full max-w-4xl mx-auto mt-8 mb-12">
    <div class="bg-[#0e0506]/95 backdrop-blur-xl border border-kader-red/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 text-kader-cream">
      
      <!-- Top Track & Meta Row -->
      <div class="flex items-center justify-between gap-3 mb-2">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Pulsing Sound Badge -->
          <div class="relative shrink-0 flex h-3.5 w-3.5 items-center justify-center">
            <span v-if="isPlaying" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-kader-red opacity-75"></span>
            <span :class="isPlaying ? 'bg-kader-red' : 'bg-kader-cream/40'" class="relative inline-flex rounded-full h-2.5 w-2.5"></span>
          </div>

          <!-- Track Info -->
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-kader-red/20 border border-kader-red/40 text-kader-red rounded">
                {{ currentTrack.tag }}
              </span>
              <span class="text-xs md:text-sm font-bold truncate text-white">
                {{ currentTrack.title }}
              </span>
            </div>
            <p class="text-[11px] text-kader-cream/60 truncate font-mono">
              {{ currentTrack.curator }}
            </p>
          </div>
        </div>

        <!-- Track Switcher -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            @click="prevTrack"
            class="p-1.5 text-kader-cream/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            :title="t('player.prevTrack')"
            :aria-label="t('player.prevTrack')"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button
            type="button"
            @click="nextTrack"
            class="p-1.5 text-kader-cream/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            :title="t('player.nextTrack')"
            :aria-label="t('player.nextTrack')"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
      </div>

      <!-- Waveform & Controls Row -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        <!-- Left: Play/Pause Button + Time -->
        <div class="flex items-center gap-3 md:col-span-3">
          <button
            type="button"
            @click="togglePlay"
            class="w-10 h-10 md:w-11 md:h-11 rounded-full bg-kader-red hover:bg-red-600 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(237,34,36,0.6)] active:scale-95 transition-all cursor-pointer"
            :title="isPlaying ? t('player.pause') : t('player.play')"
            :aria-label="isPlaying ? t('player.pause') : t('player.play')"
          >
            <svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
            <svg v-else class="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>

          <div class="font-mono text-xs text-kader-cream/80">
            <span>{{ formatTime(currentTime) }}</span>
            <span class="text-kader-cream/40 mx-1">/</span>
            <span class="text-kader-cream/50">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Middle: Scrub Bar & Animated Waveform Bars -->
        <div class="md:col-span-6 flex flex-col justify-center gap-1.5">
          <div class="flex items-end justify-between h-6 px-1 gap-1">
            <span
              v-for="(bar, i) in waveformBars"
              :key="i"
              class="flex-1 rounded-t-sm transition-all duration-100"
              :class="isPlaying ? 'bg-gradient-to-t from-kader-red to-amber-400' : 'bg-kader-cream/20'"
              :style="{ height: isPlaying ? `${bar}%` : '15%' }"
            ></span>
          </div>

          <div class="relative flex items-center group">
            <input
              type="range"
              min="0"
              :max="duration || 100"
              step="0.5"
              v-model.number="currentTime"
              @input="onScrub"
              @change="onScrubEnd"
              :aria-label="t('player.timeline')"
              class="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-kader-red group-hover:h-2 transition-all"
            />
          </div>
        </div>

        <!-- Right: Volume & Sound Info -->
        <div class="flex items-center justify-end gap-2.5 md:col-span-3">
          <button
            type="button"
            @click="toggleMute"
            class="p-1.5 text-kader-cream/70 hover:text-white rounded transition-colors cursor-pointer"
            :title="isMuted ? t('player.unmute') : t('player.mute')"
            :aria-label="isMuted ? t('player.unmute') : t('player.mute')"
          >
            <svg v-if="isMuted || volume === 0" class="w-4 h-4 text-kader-red" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="volume"
            @input="updateVolume"
            :aria-label="t('player.volume')"
            class="w-16 md:w-20 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-kader-red"
            :title="t('player.volume')"
          />
          <span class="text-[10px] font-mono text-kader-cream/40 uppercase tracking-wider hidden sm:inline">KLIPSCH</span>
        </div>
      </div>
    </div>
    
    <!-- Hidden Audio Element -->
    <audio 
      ref="audioEl" 
      :src="currentTrack.url" 
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="nextTrack"
      crossorigin="anonymous"
      preload="none"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAudioConfig } from '~/composables/useAudioConfig'
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
const { audioConfig } = useAudioConfig()

const tracks = computed(() => [
  {
    title: 'Kader Vault Session #01',
    curator: t('player.residentSelector'),
    tag: t('player.hypnoticTechno'),
    url: audioConfig.value.clubAudioUrl
  },
  {
    title: 'Basement Sub-Bass Session',
    curator: t('player.acousticCut'),
    tag: t('player.industrialMinimal'),
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946777651a.mp3'
  }
])

const currentTrackIndex = ref(0)
const currentTrack = computed(() => tracks.value[currentTrackIndex.value] || tracks.value[0])
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.75)
const isMuted = ref(false)
const lastVolume = ref(0.75)
const isScrubbing = ref(false)

const audioEl = ref<HTMLAudioElement | null>(null)

// Waveform visualizer state (18 bars)
const waveformBars = ref<number[]>(Array(18).fill(15))
const animTick = ref(0)
let animFrameId: number | null = null

const updateWaveform = () => {
  animTick.value++
  if (isPlaying.value) {
    waveformBars.value = waveformBars.value.map((_, i) => {
      const base = 25 + ((i % 4) * 18)
      const dynamic = Math.sin(animTick.value * 0.18 + i * 0.5) * 35 + Math.random() * 25
      return Math.min(100, Math.max(15, Math.floor(base + dynamic)))
    })
  } else {
    waveformBars.value = waveformBars.value.map(val => Math.max(12, val * 0.9))
  }
  animFrameId = requestAnimationFrame(updateWaveform)
}

const togglePlay = async () => {
  if (!audioEl.value) return
  
  if (isPlaying.value) {
    audioEl.value.pause()
    isPlaying.value = false
  } else {
    try {
      await audioEl.value.play()
      isPlaying.value = true
    } catch (err) {
      console.error('Audio playback failed', err)
    }
  }
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length
  switchTrack(currentTrackIndex.value)
}

const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length
  switchTrack(currentTrackIndex.value)
}

const switchTrack = (idx: number) => {
  currentTrackIndex.value = idx
  currentTime.value = 0
  if (audioEl.value) {
    audioEl.value.src = currentTrack.value.url
    audioEl.value.load()
    if (isPlaying.value) {
      audioEl.value.play().catch(e => console.error(e))
    }
  }
}

const onScrub = () => {
  isScrubbing.value = true
}

const onScrubEnd = () => {
  isScrubbing.value = false
  if (audioEl.value) {
    audioEl.value.currentTime = currentTime.value
  }
}

const onTimeUpdate = () => {
  if (!isScrubbing.value && audioEl.value) {
    currentTime.value = audioEl.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioEl.value) {
    duration.value = audioEl.value.duration
  }
}

const updateVolume = () => {
  if (audioEl.value) {
    audioEl.value.volume = volume.value
  }
  if (volume.value > 0) {
    isMuted.value = false
  }
}

const toggleMute = () => {
  if (!audioEl.value) return
  isMuted.value = !isMuted.value
  if (isMuted.value) {
    lastVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = lastVolume.value
  }
  audioEl.value.volume = volume.value
}

const formatTime = (secs: number) => {
  if (!secs || isNaN(secs)) return '00:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  animFrameId = requestAnimationFrame(updateWaveform)
  if (audioEl.value) {
    audioEl.value.volume = volume.value
  }
})

onBeforeUnmount(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>
