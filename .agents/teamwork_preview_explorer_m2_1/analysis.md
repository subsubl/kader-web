# Milestone 2: High-Performance API Caching & Optimization Specification

**Author**: Explorer 1 (`teamwork_preview_explorer_m2_1`)  
**Target Milestone**: Milestone 2 (M2) — Backend Optimization  
**Project**: Kader Nuxt 3 / Nitro Backend  
**Date**: 2026-09-10  

---

## 1. Executive Summary & Architecture Decision

The objective of Milestone 2 is to achieve sub-50ms cached API response times, deterministic HTTP caching (`ETag`, `Cache-Control`, `304 Not Modified`), single-flight deduplication, programmatic cache invalidation on admin mutations, and resilient fallback handling for Supabase outages.

### Evaluation of Nitro Native Caching vs. Explicit Custom Cache Helper

| Dimension | Nitro Native (`defineCachedEventHandler` / `routeRules`) | Explicit In-Memory Helper (`src/server/utils/cache.ts`) | Verdict / Decision |
|---|---|---|---|
| **Cache-Control Header Compliance** | Nitro's `defineCachedEventHandler` with `swr: true` forcibly emits `cache-control: s-maxage=${maxAge}, stale-while-revalidate=${staleMaxAge}`, **omitting `public` and `max-age`**. Any custom `cache-control` header set in the handler is overwritten (lines 280–282 in `nitropack/dist/runtime/internal/cache.mjs`). | Generates exact, spec-compliant headers: `public, max-age=${maxAge}, stale-while-revalidate=${swr}` without interference. | **Custom Helper wins**: Meets strict HTTP contract required by `PROJECT.md`. |
| **ETag Determinism & 304 Handling** | Uses Nitro's internal weak hash `W/"${hash(body)}"`. Conditional check uses `h3.handleCacheHeaders`, which requires exact string equality and fails on weak vs. strong ETag or quoted variances. | Generates deterministic cryptographic hashes (e.g. SHA-1/Murmur) and RFC 7232-compliant normalization (strips `W/` and quotes, handles `*` and comma lists), returning 0 body bytes on 304. | **Custom Helper wins**: RFC 7232 compliant and 100% deterministic across test runners and browsers. |
| **Programmatic Cache Invalidation** | Nitro stores cache entries in Unstorage with hashed keys (`cache:nitro/handlers:_:<pathname>.<hash>.json`). Invalidating specific routes on admin mutation requires regex-scanning unstorage keys or wiping the entire storage layer. | Invalidation is direct and synchronous: `invalidateCache('site-images')`, `invalidateCache('events')`, `invalidateCache('ra-events')`. Supports wildcard/prefix clearing. | **Custom Helper wins**: Instant, reliable, zero-overhead invalidation on admin PUT/POST/DELETE. |
| **Graceful Degradation & Resilience** | When an upstream service (Supabase) is unreachable, Nitro's `validate()` fails (`entry.value.code >= 400`) and the unhandled error bubbles up to a public HTTP 500 error. | Catches upstream errors, keeps expired/stale cache in memory as an emergency buffer, and serves cached data or safe defaults (e.g. `[]`) with HTTP 200. | **Custom Helper wins**: Guarantees zero downtime for public visitors during database maintenance. |
| **Performance & Latency** | Deserializes JSON from unstorage storage driver on every hit. | Operates directly in Node.js process RAM (direct object/pre-serialized string lookup). Response latency < 2ms. | **Custom Helper wins**: Effortlessly exceeds the `< 50ms` cached target. |

**Final Recommendation**: Implement `src/server/utils/cache.ts` providing an in-memory cache engine with single-flight promise coalescing, deterministic ETag generation, RFC 7232 conditional GET (304) handling, and an easy-to-use `handleCachedJsonRequest` utility.

---

## 2. Detailed Route Specifications & Header Values

Each public endpoint must emit precise HTTP headers, compute deterministic ETags, and handle conditional `If-None-Match` requests.

