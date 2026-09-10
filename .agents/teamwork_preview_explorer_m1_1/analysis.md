# Deep Backend Architecture & Caching Audit Report

**Target**: Nitro Server API Endpoints (`src/server/api/*`)  
**Investigator**: Explorer 1 (`teamwork_preview_explorer_m1_1`)  
**Date**: 2026-09-10  
**Status**: COMPLETE  

---

## 1. Executive Summary

A comprehensive audit of the Nitro server endpoints (`src/server/api/*`) reveals that **none of the public JSON API endpoints currently employ any caching layer or caching headers**. Every incoming HTTP request directly triggers either synchronous filesystem disk I/O or remote database/API network roundtrips.

### Critical Audit Findings
1. **Missing HTTP Caching Headers**: `/api/site-images`, `/api/events`, `/api/ra-events`, and `/api/menu-config` all return `Cache-Control: null` and `ETag: null`. Browsers, proxies, and edge CDNs treat these as uncacheable or heuristically cached.
2. **Absence of Conditional Request Handling (304 Not Modified)**: When clients send `If-None-Match`, all endpoints return `200 OK` with the full payload. Zero conditional GET optimization exists.
3. **Severe Event Loop Blocking on Auto-Sync (`/api/ra-events`)**: In `src/server/utils/raSyncEngine.ts`, if 10 minutes have elapsed since the last sync, an incoming GET request directly awaits `syncRaEventsEngine()`, which fires 8+ external GraphQL queries to `ra.co`, fetches flyer images, and blocks the client response for 3 to 10+ seconds.
4. **Thundering Herd & File Race Condition Hazard**: Multiple concurrent visitors arriving after the 10-minute threshold simultaneously trigger redundant background syncs and concurrently overwrite `.data/ra_events_store.json`.
5. **Synchronous File I/O in Handlers**: `/api/site-images` uses `fs.readFileSync` and `fs.existsSync` on every request, blocking the single-threaded Node.js event loop under high request concurrency.
6. **Fragile Error Handling in `/api/events`**: Unlike `/api/menu-config` (which gracefully falls back to default settings), `/api/events` immediately crashes with a 500 error ("Supabase not configured") if environment variables are missing or if Supabase is temporarily unreachable.
7. **TypeScript Typing / Import Errors in Server Handlers**: Multiple admin files (`kitchen.get.ts`, `calendar-notes.*`, `pnl.*`, `table-orders.post.ts`) import `getQuery` and `readBody` from `'#imports'` instead of `'h3'`, causing `npm run typecheck` to fail with 26 errors across 16 files.

---

## 2. Comprehensive Inventory of Nitro Server Endpoints

The Nitro backend contains 29 endpoints across public and administrative routes:

