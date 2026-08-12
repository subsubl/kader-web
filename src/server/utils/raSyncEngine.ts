// Local Persistent RA Sync Engine
// Syncs and caches all RA events (flyers, lineup, artists, genres, cost, dates) locally in persistent storage.
// Checks for new/updated events and syncs with Supabase when wired.

import fs from 'node:fs'
import path from 'node:path'

export interface RaEventRecord {
  ra_id: number
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  cost: number | null
  flyer_url: string | null
  ra_url: string | null
  lineup: string | null
  artists: string[]
  genres: string[]
  pretix_event_url?: string | null
  updated_at: string
}

interface LocalStoreData {
  lastSyncedAt: string | null
  events: RaEventRecord[]
}

const STORE_DIR = path.resolve(process.cwd(), '.data')
const STORE_FILE = path.resolve(STORE_DIR, 'ra_events_store.json')
const RA_CLUB_ID = '78778'
const RA_GRAPHQL = 'https://ra.co/graphql'
const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const LIMIT = 200

function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true })
  }
}

export function readLocalStore(): LocalStoreData {
  try {
    ensureStoreDir()
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (parsed && Array.isArray(parsed.events)) {
        return parsed
      }
    }
  } catch (e) {
    console.error('[raSyncEngine] Failed to read local store:', e)
  }
  return { lastSyncedAt: null, events: [] }
}

export function writeLocalStore(store: LocalStoreData) {
  try {
    ensureStoreDir()
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8')
  } catch (e) {
    console.error('[raSyncEngine] Failed to write local store:', e)
  }
}

async function fetchSingleEventFlyer(id: string | number): Promise<string | null> {
  const query = `query SingleEvent($id: ID!) {
    event(id: $id) {
      flyerFront
      images { filename type }
    }
  }`
  try {
    const res = await fetch(RA_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ query, variables: { id: String(id) } })
    })
    if (!res.ok) return null
    const json = await res.json()
    const ev = json?.data?.event
    if (!ev) return null
    if (ev.flyerFront) {
      return /^https?:/i.test(ev.flyerFront) ? ev.flyerFront : `${RA_UPLOAD_DOMAIN}${ev.flyerFront}`
    }
    if (Array.isArray(ev.images) && ev.images.length > 0) {
      const front = ev.images.find((img: any) => img.type === 'FLYERFRONT' || img.type === 'FLYER') || ev.images[0]
      if (front && front.filename) {
        return /^https?:/i.test(front.filename) ? front.filename : `${RA_UPLOAD_DOMAIN}${front.filename}`
      }
    }
  } catch {
    return null
  }
  return null
}

async function fetchRaType(type: string, year?: number): Promise<any[]> {
  const query = `query ClubEvents($id: ID!, $limit: Int, $year: Int) {
    venue(id: $id) {
      id name
      events(type: ${type}, limit: $limit, year: $year) {
        id title date startTime endTime cost contentUrl flyerFront lineup
        images { filename type }
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

export function extractFlyerUrl(e: any): string | null {
  if (e.flyerFront) {
    return /^https?:/i.test(e.flyerFront) ? e.flyerFront : `${RA_UPLOAD_DOMAIN}${e.flyerFront}`
  }
  if (Array.isArray(e.images) && e.images.length > 0) {
    const frontImage = e.images.find((img: any) => img.type === 'FLYERFRONT' || img.type === 'FLYER') || e.images[0]
    if (frontImage && frontImage.filename) {
      return /^https?:/i.test(frontImage.filename) ? frontImage.filename : `${RA_UPLOAD_DOMAIN}${frontImage.filename}`
    }
  }
  return null
}

export function normalizeRaEvent(e: any): RaEventRecord {
  const date = e.startTime || e.date
  const flyerUrl = extractFlyerUrl(e)
  return {
    ra_id: Number(e.id),
    title: e.title || 'Untitled Event',
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    start_time: e.startTime ? new Date(e.startTime).toISOString() : null,
    end_time: e.endTime ? new Date(e.endTime).toISOString() : null,
    cost: typeof e.cost === 'number' ? e.cost : null,
    flyer_url: flyerUrl,
    ra_url: e.contentUrl ? `https://ra.co${e.contentUrl}` : `https://ra.co/events/${e.id}`,
    lineup: e.lineup || null,
    artists: Array.isArray(e.artists) ? e.artists.map((a: any) => typeof a === 'string' ? a : a.name) : [],
    genres: Array.isArray(e.genres) ? e.genres.map((g: any) => typeof g === 'string' ? g : g.name) : [],
    updated_at: new Date().toISOString()
  }
}

