import { createError, readBody } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = createServerSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (!roleRow || roleRow.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readBody(event)
  const { id, status } = body || {}

  if (!id || typeof id !== 'string') {
    throw createError({ statusCode: 422, statusMessage: 'Invalid or missing id' })
  }

  const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled']
  if (!status || !validStatuses.includes(status)) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid status' })
  }

  const { error } = await admin
    .from('table_orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update order status' })
  }

  return { ok: true }
})
