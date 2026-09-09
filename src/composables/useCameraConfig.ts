import { ref, onMounted } from 'vue'

export interface CameraFeed {
  id: string
  name: string
  location: string
  url: string
  type: 'rtsp' | 'hls' | 'mjpeg' | 'http'
  isDefault?: boolean
}

const DEFAULT_CAMERAS: CameraFeed[] = [
  {
    id: 'cam-main-entrance',
    name: 'Grad Kodeljevo Entrance',
    location: 'Main Castle Gate',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'http',
    isDefault: true
  },
  {
    id: 'cam-club-floor',
    name: 'Underground Club Floor',
    location: 'Dancefloor / Sound System',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'http'
  },
  {
    id: 'cam-bar-pizzeria',
    name: 'Pizzeria & Bar Area',
    location: 'Main Courtyard Bar',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    type: 'http'
  },
  {
    id: 'cam-dj-booth',
    name: 'DJ Booth & Stage',
    location: 'Stage / Equipment Rack',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'http'
  }
]

const STORAGE_KEY = 'kader_camera_config'
const ACTIVE_CAM_KEY = 'kader_active_camera_id'

const cameras = ref<CameraFeed[]>(DEFAULT_CAMERAS)
const activeCameraId = ref<string>('cam-main-entrance')
const isInitialized = ref(false)

export function useCameraConfig() {
  const init = () => {
    if (isInitialized.value || typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          cameras.value = parsed
        }
      }
      const savedActive = localStorage.getItem(ACTIVE_CAM_KEY)
      if (savedActive && cameras.value.some(c => c.id === savedActive)) {
        activeCameraId.value = savedActive
      } else if (cameras.value.length > 0) {
        activeCameraId.value = cameras.value[0].id
      }
    } catch (e) {
      console.error('Failed to load camera config from localStorage:', e)
    } finally {
      isInitialized.value = true
    }
  }

  const save = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras.value))
      localStorage.setItem(ACTIVE_CAM_KEY, activeCameraId.value)
    } catch (e) {
      console.error('Failed to save camera config to localStorage:', e)
    }
  }

  const addCamera = (camera: Omit<CameraFeed, 'id'>) => {
    const id = `cam-${Date.now()}`
    const newCam: CameraFeed = { ...camera, id }
    cameras.value.push(newCam)
    activeCameraId.value = id
    save()
    return newCam
  }

  const updateCamera = (id: string, updated: Partial<Omit<CameraFeed, 'id'>>) => {
    const idx = cameras.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      cameras.value[idx] = { ...cameras.value[idx], ...updated }
      save()
    }
  }

  const deleteCamera = (id: string) => {
    if (cameras.value.length <= 1) {
      throw new Error('At least one camera stream must remain configured.')
    }
    cameras.value = cameras.value.filter(c => c.id !== id)
    if (activeCameraId.value === id) {
      activeCameraId.value = cameras.value[0].id
    }
    save()
  }

  const setActiveCamera = (id: string) => {
    if (cameras.value.some(c => c.id === id)) {
      activeCameraId.value = id
      save()
    }
  }

  const resetDefaults = () => {
    cameras.value = [...DEFAULT_CAMERAS]
    activeCameraId.value = DEFAULT_CAMERAS[0].id
    save()
  }

  onMounted(() => {
    init()
  })

  return {
    cameras,
    activeCameraId,
    init,
    addCamera,
    updateCamera,
    deleteCamera,
    setActiveCamera,
    resetDefaults
  }
}