export async function syncRaEventsEngine(): Promise<{ synced: number; total: number; newCount: number }> {
  console.log('[raSyncEngine] Fetching all events from Resident Advisor...')

  const currentStore = readLocalStore()
  const existingMap = new Map<number, RaEventRecord>()
  currentStore.events.forEach((ev) => existingMap.set(ev.ra_id, ev))

  const fetchedEventsMap = new Map<string | number, any>()

  const todayEvs = await fetchRaType('TODAY')
  todayEvs.forEach((e: any) => fetchedEventsMap.set(e.id, e))

  const prevEvs = await fetchRaType('PREVIOUS')
  prevEvs.forEach((e: any) => fetchedEventsMap.set(e.id, e))

  const currentYear = new Date().getFullYear()
  for (let y = currentYear; y >= currentYear - 5; y--) {
    const archiveEvs = await fetchRaType('ARCHIVE', y)
    archiveEvs.forEach((e: any) => fetchedEventsMap.set(e.id, e))
  }

  let newCount = 0
  const updatedEventsMap = new Map<number, RaEventRecord>(existingMap)

  for (const rawEvent of fetchedEventsMap.values()) {
    const normalized = normalizeRaEvent(rawEvent)
    if (!normalized.flyer_url) {
      const singleFlyer = await fetchSingleEventFlyer(normalized.ra_id)
      if (singleFlyer) normalized.flyer_url = singleFlyer
    }
    if (!existingMap.has(normalized.ra_id)) {
      newCount++
    }
    const existing = existingMap.get(normalized.ra_id)
    if (existing && existing.pretix_event_url) {
      normalized.pretix_event_url = existing.pretix_event_url
    }
    updatedEventsMap.set(normalized.ra_id, normalized)
  }

  const allEvents = Array.from(updatedEventsMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const newStore: LocalStoreData = {
    lastSyncedAt: new Date().toISOString(),
    events: allEvents
  }

  writeLocalStore(newStore)
  console.log(`[raSyncEngine] Local store updated: ${allEvents.length} events saved (${newCount} new).`)

  // Try sync with Supabase DB if configured
  try {
    const config = useRuntimeConfig()
    const url = config.public?.supabaseUrl as string
    if (url && !url.includes('placeholder')) {
      const admin = getAdminSupabase()
      await admin.from('ra_events').upsert(allEvents, { onConflict: 'ra_id' })
      console.log('[raSyncEngine] Supabase ra_events table synced.')
    }
  } catch (e) {
    // Supabase DB sync optional
  }

  return { synced: allEvents.length, total: allEvents.length, newCount }
}

export async function getSyncedRaEvents(scope: string = 'upcoming'): Promise<RaEventRecord[]> {
  let store = readLocalStore()

  const TEN_MINS = 10 * 60 * 1000
  const isStale = !store.lastSyncedAt || new Date().getTime() - new Date(store.lastSyncedAt).getTime() > TEN_MINS

  if (store.events.length === 0 || isStale) {
    await syncRaEventsEngine()
    store = readLocalStore()
  }

  const events = store.events
  const now = new Date()

  if (scope === 'upcoming') {
    const upcoming = events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime())

    if (upcoming.length > 0) return upcoming
    return events.slice(0, 12)
  }

  if (scope === 'past') {
    return events
      .filter((e) => new Date(e.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