| Route Path | Method | Purpose | Auth Required | Persistence / Data Source |
|---|---|---|---|---|
| `/api/site-images` | GET | Public hero, showcase & gallery image config | No | Disk (`.data/site_images.json`) + static fallback |
| `/api/events` | GET | Public upcoming published events | No | Remote Supabase (`events` table) |
| `/api/ra-events` | GET | Public RA & custom events (`upcoming`, `past`, `all`) | No | Disk (`.data/ra_events_store.json`) + RA GraphQL |
| `/api/menu-config` | GET | Public pizzeria menu image & updated timestamp | No | Remote Supabase (`site_settings`) + fallback |
| `/api/img` | GET | Dynamic Sharp image resizer & WebP converter | No | Disk (`.data/img-cache/`) + remote fetch |
| `/api/inquiries` | POST | Public buyout / venue inquiry form submission | No (Rate limited) | Remote Supabase (`inquiries` table) |
| `/api/table-orders` | POST | Public QR code dining order submission | No (Rate limited) | Remote Supabase (`table_orders`, `menu_items`) + Microgramm POS |
| `/api/webhooks/pretix` | POST | Ticket order & check-in webhook from Pretix | Signature verification | Remote Supabase (`pretix_orders`, `pretix_tickets`) |
| `/api/admin/site-images` | PUT | Update site image configuration | Admin | Disk (`.data/site_images.json`) |
| `/api/admin/site-images-upload`| POST | Upload site images to local disk | Admin | Local disk (`src/public/images/uploads/`) |
| `/api/admin/menu-config` | PUT | Update pizzeria menu image configuration | Admin | Remote Supabase (`site_settings`) |
| `/api/admin/menu-upload` | POST | Upload menu image to Supabase Storage | Admin | Remote Supabase Storage (`menu_images`) |
| `/api/admin/events` | POST | Create or update custom event | Admin | Disk (`.data/ra_events_store.json`) via `raSyncEngine` |
| `/api/admin/events` | DELETE | Delete custom event | Admin | Disk (`.data/ra_events_store.json`) via `raSyncEngine` |
| `/api/admin/ra-events` | PUT | Associate Pretix ticket URL with RA event | Admin | Remote Supabase (`ra_events`) |
| `/api/admin/sync-ra` | POST | Trigger manual RA event synchronization | Admin | RA GraphQL + local store + Supabase |
| `/api/admin/analytics` | GET | Admin dashboard metrics (revenue, shifts, tickets)| Admin | Remote Supabase (multi-table aggregate) |
| `/api/admin/kitchen` | GET | Table orders filtered by status | Admin | Remote Supabase (`table_orders`) |
| `/api/admin/kitchen` | PATCH | Update table order status | Admin | Remote Supabase (`table_orders`) |
| `/api/admin/pnl` | GET | Event P&L financial reports | Admin | Remote Supabase (`event_pnl`) |
| `/api/admin/pnl` | POST | Save or update event P&L record | Admin | Remote Supabase (`event_pnl`) |
| `/api/admin/pnl-export` | GET | CSV export of P&L records | Admin | Remote Supabase (`event_pnl`) |
| `/api/admin/promoters` | GET | Promoter ticket commissions | Admin | Remote Supabase (`promoter_commission_rates`, etc.)|
| `/api/admin/promoters-payout`| POST | Record promoter payout | Admin | Remote Supabase (`promoter_payouts`) |
| `/api/admin/staff` | GET | List staff accounts for scheduling | Admin | Remote Supabase Auth (`admin.listUsers`) |
| `/api/admin/tasks` | GET/POST/DEL | Kitchen/bar prep task management | Admin | Remote Supabase (`admin_tasks`) |
| `/api/admin/tasks-toggle` | PATCH | Toggle task completion | Admin | Remote Supabase (`admin_tasks`) |
| `/api/admin/team` | GET/POST | Team member management | Admin | Remote Supabase (`team_members`) |
| `/api/admin/team-role` | PATCH | Update team member role | Admin | Remote Supabase (`team_members`) |

---

## 3. Detailed Audit of Key Public Endpoints

### 3.1 `/api/site-images`
- **Source File**: `src/server/api/site-images.get.ts`
- **Data Source**: Synchronous disk read of `.data/site_images.json`, merged with in-memory fallback constant `defaultSiteImages`.
- **Implementation Analysis**:
  ```typescript
  export default defineEventHandler(async () => {
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
        return { ...defaultSiteImages, ...data }
      } catch (e) {
        console.error('[site-images] Error parsing config:', e)
      }
    }
    return defaultSiteImages
  })
  ```
- **Bottlenecks & Deficiencies**:
  - Uses synchronous `fs.existsSync` and `fs.readFileSync`. Under high visitor traffic, every hit blocks the Node event loop.
  - Zero caching headers: `Cache-Control` is omitted entirely (`null`).
  - No `ETag` generation.
  - No conditional GET support (`If-None-Match` returns 200).
- **Admin Mutation Impact**:
  - `PUT /api/admin/site-images` writes to `.data/site_images.json`.
  - When memory caching is introduced, this PUT endpoint must execute a cache invalidation hook.

---

### 3.2 `/api/events`
- **Source File**: `src/server/api/events.get.ts`
- **Data Source**: Remote Supabase database query:
  ```typescript
  export default defineEventHandler(async () => {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from('events')
      .select('id, title, slug, date, type, description, image_url, ra_link')
      .eq('status', 'published')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
    if (error) {
      throw createError({ statusCode: 500, statusMessage: 'Could not load events.' })
    }
    return data
  })
  ```
- **Bottlenecks & Deficiencies**:
  - Network roundtrip to Supabase on every single request (50ms - 250ms+ latency).
  - Fragility: If Supabase connection fails or env variables are unconfigured, throws an uncaught 500 status.
  - Zero caching headers: No `Cache-Control`, no `ETag`.
  - Stale-While-Revalidate absent: Cannot serve stale data during brief network disruptions.

