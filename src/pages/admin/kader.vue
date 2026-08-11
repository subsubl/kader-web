<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Pizzeria Brand & Menu</h1>
      <p class="text-gray-400 mt-1">Manage the pizzeria menu (single image by design) and branding</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Menu image editor -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Menu Image</h2>
        <div class="space-y-5">
          <p class="text-sm text-gray-400 mb-4">
            The pizzeria menu is displayed as a single image (matching kader.si design). Upload a new image or set a URL.
          </p>

          <!-- Upload zone -->
          <div
            class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
            :class="dragOver ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-gray-500'"
            @click="openFilePicker"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onFileChange" />
            <svg class="mx-auto w-10 h-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p class="text-sm text-gray-300 mb-1">{{ selectedFile ? selectedFile.name : 'Click or drop a menu image' }}</p>
            <p class="text-xs text-gray-500">JPEG, PNG or WebP · max 10 MB</p>
          </div>

          <div v-if="uploadError" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {{ uploadError }}
          </div>

          <div v-if="selectedFile" class="flex gap-3">
            <button
              @click="uploadAndSave"
              :disabled="uploading"
              class="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-wait rounded-lg font-semibold transition-colors"
            >
              {{ uploading ? 'Uploading...' : 'Upload & Use Image' }}
            </button>
            <button @click="clearFile" :disabled="uploading" class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
              Cancel
            </button>
          </div>

          <!-- OR divider -->
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <div class="flex-1 h-px bg-gray-700"></div>
            OR set a URL
            <div class="flex-1 h-px bg-gray-700"></div>
          </div>
        </div>

        <form @submit.prevent="save" class="space-y-4 mt-5">
          <div v-if="saveError" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {{ saveError }}
          </div>
          <div v-if="saved" class="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">
            Saved successfully ✓
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Menu Image URL</label>
            <input 
              v-model="form.menuImage" 
              type="text" 
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://... or /kader/menu.jpg"
            />
            <p class="text-xs text-gray-500 mt-1">
              Default: <code class="text-gray-400">/kader/menu.jpg</code> (the extracted kader.si menu)
            </p>
          </div>

          <!-- Live preview -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Preview</label>
            <div class="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <img 
                v-if="previewSrc"
                :src="previewSrc" 
                alt="Menu preview" 
                class="w-full h-auto max-h-64 object-contain"
                @error="previewSrc = ''"
              >
              <div v-else class="flex items-center justify-center h-32 text-gray-500 text-sm">
                Enter a valid URL to preview
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              type="submit"
              :disabled="saving || !form.menuImage.trim()"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {{ saving ? 'Saving...' : 'Save Menu Image' }}
            </button>
            <button 
              type="button"
              @click="resetToDefault"
              :disabled="!form.menuImage || form.menuImage === '/kader/menu.jpg'"
              class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg font-semibold transition-colors"
            >
              Reset to default
            </button>
          </div>
        </form>
      </div>

      <!-- Brand assets -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 class="text-lg font-semibold mb-4">Brand Assets (loaded from kader.si)</h2>
        <p class="text-sm text-gray-400 mb-4">These logos are served from the app's static assets.</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Main logo (banner)</label>
            <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-center justify-center">
              <img :src="assets.logoMain" alt="Kader logo" class="max-h-16 w-auto">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Emblem / round</label>
            <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-center justify-center gap-4">
              <img :src="assets.emblem1" alt="Kader emblem" class="h-16 w-auto">
              <img :src="assets.emblem2" alt="Kader artboard" class="h-16 w-auto">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Wordmarks</label>
            <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 flex flex-col gap-3">
              <img :src="assets.wordmark1" alt="Kader wordmark" class="max-h-10 w-auto">
              <img :src="assets.wordmark2" alt="Kader wordmark 2" class="max-h-8 w-auto">
              <img :src="assets.wordmark3" alt="Kader wordmark 3" class="max-h-6 w-auto">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadError = ref('')

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) selectedFile.value = f
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) selectedFile.value = f
}

const clearFile = () => {
  selectedFile.value = null
  uploadError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const uploadAndSave = async () => {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', selectedFile.value)
    const res = await $fetch<{ ok: boolean; url: string }>('/api/admin/menu-upload', {
      method: 'POST',
      body: fd
    })
    if (res?.ok) {
      form.value.menuImage = res.url
      clearFile()
      await save()
      saved.value = true
      setTimeout(() => (saved.value = false), 2500)
    }
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

const assets = {
  logoMain: '/kader/asset-6100.png',
  emblem1: '/kader/asset-3-100.png',
  emblem2: '/kader/artboard-1-copy-13.png',
  wordmark1: '/kader/asset-2.png',
  wordmark2: '/kader/asset-7.png',
  wordmark3: '/kader/asset-1100.png'
}

const current = ref('/kader/menu.jpg')
const form = ref({ menuImage: '/kader/menu.jpg' })
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')

const previewSrc = computed(() => {
  const v = form.value.menuImage.trim()
  return v ? v : ''
})

const loadCurrent = async () => {
  try {
    const cfg = await $fetch<{ menuImage: string }>('/api/menu-config')
    if (cfg?.menuImage) {
      current.value = cfg.menuImage
      form.value.menuImage = cfg.menuImage
    }
  } catch (err: any) {
    console.error('Failed to load menu config:', err)
  }
}

const save = async () => {
  saving.value = true
  saved.value = false
  saveError.value = ''
  try {
    const res = await $fetch<{ ok: boolean; menuImage: string }>('/api/admin/menu-config', {
      method: 'PUT',
      body: { menuImage: form.value.menuImage.trim() }
    })
    if (res.ok) {
      current.value = res.menuImage
      saved.value = true
      setTimeout(() => (saved.value = false), 2500)
    }
  } catch (err: any) {
    saveError.value = err?.data?.statusMessage || 'Failed to save menu image.'
  } finally {
    saving.value = false
  }
}

const resetToDefault = () => {
  form.value.menuImage = '/kader/menu.jpg'
}

onMounted(loadCurrent)
</script>