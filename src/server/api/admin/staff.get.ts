// GET /api/admin/staff — list auth users for assignment dropdowns (admin only)
// Self-authorizes via session cookie; returns id/email/name from auth.users.

import { createError } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = createServerSupabaseClient(event)

  // Authorize: session + admin role
  const { data: { user } } = await client.auth.getUser()
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
  .eq('user_id', user.id)
    .single()

  if (!roleRow || roleRow.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Page through auth users via the Admin API
  const perPage = 200
  let page = 1
  const out: Array<{ id: string; email: string; name: string }> = []
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw createError({ statusCode: 500, statusMessage: 'Failed to list users' })
    for (const u of data?.users || []) {
      const meta = (u.user_metadata || {}) as Record<string, unknown>
      const name =
        (typeof meta.full_name === 'string' && meta.full_name) ||
        (typeof meta.name === 'string' && meta.name) ||
        u.email ||
        ''
      out.push({ id: u.id, email: u.email ?? '', name })
    }
    if (!data || data.users.length < perPage) break
    page++
  }

  return out.filter(u => u.email)
})