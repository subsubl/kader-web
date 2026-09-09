import { createServerSupabaseClient, getAdminSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const adminClient = getAdminSupabase()
  
  const { data: rolesData, error: rolesError } = await adminClient
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (rolesError || rolesData?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden: Admins only' })
  }

  const body = await readBody(event)

  if (!body.promoter_id || !body.promoter_name || typeof body.verified_checkins !== 'number' || typeof body.commission_rate !== 'number' || typeof body.total_payout !== 'number') {
    throw createError({ statusCode: 422, message: 'Missing required fields', data: { errors: { field: 'Invalid body' } } })
  }

  const { data, error } = await adminClient
    .from('promoter_payouts')
    .insert({
      promoter_id: body.promoter_id,
      promoter_name: body.promoter_name,
      event_id: body.event_id || null,
      event_label: body.event_label || null,
      verified_checkins: body.verified_checkins,
      commission_rate: body.commission_rate,
      total_payout: body.total_payout,
      notes: body.notes || null,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true, id: data.id }
})
