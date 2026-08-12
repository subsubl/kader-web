// POST /api/admin/sync-ra — trigger a one-off Resident Advisor sync (admin only)
// Self-authorizes (session + admin role), fetches RA events (past + upcoming), upserts into ra_events.

import { createError } from '#imports'

const RA_CLUB_ID = '78778'
const RA_GRAPHQL = 'https://ra.co/graphql'
const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const LIMIT = 200

async function fetchRaEventsType(type: string, year?: number) {
  const query = `query ClubEvents($id: ID!, $limit: Int, $year: Int) {
    venue(id: $id) {
      id
      name
      events(type: ${type}, limit: $limit, year: $year) {
        id title date startTime endTime cost contentUrl flyerFront lineup
        artists { id name } genres { name }
      }
    }
  }`

  try {
    const res = await fetch(RA_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { id: RA_CLUB_ID, limit: LIMIT, year: year || undefined }
      })
    })
    if (!res.ok) return []
    const json = await res.json()
    if (json.errors) return []
    return json?.data?.venue?.events || []
  } catch (err) {
    return []
  }
}

export default defineEventHandler(async (event) => {
  // --- Authorization: valid session + admin role ---
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated.' })
  }
  const { data: role } = await supabase
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!role || role.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
  }

  // --- Fetch past + upcoming events from RA ---
  const eventsMap = new Map()

  const todayEvs = await fetchRaEventsType('TODAY')
  todayEvs.forEach((e: any) => eventsMap.set(e.id, e))

  const prevEvs = await fetchRaEventsType('PREVIOUS')
  prevEvs.forEach((e: any) => eventsMap.set(e.id, e))

  const currentYear = new Date().getFullYear()
  for (let y = currentYear; y >= currentYear - 5; y--) {
    const archiveEvs = await fetchRaEventsType('ARCHIVE', y)
    archiveEvs.forEach((e: any) => eventsMap.set(e.id, e))
  }

  const events = Array.from(eventsMap.values())
  const rows = events.map((e: any) => {
    let flyerUrl = null
    if (e.flyerFront) {
      flyerUrl = /^https?:/i.test(e.flyerFront) ? e.flyerFront : `${RA_UPLOAD_DOMAIN}${e.flyerFront}`
    }
    return {
      ra_id: Number(e.id),
      title: e.title,
      date: new Date(e.startTime || e.date).toISOString(),
      start_time: e.startTime ? new Date(e.startTime).toISOString() : null,
      end_time: e.endTime ? new Date(e.endTime).toISOString() : null,
      cost: typeof e.cost === 'number' ? e.cost : null,
      flyer_url: flyerUrl,
      ra_url: e.contentUrl ? `https://ra.co${e.contentUrl}` : `https://ra.co/events/${e.id}`,
      lineup: e.lineup || null,
      artists: (e.artists || []).map((a: any) => a.name),
      genres: (e.genres || []).map((g: any) => g.name),
      updated_at: new Date().toISOString()
    }
  })

  // --- Upsert via service role ---
  const admin = getAdminSupabase()
  const { error: upErr } = await admin.from('ra_events').upsert(rows, { onConflict: 'ra_id' })
  if (upErr) {
    console.error('[api] ra_events upsert failed:', upErr.message)
    throw createError({ statusCode: 500, statusMessage: 'Sync failed to save events.' })
  }

  return { ok: true, synced: rows.length }
})