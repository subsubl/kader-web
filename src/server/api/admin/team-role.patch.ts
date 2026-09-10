// PATCH /api/admin/team-role — update user role rights (admin only)

import { createError, readBody } from 'h3'
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

  if (roleRow?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin role required' })
  }

  const body = await readBody(event)
  const { user_id, role } = body || {}

  if (!user_id || !role) {
    throw createError({ statusCode: 422, statusMessage: 'user_id and role are required' })
  }

  const validRoles = ['admin', 'manager', 'door', 'bar', 'kitchen', 'promoter', 'staff']
  if (!validRoles.includes(role)) {
    throw createError({ statusCode: 422, statusMessage: `Invalid role: ${role}` })
  }

  const { error } = await admin
    .from('users_roles')
    .upsert({
      user_id,
      role
    }, { onConflict: 'user_id' })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true, user_id, role }
})
