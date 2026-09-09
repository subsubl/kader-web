import { createError, getQuery } from '#imports'
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

  const query = getQuery(event)
  const filterStatus = query.status as string | undefined

  let dbQuery = admin
    .from('table_orders')
    .select('*')
    .order('created_at', { ascending: true })

  if (filterStatus) {
    dbQuery = dbQuery.eq('status', filterStatus)
  } else {
    dbQuery = dbQuery.in('status', ['pending', 'preparing', 'ready'])
  }

  const { data, error } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }

  return data || []
})
