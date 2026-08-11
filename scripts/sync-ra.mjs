#!/usr/bin/env node
/**
 * Kader — Resident Advisor event sync
 * Fetches all events for RA club 78778 (Kader Grad Kodeljevo) via RA's GraphQL API
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
 *   RA_LIMIT             default 200 (events to fetch)
 */

const RA_CLUB_ID = process.env.RA_CLUB_ID || '78778'
const RA_LIMIT = Number(process.env.RA_LIMIT || 200)
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[sync-ra] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const RA_GRAPHQL = 'https://ra.co/graphql'

function fail(msg) {
  console.error('[sync-ra] ERROR:', msg)
  process.exit(1)
}

async function fetchRaEvents() {
  const query = `query ClubEvents($id: ID!, $limit: Int) {
    venue(id: $id) {
      id
      name
      events(type: PREVIOUS, limit: $limit) {
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
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { id: RA_CLUB_ID, limit: RA_LIMIT }
    })
  })

  if (!res.ok) fail(`RA GraphQL responded ${res.status}`)
  const json = await res.json()
  if (json.errors) fail(`RA GraphQL errors: ${JSON.stringify(json.errors).slice(0, 300)}`)
  const venue = json?.data?.venue
  if (!venue) fail('RA GraphQL returned no venue')
  return venue.events || []
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
  console.log(`[sync-ra] Fetching up to ${RA_LIMIT} events for RA club ${RA_CLUB_ID}...`)
  const events = await fetchRaEvents()
  console.log(`[sync-ra] Got ${events.length} events from RA.`)

  const rows = events.map(normalize)
  const upserted = await upsert(rows)
  console.log(`[sync-ra] Upserted ${upserted} events into ra_events.`)

  // Report counts (useful for CI logs)
  const now = new Date()
  const upcoming = rows.filter((r) => new Date(r.date) >= now).length
  const past = rows.length - upcoming
  console.log(`[sync-ra] Summary: ${upcoming} upcoming, ${past} past, ${rows.length} total.`)
  console.log('[sync-ra] Done.')
}

main().catch((e) => fail(e.message))