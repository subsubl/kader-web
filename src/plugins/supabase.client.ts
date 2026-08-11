// Client-side Supabase plugin — provides $supabase to the Vue app
// Uses @supabase/supabase-js directly (anon/public key only on the client)

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const anonKey = config.public.supabaseAnonKey as string

  if (!url || !anonKey) {
    // Don't crash the app at build/SSR if env not yet wired; log instead.
    // eslint-disable-next-line no-console
    console.warn('[supabase] Missing NUXT_PUBLIC_SUPABASE_URL or NUXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const supabase: SupabaseClient<Database> = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  })

  return {
    provide: {
      supabase
    }
  }
})