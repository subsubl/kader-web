// GET /api/ra-events — public, returns Resident Advisor events synced into ra_events.
// Query params: ?scope=upcoming|past|all   (default: upcoming)
// Reads via service-role client (ra_events has public-read RLS too, this keeps it robust).

import { createError } from '#imports'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scope = String(query.scope || 'upcoming')

  const supabase = getAdminSupabase()
  const now = new Date().toISOString()

  let raQuery = supabase.from('ra_events').select('*')

  if (scope === 'upcoming') {
    raQuery = raQuery.gte('date', now).order('date', { ascending: true })
  } else if (scope === 'past') {
    raQuery = raQuery.lt('date', now).order('date', { ascending: false })
  } else {
    raQuery = raQuery.order('date', { ascending: false })
  }

  const { data, error } = await raQuery.limit(100)

  if (error) {
    console.error('[api] ra-events fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not load RA events.' })
  }

  return data
})