<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl my-8">
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/events" class="text-gray-400 hover:text-white transition-colors text-xl font-bold">←</NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-white">{{ isEdit ? 'Uredi dogodek' : 'Nov dogodek' }}</h1>
          <p class="text-sm text-gray-400 mt-1">Ustvari ali uredi dogodek za prikaz na kader.si</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm font-semibold">
        {{ error }}
      </div>

      <div v-if="successMsg" class="bg-emerald-900/50 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl text-sm font-semibold">
        {{ successMsg }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Naslov dogodka *</label>
          <input 
            v-model="form.title" 
            type="text" 
            required 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="npr. Simply Life @ Kader ali House Night" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Datum & Začetek *</label>
          <input 
            v-model="form.date" 
            type="datetime-local" 
            required 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Konec dogodka</label>
          <input 
            v-model="form.end_time" 
            type="datetime-local" 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Vstopnina (€)</label>
          <input 
            v-model="form.cost" 
            type="number" 
            step="0.5"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="npr. 10 ali 0 za prost vstop" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Žanri (z vejico ločeno)</label>
          <input 
            v-model="form.genres" 
            type="text" 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="House, Techno, Electronica" 
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nastopajoči (z vejico ločeno)</label>
          <input 
            v-model="form.artists" 
            type="text" 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Mornik, ROTOR MOTOR, Akaj" 
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Slika flyerja / URL</label>
          <input 
            v-model="form.flyer_url" 
            type="url" 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="https://images.ra.co/... ali URL slike" 
          />
          <div v-if="form.flyer_url" class="mt-3">
            <p class="text-xs text-gray-400 mb-1">Predogled flyerja:</p>
            <img :src="form.flyer_url" alt="Flyer Preview" class="w-32 h-32 object-cover rounded-lg border border-gray-700" />
          </div>
        </div>

        <!-- Ticket System Selection -->
        <div class="md:col-span-2 bg-gray-800/80 p-5 rounded-2xl border border-gray-700/80 space-y-4">
          <label class="block text-xs font-bold text-gray-200 uppercase tracking-wider">Prodaja vstopnic / Sistem</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label 
              :class="form.ticket_provider === 'free' ? 'bg-red-600/30 border-red-500 text-white font-bold' : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:text-white'"
              class="p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
            >
              <input type="radio" v-model="form.ticket_provider" value="free" class="hidden" />
              <span>Prost vstop</span>
            </label>

            <label 
              :class="form.ticket_provider === 'pretix' ? 'bg-red-600/30 border-red-500 text-white font-bold' : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:text-white'"
              class="p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
            >
              <input type="radio" v-model="form.ticket_provider" value="pretix" class="hidden" />
              <span>Pretix</span>
            </label>

            <label 
              :class="form.ticket_provider === 'olaii' ? 'bg-red-600/30 border-red-500 text-white font-bold' : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:text-white'"
              class="p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
            >
              <input type="radio" v-model="form.ticket_provider" value="olaii" class="hidden" />
              <span>Olaii</span>
            </label>

            <label 
              :class="form.ticket_provider === 'ra' ? 'bg-red-600/30 border-red-500 text-white font-bold' : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:text-white'"
              class="p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
            >
              <input type="radio" v-model="form.ticket_provider" value="ra" class="hidden" />
              <span>Resident Advisor</span>
            </label>
          </div>

          <div v-if="form.ticket_provider !== 'free'" class="pt-2">
            <label class="block text-xs font-semibold text-gray-300 mb-1">
              {{ form.ticket_provider === 'pretix' ? 'Pretix URL' : form.ticket_provider === 'olaii' ? 'Olaii URL' : 'Povezava do vstopnic' }}
            </label>
            <input 
              v-model="form.ticket_url" 
              type="url" 
              class="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 text-sm"
              :placeholder="form.ticket_provider === 'pretix' ? 'https://pretix.eu/kader/event-slug/' : form.ticket_provider === 'olaii' ? 'https://olaii.com/event/...' : 'https://...'"
            />
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Spored / Lineup</label>
          <textarea 
            v-model="form.lineup" 
            rows="4" 
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors font-mono text-sm"
            placeholder="Mornik&#10;DaNe&#10;Venj Urban Ground"
          ></textarea>
        </div>
      </div>

      <div class="flex gap-4 pt-4 border-t border-gray-800">
        <button 
          type="submit"
          :disabled="saving"
          class="px-8 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-950 flex items-center gap-2"
        >
          {{ saving ? 'Shranjevanje...' : (isEdit ? 'Shrani spremembe' : 'Objavi dogodek') }}
        </button>
        <NuxtLink to="/admin/events" class="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition-colors">
          Prekliči
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'new')
const eventId = (route.params.id || '') as string

const form = ref({
  ra_id: undefined as number | undefined,
  title: '',
  date: '',
  end_time: '',
  cost: '' as string | number,
  genres: '',
  artists: '',
  flyer_url: '',
  ticket_provider: 'free' as 'free' | 'pretix' | 'olaii' | 'ra' | 'custom',
  ticket_url: '',
  lineup: ''
})

const error = ref('')
const successMsg = ref('')
const saving = ref(false)

const loadEventToEdit = async () => {
  if (!isEdit.value) return
  try {
    const allEvents = (await $fetch('/api/ra-events?scope=all')) as any[]
    const target = allEvents.find((e: any) => String(e.ra_id) === String(eventId))
    if (target) {
      form.value.ra_id = target.ra_id
      form.value.title = target.title || ''
      form.value.date = target.date ? new Date(target.date).toISOString().slice(0, 16) : ''
      form.value.end_time = target.end_time ? new Date(target.end_time).toISOString().slice(0, 16) : ''
      form.value.cost = target.cost ?? ''
      form.value.genres = Array.isArray(target.genres) ? target.genres.join(', ') : ''
      form.value.artists = Array.isArray(target.artists) ? target.artists.join(', ') : ''
      form.value.flyer_url = target.flyer_url || ''
      form.value.ticket_provider = target.ticket_provider || (target.cost === 0 ? 'free' : 'ra')
      form.value.ticket_url = target.ticket_url || target.pretix_event_url || target.ra_url || ''
      form.value.lineup = target.lineup || ''
    }
  } catch (err: any) {
    error.value = 'Failed to load event data.'
  }
}

const save = async () => {
  error.value = ''
  successMsg.value = ''
  saving.value = true

  try {
    const res = (await $fetch('/api/admin/events', {
      method: 'POST',
      body: {
        ra_id: form.value.ra_id,
        title: form.value.title,
        date: form.value.date,
        end_time: form.value.end_time || null,
        cost: form.value.cost,
        genres: form.value.genres,
        artists: form.value.artists,
        flyer_url: form.value.flyer_url,
        ticket_provider: form.value.ticket_provider,
        ticket_url: form.value.ticket_url,
        pretix_event_url: form.value.ticket_provider === 'pretix' ? form.value.ticket_url : null,
        ra_url: form.value.ticket_provider === 'ra' ? form.value.ticket_url : null,
        lineup: form.value.lineup
      }
    })) as { ok: boolean; event: any }

    if (res?.ok) {
      successMsg.value = 'Dogodek uspešno shranjen! Preusmerjam...'
      setTimeout(() => {
        router.push('/admin/events')
      }, 1000)
    }
  } catch (err: any) {
    error.value = err.statusMessage || err.message || 'Napaka pri shranjevanju dogodka.'
  } finally {
    saving.value = false
  }
}

onMounted(loadEventToEdit)
</script>