// GET /api/admin/analytics — dashboard metrics for the admin (admin only).
// Returns: pretix revenue per event, ticket + check-in counts, upcoming shifts,
// staffing gaps, and inquiry pipeline counts.

import { createError } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = createServerSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (!roleRow || roleRow.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const nowIso = new Date().toISOString()

  // Run independent aggregates in parallel
  const [ordersRes, ticketsRes, raEventsRes, shiftsRes, inquiriesRes] = await Promise.all([
    admin.from('pretix_orders').select('event_id, total, status, paid_at'),
    admin.from('pretix_tickets').select('id, event_id, checkin_status'),
    // Upcoming RA events (name/date context for revenue rows)
    admin.from('ra_events').select('ra_id, title, date').gte('date', nowIso).order('date', { ascending: true }).limit(10),
    // Upcoming shifts (next 7 days) + their assignments
    admin.from('shifts').select('id, date, start_time, end_time, role, required_count, status')
      .gte('date', new Date().toISOString().slice(0, 10))
      .lte('date', new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)),
    admin.from('inquiries').select('status')
  ])

  if (ordersRes.error || ticketsRes.error || raEventsRes.error || shiftsRes.error || inquiriesRes.error) {
    console.error('[analytics] errors', {
      orders: ordersRes.error?.message,
      tickets: ticketsRes.error?.message,
      ra: raEventsRes.error?.message,
      shifts: shiftsRes.error?.message,
      inquiries: inquiriesRes.error?.message
    })
    throw createError({ statusCode: 500, statusMessage: 'Failed to compute analytics.' })
  }

  type Order = { event_id: string | null; total: number | null; status: string | null; paid_at: string | null }
  type Ticket = { id: string; event_id: string | null; checkin_status: string | null }

  const orders = (ordersRes.data || []) as unknown as Order[]
  const tickets = (ticketsRes.data || []) as unknown as Ticket[]

  // ── Revenue & tickets grouped by internal event id ──
  const byEvent = new Map<string, { revenue: number; orders: number; tickets: number; checkedIn: number }>()
  const ensure = (id: string) => {
    if (!byEvent.has(id)) byEvent.set(id, { revenue: 0, orders: 0, tickets: 0, checkedIn: 0 })
    return byEvent.get(id)!
  }

  let totalRevenue = 0
  let paidOrders = 0
  for (const o of orders) {
    if (o.status === 'p' /* paid */ || o.paid_at) {
      const r = Number(o.total || 0)
      totalRevenue += r
      paidOrders++
      if (o.event_id) {
        const e = ensure(o.event_id)
        e.revenue += r
        e.orders++
      }
    }
  }

  let totalTickets = 0
  let totalCheckedIn = 0
  for (const t of tickets) {
    totalTickets++
    if (t.checkin_status) totalCheckedIn++
    if (t.event_id) {
      const e = ensure(t.event_id)
      e.tickets++
      if (t.checkin_status) e.checkedIn++
    }
  }

  const eventRows = [...byEvent.entries()]
    .map(([eventId, v]) => ({
      eventId,
      title: '',
      date: '',
      ...v,
      checkinRate: v.tickets > 0 ? Math.round((v.checkedIn / v.tickets) * 100) : null
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  // Attach titles/dates from ra_events where we can (by convention event_id may be ra id or uuid)
  const raList = (raEventsRes.data || []) as Array<{ ra_id: number; title: string; date: string }>
  for (const row of eventRows) {
    const match = raList.find((r) => String(r.ra_id) === row.eventId)
    if (match) {
      row.title = match.title
      row.date = match.date
    }
  }

  // ── Staffing (next 7 days) ──
  type ShiftRow = { id: string; date: string; start_time: string; end_time: string; role: DbStaffRoleLike; required_count: number; status: string | null }
  type DbStaffRoleLike = string

  const shiftRows = (shiftsRes.data || []) as unknown as ShiftRow[]
  const shiftIds = shiftRows.map((s) => s.id)

  // Fetch assignment counts per shift in one query
  let assignCounts = new Map<string, number>()
  if (shiftIds.length > 0) {
    const { data: asg } = await admin
      .from('shift_assignments')
      .select('shift_id')
      .in('shift_id', shiftIds)
    for (const a of (asg || []) as Array<{ shift_id: string }>) {
      assignCounts.set(a.shift_id, (assignCounts.get(a.shift_id) || 0) + 1)
    }
  }

  const understaffedShifts = shiftRows.filter((s) => (assignCounts.get(s.id) || 0) < s.required_count).length
  const totalShifts = shiftRows.length
  const totalAssignments = [...assignCounts.values()].reduce((a, b) => a + b, 0)

  // ── Inquiry pipeline ──
  const pipeline = { new: 0, contacted: 0, contracted: 0, invoiced: 0 } as Record<string, number>
  for (const i of (inquiriesRes.data || []) as Array<{ status: string | null }>) {
    const st = i.status || 'new'
    pipeline[st] = (pipeline[st] || 0) + 1
  }

  return {
    totals: {
      revenue: Math.round(totalRevenue * 100) / 100,
      paidOrders,
      tickets: totalTickets,
      checkedIn: totalCheckedIn,
      checkinRate: totalTickets > 0 ? Math.round((totalCheckedIn / totalTickets) * 100) : null
    },
    eventsByRevenue: eventRows,
    upcomingRaEvents: raList,
    staffing: {
      shiftsNextWeek: totalShifts,
      assignmentsNextWeek: totalAssignments,
      understaffedShifts
    },
    inquiryPipeline: pipeline
  }
})
