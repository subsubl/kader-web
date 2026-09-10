# Sharp Image Optimization Pipeline Audit (`/api/img`)

**Target File**: `src/server/api/img.get.ts`  
**Related Files**: `src/composables/useSiteImages.ts`, `src/pages/admin/kader.vue`, `src/server/api/admin/menu-upload.post.ts`, `src/server/api/admin/site-images-upload.post.ts`  
**Date**: September 2026  
**Auditor**: Explorer 3 (`teamwork_preview_explorer_m1_3`)

---

## 1. Executive Summary

The `/api/img` endpoint in Kader provides on-demand resizing, format conversion (WebP, JPEG, PNG, AVIF), and local disk caching using Sharp. While functional for basic use cases, a rigorous audit revealed **critical architectural bottlenecks, concurrency race conditions, memory vulnerabilities, and a complete absence of HTTP conditional request handling (ETag / 304 Not Modified)**.

### Key Audit Findings at a Glance:
| Category | Current State | Risk / Impact | Severity |
| :--- | :--- | :--- | :--- |
| **HTTP Conditional Requests** | No ETag generated; `If-None-Match` & `If-Modified-Since` ignored; never returns HTTP 304 | Full image payload re-sent on every request; wastes bandwidth and CPU | **CRITICAL** |
| **Cache Invalidation** | Hash key only includes query string (`src_w_q_f`), ignoring source file `mtime`/size | Updating a source image on disk never invalidates the cache; stale images served forever | **HIGH** |
| **Cache Race Conditions** | Non-atomic `fs.writeFile` writes directly to cached destination path | Concurrent requests read partially written, truncated files resulting in broken images | **HIGH** |
| **Cache Stampede (Thundering Herd)** | No in-flight promise coalescing | Multiple parallel requests for the same uncached image trigger redundant Sharp transforms | **HIGH** |
| **Event Loop Blocking** | Synchronous file operations (`fs.existsSync`, `fs.readFileSync`) on every cache hit and miss | Event loop starved under concurrent load; latency spikes across all backend APIs | **MEDIUM-HIGH** |
| **Memory Footprint** | 100% full-buffer in-memory pipeline; 20 concurrent transforms consume **180.78 MB native RSS** | Native libvips raster buffers risk triggering Linux OOM (Out Of Memory) process termination | **HIGH** |
| **CPU Saturation (AVIF)** | Default AVIF encoding takes **~2,045 ms** per image (effort 4) | Single uncached AVIF request monopolizes CPU core for > 2 seconds | **HIGH** |
| **Cache Growth & Eviction** | `.data/img-cache` has no max size, no TTL, and no LRU eviction | Indefinite disk growth leading to disk exhaustion DoS | **MEDIUM** |
| **Security (SSRF)** | Arbitrary remote URLs accepted without host whitelist, timeout, or payload size cap | Internal port scanning, cloud metadata credential theft, memory exhaustion DoS | **HIGH** |
| **Input Validation** | Non-numeric `w` or `q` results in `NaN`, which crashes Sharp with unhandled 404 | Crash/error on invalid query strings; `url`, `h`, and `fit` parameters unsupported | **MEDIUM** |

---

## 2. Request Lifecycle & Pipeline Walkthrough

The request lifecycle inside `src/server/api/img.get.ts` follows 6 distinct phases:

