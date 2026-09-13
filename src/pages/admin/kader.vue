<template>
  <div class="space-y-8 pb-16 text-gray-100">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Site Images & Background Manager</h1>
        <p class="text-gray-400 mt-1 text-sm">
          Change background images, hero banners, and feature photos across all pages of the site with instant high-performance image optimization.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="saveAll"
          :disabled="saving"
          class="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-red-950 flex items-center gap-2 min-h-[44px]"
        >
          <span v-if="saving" class="animate-spin text-lg">⏳</span>
          <span>{{ saving ? 'Saving Changes...' : 'Save All Image Settings' }}</span>
        </button>
      </div>
    </div>

    <!-- Notification Banners -->
    <div v-if="saveSuccess" class="bg-green-950/80 border border-green-700/80 text-green-300 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
      <span>✓ All image settings and background configurations updated successfully!</span>
      <button @click="saveSuccess = false" class="text-green-400 hover:text-white">✕</button>
    </div>

    <div v-if="saveError" class="bg-red-950/80 border border-red-700/80 text-red-300 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
      <span>⚠️ {{ saveError }}</span>
      <button @click="saveError = ''" class="text-red-400 hover:text-white">✕</button>
    </div>

    <!-- Category Tabs -->
    <div class="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
      <button
        v-for="tab in [
          { id: 'home', label: '🏠 Home Page' },
          { id: 'pizzeria', label: '🍕 Pizzeria Page' },
          { id: 'club', label: '🪩 Club Page' },
          { id: 'buyouts', label: '🏰 Buyouts Page' },
          { id: 'gallery', label: '📸 Gallery Items' }
        ]"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 min-h-[44px]', activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-950' : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800']"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- TAB 1: HOME PAGE IMAGES -->
    <div v-if="activeTab === 'home'" class="space-y-6">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-red-500 pl-3">Home Page Images & Backgrounds</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Home Hero BG -->
        <ImageSlotCard
          title="Home Hero Background"
          description="Main banner image behind the Grad Kodeljevo hero title"
          v-model="form.home_hero_bg"
          @upload="handleUpload('home_hero_bg', $event)"
        />

        <!-- Home Basement BG -->
        <ImageSlotCard
          title="Basement Club Feature Image"
          description="Atmosphere image for the Basement Vault segment on Home page"
          v-model="form.home_basement_bg"
          @upload="handleUpload('home_basement_bg', $event)"
        />

        <!-- Home 2nd Floor BG -->
        <ImageSlotCard
          title="2nd Floor Lounge Feature Image"
          description="Atmosphere image for the 2nd Floor Klipsch Lounge segment on Home page"
          v-model="form.home_second_floor_bg"
          @upload="handleUpload('home_second_floor_bg', $event)"
        />

        <!-- Home Terrace BG -->
        <ImageSlotCard
          title="Summer Terrace Feature Image"
          description="Atmosphere image for the Outdoor Garden & Terrace segment on Home page"
          v-model="form.home_terrace_bg"
          @upload="handleUpload('home_terrace_bg', $event)"
        />
      </div>
    </div>

    <!-- TAB 2: PIZZERIA PAGE IMAGES -->
    <div v-if="activeTab === 'pizzeria'" class="space-y-6">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-masanielli-gold pl-3">Pizzeria Page Images & Backgrounds</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pizzeria Hero BG -->
        <ImageSlotCard
          title="Pizzeria Hero Header Background"
          description="Luxury dark background behind Neapolitan Pizzeria title"
          v-model="form.pizzeria_hero_bg"
          @upload="handleUpload('pizzeria_hero_bg', $event)"
        />

        <!-- Pizzeria Showcase 1 -->
        <ImageSlotCard
          title="Pizza Craft Photo 1"
          description="Showcase photo of Neapolitan pizza fresh out of the oven"
          v-model="form.pizzeria_showcase_1"
          @upload="handleUpload('pizzeria_showcase_1', $event)"
        />

        <!-- Pizzeria Showcase 2 -->
        <ImageSlotCard
          title="Panuozzo Craft Photo 2"
          description="Showcase photo of Stuffed Panuozzo sandwich"
          v-model="form.pizzeria_showcase_2"
          @upload="handleUpload('pizzeria_showcase_2', $event)"
        />
      </div>
    </div>

    <!-- TAB 3: CLUB PAGE IMAGES -->
    <div v-if="activeTab === 'club'" class="space-y-6">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-red-500 pl-3">Club Page Images & Backgrounds</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Club Hero BG -->
        <ImageSlotCard
          title="Club Hero Header Background"
          description="Immersive background image at the top of the Club page"
          v-model="form.club_hero_bg"
          @upload="handleUpload('club_hero_bg', $event)"
        />

        <!-- Club Floor 1 -->
        <ImageSlotCard
          title="Floor 01: Basement Vault Card Image"
          description="Card background for Basement club space"
          v-model="form.club_floor1_bg"
          @upload="handleUpload('club_floor1_bg', $event)"
        />

        <!-- Club Floor 2 -->
        <ImageSlotCard
          title="Floor 02: Ground Level & Terrace Card Image"
          description="Card background for Ground Floor & Garden space"
          v-model="form.club_floor2_bg"
          @upload="handleUpload('club_floor2_bg', $event)"
        />

        <!-- Club Sound System -->
        <ImageSlotCard
          title="Sound System Feature Photo"
          description="Photo of Klipsch La Scala audio system"
          v-model="form.club_sound_system"
          @upload="handleUpload('club_sound_system', $event)"
        />
      </div>
    </div>

    <!-- TAB 4: BUYOUTS PAGE IMAGES -->
    <div v-if="activeTab === 'buyouts'" class="space-y-6">
      <h2 class="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-red-500 pl-3">Buyouts & Private Hire Images</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Buyouts Hero BG -->
        <ImageSlotCard
          title="Buyouts Hero Header Background"
          description="Header banner image for Private Hire page"
          v-model="form.buyouts_hero_bg"
          @upload="handleUpload('buyouts_hero_bg', $event)"
        />

        <!-- Buyouts Booking BG -->
        <ImageSlotCard
          title="Booking Process Feature Photo"
          description="Event photo displayed alongside the booking process steps"
          v-model="form.buyouts_booking_bg"
          @upload="handleUpload('buyouts_booking_bg', $event)"
        />
      </div>
    </div>

    <!-- TAB 5: GALLERY ITEMS -->
    <div v-if="activeTab === 'gallery'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-red-500 pl-3">Kader V Slikah Gallery Items</h2>
        <button
          @click="addGalleryItem"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
        >
          + Add New Photo Item
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, idx) in form.gallery_items"
          :key="idx"
          class="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-800 pb-3">
            <span class="font-mono text-xs text-red-400 font-bold">Photo #{{ idx + 1 }}</span>
            <button @click="removeGalleryItem(idx)" class="text-xs text-red-500 hover:text-red-400 font-bold">Delete</button>
          </div>

          <div class="aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 relative">
            <img :src="getOptImg(item.src, 600, 80)" class="w-full h-full object-cover" alt="Gallery item" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Image URL or Path</label>
            <input v-model="item.src" type="text" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Caption / Label</label>
            <input v-model="item.label" type="text" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Replace File</label>
            <input type="file" accept="image/*" @change="uploadGalleryItem(idx, $event)" class="text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-800 file:text-xs file:text-white hover:file:bg-gray-700 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineComponent, h } from 'vue'

