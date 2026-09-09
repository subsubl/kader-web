// PATCH /api/admin/tasks-toggle — toggle task completion status for today (authenticated staff)

import { createError, readBody } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { task_id, completion_date, completed } = body || {}

  if (!task_id) {
    throw createError({ statusCode: 422, statusMessage: 'task_id is required' })
  }

  const dateStr = completion_date || new Date().toISOString().split('T')[0]
  const admin = getAdminSupabase()
  const completedByName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Staff Member'

  if (completed) {
    // Insert completion row
    const { error } = await admin
      .from('team_task_completions')
      .upsert({
        task_id,
        completion_date: dateStr,
        completed_by: user.id,
        completed_by_name: completedByName,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'task_id,completion_date' })

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
  } else {
    // Delete completion row
    const { error } = await admin
      .from('team_task_completions')
      .delete()
      .eq('task_id', task_id)
      .eq('completion_date', dateStr)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return { ok: true, task_id, completion_date: dateStr, completed }
})