```
+---------------------------------------------------------------------------------------------------+
|                                  INCOMING REQUEST (GET /api/img)                                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 1: Query Extraction & Sanitization                                                          |
| - getQuery(event) -> src, w, q, format                                                            |
| - Defaults: w=800, q=80, format='webp'                                                            |
| - Flaw: Missing 'url' parameter support (PROJECT.md contract specifies url)                       |
| - Flaw: Ignores 'h' (height) and 'fit' (PROJECT.md contract specifies fit)                        |
| - Flaw: parseInt('abc') -> NaN causes Math.min/max to evaluate to NaN                             |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 2: Cache Key Generation & Disk Check                                                        |
| - hashKey = md5(`${src}_w${width}_q${quality}_f${targetFormat}`)                                  |
| - cachedFilePath = `.data/img-cache/${hashKey}.${ext}`                                            |
| - Sets headers: Cache-Control: public, max-age=31536000, immutable; Content-Type: image/${fmt}   |
| - fs.existsSync(cachedFilePath) check                                                             |
|   ├── [HIT] -> fs.readFileSync(cachedFilePath) -> Return full Buffer (NO ETag, NO 304)           |
|   └── [MISS] -> Proceed to Phase 3                                                                |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 3: Source Image Retrieval                                                                   |
| - If Remote (http/https):                                                                         |
|     fetch(src) -> arrayBuffer() -> Buffer.from()                                                  |
|     (No SSRF protection, no timeout, no size cap)                                                 |
| - If Local:                                                                                       |
|     Searches across 3 base dirs: src/public, public, .output/public (with/without 'images/')      |
|     Linear search using fs.existsSync (up to 6 sync stat calls)                                   |
|     fs.readFileSync(localPath) -> inputBuffer                                                     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 4: Sharp Transformation Pipeline                                                            |
| - sharp(inputBuffer).resize({ width, withoutEnlargement: true, fit: 'inside' })                   |
| - Formatter: .webp({ quality }) | .jpeg({ quality, progressive }) | .png() | .avif({ quality })  |
| - outputBuffer = await pipeline.toBuffer()                                                        |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 5: Asynchronous Cache Persistence                                                           |
| - fs.writeFile(cachedFilePath, outputBuffer) (Fire-and-forget, non-atomic write)                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Phase 6: Response Delivery                                                                        |
| - Returns outputBuffer directly to Nitro/H3 handler                                               |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Code Line Audit (`src/server/api/img.get.ts`):

1. **Lines 7-11: Cold Startup Directory Creation**
   ```ts
   const CACHE_DIR = path.resolve(process.cwd(), '.data/img-cache')
   if (!fs.existsSync(CACHE_DIR)) {
     fs.mkdirSync(CACHE_DIR, { recursive: true })
   }
   ```
   - Synchronous directory creation occurs at top-level module load.
   - If executed in read-only environments (e.g. serverless containers or Lambdas with read-only root filesystems), top-level execution can crash the worker immediately.

2. **Lines 14-27: Query Parameter Extraction & Flaws**
   ```ts
   const query = getQuery(event)
   const src = (query.src as string || '').trim()
   if (!src) {
     throw createError({ statusCode: 400, statusMessage: 'Image src parameter is required' })
   }
   const width = Math.min(Math.max(parseInt(query.w as string || '800', 10), 50), 3840)
   const quality = Math.min(Math.max(parseInt(query.q as string || '80', 10), 10), 100)
   const format = (query.format as string || 'webp').toLowerCase()
   ```
   - **Contract Mismatch**: `PROJECT.md` line 24 specifies: `Query params url, w, h, q, fit, etc.` However, `img.get.ts` only checks `query.src`. Any caller providing `?url=...` receives a 400 error.
   - **Missing Parameters**: `h` (height) and `fit` (resize fit mode) are never read from `query`. `fit: 'inside'` is hardcoded.
   - **`NaN` Vulnerability**: If `query.w = "foo"`, `parseInt("foo", 10)` returns `NaN`. In JavaScript:
     ```js
     Math.max(NaN, 50) === NaN
     Math.min(NaN, 3840) === NaN
     ```
     `width` becomes `NaN`. Sharp throws: `Expected positive integer for width but received NaN of type number`.

3. **Lines 28-36: Cache Key Generation & HTTP Headers**
   ```ts
   // Hashing for cache key
   const hashKey = crypto.createHash('md5').update(`${src}_w${width}_q${quality}_f${targetFormat}`).digest('hex')
   const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat
   const cachedFilePath = path.join(CACHE_DIR, `${hashKey}.${ext}`)

   // Set caching headers
   setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
   setHeader(event, 'Content-Type', `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`)
   ```
   - **Flaw 1**: The MD5 hash is derived strictly from query string inputs: `${src}_w${width}_q${quality}_f${targetFormat}`. If the underlying image file at `src` is updated on disk (e.g., admin uploads a new banner to `/hero-bg.jpg`), the hash key does not change! The endpoint will permanently serve the old image from `.data/img-cache`.
   - **Flaw 2**: `immutable` and `max-age=31536000` (1 year) are applied to dynamic endpoints where the URL does not change on content updates. When browsers cache this response with `immutable`, they will never send another request to the server, preventing users from seeing updated images until their local browser cache is cleared.
   - **Flaw 3**: Neither `ETag` nor `Last-Modified` headers are set.

4. **Lines 37-40: Cache Hit Handling**
   ```ts
   // Return cached file if exists
   if (fs.existsSync(cachedFilePath)) {
     return fs.readFileSync(cachedFilePath)
   }
   ```
   - `fs.existsSync` and `fs.readFileSync` are **synchronous**. Under high request concurrency, reading large files synchronously blocks the Node.js event loop thread, queuing all other network requests.
   - **Zero conditional check**: The code does NOT inspect `If-None-Match` or `If-Modified-Since`. Even when the client's browser already has the exact image cached, the server loads the entire file into a V8 Buffer and transmits the entire body with HTTP 200.

5. **Lines 45-56: Remote Image Fetching (SSRF & DoS)**
   ```ts
   if (src.startsWith('http://') || src.startsWith('https://')) {
     const resp = await fetch(src, {
       headers: { 'User-Agent': 'Mozilla/5.0 ...' }
     })
     if (!resp.ok) throw new Error(`Failed to fetch remote image: HTTP ${resp.status}`)
     const arrayBuf = await resp.arrayBuffer()
     inputBuffer = Buffer.from(arrayBuf)
   }
   ```
   - **SSRF Vulnerability**: An external user can pass `src=http://169.254.169.254/latest/meta-data/` or `src=http://127.0.0.1:5432` to probe internal services and cloud instance metadata.
   - **Denial of Service**: There is no timeout (`AbortSignal.timeout(...)`). If an external URL hangs, the Node worker hangs.
   - **Unbounded Memory Allocation**: No maximum download size is enforced. Fetching a 100MB file or infinite stream consumes memory and crashes the process.
   - `resp.arrayBuffer()` followed by `Buffer.from(arrayBuf)` allocates duplicate memory blocks in V8 heap.

