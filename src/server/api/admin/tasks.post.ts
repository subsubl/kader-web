// POST /api/admin/tasks — create a new internal task (admin & manager only)

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

  if (roleRow?.role !== 'admin' && roleRow?.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Admin or Manager role required' })
  }

  const body = await readBody(event)
  const { title, description, category, assigned_role, task_type, due_date, recurrence_days } = body || {}

  if (!title || !task_type) {
    throw createError({ statusCode: 422, statusMessage: 'Title and Task Type are required' })
  }

  const validTypes = ['daily', 'one_time', 'repeating']
  if (!validTypes.includes(task_type)) {
    throw createError({ statusCode: 422, statusMessage: `Invalid task_type: ${task_type}` })
  }

  if (task_type === 'one_time' && !due_date) {
    throw createError({ statusCode: 422, statusMessage: 'due_date is required for one_time tasks' })
  }

  const createdByName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'

  const { data, error } = await admin
    .from('team_tasks')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      category: category || 'general',
      assigned_role: assigned_role || 'all',
      task_type,
      due_date: due_date || null,
      recurrence_days: Array.isArray(recurrence_days) ? recurrence_days : [],
      created_by: user.id,
      created_by_name: createdByName,
      is_active: true,
    })
    .select('*')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