### Route 1: `/api/site-images`
- **File**: `src/server/api/site-images.get.ts`
- **HTTP Method**: `GET`
- **Cache-Control Header**:  
  `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- **Data Source**: `.data/site_images.json` merged with `defaultSiteImages` fallback.
- **I/O Optimization**: Replace synchronous `fs.readFileSync` with cached asynchronous `fs.promises.readFile`. Under cached state, disk is never touched.
- **Cache Key**: `site-images`
- **Invalidation Triggers**:
  - `src/server/api/admin/site-images.put.ts`
  - `src/server/api/admin/site-images-upload.post.ts`

### Route 2: `/api/menu-config`
- **File**: `src/server/api/menu-config.get.ts`
- **HTTP Method**: `GET`
- **Cache-Control Header**:  
  `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- **Data Source**: Supabase `site_settings` table (`key = 'pizzeria_menu'`).
- **Fallback**: `{ menuImage: '/kader/menu.jpg', updatedAt: null }`
- **Cache Key**: `menu-config`
- **Invalidation Triggers**:
  - `src/server/api/admin/menu-config.put.ts`
  - `src/server/api/admin/menu-upload.post.ts`

### Route 3: `/api/ra-events`
- **File**: `src/server/api/ra-events.get.ts`
- **HTTP Method**: `GET`
- **Cache-Control Header**:  
  `Cache-Control: public, max-age=120, stale-while-revalidate=600`
- **Query Parameter Support**: `?scope=upcoming` (default), `?scope=past`, `?scope=all`
- **Cache Key**: `ra-events:${scope}` (e.g. `ra-events:upcoming`)
- **Invalidation Triggers**:
  - `src/server/api/admin/ra-events.put.ts`
  - `src/server/api/admin/sync-ra.post.ts`
  - `src/server/api/admin/events.post.ts` (custom events)
  - `src/server/api/admin/events.delete.ts` (custom events)
- **Prefix Invalidation**: Invalidation of `'ra-events'` flushes all scoped entries (`ra-events:*`).

### Route 4: `/api/events`
- **File**: `src/server/api/events.get.ts`
- **HTTP Method**: `GET`
- **Cache-Control Header**:  
  `Cache-Control: public, max-age=60, stale-while-revalidate=300`
- **Data Source**: Supabase `events` table (`status = 'published'`, `date >= now`, ordered by `date asc`).
- **Fallback**: Returns stale cached events if available; otherwise returns `[]` (HTTP 200) with diagnostic logging.
- **Cache Key**: `events`
- **Invalidation Triggers**:
  - `src/server/api/admin/events.post.ts`
  - `src/server/api/admin/events.delete.ts`
  - `src/server/api/webhooks/pretix.ts`

---

## 3. Core Cache Helper Specification: `src/server/utils/cache.ts`

The implementer should create `src/server/utils/cache.ts` with the following clean architecture:

### 3.1 Type Definitions
```typescript
import type { H3Event } from 'h3'

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
```

### 3.2 In-Memory Store & Single-Flight Coalescing
```typescript
import { createHash } from 'node:crypto'
import { getHeader, setResponseHeader, setResponseStatus, sendNoContent } from 'h3'

class ApiCacheEngine {
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
export const invalidateCache = (keyOrPrefix: string) => apiCache.invalidate(keyOrPrefix)
```

### 3.3 Conditional ETag Matching & 304 Handling
```typescript
export function isEtagMatch(clientIfNoneMatch: string | undefined, currentEtag: string): boolean {
  if (!clientIfNoneMatch) return false
  if (clientIfNoneMatch === '*') return true

  const normalize = (tag: string) => tag.trim().replace(/^W\//, '').replace(/^"|"$/g, '')
  const target = normalize(currentEtag)
  const clientTags = clientIfNoneMatch.split(',').map(normalize)
  return clientTags.includes(target)
}

export function send304(event: H3Event, etag: string, cacheControl: string, lastModified?: string): void {
  setResponseHeader(event, 'etag', etag)
  setResponseHeader(event, 'cache-control', cacheControl)
  if (lastModified) {
    setResponseHeader(event, 'last-modified', lastModified)
  }
  sendNoContent(event, 304)
}
```

### 3.4 High-Level Request Handler
```typescript
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
    // 1. Stale entry if exists (even if past staleUntil)
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
```