6. **Lines 57-97: Local File Resolution**
   ```ts
   let cleanPath = src.startsWith('/') ? src.slice(1) : src
   if (cleanPath.includes('..') || cleanPath.includes('\0')) {
     throw createError({ statusCode: 403, statusMessage: 'Forbidden: Invalid file path' })
   }
   // Loops through 6 search paths with synchronous fs.existsSync
   inputBuffer = fs.readFileSync(localPath)
   ```
   - Synchronous read of source files into memory.
   - Did you know? `sharp(localPath)` can accept file paths directly, letting libvips memory-map (`mmap`) the file at the native C level without creating an intermediate Node.js V8 Buffer.

7. **Lines 99-123: Sharp Transformation & Cache Storage Race Condition**
   ```ts
   let pipeline = sharp(inputBuffer).resize({ width, withoutEnlargement: true, fit: 'inside' })
   // format configuration...
   const outputBuffer = await pipeline.toBuffer()

   // Write to cache asynchronously
   fs.writeFile(cachedFilePath, outputBuffer, (err) => {
     if (err) console.error('[img-cache] Error writing cache:', err)
   })

   return outputBuffer
   ```
   - **Race Condition (Corrupted Reads)**: `fs.writeFile` is non-atomic. It opens `cachedFilePath` and writes data asynchronously chunk by chunk. If a parallel request arrives while the write is underway, `fs.existsSync(cachedFilePath)` in line 38 returns `true`, and `fs.readFileSync(cachedFilePath)` reads a truncated, half-written buffer, sending corrupted image bytes to the client!
   - **Thundering Herd**: If 20 users simultaneously request an uncached image, 20 parallel Sharp instances process the identical transform and race to write to the same file.

