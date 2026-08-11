// Nuxt plugin type augmentation — makes $supabase typed everywhere
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient<Database>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient<Database>
  }
}

export {}