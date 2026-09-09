// POST /api/admin/calendar-notes — create/add calendar note for a specific date (authenticated staff)

import { createError, readBody } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { date, title, content, category, event_id } = body || {}

  if (!date || !title) {
    throw createError({ statusCode: 422, statusMessage: 'Date and Title are required' })
  }

  const admin = getAdminSupabase()
  const authorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Staff Member'

  const { data, error } = await admin
    .from('calendar_notes')
    .insert({
      date,
      title: title.trim(),
      content: content?.trim() || null,
      category: category || 'general',
      event_id: event_id || null,
      author_id: user.id,
      author_name: authorName,
    })
    .select('*')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
