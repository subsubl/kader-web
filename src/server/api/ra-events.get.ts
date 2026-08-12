// GET /api/ra-events — public, returns Resident Advisor events synced into ra_events.
// Query params: ?scope=upcoming|past|all (default: upcoming)
// Robust live fallback: If DB returns empty (or in placeholder mode), fetches directly from RA GraphQL API.

import { createError } from '#imports'

const RA_CLUB_ID = '78778'
const RA_GRAPHQL = 'https://ra.co/graphql'
const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const LIMIT = 200

async function fetchRaEventsLiveDirect() {
  async function fetchRaType(type: string, year?: number) {
    const query = `query ClubEvents($id: ID!, $limit: Int, $year: Int) {
      venue(id: $id) {
        id name
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
      return json?.data?.venue?.events || []
    } catch {
      return []
    }
  }

  const eventsMap = new Map()
  const todayEvs = await fetchRaType('TODAY')
  todayEvs.forEach((e: any) => eventsMap.set(e.id, e))

  const prevEvs = await fetchRaType('PREVIOUS')
  prevEvs.forEach((e: any) => eventsMap.set(e.id, e))

  const currentYear = new Date().getFullYear()
  for (let y = currentYear; y >= currentYear - 5; y--) {
    const archiveEvs = await fetchRaType('ARCHIVE', y)
    archiveEvs.forEach((e: any) => eventsMap.set(e.id, e))
  }

  return Array.from(eventsMap.values()).map((e: any) => {
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
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scope = String(query.scope || 'upcoming')
  const now = new Date().toISOString()

  let data: any[] = []

  try {
    const supabase = getAdminSupabase()
    let raQuery = supabase.from('ra_events').select('*')

    if (scope === 'upcoming') {
      raQuery = raQuery.gte('date', now).order('date', { ascending: true })
    } else if (scope === 'past') {
      raQuery = raQuery.lt('date', now).order('date', { ascending: false })
    } else {
      raQuery = raQuery.order('date', { ascending: false })
    }

    const { data: dbData } = await raQuery.limit(100)
    data = dbData || []
  } catch {
    data = []
  }

  // Fallback: If DB yields 0 events, fetch live from RA GraphQL
  if (!data || data.length === 0) {
    const liveEvents = await fetchRaEventsLiveDirect()

    if (scope === 'upcoming') {
      data = liveEvents
        .filter((e) => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // If no upcoming events in the future, fallback to latest events so page displays content
      if (data.length === 0 && liveEvents.length > 0) {
        data = liveEvents
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 12)
      }
    } else if (scope === 'past') {
      data = liveEvents
        .filter((e) => new Date(e.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      data = liveEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }

  return data
})