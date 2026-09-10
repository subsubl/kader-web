// DELETE /api/admin/calendar-notes — delete a calendar note (authenticated staff/admin)

import { createError, getQuery } from 'h3'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const id = query.id as string

  if (!id) {
    throw createError({ statusCode: 422, statusMessage: 'Note ID is required' })
  }

  const admin = getAdminSupabase()
  const { error } = await admin
    .from('calendar_notes')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true, id }
})