---

## 3. Deep Dive: Memory & CPU Consumption

### 3.1 Empirical Concurrency & Memory Benchmarks

To quantify the exact memory overhead of Sharp inside the Node.js environment, we executed empirical benchmarks under controlled conditions using `src/public/hero-bg.jpg` (222 KB source file):

#### Test 1: Concurrency Memory Footprint (20 Parallel Transforms)
```js
// 20 concurrent WebP transforms of a 222KB image
const promises = [];
for (let i = 0; i < 20; i++) {
  promises.push(sharp(input).resize({ width: 800 }).webp({ quality: 80 }).toBuffer());
}
await Promise.all(promises);
```
**Results**:
- **RSS (Resident Set Size) Delta**: **+180.78 MB**
- **V8 Heap Delta**: **+0.60 MB**
- **Total output bytes**: 576,560 bytes

**Analysis**:
The JS Heap remained flat (+0.60 MB), while process RSS surged by **+180.78 MB**. This confirms that memory consumption in the image pipeline is **overwhelmingly native libvips memory allocation** (uncompressed pixel matrices, decompression workspaces, and thread buffers). Because V8 garbage collection does not track native C memory, running unthrottled concurrent Sharp operations can rapidly trigger Linux OOM (Out Of Memory) killer kills without V8 ever triggering a GC cycle.

---

### 3.2 Format Transformation Latency & CPU Overhead

We benchmarked the latency of encoding `src/public/hero-bg.jpg` (800px width, quality 80) across supported formats:

| Format | Output Size | Transformation Time | CPU Overhead Assessment |
| :--- | :--- | :--- | :--- |
| **WebP** (`effort: 4`) | 28,828 bytes | **123.19 ms** | Moderate; acceptable for uncached baseline |
| **JPEG** (progressive) | 48,351 bytes | **90.64 ms** | Low; fast libjpeg-turbo encoding |
| **AVIF** (`effort: 4` default) | 40,383 bytes | **2,045.85 ms** | **SEVERE BOTTLENECK** (> 2 seconds CPU peg per image) |

#### Investigation of AVIF CPU Bottleneck:
Sharp’s default AVIF encoder uses `effort: 4` (libaom CPU effort). We tested how tuning `effort` impacts latency vs compression:

| AVIF Effort Level | Output Size | Latency | Speedup vs Default |
| :---: | :---: | :---: | :---: |
| **Effort 4 (Current Default)** | 40,383 bytes | **1,941.24 ms** | 1.0x (baseline) |
| **Effort 3** | 41,758 bytes | **403.92 ms** | 4.8x faster |
| **Effort 2 (Recommended)** | 45,125 bytes | **300.13 ms** | **6.5x faster** |
| **Effort 1** | 47,262 bytes | **192.08 ms** | 10.1x faster |
| **Effort 0** | 49,838 bytes | **122.96 ms** | 15.8x faster |

**Finding**:
At `effort: 2`, transformation time drops from **1,941 ms to 300 ms** (an 85% CPU reduction) while the file size only increases from 40.3 KB to 45.1 KB (a negligible 4.8 KB difference). The current default of `effort: 4` is a critical CPU denial-of-service vector.

---

### 3.3 Full Buffer Allocation vs Streaming

The current endpoint holds the entire image in memory at every stage:
1. `fs.readFileSync` reads the full source file into Node.js memory.
2. Sharp decodes the full image into an uncompressed raster bitmap in libvips native memory.
3. `pipeline.toBuffer()` creates a new output Buffer in Node.js memory.
4. On cache hits, `fs.readFileSync` allocates another Buffer in Node.js memory.

**Comparison with Stream-Based Architecture**:
- When serving from disk cache, streaming the file using `sendStream(event, fs.createReadStream(cachedFilePath))` streams the file in small 64KB chunks directly into the HTTP response socket.
- Memory usage drops from `O(file_size * concurrent_requests)` to a constant `64 KB` per active socket.
- Furthermore, when source files are local, passing the file path directly to Sharp (`sharp(localPath)`) allows libvips to use `mmap` or native file descriptors, eliminating the source `fs.readFileSync` V8 Buffer entirely.

