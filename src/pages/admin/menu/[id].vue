<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/admin/menu" class="text-gray-400 hover:text-white transition-colors">←</NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isEdit ? 'Edit Menu Item' : 'New Menu Item' }}</h1>
        <p class="text-gray-400 mt-1">{{ isEdit ? 'Update item details' : 'Add a menu item' }}</p>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Name *</label>
        <input v-model="form.name" type="text" required class="input-field" placeholder="e.g. Pizza Margherita" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Category *</label>
        <input v-model="form.category" type="text" required list="categories" class="input-field" placeholder="e.g. Pizza, Drinks, Dessert" />
        <datalist id="categories">
          <option value="Pizza" />
          <option value="Antipasti" />
          <option value="Dessert" />
          <option value="Drinks" />
          <option value="Coffee" />
        </datalist>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea v-model="form.description" rows="3" class="input-field" placeholder="Ingredients / description"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Price (€) *</label>
        <input v-model.number="form.price" type="number" min="0" step="0.5" required class="input-field" />
      </div>

      <div>
        <label class="flex items-center gap-3 text-sm font-medium text-gray-300">
          <input v-model="form.is_available" type="checkbox" class="w-4 h-4 rounded bg-gray-700 border-gray-600" />
          Available for ordering
        </label>
      </div>

      <div class="flex gap-4 pt-2">
        <button 
          type="submit"
          :disabled="saving"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg font-semibold transition-colors duration-300"
        >
          {{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Item') }}
        </button>
        <NuxtLink to="/admin/menu" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300">
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
const itemId = (route.params.id || '') as string

const form = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  is_available: true
})

const error = ref('')
const saving = ref(false)

const fetchItem = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error: err } = await $supabase.from('menu_items').select('*').eq('id', itemId).single()
    if (err) throw err
    if (data) {
      form.value.name = data.name
      form.value.category = data.category
      form.value.description = data.description || ''
      form.value.price = data.price
      form.value.is_available = data.is_available ?? true
    }
  } catch (err: any) {
    error.value = 'Failed to load item.'
    console.error(err)
  }
}

const save = async () => {
  error.value = ''
  saving.value = true
  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      name: form.value.name,
      category: form.value.category,
      description: form.value.description,
      price: form.value.price,
      is_available: form.value.is_available
    }

    if (isEdit) {
      const { error: err } = await $supabase.from('menu_items').update(payload).eq('id', itemId)
      if (err) throw err
    } else {
      const { error: err } = await $supabase.from('menu_items').insert(payload)
      if (err) throw err
    }

    await router.push('/admin/menu')
  } catch (err: any) {
    error.value = err?.message || 'Failed to save item.'
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEdit) fetchItem()
})

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
</style>