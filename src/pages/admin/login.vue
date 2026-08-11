<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">K</div>
          <h1 class="text-2xl font-bold">Admin Login</h1>
          <p class="text-gray-400 mt-2">Kader Grad Kodeljevo Admin</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="admin@kader.si"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          <a href="/" class="text-gray-400 hover:text-white transition-colors">← Back to site</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const { $supabase } = useNuxtApp()
    
    const { data, error: authError } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (authError) {
      error.value = 'Invalid credentials. Please try again.'
      return
    }

    if (!data.user) {
      error.value = 'Login failed. Please try again.'
      return
    }

    // Check if user has admin role
    const { data: userRole, error: roleError } = await $supabase
      .from('users_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle()

    if (roleError || !userRole || userRole.role !== 'admin') {
      await $supabase.auth.signOut()
      error.value = 'Access denied. Admin role required.'
      return
    }

    // Redirect to admin dashboard
    await router.push('/admin/dashboard')
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Check if already logged in and redirect
const checkAuth = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data: { user } } = await $supabase.auth.getUser()
    
    if (user) {
      const { data: userRole } = await $supabase
        .from('users_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (userRole && userRole.role === 'admin') {
        await router.push('/admin/dashboard')
      }
    }
  } catch (err) {
    console.error('Auth check error:', err)
  }
}

// Run auth check only on the client ($supabase is client-only)
onMounted(checkAuth)
</script>