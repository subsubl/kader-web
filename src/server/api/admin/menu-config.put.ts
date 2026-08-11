// PUT /api/admin/menu-config — update the public pizzeria menu image (admin only)
// Self-authorizes: verifies a valid Supabase session AND admin role via users_roles.

import { createError } from '#imports'

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

  // --- Authorization: valid session + admin role ---
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

  return { ok: true, menuImage }
})