---

## 4. Caching Mechanisms & Invalidation Audit

### 4.1 Disk Cache (`.data/img-cache`)

Current implementation:
- Destination directory: `.data/img-cache`
- File naming: `<md5-hash>.<ext>`
- Total existing files: 13 files, ~648 KB.

#### Architectural Defects in Disk Cache:
1. **Source Agnostic Cache Key**:
   The cache key is `md5(`${src}_w${width}_q${quality}_f${targetFormat}`)`. It contains no reference to the file's modification time (`mtime`) or content digest.
   - If an admin updates `/images/instagram/ig_img_7.jpg` or `/hero-bg.jpg`, the cached file `.data/img-cache/28ff6249...webp` remains untouched.
   - Any client requesting that image continues to receive the old, obsolete image indefinitely.
2. **Unbounded Disk Storage Growth**:
   There is no cache eviction policy, no LRU mechanism, no TTL expiration, and no maximum directory size cap. Every distinct combination of `src`, `w`, `q`, and `format` writes a new file to disk. An attacker or crawler requesting random `w` values (`?w=801`, `?w=802`, ...) can generate thousands of files, exhausting disk inodes and storage.
3. **Non-Atomic Writes & File Corruption**:
   `fs.writeFile(cachedFilePath, outputBuffer)` writes directly to the destination path. A concurrent read request will find `fs.existsSync(cachedFilePath) === true` while the file is only partially written, serving corrupted data.

### 4.2 In-Memory Caching

- Currently, there is **zero in-memory caching**.
- Even for the site's most critical hot assets (e.g. `hero-bg.jpg`, pizzeria hero, logos), every single cache hit requires synchronous filesystem calls (`fs.existsSync` + `fs.readFileSync`).
- Adding an in-memory LRU cache for popular image buffers (e.g. 20MB / 50 items) allows sub-millisecond responses (< 2ms) without disk I/O.

---

## 5. HTTP Conditional Requests & Cache-Control Audit

### 5.1 Absence of ETag & 304 Not Modified

Inspection of `src/server/api/img.get.ts` lines 33-40 reveals:
```ts
setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
setHeader(event, 'Content-Type', `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`)

if (fs.existsSync(cachedFilePath)) {
  return fs.readFileSync(cachedFilePath)
}
```
- **ETag**: Not generated. Not sent in response.
- **Last-Modified**: Not generated. Not sent in response.
- **`If-None-Match`**: Never read or evaluated.
- **`If-Modified-Since`**: Never read or evaluated.
- **HTTP 304**: Never returned.

**Performance Impact**:
When a client or CDN makes a conditional request (`If-None-Match: "..."`), the server does not check the header. It reads the full image from disk and sends a 200 OK response with the entire binary payload.
By contrast, returning **HTTP 304 Not Modified**:
- Response payload: **0 bytes**
- Processing time: **< 0.5 ms**
- Network transfer time: instantaneous
- Bandwidth savings: **100%**

### 5.2 Cache-Control Header Analysis

Current header:
```http
Cache-Control: public, max-age=31536000, immutable
```

**Flaws**:
1. **Misapplied `immutable` Directive**: The `immutable` directive tells browsers that the content will *never* change under this URL. This directive is only appropriate for hashed asset URLs (e.g., `/_nuxt/entry.a9b8c7.js`). Because `/api/img?src=/hero-bg.jpg&w=800` is a mutable resource path, applying `immutable` prevents browsers from ever revalidating the image when updated.
2. **Missing CDN Directives**: Does not include `s-maxage` or `stale-while-revalidate`.
3. **Recommended Cache-Control**:
   ```http
   Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400
   ETag: W/"<cacheKey>-<mtime>"
   ```
   This instructs browsers to cache for 1 day, CDNs/proxies for 7 days, allows serving stale content while asynchronously revalidating, and enables instant 304 validation via ETag.

---

## 6. Bottlenecks, Concurrency & Security Vulnerabilities

