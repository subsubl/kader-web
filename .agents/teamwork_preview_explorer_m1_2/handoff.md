# Handoff Report: Data Persistence, Concurrency & Bottlenecks Audit

**Agent**: Explorer 2 (`teamwork_preview_explorer_m1_2`)  
**Type**: Hard Handoff (Task Complete)  
**Target Milestone**: Milestone 2 (High-Performance API Caching & Optimization Implementation)  
**Detailed Analysis**: `/home/ator/Kader/.agents/teamwork_preview_explorer_m1_2/analysis.md`  

---

## 1. Observation

### 1.1 Direct Non-Atomic File Writes & Truncation Vulnerabilities
- In `src/server/api/admin/site-images.put.ts` lines 20–30:
  ```ts
  20: if (fs.existsSync(CONFIG_FILE)) {
  21:   try {
  22:     current = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
  23:   } ...
  28: const updated = { ...current, ...body, updated_at: new Date().toISOString() }
  30: fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2))
  ```
  `fs.writeFileSync` opens `.data/site_images.json` with `O_TRUNC`, truncating the file to 0 bytes before writing.
- In `src/server/utils/raSyncEngine.ts` lines 48–64:
  ```ts
  48: if (fs.existsSync(STORE_FILE)) {
  49:   const content = fs.readFileSync(STORE_FILE, 'utf-8')
  50:   const parsed = JSON.parse(content)
  ...
  61: export function writeLocalStore(store: LocalStoreData) {
  64:   fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8')
  ```
  Writes to `.data/ra_events_store.json` (currently 15KB with 200+ events) are non-atomic and synchronous.

### 1.2 Inline External Sync & Thundering Herd on Public Path
- In `src/server/utils/raSyncEngine.ts` lines 292–302:
  ```ts
  292: export async function getSyncedRaEvents(scope: string = 'upcoming'): Promise<RaEventRecord[]> {
  293:   let store = readLocalStore()
  295:   const TEN_MINS = 10 * 60 * 1000
  296:   const isStale = !store.lastSyncedAt || new Date().getTime() - new Date(store.lastSyncedAt).getTime() > TEN_MINS
  298:   if (store.events.length === 0 || isStale) {
  299:     await syncRaEventsEngine()
  300:     store = readLocalStore()
  301:   }
  ```
  Every incoming request to `GET /api/ra-events` triggers `syncRaEventsEngine()` if 10 minutes have elapsed.
- In `src/server/utils/raSyncEngine.ts` lines 177–187:
  `syncRaEventsEngine` calls `fetchRaType('TODAY')`, `fetchRaType('PREVIOUS')`, and loops through 6 years of `fetchRaType('ARCHIVE', y)` sequentially against `https://ra.co/graphql`, followed by individual flyer fetches in lines 205–208.
- During this 10–30 second window, there is **zero promise deduplication**: every concurrent request triggers duplicate GraphQL bursts to Resident Advisor, then simultaneously runs `fs.writeFileSync(STORE_FILE)` and upserts to Supabase table `ra_events`.

### 1.3 Custom Event Overwrite Race Condition
- In `src/server/utils/raSyncEngine.ts`:
  - Line 171: `currentStore = readLocalStore()` captures a store snapshot.
  - Lines 177–217: 10–30s of asynchronous GraphQL fetches occur.
  - Line 227: `writeLocalStore(newStore)` flushes `allEvents`.
  - If `saveCustomEvent` (lines 247–279) is invoked by an admin via `POST /api/admin/events` during that 30-second window, the newly saved custom event is completely overwritten and lost when `writeLocalStore` flushes the stale snapshot.

### 1.4 Uncached Public Endpoint Reads & Event Loop Blocking
- In `src/server/api/site-images.get.ts` lines 36–44:
  `fs.existsSync(CONFIG_FILE)` and `fs.readFileSync(CONFIG_FILE, 'utf-8')` execute synchronously on every request with no in-memory caching, no `Cache-Control`, and no ETag.
