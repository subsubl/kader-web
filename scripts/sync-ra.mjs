#!/usr/bin/env node
/**
 * Kader — Resident Advisor event sync
 * Fetches all upcoming AND past events for RA club 78778 (Kader Grad Kodeljevo) via RA's GraphQL API
 * and upserts them into the local Supabase `ra_events` table (idempotent, keyed by ra_id).
 *
 * Designed to be dependency-free (Node 18+ global fetch) so it can run in CI
 * (GitHub Actions scheduled workflow) without an npm install step.
 *
 * Env required:
 *   SUPABASE_URL         e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY  service-role key (bypasses RLS for writes)
 * Optional:
 *   RA_CLUB_ID           default 78778
 *   RA_LIMIT             default 200 (events to fetch per query)
 */

const RA_CLUB_ID = process.env.RA_CLUB_ID || '78778'
const RA_LIMIT = Number(process.env.RA_LIMIT || 200)
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

const isPlaceholder = !SUPABASE_URL || !SUPABASE_SERVICE_KEY || SUPABASE_URL.includes('placeholder')

const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const RA_GRAPHQL = 'https://ra.co/graphql'

function fail(msg) {
  console.error('[sync-ra] ERROR:', msg)
  process.exit(1)
}

async function fetchRaEventsType(type, year) {
  const query = `query ClubEvents($id: ID!, $limit: Int, $year: Int) {
    venue(id: $id) {
      id
      name
      events(type: ${type}, limit: $limit, year: $year) {
        id
        title
        date
        startTime
        endTime
        cost
        contentUrl
        flyerFront
        minimumAge
        lineup
        artists { id name }
        genres { name }
      }
    }
  }`

  const res = await fetch(RA_GRAPHQL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      query,
      variables: { id: RA_CLUB_ID, limit: RA_LIMIT, year: year || undefined }
    })
  })

  if (!res.ok) {
    console.warn(`[sync-ra] Warning: RA GraphQL returned ${res.status} for type=${type}`)
    return []
  }

  const json = await res.json()
  if (json.errors) {
    console.warn(`[sync-ra] Warning: RA GraphQL errors for type=${type}: ${JSON.stringify(json.errors).slice(0, 200)}`)
    return []
  }

  return json?.data?.venue?.events || []
}

async function fetchAllRaEvents() {
  const eventsMap = new Map()

  // 1. Fetch upcoming & current events (TODAY enum in RA API)
  const todayEvents = await fetchRaEventsType('TODAY')
  todayEvents.forEach((e) => eventsMap.set(e.id, e))

  // 2. Fetch previous events (PREVIOUS enum in RA API)
  const prevEvents = await fetchRaEventsType('PREVIOUS')
  prevEvents.forEach((e) => eventsMap.set(e.id, e))

  // 3. Fetch archived events across past years
  const currentYear = new Date().getFullYear()
  for (let y = currentYear; y >= currentYear - 5; y--) {
    const archiveEvents = await fetchRaEventsType('ARCHIVE', y)
    archiveEvents.forEach((e) => eventsMap.set(e.id, e))
  }

  return Array.from(eventsMap.values())
}

function normalize(e) {
  const date = e.startTime || e.date
  let flyerUrl = null
  if (e.flyerFront) {
    flyerUrl = /^https?:/i.test(e.flyerFront)
      ? e.flyerFront
      : `${RA_UPLOAD_DOMAIN}${e.flyerFront}`
  }
  return {
    ra_id: Number(e.id),
    title: e.title,
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    start_time: e.startTime ? new Date(e.startTime).toISOString() : null,
    end_time: e.endTime ? new Date(e.endTime).toISOString() : null,
    cost: typeof e.cost === 'number' ? e.cost : null,
    flyer_url: flyerUrl,
    ra_url: e.contentUrl ? `https://ra.co${e.contentUrl}` : `https://ra.co/events/${e.id}`,
    lineup: e.lineup || null,
    artists: (e.artists || []).map((a) => a.name),
    genres: (e.genres || []).map((g) => g.name),
    updated_at: new Date().toISOString()
  }
}

async function upsert(rows) {
  if (rows.length === 0) return 0
  if (isPlaceholder) {
    console.log(`[sync-ra] Local placeholder mode — fetched ${rows.length} events (skipping Supabase REST write).`)
    return rows.length
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ra_events`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  })
  if (!res.ok) {
    const body = await res.text()
    fail(`Supabase upsert failed (${res.status}): ${body.slice(0, 300)}`)
  }
  return rows.length
}

async function main() {
  console.log(`[sync-ra] Syncing all past and upcoming events for RA club ${RA_CLUB_ID}...`)
  const events = await fetchAllRaEvents()
  console.log(`[sync-ra] Got ${events.length} total unique events from RA.`)

  const rows = events.map(normalize)
  const upserted = await upsert(rows)

  const now = new Date()
  const upcoming = rows.filter((r) => new Date(r.date) >= now).length
  const past = rows.length - upcoming
  console.log(`[sync-ra] Summary: ${upcoming} upcoming/new, ${past} past, ${rows.length} total synced.`)
  console.log('[sync-ra] Done.')
}

main().catch((e) => fail(e.message))