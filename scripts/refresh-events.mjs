#!/usr/bin/env node
// Scheduled build-time refresh only. No API server, browser CORS proxy or secrets.
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const OUTPUT = path.resolve('src/data/events.json')
const endpoint = 'https://ra.co/graphql'

export async function fetchEvents(type, fetcher = fetch) {
  const query = `query ClubEvents($id: ID!, $limit: Int) {
    venue(id: $id) {
      id name
      events(type: ${type}, limit: $limit) {
        id title date startTime endTime cost contentUrl flyerFront lineup
        images { filename type }
        artists { name } genres { name }
      }
    }
  }`
  const res = await fetcher(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'KaderStaticEvents/1.0' },
    body: JSON.stringify({ query, variables: { id: '78778', limit: 200 } }),
    signal: AbortSignal.timeout(20000)
  })
  if (!res.ok) throw new Error(`RA ${type}: HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(`RA ${type}: GraphQL errors`)
  const events = json.data?.venue?.events
  if (!Array.isArray(events)) throw new Error(`RA ${type}: invalid response`)
  return events
}

const safeUrl = value => {
  if (!value) return null
  const url = new URL(value, 'https://ra.co')
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid event URL protocol')
  return url.href
}

export function normalizeEvent(e) {
  if (!e || !Number.isSafeInteger(Number(e.id)) || Number(e.id) < 1 || !e.title?.trim()) {
    throw new Error('RA event missing valid ID/title')
  }
  const date = new Date(e.startTime || e.date).toISOString()
  const image = e.images?.find(i => ['FLYERFRONT', 'FLYER'].includes(i.type)) || e.images?.[0]
  const flyer = e.flyerFront || image?.filename
  return {
    ra_id: Number(e.id), title: e.title.trim(), date,
    start_time: e.startTime ? new Date(e.startTime).toISOString() : null,
    end_time: e.endTime ? new Date(e.endTime).toISOString() : null,
    cost: typeof e.cost === 'number' ? e.cost : null,
    flyer_url: flyer ? safeUrl(/^https?:/i.test(flyer) ? flyer : `https://d1rlyio0xno2kt.cloudfront.net${flyer}`) : null,
    ra_url: safeUrl(e.contentUrl || `/events/${e.id}`),
    lineup: e.lineup || null,
    artists: (e.artists || []).map(a => typeof a === 'string' ? a : a.name).filter(Boolean),
    genres: (e.genres || []).map(g => typeof g === 'string' ? g : g.name).filter(Boolean)
  }
}

export async function refresh({ output = OUTPUT, fetcher = fetch } = {}) {
  // Any failed query or invalid record aborts BEFORE touching the last good file.
  const batches = await Promise.all(['TODAY', 'PREVIOUS'].map(type => fetchEvents(type, fetcher)))
  const byId = new Map()
  for (const raw of batches.flat()) {
    const e = normalizeEvent(raw)
    byId.set(e.ra_id, e)
  }
  if (!byId.size) throw new Error('RA returned no events; keeping last good snapshot')
  const events = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.ra_id - b.ra_id)
  let previous
  try { previous = JSON.parse(await fs.readFile(output, 'utf8')) } catch (e) { if (e.code !== 'ENOENT') throw e }
  if (JSON.stringify(previous?.events) === JSON.stringify(events)) {
    console.log(`[refresh-events] unchanged: ${events.length} events`)
    return events
  }
  const store = { lastSyncedAt: new Date().toISOString(), events }
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(`${output}.tmp`, JSON.stringify(store, null, 2) + '\n')
  await fs.rename(`${output}.tmp`, output)
  console.log(`[refresh-events] saved ${events.length} validated RA events (${events.filter(e => Date.parse(e.end_time || e.date) >= Date.now()).length} upcoming)`)
  return events
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  refresh().catch(e => { console.error(`[refresh-events] ${e.message}; snapshot not replaced`); process.exitCode = 1 })
}
