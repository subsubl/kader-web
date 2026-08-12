// Client-side Supabase plugin — provides $supabase to the Vue app
// Uses @supabase/supabase-js directly, with seamless local dev fallback when using placeholder URL.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = (config.public.supabaseUrl as string) || ''
  const anonKey = (config.public.supabaseAnonKey as string) || ''

  const isPlaceholder = !url || !anonKey || url.includes('placeholder')

  let supabase: SupabaseClient<Database>

  if (!isPlaceholder) {
    supabase = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  } else {
    // Local Dev Mock Supabase Client for immediate testing
    console.warn('[supabase] Placeholder URL detected. Using local dev auth mock mode.')

    const DEV_ADMIN_EMAIL = 'subsubl@gmail.com'
    const DEV_ADMIN_PASS = 'Vpzgn10p.'
    const DEV_USER = {
      id: '00000000-0000-0000-0000-000000000001',
      email: DEV_ADMIN_EMAIL,
      user_metadata: { role: 'admin' }
    }

    const mockAuth = {
      async signInWithPassword({ email, password }: any) {
        if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASS) {
          if (import.meta.client) {
            localStorage.setItem('kader_dev_admin_user', JSON.stringify(DEV_USER))
          }
          return { data: { user: DEV_USER, session: { access_token: 'dev-token' } }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: 'Invalid credentials. Use subsubl@gmail.com / Vpzgn10p.' } }
      },
      async getUser() {
        if (import.meta.client) {
          const stored = localStorage.getItem('kader_dev_admin_user')
          if (stored) {
            try {
              return { data: { user: JSON.parse(stored) }, error: null }
            } catch (e) {}
          }
        }
        return { data: { user: null }, error: null }
      },
      async getSession() {
        const { data } = await this.getUser()
        return { data: { session: data.user ? { access_token: 'dev-token', user: data.user } : null }, error: null }
      },
      async signOut() {
        if (import.meta.client) {
          localStorage.removeItem('kader_dev_admin_user')
        }
        return { error: null }
      },
      onAuthStateChange(callback: any) {
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
    }

    const mockQueryBuilder = (table: string) => {
      const builder: any = {
        select: () => builder,
        insert: () => builder,
        update: () => builder,
        delete: () => builder,
        eq: () => builder,
        gte: () => builder,
        lte: () => builder,
        order: () => builder,
        limit: () => builder,
        maybeSingle: async () => {
          if (table === 'users_roles') {
            const user = (await mockAuth.getUser()).data.user
            if (user) return { data: { role: 'admin' }, error: null }
          }
          return { data: null, error: null }
        },
        single: async () => {
          if (table === 'users_roles') {
            return { data: { role: 'admin' }, error: null }
          }
          return { data: null, error: null }
        },
        then: (resolve: any) => {
          if (table === 'users_roles') {
            resolve({ data: [{ role: 'admin' }], count: 1, error: null })
          } else {
            resolve({ data: [], count: 0, error: null })
          }
        }
      }
      return builder
    }

    supabase = {
      auth: mockAuth,
      from: mockQueryBuilder,
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'demo.jpg' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '/menu-a3.jpg' } })
        })
      }
    } as any
  }

  return {
    provide: {
      supabase
    }
  }
})