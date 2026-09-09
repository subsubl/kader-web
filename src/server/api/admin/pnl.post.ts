import { createError, readBody, defineEventHandler } from '#imports'
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

  const body = await readBody(event)
  const {
    event_id,
    event_label,
    event_date,
    auto_prefill,
    bar_revenue,
    door_revenue,
    other_revenue,
    staff_cost,
    artist_fee,
    venue_cost,
    other_cost,
    notes,
    status
  } = body

  if (!event_id) {
    throw createError({ statusCode: 422, data: { errors: { event_id: 'Required' } } })
  }

  let ticket_revenue = body.ticket_revenue || 0
  let promoter_cost = body.promoter_cost || 0
  let attendance = body.attendance || 0

  let prefilled = false

  if (auto_prefill) {
    prefilled = true
    
    // Calculate ticket_revenue
    const { data: orders } = await adminSupabase
      .from('pretix_orders')
      .select('total')
      .eq('event_id', event_id)
      .eq('status', 'paid')
    
    if (orders) {
      ticket_revenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
    }

    // Calculate promoter_cost
    const { data: payouts } = await adminSupabase
      .from('promoter_payouts')
      .select('total_payout')
      .eq('event_id', event_id)

    if (payouts) {
      promoter_cost = payouts.reduce((sum, payout) => sum + (Number(payout.total_payout) || 0), 0)
    }

    // Calculate attendance
    const { count } = await adminSupabase
      .from('pretix_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id)
      .eq('checkin_status', 'checked_in')

    if (count !== null) {
      attendance = count
    }
  }

  const { data, error } = await adminSupabase
    .from('event_pnl')
    .upsert({
      event_id,
      event_label,
      event_date,
      ticket_revenue,
      bar_revenue: bar_revenue || 0,
      door_revenue: door_revenue || 0,
      other_revenue: other_revenue || 0,
      staff_cost: staff_cost || 0,
      promoter_cost,
      artist_fee: artist_fee || 0,
      venue_cost: venue_cost || 0,
      other_cost: other_cost || 0,
      attendance,
      notes,
      status: status || 'draft'
    }, { onConflict: 'event_id' })
    .select('id')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true, id: data.id, prefilled }
})