- In `src/server/api/events.get.ts` lines 8–16:
  `getAdminSupabase().from('events').select(...).eq('status', 'published')` is queried from Supabase on every GET request with no caching.
- In `src/server/api/menu-config.get.ts` lines 18–24:
  `getAdminSupabase().from('site_settings').select('value, updated_at').eq('key', 'pizzeria_menu')` is queried from Supabase on every GET request with no caching.

### 1.5 Redundant Supabase Authentication Network Roundtrips
- In `src/server/middleware/admin.ts` lines 35–50:
  Calls `supabase.auth.getUser()` followed by `supabase.from('users_roles').select('role').eq('user_id', user.id)`.
- In `src/server/api/admin/analytics.get.ts` lines 9–21:
  Calls `client.auth.getUser()` and `admin.from('users_roles').select('role')` a second time!
- Identical duplicate checks exist in:
  - `src/server/api/admin/pnl.get.ts` (lines 5–21)
  - `src/server/api/admin/pnl.post.ts` (lines 5–21)
  - `src/server/api/admin/staff.get.ts` (lines 11–25)
  - `src/server/api/admin/team.get.ts` (lines 8–23)
  - `src/server/api/admin/menu-config.put.ts` (lines 22–34)
  - `src/server/api/admin/kitchen.get.ts` & `kitchen.patch.ts`
  - `src/server/api/admin/promoters.get.ts` & `promoters-payout.post.ts`
  Each request to `/api/admin/*` incurs 4 round-trips to Supabase (2 in middleware + 2 in handler).

### 1.6 Unbounded Table Scans in Analytics
- In `src/server/api/admin/analytics.get.ts` lines 27–36:
  ```ts
  27: admin.from('pretix_orders').select('event_id, total, status, paid_at')
  28: admin.from('pretix_tickets').select('id, event_id, checkin_status')
  35: admin.from('inquiries').select('status')
  ```
  Unbounded table scans pull all historical rows over the wire for client-side JavaScript iteration.

### 1.7 Data Store Desynchronization
- In `src/server/api/admin/ra-events.put.ts` lines 37–42:
  Updates `pretix_event_url` on Supabase table `ra_events`, but never updates `.data/ra_events_store.json`.
- In `src/server/api/ra-events.get.ts` line 10:
  Reads exclusively from `getSyncedRaEvents()`, which reads `.data/ra_events_store.json`. Admin edits in the UI are never served to public users!
- In `src/server/api/admin/events.post.ts` line 35:
  Writes custom events to `saveCustomEvent` (local JSON store), while `src/server/api/events.get.ts` reads from Supabase table `events`.

---

## 2. Logic Chain

1. **Premise**: Node.js `fs.writeFileSync` truncates target files upon opening (`O_TRUNC`).
   **Observation**: `site-images.put.ts` (line 30) and `raSyncEngine.ts` (line 64) write directly to their respective JSON stores using `fs.writeFileSync`.
   **Inference**: A concurrent reader (e.g. `site-images.get.ts` or `readLocalStore()`) reading the file during a write reads a 0-byte or partial buffer, throwing a `SyntaxError` on `JSON.parse`. If the process crashes mid-write, the file remains permanently corrupted on disk.

2. **Premise**: Long asynchronous operations between a read and a write in a single process allow intervening mutations to be overwritten (Lost Update).
   **Observation**: `syncRaEventsEngine()` reads `ra_events_store.json` at T0, performs 10–30s of external network requests, and writes the snapshot at T30 (`raSyncEngine.ts` lines 171, 227).
   **Inference**: Any admin action adding/editing an event via `saveCustomEvent` during those 30 seconds is overwritten by the stale T0 snapshot.

3. **Premise**: Public HTTP request handlers must not execute long, unbounded external network calls without single-flight deduplication.
   **Observation**: `GET /api/ra-events` triggers `syncRaEventsEngine()` when data is >10 minutes old (`raSyncEngine.ts` line 296).
   **Inference**: Concurrent visitors hitting `/api/ra-events` trigger multiple parallel sync loops, spamming Resident Advisor with 200+ requests, causing rate-limiting (HTTP 429), latency spikes (>20s), and disk thrashing.