definePageMeta({
  layout: 'admin'
})

const { siteImages, loadSiteImages, getOptImg } = useSiteImages()

const activeTab = ref('home')
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

const form = reactive({
  home_hero_bg: '',
  home_basement_bg: '',
  home_second_floor_bg: '',
  home_terrace_bg: '',

  pizzeria_hero_bg: '',
  pizzeria_showcase_1: '',
  pizzeria_showcase_2: '',

  club_hero_bg: '',
  club_floor1_bg: '',
  club_floor2_bg: '',
  club_sound_system: '',

  buyouts_hero_bg: '',
  buyouts_booking_bg: '',

  gallery_items: [] as Array<{ src: string; label: string }>
})

onMounted(async () => {
  await loadSiteImages()
  Object.assign(form, JSON.parse(JSON.stringify(siteImages.value)))
})

const handleUpload = async (slotKey: keyof typeof form, event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const formData = new FormData()
  formData.append('file', input.files[0])

  try {
    const res = (await $fetch('/api/admin/site-images-upload', {
      method: 'POST',
      body: formData
    })) as { ok: boolean; url: string }
    if (res && res.url) {
      (form as any)[slotKey] = res.url
    }
  } catch (err: any) {
    saveError.value = 'Failed to upload image file: ' + err.message
  }
}

const uploadGalleryItem = async (idx: number, event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const formData = new FormData()
  formData.append('file', input.files[0])

  try {
    const res = (await $fetch('/api/admin/site-images-upload', {
      method: 'POST',
      body: formData
    })) as { ok: boolean; url: string }
    if (res && res.url) {
      form.gallery_items[idx].src = res.url
    }
  } catch (err: any) {
    saveError.value = 'Failed to upload gallery image: ' + err.message
  }
}

const addGalleryItem = () => {
  form.gallery_items.push({
    src: '/images/instagram/ig_img_7.jpg',
    label: 'Neznani Utrinek'
  })
}

const removeGalleryItem = (idx: number) => {
  form.gallery_items.splice(idx, 1)
}

const saveAll = async () => {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false

  try {
    const res = (await $fetch('/api/admin/site-images', {
      method: 'PUT',
      body: form
    })) as { ok: boolean }
    if (res && res.ok) {
      saveSuccess.value = true
      await loadSiteImages()
    }
  } catch (err: any) {
    saveError.value = err.message || 'Failed to save site images configuration'
  } finally {
    saving.value = false
  }
}

// Inline Sub-component for Image Slots
const ImageSlotCard = defineComponent({
  props: {
    title: String,
    description: String,
    modelValue: String
  },
  emits: ['update:modelValue', 'upload'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl' }, [
        h('div', [
          h('h3', { class: 'text-base font-bold text-white uppercase tracking-wider' }, props.title),
          h('p', { class: 'text-xs text-gray-400 mt-0.5' }, props.description)
        ]),
        h('div', { class: 'aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 relative' }, [
          props.modelValue
            ? h('img', {
                src: `/api/img?src=${encodeURIComponent(props.modelValue)}&w=640&q=80`,
                class: 'w-full h-full object-cover',
                alt: props.title
              })
            : h('div', { class: 'flex items-center justify-center h-full text-gray-600 text-xs' }, 'No Image Configured')
        ]),
        h('div', { class: 'space-y-3' }, [
          h('div', [
            h('label', { class: 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1' }, 'Image URL / Path'),
            h('input', {
              type: 'text',
              value: props.modelValue,
              onInput: (e: any) => emit('update:modelValue', e.target.value),
              class: 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono'
            })
          ]),
          h('div', [
            h('label', { class: 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1' }, 'Upload File to Replace'),
            h('input', {
              type: 'file',
              accept: 'image/*',
              onChange: (e: Event) => emit('upload', e),
              class: 'text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-800 file:text-xs file:text-white hover:file:bg-gray-700 cursor-pointer'
            })
          ])
        ])
      ])
  }
})
</script>