### 6.1 Thundering Herd (Cache Stampede)
When a cold image is requested simultaneously by 10 users:
- All 10 requests evaluate `fs.existsSync(cachedFilePath)` to `false`.
- All 10 requests invoke Sharp and libvips in parallel.
- CPU spikes to 100%, and RAM increases by ~90MB.
- All 10 requests race to write the output to `cachedFilePath`.
- **Solution**: Single-flight promise deduplication map (`Map<string, Promise<Buffer>>`).

### 6.2 Race Condition: Broken Image Delivery
- Node's `fs.writeFile(file, data)` opens the file descriptor, creates a 0-byte file, and streams buffer chunks.
- During this window, concurrent requests see the file exists and read partial bytes.
- **Solution**: Atomic writes using temporary files:
  ```ts
  const tempPath = `${cachedFilePath}.tmp.${process.pid}.${Date.now()}`
  await fs.promises.writeFile(tempPath, outputBuffer)
  await fs.promises.rename(tempPath, cachedFilePath)
  ```
  On POSIX systems, `rename` is an atomic directory operation.

### 6.3 Server-Side Request Forgery (SSRF)
- `src` accepting any `http://` or `https://` allows attackers to target:
  - AWS/GCP metadata: `http://169.254.169.254/latest/meta-data/`
  - Internal databases/services: `http://localhost:5432`
- **Solution**: Restrict remote URLs strictly to trusted origins (e.g., Supabase Storage domain: `*.supabase.co` or configured CDN domains), and reject local/private IP ranges.

### 6.4 Input Validation & `NaN` Injection
- `parseInt(query.w)` without `isNaN` check allows `NaN` to slip through `Math.min/max` and crash Sharp.
- Missing support for `url` alias, `h` height constraint, and `fit` modes.
- **Solution**: Robust validator with fallbacks:
  ```ts
  const rawSrc = (query.src || query.url || '') as string
  const rawW = parseInt(query.w as string, 10)
  const width = Number.isFinite(rawW) ? Math.min(Math.max(rawW, 50), 3840) : 800
  ```

---

## 7. Actionable Recommendations for Milestone 2

### 7.1 Architecture Design Blueprint

To meet the project goals (< 50ms cached, < 100ms uncached, 304 conditional GETs, rock-solid concurrency), the optimized pipeline should implement:

```
                            Incoming Request (GET /api/img)
                                          |
                                          v
                         +---------------------------------+
                         |  Parameter Validation & Norm    |
                         |  (src/url, w, h, q, fit, format)|
                         +---------------------------------+
                                          |
                                          v
                         +---------------------------------+
                         |  Source Resolution & ETag Calc  |
                         |  - Get local file stat (mtime)  |
                         |  - ETag = W/"<hashKey>-<mtime>" |
                         +---------------------------------+
                                          |
                                          v
             [If-None-Match == ETag?] -- YES --> Set Status 304 -> Return (0ms, 0 bytes)
                                          |
                                         NO
                                          |
                                          v
                         +---------------------------------+
                         |  In-Memory Hot Cache (LRU)      |
                         +---------------------------------+
                            | (Hit)                   | (Miss)
                            v                         v
                   Return Buffer (<2ms)     +---------------------------------+
                                            |  Disk Cache Check (.data/...)   |
                                            +---------------------------------+
                                               | (Hit)                   | (Miss)
                                               v                         v
                                       sendStream (<5ms)        +-------------------+
                                                                | In-Flight Promise |
                                                                | Deduplication Map |
                                                                +-------------------+
                                                                          |
                                                                          v
                                                                +-------------------+
                                                                | Concurrency-      |
                                                                | Limited Sharp     |
                                                                | (p-limit / sem)   |
                                                                +-------------------+
                                                                          |
                                                                          v
                                                                +-------------------+
                                                                | Atomic Disk Write |
                                                                | (tmp -> rename)   |
                                                                +-------------------+
                                                                          |
                                                                          v
                                                                  sendStream / Buffer
```