4. **Premise**: Redundant remote network roundtrips in an API request pipeline directly inflate response latency.
   **Observation**: `middleware/admin.ts` authenticates the user and queries `users_roles`. Admin endpoint handlers repeat the exact same `getUser()` and `users_roles` query against Supabase.
   **Inference**: 4 round-trips occur per admin request. Assuming 40ms per Supabase call, 160ms of dead network latency is added to every admin request.

5. **Premise**: Unbounded `select('*')` or full table fetches degrade quadratically as data grows.
   **Observation**: `analytics.get.ts` selects all rows from `pretix_orders`, `pretix_tickets`, and `inquiries`.
   **Inference**: As ticket and order volume increases, response payloads and memory usage scale without bound, risking memory leaks and slow response times.

---

## 3. Caveats

- **Network Mode**: Investigation was performed in `CODE_ONLY` network mode; external live calls to `https://ra.co/graphql` and live Supabase servers were not executed during this turn.
- **Supabase Local State**: `.env` currently has no `NUXT_PUBLIC_SUPABASE_URL` set, meaning the server runs in local dev fallback mode. However, in production with Supabase configured, the identified roundtrip overhead and query patterns will be active.
- **Microgramm POS Dispatch**: Calls to `sendMicrogrammOrder` in `table-orders.post.ts` are asynchronous fire-and-forget (`.catch(...)`), so POS network latency does not block table order responses.

---

## 4. Conclusion

The persistence layer currently suffers from high-risk concurrency bugs (un-atomic writes, lost updates, thundering herd sync storms) and severe latency penalties (synchronous disk I/O, un-cached public database reads, redundant authentication queries).

To achieve the performance goals (<50ms cached, <100ms uncached) and rock-solid stability in Milestone 2:
1. **Implement Atomic File Writes**: Replace `fs.writeFileSync` with a temp-file write + POSIX `rename` helper (`atomicWriteJson`).
2. **Apply SWR & Memory Caching via Nitro**: Wrap `/api/site-images`, `/api/events`, `/api/ra-events`, and `/api/menu-config` with Nitro's `defineCachedEventHandler` (or configure `routeRules`), delivering cached responses in <5ms with ETags and 304 support.
3. **Decouple RA Sync & Implement Single-Flight Mutex**: Ensure `getSyncedRaEvents()` never blocks on network syncs. Coalesce in-flight sync promises and trigger syncs in background intervals.
4. **Attach User Context in Middleware**: Store authenticated user and role in `event.context.user` and `event.context.userRole` to eliminate 2 redundant Supabase calls per admin request.
5. **Harmonize Data Stores**: Update `admin/ra-events.put.ts` to sync `pretix_event_url` to `ra_events_store.json` as well as Supabase, eliminating data divergence.

---

## 5. Verification Method

To verify the findings and assess system behavior:
1. **Inspect Target Files & Lines**:
   - `src/server/api/site-images.get.ts:36-40` & `src/server/api/admin/site-images.put.ts:30`
   - `src/server/utils/raSyncEngine.ts:48-64`, `171-227`, `292-302`
   - `src/server/middleware/admin.ts:35-50` vs `src/server/api/admin/analytics.get.ts:10-20`
   - `src/server/api/events.get.ts:8-23`
   - `src/server/api/menu-config.get.ts:18-35`
2. **Build Verification**:
   - Run `npm run build` — currently finishes with 0 errors (verified in 14.65s).
3. **Invalidation Conditions**:
   - If `fs.writeFileSync` is replaced by atomic rename operations, file corruption risks are invalidated.
   - If `defineCachedEventHandler` or in-memory caching is added, public disk I/O and un-cached database reads are eliminated.
   - If `event.context.user` is utilized across admin endpoints, redundant auth queries are eliminated.