---

### 3.3 `/api/ra-events`
- **Source File**: `src/server/api/ra-events.get.ts` & `src/server/utils/raSyncEngine.ts`
- **Data Source**: Local store `.data/ra_events_store.json` + automated sync with Resident Advisor GraphQL API (`https://ra.co/graphql`).
- **Implementation Analysis**:
  ```typescript
  export async function getSyncedRaEvents(scope: string = 'upcoming'): Promise<RaEventRecord[]> {
    let store = readLocalStore()
    const TEN_MINS = 10 * 60 * 1000
    const isStale = !store.lastSyncedAt || new Date().getTime() - new Date(store.lastSyncedAt).getTime() > TEN_MINS

    if (store.events.length === 0 || isStale) {
      await syncRaEventsEngine()
      store = readLocalStore()
    }
    // filtering by scope...
  }
  ```
- **Critical Architectural Flaws**:
  1. **Inline Request Blocking**: When `isStale` evaluates to true (every 10 minutes), the visitor request triggers and blocks on `await syncRaEventsEngine()`.
  2. **Heavy External Dependencies**: `syncRaEventsEngine()` executes:
     - `fetchRaType('TODAY')` (GraphQL)
     - `fetchRaType('PREVIOUS')` (GraphQL)
     - 6 queries for `fetchRaType('ARCHIVE', year)` for past 5 years
     - Multiple `fetchSingleEventFlyer()` queries
     - Synchronous `writeLocalStore()` to disk
     - Remote Supabase upsert of all events
  3. **Thundering Herd Hazard**: If 10 requests hit `/api/ra-events` concurrently when stale, all 10 simultaneously run `syncRaEventsEngine()`, overwhelming the network, hammering RA GraphQL, and racing to write `.data/ra_events_store.json`.
  4. **Synchronous File Reads on Cache Miss / Hits**: Every invocation performs `fs.readFileSync(STORE_FILE)` and `JSON.parse(content)` for a 15KB JSON structure.
  5. **No HTTP Caching Headers**: No `Cache-Control`, no `ETag`.

---

### 3.4 `/api/menu-config`
- **Source File**: `src/server/api/menu-config.get.ts`
- **Data Source**: Remote Supabase query to `site_settings` where `key = 'pizzeria_menu'`, fallback to `/kader/menu.jpg`.
- **Bottlenecks & Deficiencies**:
  - Repeated remote network call for nearly static configuration.
  - Missing `Cache-Control` and `ETag`.
  - Responds in ~100-250ms when Supabase is contacted; could respond in < 2ms from memory.
- **Admin Mutation Impact**:
  - `PUT /api/admin/menu-config` updates `site_settings`. Must bust the cache key on update.

---

### 3.5 `/api/img`
- **Source File**: `src/server/api/img.get.ts`
- **Data Source**: Transformed image stream cached in `.data/img-cache/{hashKey}.{ext}`.
- **Current Behavior**:
  - Sets `Cache-Control: public, max-age=31536000, immutable`.
  - BUT does NOT set `ETag`.
  - Does NOT inspect `If-None-Match` or return `304 Not Modified`.
  - Performs synchronous `fs.readFileSync(cachedFilePath)` on disk cache hits.

---

## 4. Empirical Baseline Measurements

Testing against the built Nitro production server (`PORT=3456 node .output/server/index.mjs`):

| Endpoint | Baseline Status | Uncached Latency | Cache-Control Header | ETag Header | 304 on `If-None-Match`? |
|---|---|---|---|---|---|
| `/api/site-images` | 200 OK | 48 ms | **null (Missing)** | **null (Missing)** | **No (Returns 200)** |
| `/api/menu-config` | 200 OK | 4 ms (dev fallback) | **null (Missing)** | **null (Missing)** | **No (Returns 200)** |
| `/api/ra-events?scope=upcoming` | 200 OK | 5 ms (warm store) | **null (Missing)** | **null (Missing)** | **No (Returns 200)** |
| `/api/events` | 500 Error | 5 ms (fail-fast) | `no-cache` (error) | **null (Missing)** | **No** |
| `/api/img?src=/hero-bg.jpg&w=400` | 200 OK | 54 ms | `public, max-age=...` | **null (Missing)** | **No (Returns 200)** |

