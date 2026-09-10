import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'
import { getHeader, setResponseHeader, sendNoContent } from 'h3'

export interface CacheEntry<T = unknown> {
  data: T
  etag: string
  cachedAt: number
  freshUntil: number
  staleUntil: number
  lastModified: string
}

export interface CachedRequestOptions<T> {
  key: string
  maxAge: number
  staleWhileRevalidate: number
  fetcher: () => Promise<T>
  fallback?: T
}

export class ApiCacheEngine {
  private store = new Map<string, CacheEntry<any>>()
  private inFlight = new Map<string, Promise<any>>()

  get<T>(key: string): CacheEntry<T> | undefined {
    return this.store.get(key)
  }

  set<T>(key: string, data: T, maxAgeSec: number, swrSec: number): CacheEntry<T> {
    const now = Date.now()
    const json = JSON.stringify(data)
    const hash = createHash('sha1').update(json).digest('hex').slice(0, 16)
    const etag = `"${hash}"`
    const entry: CacheEntry<T> = {
      data,
      etag,
      cachedAt: now,
      freshUntil: now + maxAgeSec * 1000,
      staleUntil: now + (maxAgeSec + swrSec) * 1000,
      lastModified: new Date(now).toUTCString()
    }
    this.store.set(key, entry)
    return entry
  }

  async singleFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key)
    if (existing) {
      return existing as Promise<T>
    }
    const promise = (async () => {
      try {
        return await fn()
      } finally {
        this.inFlight.delete(key)
      }
    })()
    this.inFlight.set(key, promise)
    return promise
  }

  invalidate(keyOrPrefix: string): number {
    let count = 0
    for (const key of this.store.keys()) {
      if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
        this.store.delete(key)
        count++
      }
    }
    return count
  }

  clear(): void {
    this.store.clear()
    this.inFlight.clear()
  }
}

export const apiCache = new ApiCacheEngine()

export function invalidateCache(keyOrPrefix: string): number {
  return apiCache.invalidate(keyOrPrefix)
}

/**
 * Evaluates RFC 7232 If-None-Match header against the current ETag.
 * Supports weak tags (W/), quotes, wildcards (*), and comma-separated lists.
 */
export function isEtagMatch(clientIfNoneMatch: string | undefined | null, currentEtag: string): boolean {
  if (!clientIfNoneMatch) return false
  const trimmed = clientIfNoneMatch.trim()
  if (trimmed === '*') return true

  const normalize = (tag: string) => tag.trim().replace(/^W\//, '').replace(/^"|"$/g, '')
  const target = normalize(currentEtag)
  const clientTags = trimmed.split(',').map(normalize)
  return clientTags.includes(target)
}

/**
 * Sends RFC 7232 compliant HTTP 304 Not Modified response with 0 body bytes.
 */
export function send304(event: H3Event, etag: string, cacheControl: string, lastModified?: string): void {
  setResponseHeader(event, 'etag', etag)
  setResponseHeader(event, 'cache-control', cacheControl)
  if (lastModified) {
    setResponseHeader(event, 'last-modified', lastModified)
  }
  sendNoContent(event, 304)
}

/**
 * High-performance cached JSON handler with deterministic ETag, HTTP 304 conditional handling,
 * single-flight request coalescing, SWR background updates, and graceful error fallbacks.
 */
export async function handleCachedJsonRequest<T>(
  event: H3Event,
  options: CachedRequestOptions<T>
): Promise<T | void> {
  const { key, maxAge, staleWhileRevalidate, fetcher, fallback } = options
  const cacheControl = `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  const now = Date.now()
  const entry = apiCache.get<T>(key)

  // 1. Fresh Cache Hit (< maxAge)
  if (entry && now < entry.freshUntil) {
    if (isEtagMatch(getHeader(event, 'if-none-match'), entry.etag)) {
      send304(event, entry.etag, cacheControl, entry.lastModified)
      return
    }
    setResponseHeader(event, 'etag', entry.etag)
    setResponseHeader(event, 'cache-control', cacheControl)
    setResponseHeader(event, 'last-modified', entry.lastModified)
    return entry.data
  }

  // 2. Stale Cache Hit (between maxAge and staleUntil)
  if (entry && now < entry.staleUntil) {
    // Non-blocking background revalidation with single-flight coalescing
    apiCache.singleFlight(key, async () => {
      try {
        const freshData = await fetcher()
        apiCache.set(key, freshData, maxAge, staleWhileRevalidate)
      } catch (err) {
        console.warn(`[cache] Background SWR refresh failed for ${key}:`, err)
      }
    })

    if (isEtagMatch(getHeader(event, 'if-none-match'), entry.etag)) {
      send304(event, entry.etag, cacheControl, entry.lastModified)
      return
    }
    setResponseHeader(event, 'etag', entry.etag)
    setResponseHeader(event, 'cache-control', cacheControl)
    setResponseHeader(event, 'last-modified', entry.lastModified)
    return entry.data
  }

  // 3. Cache Miss or Expired
  try {
    const freshData = await apiCache.singleFlight(key, () => fetcher())
    const newEntry = apiCache.set(key, freshData, maxAge, staleWhileRevalidate)

    if (isEtagMatch(getHeader(event, 'if-none-match'), newEntry.etag)) {
      send304(event, newEntry.etag, cacheControl, newEntry.lastModified)
      return
    }
    setResponseHeader(event, 'etag', newEntry.etag)
    setResponseHeader(event, 'cache-control', cacheControl)
    setResponseHeader(event, 'last-modified', newEntry.lastModified)
    return freshData
  } catch (err) {
    console.error(`[cache] Fetch failed for ${key}:`, err)
    // Graceful fallback hierarchy:
    // 1. Stale entry if exists (even past staleUntil)
    if (entry) {
      console.warn(`[cache] Serving stale cache as emergency fallback for ${key}`)
      setResponseHeader(event, 'etag', entry.etag)
      setResponseHeader(event, 'cache-control', cacheControl)
      return entry.data
    }
    // 2. Default fallback object/array if supplied
    if (fallback !== undefined) {
      console.warn(`[cache] Serving static fallback for ${key}`)
      const newEntry = apiCache.set(key, fallback, maxAge, staleWhileRevalidate)
      setResponseHeader(event, 'etag', newEntry.etag)
      setResponseHeader(event, 'cache-control', cacheControl)
      return fallback
    }
    throw err
  }
}
