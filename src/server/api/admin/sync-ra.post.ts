// POST /api/admin/sync-ra — trigger a one-off Resident Advisor sync (admin only)

import { createError } from '#imports'
import { syncRaEventsEngine } from '~/server/utils/raSyncEngine'

export default defineEventHandler(async (event) => {
  // Authorization: valid session + admin role (or dev mode fallback)
  try {
    const config = useRuntimeConfig()
    const url = config.public?.supabaseUrl as string
    if (url && !url.includes('placeholder')) {
      const supabase = createServerSupabaseClient(event)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated.' })
      }
      const { data: role } = await supabase
        .from('users_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!role || role.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
      }
    }
  } catch (e: any) {
    if (e.statusCode) throw e
  }

  const result = await syncRaEventsEngine()
  return { ok: true, ...result }
})