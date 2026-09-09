// GET /api/admin/team — returns list of team accounts with their roles (admin only)

import { createError } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleRow?.role !== 'admin' && roleRow?.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Fetch all auth users
  const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers()
  if (usersErr) {
    throw createError({ statusCode: 500, statusMessage: usersErr.message })
  }

  // Fetch all user roles
  const { data: rolesData, error: rolesErr } = await admin
    .from('users_roles')
    .select('user_id, role')

  if (rolesErr) {
    throw createError({ statusCode: 500, statusMessage: rolesErr.message })
  }

  const rolesMap = new Map((rolesData || []).map((r) => [r.user_id, r.role]))

  const team = (usersData.users || []).map((u) => ({
    id: u.id,
    email: u.email || '',
    name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Staff Member',
    role: rolesMap.get(u.id) || 'staff',
    last_sign_in: u.last_sign_in_at || null,
    created_at: u.created_at,
  }))

  return team
})
