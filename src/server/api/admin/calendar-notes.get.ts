// GET /api/admin/calendar-notes — fetch calendar notes for a date range (authenticated staff)

import { createError, getQuery } from 'h3'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const start = query.start as string | undefined
  const end = query.end as string | undefined

  const admin = getAdminSupabase()
  let dbQuery = admin
    .from('calendar_notes')
    .select('*, events(title)')
    .order('date', { ascending: true })

  if (start) dbQuery = dbQuery.gte('date', start)
  if (end) dbQuery = dbQuery.lte('date', end)

  const { data, error } = await dbQuery
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
})