---

## 4. Route Implementation Blueprints

### 4.1 `/api/site-images.get.ts`
```typescript
import { defineEventHandler } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { handleCachedJsonRequest } from '../utils/cache'

const CONFIG_FILE = path.resolve(process.cwd(), '.data/site_images.json')

export const defaultSiteImages = {
  home_hero_bg: '/hero-bg.jpg',
  home_basement_bg: '/images/instagram/ig_img_3.jpg',
  home_second_floor_bg: '/images/instagram/ig_img_7.jpg',
  home_terrace_bg: '/images/instagram/ig_img_5.jpg',
  pizzeria_hero_bg: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_1: '/images/instagram/ig_img_7.jpg',
  pizzeria_showcase_2: '/images/instagram/ig_img_13.jpg',
  club_hero_bg: '/images/instagram/ig_img_10.jpg',
  club_floor1_bg: '/images/instagram/ig_img_3.jpg',
  club_floor2_bg: '/images/instagram/ig_img_5.jpg',
  club_sound_system: '/images/instagram/ig_img_6.jpg',
  buyouts_hero_bg: '/images/instagram/ig_img_5.jpg',
  buyouts_booking_bg: '/images/instagram/ig_img_3.jpg',
  gallery_items: [
    { src: '/images/instagram/ig_img_7.jpg', label: '🍕 Neapeljska Pica z Izbrano Rukolo' },
    { src: '/images/instagram/ig_img_13.jpg', label: '🥪 Panuozzo z Mortadelo & Burrato' },
    { src: '/images/instagram/ig_img_5.jpg', label: '🎉 Poletna Zabava na Terasi' },
    { src: '/images/instagram/ig_img_3.jpg', label: '🎸 Koncert v Živo pod Grajskimi Drevesi' },
    { src: '/pizzeria-bg.jpg', label: '🍷 Neapeljski Pica Bistro Ambient' },
    { src: '/buyout-bg.jpg', label: '🏰 Grajski Vrt Kodeljevo' }
  ]
}

export default defineEventHandler(async (event) => {
  return handleCachedJsonRequest(event, {
    key: 'site-images',
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    fetcher: async () => {
      try {
        if (fs.existsSync(CONFIG_FILE)) {
          const content = await fs.promises.readFile(CONFIG_FILE, 'utf-8')
          const data = JSON.parse(content)
          return { ...defaultSiteImages, ...data }
        }
      } catch (e) {
        console.error('[site-images] Error reading config file:', e)
      }
      return defaultSiteImages
    },
    fallback: defaultSiteImages
  })
})
```

### 4.2 `/api/menu-config.get.ts`
```typescript
import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'

const DEFAULT_MENU_IMAGE = '/kader/menu.jpg'

interface MenuConfig {
  menuImage: string
  updatedAt: string | null
}

const defaultMenuConfig: MenuConfig = {
  menuImage: DEFAULT_MENU_IMAGE,
  updatedAt: null
}

export default defineEventHandler(async (event) => {
  return handleCachedJsonRequest(event, {
    key: 'menu-config',
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    fetcher: async () => {
      let menuImage = DEFAULT_MENU_IMAGE
      let updatedAt: string | null = null

      try {
        const supabase = getAdminSupabase()
        const { data, error } = await supabase
          .from('site_settings')
          .select('value, updated_at')
          .eq('key', 'pizzeria_menu')
          .maybeSingle()

        if (!error && data?.value && typeof data.value === 'object' && 'menuImage' in data.value) {
          const v = data.value as Record<string, unknown>
          if (typeof v.menuImage === 'string' && v.menuImage) {
            menuImage = v.menuImage
            updatedAt = data.updated_at
          }
        }
      } catch (err) {
        console.error('[api] menu-config database hop error:', (err as Error).message)
      }

      return <MenuConfig>{ menuImage, updatedAt }
    },
    fallback: defaultMenuConfig
  })
})
```

