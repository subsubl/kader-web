// POST /api/admin/team — create a new team account and assign role rights (admin only)

import { createError, readBody } from '#imports'
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
  const { email, password, name, role } = body || {}

  if (!email || !password || !role) {
    throw createError({ statusCode: 422, statusMessage: 'Email, password, and role are required' })
  }

  const validRoles = ['admin', 'manager', 'door', 'bar', 'kitchen', 'promoter', 'staff']
  if (!validRoles.includes(role)) {
    throw createError({ statusCode: 422, statusMessage: `Invalid role. Must be one of: ${validRoles.join(', ')}` })
  }

  // Create auth user via service role
  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name || email.split('@')[0] }
  })

  if (createErr || !newUser.user) {
    throw createError({ statusCode: 500, statusMessage: createErr?.message || 'Failed to create user account' })
  }

  // Insert role into users_roles
  const { error: roleErr } = await admin
    .from('users_roles')
    .upsert({
      user_id: newUser.user.id,
      role,
    }, { onConflict: 'user_id' })

  if (roleErr) {
    throw createError({ statusCode: 500, statusMessage: `User created but failed to assign role: ${roleErr.message}` })
  }

  return {
    ok: true,
    user: {
      id: newUser.user.id,
      email: newUser.user.email,
      name: name || email.split('@')[0],
      role,
    }
  }
})
