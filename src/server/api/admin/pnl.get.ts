import { createError, getQuery, defineEventHandler } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const adminSupabase = getAdminSupabase()
  const { data: roleData } = await adminSupabase
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = getQuery(event)
  const eventId = query.event_id as string | undefined

  let dbQuery = adminSupabase
    .from('event_pnl')
    .select('*')
    .order('event_date', { ascending: false })

  if (eventId) {
    dbQuery = dbQuery.eq('event_id', eventId)
  }

  const { data, error } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