### 4.3 `/api/ra-events.get.ts`
```typescript
import { defineEventHandler, getQuery } from 'h3'
import { getSyncedRaEvents } from '~/server/utils/raSyncEngine'
import { handleCachedJsonRequest } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scope = String(query.scope || 'upcoming')

  return handleCachedJsonRequest(event, {
    key: `ra-events:${scope}`,
    maxAge: 120,
    staleWhileRevalidate: 600,
    fetcher: async () => {
      return await getSyncedRaEvents(scope)
    },
    fallback: []
  })
})
```

### 4.4 `/api/events.get.ts` (Resilient Supabase Error Handling)
```typescript
import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'

export default defineEventHandler(async (event) => {
  return handleCachedJsonRequest(event, {
    key: 'events',
    maxAge: 60,
    staleWhileRevalidate: 300,
    fetcher: async () => {
      const supabase = getAdminSupabase()
      const { data, error } = await supabase
        .from('events')
        .select('id, title, slug, date, type, description, image_url, ra_link')
        .eq('status', 'published')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) {
        throw new Error(`[api] events query error: ${error.message}`)
      }

      return data || []
    },
    // If Supabase is unconfigured, unreachable, or throwing errors:
    // Fall back to empty array rather than a 500 error!
    fallback: []
  })
})
```

---

## 5. Programmatic Cache Invalidation Matrix

The implementer must wire `invalidateCache(key)` into all admin mutation endpoints:

| Admin Mutation Endpoint | Trigger Action | Key to Invalidate | Invalidation Code Snippet |
|---|---|---|---|
| `src/server/api/admin/site-images.put.ts` | Image mapping updated in `.data/site_images.json` | `'site-images'` | `invalidateCache('site-images')` |
| `src/server/api/admin/site-images-upload.post.ts` | New image uploaded | `'site-images'` | `invalidateCache('site-images')` |
| `src/server/api/admin/menu-config.put.ts` | Pizzeria menu image path updated in `site_settings` | `'menu-config'` | `invalidateCache('menu-config')` |
| `src/server/api/admin/menu-upload.post.ts` | New menu image uploaded | `'menu-config'` | `invalidateCache('menu-config')` |
| `src/server/api/admin/events.post.ts` | Custom event created or modified | `'events'` and `'ra-events'` | `invalidateCache('events'); invalidateCache('ra-events')` |
| `src/server/api/admin/events.delete.ts` | Event deleted | `'events'` and `'ra-events'` | `invalidateCache('events'); invalidateCache('ra-events')` |
| `src/server/api/admin/ra-events.put.ts` | RA event ticket URL updated | `'ra-events'` | `invalidateCache('ra-events')` |
| `src/server/api/admin/sync-ra.post.ts` | RA events sync completed | `'ra-events'` | `invalidateCache('ra-events')` |
| `src/server/api/webhooks/pretix.ts` | Pretix event status webhook received | `'events'` | `invalidateCache('events')` |

---

## 6. TypeScript Compilation Fixes (26 Errors across 16 Files)

Running `npm run typecheck` fails with 26 errors. Nuxt 3's `#imports` is intended for auto-imported Vue composables. Nitro server utilities (`getQuery`, `readBody`, `defineEventHandler`, `setResponseHeader`, `setResponseStatus`) reside in `'h3'`. Furthermore, `promoters.get.ts` queries a non-existent column `rate` instead of `rate_per_checkin`.

### Verbatim Replacement Guide

#### 1. `src/server/api/admin/calendar-notes.delete.ts` (1 error)
- Line 3:
  - Replace: `import { createError, getQuery } from '#imports'`
  - With: `import { createError, getQuery } from 'h3'`

#### 2. `src/server/api/admin/calendar-notes.get.ts` (1 error)
- Line 3:
  - Replace: `import { createError, getQuery } from '#imports'`
  - With: `import { createError, getQuery } from 'h3'`

#### 3. `src/server/api/admin/calendar-notes.post.ts` (1 error)
- Line 3:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 4. `src/server/api/admin/kitchen.get.ts` (1 error)
- Line 1:
  - Replace: `import { createError, getQuery } from '#imports'`
  - With: `import { createError, getQuery } from 'h3'`

