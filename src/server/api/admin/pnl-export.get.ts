import { createError, getQuery, defineEventHandler, setResponseHeader, setHeader } from 'h3'
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
  const eventId = query.event_id as string

  if (!eventId) {
    throw createError({ statusCode: 400, message: 'Missing event_id' })
  }

  const { data: pnl, error } = await adminSupabase
    .from('event_pnl')
    .select('*')
    .eq('event_id', eventId)
    .single()

  if (error || !pnl) {
    throw createError({ statusCode: 404, message: 'P&L report not found' })
  }

  const totalRevenue = (Number(pnl.ticket_revenue) || 0) + (Number(pnl.bar_revenue) || 0) + (Number(pnl.door_revenue) || 0) + (Number(pnl.other_revenue) || 0)
  const totalCost = (Number(pnl.staff_cost) || 0) + (Number(pnl.promoter_cost) || 0) + (Number(pnl.artist_fee) || 0) + (Number(pnl.venue_cost) || 0) + (Number(pnl.other_cost) || 0)
  const netProfit = totalRevenue - totalCost

  const headers = [
    'Event', 'Date', 'Ticket Revenue', 'Bar Revenue', 'Door Revenue', 'Other Revenue',
    'Staff Cost', 'Promoter Cost', 'Artist Fee', 'Venue Cost', 'Other Cost',
    'Total Revenue', 'Total Cost', 'Net Profit', 'Attendance', 'Status'
  ]

  const row = [
    pnl.event_label,
    pnl.event_date,
    pnl.ticket_revenue,
    pnl.bar_revenue,
    pnl.door_revenue,
    pnl.other_revenue,
    pnl.staff_cost,
    pnl.promoter_cost,
    pnl.artist_fee,
    pnl.venue_cost,
    pnl.other_cost,
    totalRevenue,
    totalCost,
    netProfit,
    pnl.attendance,
    pnl.status
  ]

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""'
    const str = String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csv = [
    headers.map(escapeCSV).join(','),
    row.map(escapeCSV).join(',')
  ].join('\n')

  setHeader(event, 'Content-Type', 'text/csv')
  setHeader(event, 'Content-Disposition', `attachment; filename="pnl_${eventId}.csv"`)

  return csv
})
