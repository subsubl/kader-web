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

  const query = getQuery(event)
  const eventId = query.event_id as string | undefined

  let guestlistQuery = adminClient
    .from('guestlists')
    .select('promoter_id, status, event_id')
    .not('promoter_id', 'is', null)

  if (eventId) {
    guestlistQuery = guestlistQuery.eq('event_id', eventId)
  }

  const { data: guestlists, error: glError } = await guestlistQuery

  if (glError) {
    throw createError({ statusCode: 500, message: glError.message })
  }

  const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers()
  if (usersError) {
    throw createError({ statusCode: 500, message: usersError.message })
  }
  const users = usersData.users

  let ratesQuery = adminClient.from('promoter_commission_rates').select('event_id, rate')
  if (eventId) {
    ratesQuery = ratesQuery.eq('event_id', eventId)
  }
  const { data: ratesData } = await ratesQuery

  const ratesMap = new Map<string, number>()
  if (ratesData) {
    for (const rate of ratesData) {
      if (rate.event_id) {
        ratesMap.set(rate.event_id, rate.rate)
      }
    }
  }

  const statsMap = new Map<string, any>()

  for (const gl of guestlists || []) {
    const pId = gl.promoter_id
    if (!pId) continue

    if (!statsMap.has(pId)) {
      const pUser = users.find(u => u.id === pId)
      statsMap.set(pId, {
        promoter_id: pId,
        name: pUser?.user_metadata?.name || pUser?.email?.split('@')[0] || 'Unknown',
        email: pUser?.email || '',
        total_guests: 0,
        checked_in: 0,
        commission: 0,
        events: new Set()
      })
    }

    const stats = statsMap.get(pId)
    stats.total_guests++
    stats.events.add(gl.event_id)

    if (gl.status === 'checked_in') {
      stats.checked_in++
      const rate = ratesMap.get(gl.event_id) ?? 2.00
      stats.commission += rate
    }
  }

  const results = Array.from(statsMap.values()).map(stats => {
    return {
      promoter_id: stats.promoter_id,
      name: stats.name,
      email: stats.email,
      total_guests: stats.total_guests,
      checked_in: stats.checked_in,
      checkin_rate: stats.total_guests > 0 ? ((stats.checked_in / stats.total_guests) * 100).toFixed(1) : '0.0',
      commission: Number(stats.commission.toFixed(2)),
      events_count: stats.events.size
    }
  })

  results.sort((a, b) => b.commission - a.commission)

  return results
})
