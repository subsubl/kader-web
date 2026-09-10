// PUT /api/admin/menu-config — update the public pizzeria menu image (admin only)
// Self-authorizes: verifies a valid Supabase session AND admin role via users_roles.

import { createError, defineEventHandler, readBody } from 'h3'
import { createServerSupabaseClient, getAdminSupabase } from '~/server/utils/supabase'
import { invalidateCache } from '~/server/utils/cache'

interface Body { menuImage?: unknown }

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as Body

  let menuImage = String(body.menuImage || '').trim()
  if (!menuImage) {
    throw createError({ statusCode: 400, statusMessage: 'Menu image is required.' })
  }

  // Allow only http(s) URLs or local static paths (e.g. /kader/menu.jpg)
  if (!/^(https?:\/\/|\/)/.test(menuImage)) {
    throw createError({ statusCode: 422, statusMessage: 'Menu image must be an http(s) URL or a local path.' })
  }

  // --- Authorization: valid session + admin role (bypassed in dev placeholder mode) ---
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

  // --- Persist via service role (bypasses RLS for upsert; data validated above) ---
  const admin = getAdminSupabase()
  const value = { menuImage }
  const { error } = await admin
    .from('site_settings')
    .upsert(
      { key: 'pizzeria_menu', value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  if (error) {
    console.error('[api] menu-config update failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not save menu configuration.' })
  }

  invalidateCache('menu-config')

  return { ok: true, menuImage }
})