### Key Takeaways from Empirical Probing
- Zero public JSON endpoints have `Cache-Control` or `ETag`.
- Zero public endpoints support conditional requests (`304 Not Modified`).
- When Supabase is not configured, `/api/events` immediately crashes with 500 status.

---

## 5. Security & Middleware Audit

### 5.1 `src/server/middleware/security-headers.ts`
- Sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Deficiency**: Does not set default caching policy. Without explicit headers, browser behavior defaults to heuristic caching, which can lead to stale UI or excessive requests.
- **Recommendation**: Ensure security headers include clear caching boundaries (e.g. sensitive admin paths marked `no-store`).

### 5.2 `src/server/middleware/admin.ts`
- Authoritatively guards `/admin/*` and `/api/admin/*`.
- Bypasses when `process.env.SKIP_ADMIN_AUTH === 'true'` or header `x-test-bypass === 'true'`.
- **Recommendation**: Ensure `/api/admin/*` explicitly returns `Cache-Control: private, no-cache, no-store, must-revalidate` to prevent intermediate proxy or browser caching of administrative data.

---

## 6. Actionable Implementation Recommendations for Milestone 2

### 6.1 Core Caching Architecture: Centralized In-Memory Cache Utility
Create a lightweight, high-performance in-memory cache helper in `src/server/utils/cache.ts`:

```typescript
// Architecture Design Sketch: src/server/utils/cache.ts
import { H3Event, getHeader, setHeader, setResponseStatus } from 'h3'
import crypto from 'node:crypto'

interface CacheEntry<T> {
  data: T
  etag: string
  createdAt: number
  expiresAt: number
  staleUntil: number
}

const memoryStore = new Map<string, CacheEntry<any>>()

export function generateETag(data: any): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  return `"${crypto.createHash('md5').update(str).digest('hex').slice(0, 16)}"`
}

export async function handleCachedRoute<T>(
  event: H3Event,
  options: {
    key: string
    maxAge: number       // Fresh TTL in seconds
    staleWhileRevalidate: number // SWR window in seconds
    fetcher: () => Promise<T>
  }
): Promise<T | null> {
  const now = Date.now()
  const entry = memoryStore.get(options.key)

  // 1. Check If-None-Match conditional request
  const clientEtag = getHeader(event, 'if-none-match')

  // Cache hit & completely fresh
  if (entry && now < entry.expiresAt) {
    setHeader(event, 'Cache-Control', `public, max-age=${options.maxAge}, stale-while-revalidate=${options.staleWhileRevalidate}`)
    setHeader(event, 'ETag', entry.etag)

    if (clientEtag && clientEtag === entry.etag) {
      setResponseStatus(event, 304)
      return null
    }
    return entry.data
  }

  // Stale-While-Revalidate window: serve stale immediately, revalidate asynchronously in background
  if (entry && now < entry.staleUntil) {
    setHeader(event, 'Cache-Control', `public, max-age=${options.maxAge}, stale-while-revalidate=${options.staleWhileRevalidate}`)
    setHeader(event, 'ETag', entry.etag)

    // Trigger async background revalidation without blocking client
    options.fetcher().then(freshData => {
      const etag = generateETag(freshData)
      memoryStore.set(options.key, {
        data: freshData,
        etag,
        createdAt: Date.now(),
        expiresAt: Date.now() + options.maxAge * 1000,
        staleUntil: Date.now() + (options.maxAge + options.staleWhileRevalidate) * 1000
      })
    }).catch(err => console.error(`[cache] Background revalidation failed for ${options.key}:`, err))

    if (clientEtag && clientEtag === entry.etag) {
      setResponseStatus(event, 304)
      return null
    }
    return entry.data
  }

  // Cache miss or expired: fetch synchronously
  try {
    const data = await options.fetcher()
    const etag = generateETag(data)
    memoryStore.set(options.key, {
      data,
      etag,
      createdAt: now,
      expiresAt: now + options.maxAge * 1000,
      staleUntil: now + (options.maxAge + options.staleWhileRevalidate) * 1000
    })

    setHeader(event, 'Cache-Control', `public, max-age=${options.maxAge}, stale-while-revalidate=${options.staleWhileRevalidate}`)
    setHeader(event, 'ETag', etag)

    if (clientEtag && clientEtag === etag) {
      setResponseStatus(event, 304)
      return null
    }
    return data
  } catch (err) {
    // If fetcher fails but stale data exists, serve stale rather than 500
    if (entry) {
      console.warn(`[cache] Fetcher failed for ${options.key}, serving stale fallback.`)
      setHeader(event, 'Cache-Control', 'public, max-age=10')
      setHeader(event, 'ETag', entry.etag)
      return entry.data
    }
    throw err
  }
}

export function invalidateCacheKey(prefix: string) {
  for (const k of memoryStore.keys()) {
    if (k.startsWith(prefix)) {
      memoryStore.delete(k)
    }
  }
}
```