#### 5. `src/server/api/admin/kitchen.patch.ts` (1 error)
- Line 1:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 6. `src/server/api/admin/pnl-export.get.ts` (4 errors)
- Line 1:
  - Replace: `import { createError, getQuery, defineEventHandler, setResponseHeader } from '#imports'`
  - With: `import { createError, getQuery, defineEventHandler, setResponseHeader } from 'h3'`

#### 7. `src/server/api/admin/pnl.get.ts` (3 errors)
- Line 1:
  - Replace: `import { createError, getQuery, defineEventHandler } from '#imports'`
  - With: `import { createError, getQuery, defineEventHandler } from 'h3'`

#### 8. `src/server/api/admin/pnl.post.ts` (3 errors)
- Line 1:
  - Replace: `import { createError, readBody, defineEventHandler } from '#imports'`
  - With: `import { createError, readBody, defineEventHandler } from 'h3'`

#### 9. `src/server/api/admin/promoters.get.ts` (4 errors)
- Line 47:
  - Replace: `let ratesQuery = adminClient.from('promoter_commission_rates').select('event_id, rate')`
  - With: `let ratesQuery = adminClient.from('promoter_commission_rates').select('event_id, rate_per_checkin')`
- Line 56–58:
  - Replace:
    ```typescript
    if (rate.event_id) {
      ratesMap.set(rate.event_id, rate.rate)
    }
    ```
  - With:
    ```typescript
    if (rate.event_id) {
      ratesMap.set(rate.event_id, rate.rate_per_checkin)
    }
    ```
- Line 87:
  - Replace: `const rate = ratesMap.get(gl.event_id) ?? 2.00`
  - With: `const rate = (gl.event_id ? ratesMap.get(gl.event_id) : undefined) ?? 2.00`

#### 10. `src/server/api/admin/tasks-toggle.patch.ts` (1 error)
- Line 3:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 11. `src/server/api/admin/tasks.delete.ts` (1 error)
- Line 3:
  - Replace: `import { createError, getQuery } from '#imports'`
  - With: `import { createError, getQuery } from 'h3'`

#### 12. `src/server/api/admin/tasks.get.ts` (1 error)
- Line 3:
  - Replace: `import { createError, getQuery } from '#imports'`
  - With: `import { createError, getQuery } from 'h3'`

#### 13. `src/server/api/admin/tasks.post.ts` (1 error)
- Line 3:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 14. `src/server/api/admin/team-role.patch.ts` (1 error)
- Line 3:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 15. `src/server/api/admin/team.post.ts` (1 error)
- Line 3:
  - Replace: `import { createError, readBody } from '#imports'`
  - With: `import { createError, readBody } from 'h3'`

#### 16. `src/server/api/table-orders.post.ts` (1 error)
- Line 1:
  - Replace: `import { readBody, setResponseStatus } from '#imports'`
  - With: `import { readBody, setResponseStatus } from 'h3'`

---

## 7. Verification and Testing Strategy

To ensure implementation correctness in Milestone 2 and prepare for Milestone 3 verification:
1. **Typecheck Pass**:
   Run `npm run typecheck` to confirm 0 errors across the entire codebase.
2. **Deterministic ETag & Header Verification**:
   Execute curl commands against the Nitro server:
   ```bash
   # Test site-images headers
   curl -I http://localhost:3000/api/site-images
   # Expect:
   # HTTP/1.1 200 OK
   # cache-control: public, max-age=3600, stale-while-revalidate=86400
   # etag: "<sha1-hash>"

   # Test 304 conditional request
   curl -I -H 'If-None-Match: "<sha1-hash>"' http://localhost:3000/api/site-images
   # Expect:
   # HTTP/1.1 304 Not Modified
   # etag: "<sha1-hash>"
   # cache-control: public, max-age=3600, stale-while-revalidate=86400
   # (0 body bytes)
   ```
3. **Resilience Verification**:
   Unset or change Supabase credentials to invalid values and query `GET /api/events`:
   - Must return HTTP 200 with `[]` (or cached events), NOT HTTP 500.
4. **Invalidation Verification**:
   Query `GET /api/site-images` (receive ETag A). Send `PUT /api/admin/site-images` with modified config. Query `GET /api/site-images` again — must return fresh config with ETag B.
