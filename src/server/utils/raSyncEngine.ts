// Local Persistent RA & Custom Events Sync Engine
// Syncs RA events and allows creating/managing custom admin events.
// Preserves custom events, tickets, and flyers across auto-syncs.

import path from 'node:path'
import { readJsonSync, atomicWriteJson, atomicWriteJsonSync } from './fileStore'
import { getAdminSupabase } from './supabase'

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
  ticket_provider?: 'free' | 'pretix' | 'olaii' | 'ra' | 'custom' | string | null
  ticket_url?: string | null
  is_custom?: boolean
  updated_at: string
}

export interface LocalStoreData {
  lastSyncedAt: string | null
  events: RaEventRecord[]
}

const STORE_DIR = path.resolve(process.cwd(), '.data')
const STORE_FILE = path.resolve(STORE_DIR, 'ra_events_store.json')
const RA_CLUB_ID = '78778'
const RA_GRAPHQL = 'https://ra.co/graphql'
const RA_UPLOAD_DOMAIN = 'https://d1rlyio0xno2kt.cloudfront.net'
const LIMIT = 200

// In-flight sync promise for single-flight coalescing
let activeSyncPromise: Promise<{ synced: number; total: number; newCount: number }> | null = null

export function readLocalStore(): LocalStoreData {
  return readJsonSync<LocalStoreData>(STORE_FILE, { lastSyncedAt: null, events: [] })
}

export function writeLocalStore(store: LocalStoreData): void {
  atomicWriteJsonSync(STORE_FILE, store)
}

export async function writeLocalStoreAsync(store: LocalStoreData): Promise<void> {
  await atomicWriteJson(STORE_FILE, store)
}

export function isRaSyncing(): boolean {
  return activeSyncPromise !== null
}

async function fetchSingleEventFlyer(id: string | number): Promise<string | null> {
  const query = `query SingleEvent($id: ID!) {
    event(id: $id) {
      flyerFront
      images { filename type }
    }
  }`
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(RA_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ query, variables: { id: String(id) } }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout))

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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(RA_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { id: RA_CLUB_ID, limit: LIMIT, year: year || undefined }
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout))

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