### 6.2 Recommended Cache TTL & SWR Configurations

| Endpoint | Target TTL (`max-age`) | SWR Window | Invalidation Trigger |
|---|---|---|---|
| `/api/site-images` | 3600s (1 hr) | 86400s (24 hr) | `PUT /api/admin/site-images`, `POST /api/admin/site-images-upload` |
| `/api/menu-config` | 3600s (1 hr) | 86400s (24 hr) | `PUT /api/admin/menu-config`, `POST /api/admin/menu-upload` |
| `/api/events` | 60s (1 min) | 300s (5 min) | Webhooks or Supabase mutation |
| `/api/ra-events` | 120s (2 min) | 600s (10 min) | `POST /api/admin/sync-ra`, `POST/DEL /api/admin/events` |
| `/api/img` | 31536000s (immutable)| N/A | Image source update (hashKey based) |
| `/api/admin/*` | `no-store, no-cache`| N/A | Never cached |

### 6.3 Decoupled Asynchronous Sync Engine for `raSyncEngine.ts`
1. **Remove Blocking Inline Sync**: `getSyncedRaEvents()` must NEVER await `syncRaEventsEngine()` during a GET request.
2. **Implement Concurrency Mutex**: Use an inflight sync promise / boolean flag (`let isSyncing = false`). If an auto-sync is already in progress, subsequent requests skip triggering another sync.
3. **Background Sync Trigger**: If `isStale` is true, trigger `syncRaEventsEngine().catch(...)` as a detached promise in the background while returning existing events immediately.
4. **In-Memory Store Caching**: Retain parsed `store` in memory so `readLocalStore()` does not execute `fs.readFileSync` on every call.

### 6.4 Image Stream Caching & 304 Handling (`/api/img.get.ts`)
1. Calculate ETag directly from `hashKey`: `setHeader(event, 'ETag', `"${hashKey}"`)`.
2. Inspect `getHeader(event, 'if-none-match')`. If match, return `setResponseStatus(event, 304)`.
3. Switch disk reads from `fs.readFileSync` to `fs.promises.readFile` or Node streams (`sendStream(event, fs.createReadStream(cachedFilePath))`) to prevent event loop blocking.

### 6.5 Fix TypeScript Compilation Issues
Update imports in the 16 offending admin and server files from `#imports` to `h3`:
```typescript
// Replace:
import { createError, getQuery, readBody, defineEventHandler } from '#imports'
// With:
import { createError, getQuery, readBody, defineEventHandler } from 'h3'
```
Fix the typing mismatch in `src/server/api/admin/promoters.get.ts`.

---

## 7. Verification Strategy for Milestone 3

Implement an automated verification test suite:
1. **Latency Verification**: Send 20 sequential requests to each semi-static endpoint. Verify that calls #2 through #20 respond in `< 50ms` (target: `< 15ms`).
2. **Header Assertions**:
   - `Cache-Control` is non-null and matches expected directives.
   - `ETag` is present on all cached endpoints.
3. **Conditional 304 Verification**:
   - Issue GET request, capture `ETag`.
   - Issue second GET with `If-None-Match: <captured-etag>`.
   - Assert HTTP status `304 Not Modified` and empty response body.
4. **Cache Invalidation Verification**:
   - Issue GET `/api/site-images`.
   - Issue PUT `/api/admin/site-images` with updated payload.
   - Assert next GET `/api/site-images` returns updated payload with new ETag.
5. **Typecheck & Build**:
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` succeeds cleanly.
