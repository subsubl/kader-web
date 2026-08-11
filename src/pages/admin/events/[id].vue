<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/admin/events" class="text-gray-400 hover:text-white transition-colors">←</NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isEdit ? 'Edit Event' : 'New Event' }}</h1>
        <p class="text-gray-400 mt-1">{{ isEdit ? 'Update event details' : 'Create a new event' }}</p>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Title *</label>
        <input v-model="form.title" type="text" required class="input-field" placeholder="e.g. Techno Night: DJ XXX" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Slug</label>
        <input v-model="form.slug" type="text" class="input-field" placeholder="auto-generated if empty" />
        <p class="text-xs text-gray-500 mt-1">Used in the URL: /events/&lt;slug&gt;</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Date & Time *</label>
        <input v-model="form.date" type="datetime-local" required class="input-field" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
        <select v-model="form.type" class="input-field">
          <option value="club">Club Night</option>
          <option value="pizzeria">Pizzeria / Dining event</option>
          <option value="live">Live Music</option>
          <option value="private">Private / Buyout</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea v-model="form.description" rows="5" class="input-field" placeholder="Event description..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Flyer Image URL</label>
        <input v-model="form.image_url" type="url" class="input-field" placeholder="https://... (Supabase Storage or Unsplash)" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Resident Advisor Link</label>
        <input v-model="form.ra_link" type="url" class="input-field" placeholder="https://ra.co/events/..." />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select v-model="form.status" class="input-field">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="flex gap-4 pt-2">
        <button 
          type="submit"
          :disabled="saving"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
        >
          {{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Event') }}
        </button>
        <NuxtLink to="/admin/events" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'new')
const eventId = (route.params.id || '') as string

const form = ref({
  title: '',
  slug: '',
  date: '',
  type: 'club',
  description: '',
  image_url: '',
  ra_link: '',
  status: 'draft'
})

const error = ref('')
const saving = ref(false)

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const fetchEvent = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error: err } = await $supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (err) throw err
    if (data) {
      form.value.title = data.title
      form.value.slug = data.slug
      form.value.date = toLocalInput(new Date(data.date))
      form.value.type = data.type || 'club'
      form.value.description = data.description || ''
      form.value.image_url = data.image_url || ''
      form.value.ra_link = data.ra_link || ''
      form.value.status = data.status || 'draft'
    }
  } catch (err: any) {
    error.value = 'Failed to load event.'
    console.error(err)
  }
}

const toLocalInput = (d: Date) => {
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

const save = async () => {
  error.value = ''
  saving.value = true
  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      title: form.value.title,
      slug: form.value.slug || slugify(form.value.title),
      date: new Date(form.value.date).toISOString(),
      type: form.value.type,
      description: form.value.description,
      image_url: form.value.image_url,
      ra_link: form.value.ra_link,
      status: form.value.status
    }

    if (isEdit) {
      const { error: err } = await $supabase.from('events').update(payload).eq('id', eventId)
      if (err) throw err
    } else {
      const { error: err } = await $supabase.from('events').insert(payload)
      if (err) throw err
    }

    await router.push('/admin/events')
  } catch (err: any) {
    error.value = err?.message || 'Failed to save event.'
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEdit) fetchEvent()
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>