async function executeRaSync(): Promise<{ synced: number; total: number; newCount: number }> {
  console.log('[raSyncEngine] Fetching events from Resident Advisor...')

  const fetchedEventsMap = new Map<string | number, any>()

  const currentYear = new Date().getFullYear()
  const archiveYears = Array.from({ length: 6 }, (_, i) => currentYear - i)

  // Concurrent GraphQL queries for high performance
  const [todayEvs, prevEvs, ...archiveResults] = await Promise.all([
    fetchRaType('TODAY'),
    fetchRaType('PREVIOUS'),
    ...archiveYears.map(y => fetchRaType('ARCHIVE', y))
  ])

  todayEvs.forEach((e: any) => fetchedEventsMap.set(e.id, e))
  prevEvs.forEach((e: any) => fetchedEventsMap.set(e.id, e))
  archiveResults.forEach(batch => {
    batch.forEach((e: any) => fetchedEventsMap.set(e.id, e))
  })

  // === CRITICAL CONCURRENCY MERGE (NO LOST UPDATES) ===
  // Snapshot the freshest store state right now, AFTER external network completes!
  const freshStore = readLocalStore()
  const freshMap = new Map<number, RaEventRecord>()
  freshStore.events.forEach((ev) => freshMap.set(ev.ra_id, ev))

  const updatedEventsMap = new Map<number, RaEventRecord>()

  // 1. Preserve all custom admin events created before or during the network fetch
  freshStore.events.forEach((ev) => {
    if (ev.is_custom) {
      updatedEventsMap.set(ev.ra_id, ev)
    }
  })

  // 2. Normalize and merge fetched RA events
  let newCount = 0
  for (const rawEvent of fetchedEventsMap.values()) {
    const normalized = normalizeRaEvent(rawEvent)
    const existing = freshMap.get(normalized.ra_id)

    if (existing?.flyer_url && !normalized.flyer_url) {
      normalized.flyer_url = existing.flyer_url
    }
    if (!normalized.flyer_url) {
      const singleFlyer = await fetchSingleEventFlyer(normalized.ra_id)
      if (singleFlyer) normalized.flyer_url = singleFlyer
    }
    if (!freshMap.has(normalized.ra_id)) {
      newCount++
    }
    // Retain pretix URL and ticket configuration from fresh local store
    if (existing && existing.pretix_event_url) {
      normalized.pretix_event_url = existing.pretix_event_url
    }
    if (existing && existing.ticket_provider) {
      normalized.ticket_provider = existing.ticket_provider
    }
    if (existing && existing.ticket_url) {
      normalized.ticket_url = existing.ticket_url
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

  await writeLocalStoreAsync(newStore)
  console.log(`[raSyncEngine] Store atomically updated: ${allEvents.length} events saved (${newCount} new).`)

  // Sync to Supabase DB in background if configured
  try {
    const config = useRuntimeConfig()
    const url = config.public?.supabaseUrl as string
    if (url && !url.includes('placeholder')) {
      const admin = getAdminSupabase()
      const dbRows = allEvents.map(({ is_custom, ...rest }) => rest)
      await admin.from('ra_events').upsert(dbRows as any, { onConflict: 'ra_id' })
      console.log('[raSyncEngine] Supabase ra_events table synced.')
    }
  } catch {
    // Supabase DB sync optional / non-fatal
  }

  return { synced: allEvents.length, total: allEvents.length, newCount }
}

/**
 * Single-flight request coalescing for RA sync.
 */
export function syncRaEventsEngine(): Promise<{ synced: number; total: number; newCount: number }> {
  if (activeSyncPromise) {
    return activeSyncPromise
  }

  activeSyncPromise = executeRaSync().finally(() => {
    activeSyncPromise = null
  })

  return activeSyncPromise
}

export function triggerBackgroundSync(): void {
  if (!activeSyncPromise) {
    syncRaEventsEngine().catch((err) => {
      console.error('[raSyncEngine] Background auto-sync failed:', err)
    })
  }
}

export function saveCustomEvent(eventData: Partial<RaEventRecord>): RaEventRecord {
  const store = readLocalStore()
  const ra_id = eventData.ra_id || Date.now()

  const record: RaEventRecord = {
    ra_id,
    title: eventData.title || 'Untitled Event',
    date: eventData.date ? new Date(eventData.date).toISOString() : new Date().toISOString(),
    start_time: eventData.start_time ? new Date(eventData.start_time).toISOString() : null,
    end_time: eventData.end_time ? new Date(eventData.end_time).toISOString() : null,
    cost: typeof eventData.cost === 'number' ? eventData.cost : null,
    flyer_url: eventData.flyer_url || null,
    ra_url: eventData.ra_url || null,
    lineup: eventData.lineup || null,
    artists: Array.isArray(eventData.artists) ? eventData.artists : [],
    genres: Array.isArray(eventData.genres) ? eventData.genres : [],
    pretix_event_url: eventData.pretix_event_url || null,
    ticket_provider: eventData.ticket_provider || (eventData.cost === 0 ? 'free' : 'ra'),
    ticket_url: eventData.ticket_url || null,
    is_custom: true,
    updated_at: new Date().toISOString()
  }

  const existingIdx = store.events.findIndex((e) => e.ra_id === ra_id)
  if (existingIdx >= 0) {
    store.events[existingIdx] = record
  } else {
    store.events = [record, ...store.events]
  }

  writeLocalStore(store)
  return record
}

export function deleteCustomEvent(ra_id: number): boolean {
  const store = readLocalStore()
  const initialCount = store.events.length
  store.events = store.events.filter((e) => e.ra_id !== ra_id)
  if (store.events.length !== initialCount) {
    writeLocalStore(store)
    return true
  }
  return false
}

export async function updateRaEventPretix(
  ra_id: number,
  pretix_event_url: string | null
): Promise<RaEventRecord | null> {
  const store = readLocalStore()
  const event = store.events.find((e) => e.ra_id === ra_id)
  if (!event) {
    return null
  }
  event.pretix_event_url = pretix_event_url || null
  event.updated_at = new Date().toISOString()
  await writeLocalStoreAsync(store)
  return event
}

/**
 * Public getter for RA & custom events.
 * NEVER blocks on external network. Returns local store data in < 1ms.
 */
export async function getSyncedRaEvents(scope: string = 'upcoming'): Promise<RaEventRecord[]> {
  const store = readLocalStore()

  const TEN_MINS = 10 * 60 * 1000
  const isStale = !store.lastSyncedAt || Date.now() - new Date(store.lastSyncedAt).getTime() > TEN_MINS

  if (isStale) {
    triggerBackgroundSync()
  }

  const events = store.events
  const now = new Date()

  if (scope === 'upcoming') {
    return events
      .filter((e) => new Date(e.end_time || e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  if (scope === 'past') {
    return events
      .filter((e) => new Date(e.end_time || e.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
