// POST /api/admin/sync-ra — trigger a one-off Resident Advisor sync (admin only)
// Self-authorizes (session + admin role), fetches RA events, upserts into ra_events.
// The scheduled GitHub Actions workflow (scripts/sync-ra.mjs) is the primary sync;
// this lets staff run it on demand from the admin UI without waiting.

import { createError } from '#imports'

const RA_CLUB_ID = '78778'
const RA_GRAPHQL = 'https://ra.co/graphql'
const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const LIMIT = 200

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

  // --- Fetch from RA ---
  const query = `query ClubEvents($id: ID!, $limit: Int) {
    venue(id: $id) {
      id events(type: PREVIOUS, limit: $limit) {
        id title date startTime endTime cost contentUrl flyerFront lineup
        artists { name } genres { name }
      }
    }
  }`

  let raJson
  try {
    const res = await fetch(RA_GRAPHQL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: RA_CLUB_ID, limit: LIMIT } })
    })
    if (!res.ok) throw new Error(`RA responded ${res.status}`)
    raJson = await res.json()
    if (raJson.errors) throw new Error(`RA errors: ${JSON.stringify(raJson.errors).slice(0, 200)}`)
  } catch (err) {
    console.error('[api] RA fetch failed:', (err as Error).message)
    throw createError({ statusCode: 502, statusMessage: 'Could not reach Resident Advisor.' })
  }

  const events = raJson?.data?.venue?.events || []
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