### 7.2 Specific Code Proposals for Implementation

#### 1. Conditional GET & ETag Handling:
```ts
// Calculate robust ETag based on cache key + source modification timestamp
const etag = `W/"${hashKey}-${sourceMtime}"`

setHeader(event, 'ETag', etag)
setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')

const ifNoneMatch = getHeader(event, 'if-none-match')
if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `"${etag.replace(/^W\//, '')}"`)) {
  setResponseStatus(event, 304)
  return null
}
```

#### 2. In-Flight Request Deduplication (Anti-Stampede):
```ts
const inFlightTransforms = new Map<string, Promise<Buffer>>()

function getOrCreateTransform(key: string, fn: () => Promise<Buffer>): Promise<Buffer> {
  if (inFlightTransforms.has(key)) {
    return inFlightTransforms.get(key)!
  }
  const promise = fn().finally(() => {
    inFlightTransforms.delete(key)
  })
  inFlightTransforms.set(key, promise)
  return promise
}
```

#### 3. Atomic Cache Persistence:
```ts
async function saveToCacheAtomic(targetPath: string, buffer: Buffer): Promise<void> {
  const tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`
  await fs.promises.writeFile(tempPath, buffer)
  await fs.promises.rename(tempPath, targetPath)
}
```

#### 4. Stream Caching for Disk Hits:
```ts
if (await fileExists(cachedFilePath)) {
  setHeader(event, 'Content-Type', `image/${targetFormat}`)
  return sendStream(event, fs.createReadStream(cachedFilePath))
}
```

#### 5. Sharp Concurrency & Parameter Hardening:
```ts
// Set AVIF effort to 2 for 6.5x speedup
if (targetFormat === 'avif') {
  pipeline = pipeline.avif({ quality, effort: 2 })
} else if (targetFormat === 'webp') {
  pipeline = pipeline.webp({ quality, effort: 4 })
}
```

#### 6. SSRF Protection:
```ts
const ALLOWED_REMOTE_HOSTS = new Set([
  'supabase.co',
  // Allow project Supabase domain parsed from runtimeConfig
])

function isAllowedRemoteUrl(srcUrl: string): boolean {
  try {
    const parsed = new URL(srcUrl)
    if (parsed.protocol !== 'https:') return false
    return Array.from(ALLOWED_REMOTE_HOSTS).some(h => parsed.hostname.endsWith(h))
  } catch {
    return false
  }
}
```

---

## 8. Summary Table of Action Items for Milestone 2

| # | Action Item | Target Location | Rationale |
|---|---|---|---|
| 1 | Implement ETag & 304 Not Modified | `src/server/api/img.get.ts` | Eliminates redundant downloads; responds in < 1ms for revalidations |
| 2 | Incorporate source `mtime` into cache key/ETag | `src/server/api/img.get.ts` | Ensures automatic cache invalidation when source image files are updated |
| 3 | Replace `fs.writeFile` with atomic write (`.tmp` + rename) | `src/server/api/img.get.ts` | Prevents corrupt partial image delivery during concurrent writes |
| 4 | Add in-flight request deduplication map | `src/server/api/img.get.ts` | Prevents thundering herd / cache stampede on uncached requests |
| 5 | Stream disk-cached files using `sendStream` | `src/server/api/img.get.ts` | Reduces V8 heap allocations from full buffer loading |
| 6 | Tune AVIF effort (`effort: 2`) & Sharp concurrency | `src/server/api/img.get.ts` | Reduces AVIF CPU time from 2045ms to 300ms (85% reduction) |
| 7 | Fix Cache-Control directives | `src/server/api/img.get.ts` | Remove `immutable`; add `s-maxage=604800` & `stale-while-revalidate` |
| 8 | Support `url`, `h`, and `fit` parameters with safe `NaN` fallbacks | `src/server/api/img.get.ts` | Satisfies interface contract in `PROJECT.md` and avoids runtime crashes |
| 9 | Add SSRF origin whitelist and fetch timeout | `src/server/api/img.get.ts` | Prevents internal network scanning and hanging fetch requests |
