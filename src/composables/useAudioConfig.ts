import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'kader_audio_config'

export interface AudioConfig {
  radioStreamUrl: string
  clubAudioUrl: string
}

const DEFAULT_CONFIG: AudioConfig = {
  radioStreamUrl: 'https://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3',
  clubAudioUrl: 'https://cdn.pixabay.com/audio/2022/10/14/audio_9939f792cb.mp3' // Default placeholder beat
}

const audioConfig = ref<AudioConfig>({ ...DEFAULT_CONFIG })
const isInitialized = ref(false)

export function useAudioConfig() {
  const init = () => {
    if (isInitialized.value || typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        audioConfig.value = { ...DEFAULT_CONFIG, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load audio config from localStorage:', e)
    } finally {
      isInitialized.value = true
    }
  }

  const save = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(audioConfig.value))
    } catch (e) {
      console.error('Failed to save audio config to localStorage:', e)
    }
  }

  const updateConfig = (updated: Partial<AudioConfig>) => {
    audioConfig.value = { ...audioConfig.value, ...updated }
    save()
  }

  const resetDefaults = () => {
    audioConfig.value = { ...DEFAULT_CONFIG }
    save()
  }

  onMounted(() => {
    init()
  })

  return {
    audioConfig,
    init,
    updateConfig,
    resetDefaults
  }
}
