<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Cog6ToothIcon class="w-7 h-7 text-red-500" />
          System Settings &amp; Configuration
        </h1>
        <p class="text-xs text-gray-400 mt-1">Configure security RTSP streams, venue metrics, and operational preferences.</p>
      </div>

      <!-- Action feedback -->
      <div v-if="toastMessage" class="px-4 py-2 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs rounded-lg flex items-center gap-2 shadow-lg animate-fade-in">
        <CheckCircleIcon class="w-4 h-4 text-emerald-400" />
        {{ toastMessage }}
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-800 flex items-center space-x-4">
      <button 
        @click="activeTab = 'cameras'"
        :class="activeTab === 'cameras' ? 'border-red-500 text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'"
        class="py-3 px-1 border-b-2 text-sm flex items-center gap-2 transition-colors"
      >
        <VideoCameraIcon class="w-4 h-4 text-red-400" />
        Security &amp; RTSP Cameras
        <span class="px-2 py-0.5 rounded-full text-[10px] bg-gray-800 text-gray-300 font-mono">{{ cameras.length }}</span>
      </button>

      <button 
        @click="activeTab = 'media'"
        :class="activeTab === 'media' ? 'border-red-500 text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'"
        class="py-3 px-1 border-b-2 text-sm flex items-center gap-2 transition-colors"
      >
        <RadioIcon class="w-4 h-4 text-amber-400" />
        Audio &amp; Radio Streams
      </button>

      <button 
        @click="activeTab = 'venue'"
        :class="activeTab === 'venue' ? 'border-red-500 text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'"
        class="py-3 px-1 border-b-2 text-sm flex items-center gap-2 transition-colors"
      >
        <BuildingOfficeIcon class="w-4 h-4 text-blue-400" />
        Venue &amp; Capacity Limits
      </button>

      <button 
        @click="activeTab = 'notifications'"
        :class="activeTab === 'notifications' ? 'border-red-500 text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'"
        class="py-3 px-1 border-b-2 text-sm flex items-center gap-2 transition-colors"
      >
        <BellIcon class="w-4 h-4 text-emerald-400" />
        Notifications &amp; Telegram
      </button>
    </div>

    <!-- TAB 1: RTSP & CAMERA STREAMS -->
    <div v-if="activeTab === 'cameras'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-white">RTSP Security Stream Feeds</h2>
          <p class="text-xs text-gray-400">Configure video feeds displayed in the BI staff dashboard.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="resetDefaults" 
            class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-lg text-xs font-medium transition-colors"
          >
            Reset Defaults
          </button>
          <button 
            @click="openAddModal" 
            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <PlusIcon class="w-4 h-4" /> Add Camera Stream
          </button>
        </div>
      </div>

      <!-- Camera Cards List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="cam in cameras" 
          :key="cam.id"
          class="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-gray-700 transition-colors"
        >
          <div class="space-y-2">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <div class="p-2 bg-gray-800 rounded-lg text-red-400 border border-gray-700">
                  <VideoCameraIcon class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-bold text-white text-sm">{{ cam.name }}</h3>
                  <p class="text-xs text-gray-400">{{ cam.location }}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] font-mono border border-gray-700 rounded uppercase">
                {{ cam.type }}
              </span>
            </div>

            <div class="bg-black/60 p-2.5 rounded-lg border border-gray-800/80 text-xs font-mono text-gray-300 truncate">
              {{ cam.url }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
            <span class="text-gray-500 text-[11px]">ID: <span class="font-mono">{{ cam.id }}</span></span>
            <div class="flex items-center gap-2">
              <button 
                @click="editCamera(cam)" 
                class="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors"
              >
                Edit
              </button>
              <button 
                @click="handleDeleteCamera(cam.id)" 
                class="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: MEDIA & RADIO MEUH -->
    <div v-if="activeTab === 'media'" class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <RadioIcon class="w-5 h-5 text-amber-400" /> Radio Meuh Internet Radio Stream
        </h2>
        <p class="text-xs text-gray-400 mt-1">Configure background music audio stream URL used by the header player.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Primary Radio Stream URL</label>
          <input 
            type="text" 
            v-model="radioStreamUrl"
            class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
          />
          <p class="text-[11px] text-gray-500">Default: <code class="text-gray-400">https://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3</code></p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Station Info &amp; Website</label>
          <div class="p-3 bg-gray-800/80 border border-gray-700/80 rounded-lg flex items-center justify-between text-xs">
            <div>
              <p class="font-bold text-white">Radio Meuh (Reblochonland)</p>
              <p class="text-gray-400 text-[11px]">Indie, Funk, Groove &amp; Electronic Radio</p>
            </div>
            <a 
              href="https://www.radiomeuh.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg font-medium hover:bg-amber-500/30 transition-colors"
            >
              Visit Website ↗
            </a>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-800 flex justify-end">
        <button @click="saveMediaSettings" class="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors">
          Save Radio Configuration
        </button>
      </div>
    </div>

    <!-- TAB 3: VENUE CAPACITY -->
    <div v-if="activeTab === 'venue'" class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <BuildingOfficeIcon class="w-5 h-5 text-blue-400" /> Operational Limits &amp; Capacity
        </h2>
        <p class="text-xs text-gray-400 mt-1">Set max capacity thresholds for real-time door tracking and BI alert meters.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Max Venue Capacity</label>
          <input 
            type="number" 
            v-model.number="maxCapacity" 
            class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
          />
          <p class="text-[11px] text-gray-500">Legal castle occupancy limit (Guests).</p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Warning Threshold (%)</label>
          <input 
            type="number" 
            v-model.number="warningThreshold" 
            class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
          />
          <p class="text-[11px] text-gray-500">Triggers door warning badge (e.g. 85%).</p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Default Shift Mode</label>
          <select 
            v-model="operatingMode"
            class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="club">Club Night (Nighttime)</option>
            <option value="pizzeria">Daytime Pizzeria</option>
            <option value="buyout">Private Buyout Event</option>
          </select>
          <p class="text-[11px] text-gray-500">Primary operational layout mode.</p>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-800 flex justify-end">
        <button @click="saveVenueSettings" class="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors">
          Save Venue Limits
        </button>
      </div>
    </div>

    <!-- Modal for Adding / Editing Camera Stream -->

    <!-- TAB 4: NOTIFICATIONS & TELEGRAM -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <BellIcon class="w-5 h-5 text-emerald-400" /> Telegram Staff Alert Bot
          </h2>
          <p class="text-xs text-gray-400 mt-1">Send real-time operational alerts to your staff Telegram group chat.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="p-4 rounded-xl border" :class="telegramStatus === 'connected' ? 'bg-emerald-950/30 border-emerald-800/60' : telegramStatus === 'error' ? 'bg-red-950/30 border-red-800/60' : 'bg-gray-800/60 border-gray-700'">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full" :class="telegramStatus === 'connected' ? 'bg-emerald-500' : telegramStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'"></div>
                <span class="text-sm font-bold text-white">
                  {{ telegramStatus === 'connected' ? 'Bot Connected' : telegramStatus === 'error' ? 'Connection Failed' : 'Not Configured' }}
                </span>
              </div>
              <p class="text-xs text-gray-400">{{ telegramStatusMessage }}</p>
            </div>

            <button 
              @click="testTelegram" 
              :disabled="telegramTesting"
              class="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span v-if="telegramTesting">Sending Test Message...</span>
              <span v-else>🤖 Send Test Alert to Telegram</span>
            </button>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-white">Alert Types (Active)</h3>
            <div class="space-y-2 text-xs">
              <div class="flex items-center gap-3 p-2.5 bg-gray-800/60 rounded-lg border border-gray-700/60">
                <span>🍕</span>
                <div>
                  <p class="font-semibold text-white">Kitchen Orders</p>
                  <p class="text-gray-400">New QR table orders from guests</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2.5 bg-gray-800/60 rounded-lg border border-gray-700/60">
                <span>📋</span>
                <div>
                  <p class="font-semibold text-white">Buyout Inquiries</p>
                  <p class="text-gray-400">New private hire form submissions</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2.5 bg-gray-800/60 rounded-lg border border-gray-700/60">
                <span>🎫</span>
                <div>
                  <p class="font-semibold text-white">Pretix Ticket Sales</p>
                  <p class="text-gray-400">Paid ticket orders (silent mode)</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2.5 bg-gray-800/60 rounded-lg border border-gray-700/60">
                <span>🚪</span>
                <div>
                  <p class="font-semibold text-white">Capacity Warnings</p>
                  <p class="text-gray-400">Venue nearing max occupancy</p>
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-gray-800/40 rounded-lg border border-gray-700/40 text-xs text-gray-400">
              <p class="font-semibold text-gray-300 mb-1">Setup Guide</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Create a bot via <a href="https://t.me/BotFather" target="_blank" class="text-emerald-400 hover:underline">@BotFather</a> on Telegram</li>
                <li>Add the bot to your staff group chat</li>
                <li>Set <code class="text-gray-300">NUXT_TELEGRAM_BOT_TOKEN</code> and <code class="text-gray-300">NUXT_TELEGRAM_CHAT_ID</code> in <code class="text-gray-300">.env</code></li>
                <li>Restart the server and click "Send Test Alert"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">{{ editingId ? 'Edit Camera Stream' : 'Add New RTSP Stream' }}</h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-gray-300 mb-1">Camera Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. DJ Booth Overhead" 
              class="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">Location Tag</label>
            <input 
              v-model="form.location" 
              type="text" 
              placeholder="e.g. Stage Rack 2" 
              class="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">Protocol Type</label>
            <select 
              v-model="form.type" 
              class="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="http">HTTP / MP4 Direct</option>
              <option value="rtsp">RTSP (TCP / Stream Proxy)</option>
              <option value="hls">HLS (m3u8)</option>
              <option value="mjpeg">MJPEG Stream</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">Stream URL</label>
            <input 
              v-model="form.url" 
              type="text" 
              placeholder="https://... or rtsp://..." 
              class="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white font-mono focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg">
            Cancel
          </button>
          <button @click="saveCameraForm" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg">
            Save Stream
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Cog6ToothIcon, 
  VideoCameraIcon, 
  RadioIcon, 
  BuildingOfficeIcon, 
  PlusIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'
import { useCameraConfig, type CameraFeed } from '~/composables/useCameraConfig'

const { cameras, addCamera, updateCamera, deleteCamera, resetDefaults } = useCameraConfig()

const activeTab = ref<'cameras' | 'media' | 'venue' | 'notifications'>('cameras')
const toastMessage = ref('')

const radioStreamUrl = ref('https://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3')
const maxCapacity = ref(450)
const warningThreshold = ref(85)
const operatingMode = ref('club')

const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = ref<{
  name: string
  location: string
  url: string
  type: 'rtsp' | 'hls' | 'mjpeg' | 'http'
}>({
  name: '',
  location: '',
  url: '',
  type: 'http'
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const openAddModal = () => {
  editingId.value = null
  form.value = {
    name: '',
    location: '',
    url: '',
    type: 'http'
  }
  showModal.value = true
}

const editCamera = (cam: CameraFeed) => {
  editingId.value = cam.id
  form.value = {
    name: cam.name,
    location: cam.location,
    url: cam.url,
    type: cam.type
  }
  showModal.value = true
}

const saveCameraForm = () => {
  if (!form.value.name || !form.value.url) return

  if (editingId.value) {
    updateCamera(editingId.value, form.value)
    showToast('Camera feed updated successfully.')
  } else {
    addCamera(form.value)
    showToast('New RTSP stream added.')
  }
  showModal.value = false
}

const handleDeleteCamera = (id: string) => {
  try {
    deleteCamera(id)
    showToast('Camera feed removed.')
  } catch (err: any) {
    alert(err.message || 'Cannot remove camera.')
  }
}

const saveMediaSettings = () => {
  showToast('Radio Meuh stream configuration updated.')
}

const saveVenueSettings = () => {
  showToast('Venue capacity & shift operational limits saved.')
}

// Telegram bot test
const telegramStatus = ref<'unknown' | 'connected' | 'error'>('unknown')
const telegramStatusMessage = ref('Click "Send Test Alert" to verify your Telegram bot configuration.')
const telegramTesting = ref(false)

const testTelegram = async () => {
  telegramTesting.value = true
  try {
    const result = await $fetch<{ ok: boolean; configured: boolean; message: string }>('/api/admin/telegram-test', { method: 'POST' })
    telegramStatus.value = result.ok ? 'connected' : result.configured ? 'error' : 'unknown'
    telegramStatusMessage.value = result.message
    showToast(result.message)
  } catch (err: any) {
    telegramStatus.value = 'error'
    telegramStatusMessage.value = 'Failed to reach the test endpoint.'
    showToast('Telegram test failed.')
  } finally {
    telegramTesting.value = false
  }
}

definePageMeta({ layout: 'admin' })
</script>
