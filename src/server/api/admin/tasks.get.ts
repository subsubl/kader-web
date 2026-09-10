// GET /api/admin/tasks — returns operational tasks active for today (or all tasks for admin)

import { createError, getQuery } from 'h3'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const showAll = query.all === 'true'
  const targetDateStr = (query.date as string) || new Date().toISOString().split('T')[0]
  const targetDate = new Date(targetDateStr)
  const dayOfWeek = targetDate.getDay() // 0=Sun, 1=Mon, ..., 6=Sat

  const admin = getAdminSupabase()

  // Fetch active team tasks
  const { data: tasks, error: tasksErr } = await admin
    .from('team_tasks')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (tasksErr) {
    throw createError({ statusCode: 500, statusMessage: tasksErr.message })
  }

  // Fetch task completions for target date
  const { data: completions, error: compErr } = await admin
    .from('team_task_completions')
    .select('*')
    .eq('completion_date', targetDateStr)

  if (compErr) {
    throw createError({ statusCode: 500, statusMessage: compErr.message })
  }

  const completionsMap = new Map((completions || []).map((c) => [c.task_id, c]))

  const allTasks = (tasks || []).map((t) => {
    const comp = completionsMap.get(t.id)
    return {
      ...t,
      is_completed_today: !!comp,
      completed_by_name: comp?.completed_by_name || null,
      completed_at: comp?.completed_at || null,
    }
  })

  if (showAll) {
    return allTasks
  }

  // Filter tasks active FOR TODAY:
  // 1. daily: always active
  // 2. one_time: due_date matches targetDateStr
  // 3. repeating: recurrence_days array contains dayOfWeek
  const activeToday = allTasks.filter((t) => {
    if (t.task_type === 'daily') return true
    if (t.task_type === 'one_time') return t.due_date === targetDateStr
    if (t.task_type === 'repeating') {
      const days = Array.isArray(t.recurrence_days) ? t.recurrence_days : []
      return days.includes(dayOfWeek)
    }
    return false
  })

  return activeToday
})
