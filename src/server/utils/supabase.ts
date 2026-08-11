// Server-side Supabase client helper
// Uses @supabase/supabase-js directly with service role or anon key

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'
import { useRuntimeConfig, createError } from '#imports'
import { getHeader } from 'h3'
let adminClient: SupabaseClient<Database> | null = null

export function getAdminSupabase(): SupabaseClient<Database> {
  if (adminClient) return adminClient
  
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.supabaseServiceKey as string
  
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }
  
  adminClient = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  
  return adminClient
}

// SSR client for request context (uses cookies)
export function createServerSupabaseClient(event: any): SupabaseClient<Database> {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string
  
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }
  
  // Get cookies from event
  const cookieHeader = getHeader(event, 'cookie') || ''
  
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        cookie: cookieHeader
      }
    }
  })
}