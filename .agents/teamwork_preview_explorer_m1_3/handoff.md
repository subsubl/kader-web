# Handoff Report: Sharp Image Optimization Pipeline Audit (`/api/img`)

**Agent**: Explorer 3 (`teamwork_preview_explorer_m1_3`)  
**Type**: Hard Handoff (Task Complete)  
**Target File**: `src/server/api/img.get.ts`  
**Reference Document**: `/home/ator/Kader/.agents/teamwork_preview_explorer_m1_3/analysis.md`  
**Date**: September 2026

---

## 1. Observation

### 1.1 Source Code Observations in `src/server/api/img.get.ts`

- **Lines 14-27 (Parameter Extraction & Validation)**:
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
  - Direct observation: `query.src` is required; `query.url` is never checked. `PROJECT.md` line 24 specifies `Query params url, w, h, q, fit, etc.`.
  - Direct observation: `query.h` and `query.fit` are never read or handled.
  - Direct observation: Non-numeric strings in `query.w` yield `NaN`. `Math.max(NaN, 50)` evaluates to `NaN`.

- **Lines 28-36 (Cache Key & Header Setting)**:
  ```ts
  const hashKey = crypto.createHash('md5').update(`${src}_w${width}_q${quality}_f${targetFormat}`).digest('hex')
  const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat
  const cachedFilePath = path.join(CACHE_DIR, `${hashKey}.${ext}`)

  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'Content-Type', `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`)
  ```
  - Direct observation: `hashKey` is computed strictly from query string parameters. It does not include file `mtime` or file size.
  - Direct observation: `Cache-Control` is hardcoded to `public, max-age=31536000, immutable`.
  - Direct observation: Neither `ETag` nor `Last-Modified` headers are set.

- **Lines 37-40 (Cache Hit Handling)**:
  ```ts
  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath)
  }
  ```
  - Direct observation: Synchronous file check and synchronous file read.
  - Direct observation: No inspection of `If-None-Match` or `If-Modified-Since` request headers.
  - Direct observation: Status 304 is never returned. Full buffer payload is returned on every request.

- **Lines 45-56 (Remote Fetch)**:
  ```ts
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const resp = await fetch(src, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    if (!resp.ok) {
      throw new Error(`Failed to fetch remote image: HTTP ${resp.status}`)
    }
    const arrayBuf = await resp.arrayBuffer()
    inputBuffer = Buffer.from(arrayBuf)
  }
  ```
  - Direct observation: No hostname filtering or IP whitelist. Allows requests to `127.0.0.1`, `localhost`, and `169.254.169.254`.
  - Direct observation: No timeout (`AbortSignal.timeout`) configured.
  - Direct observation: No byte limit or streaming size cap on download.

- **Lines 99-123 (Sharp Pipeline & Persistence)**:
  ```ts
  let pipeline = sharp(inputBuffer).resize({
    width,
    withoutEnlargement: true,
    fit: 'inside'
  })
  ...
  const outputBuffer = await pipeline.toBuffer()

  fs.writeFile(cachedFilePath, outputBuffer, (err) => {
    if (err) console.error('[img-cache] Error writing cache:', err)
  })

  return outputBuffer
  ```
  - Direct observation: Sharp is passed an in-memory buffer (`inputBuffer`) and outputs to an in-memory buffer (`outputBuffer`).
  - Direct observation: `fs.writeFile` writes directly to `cachedFilePath` asynchronously without atomic renaming.
  - Direct observation: There is no in-flight promise deduplication map.

### 1.2 Empirical Runtime Measurements

- **Test Command**:
  ```sh
  node -e 'const sharp = require("sharp"); const fs = require("fs"); ...'
  ```
- **Results**:
  - WebP (w=800, q=80, effort=4): **123.19 ms** (28,828 bytes)
  - JPEG (w=800, q=80, progressive): **90.64 ms** (48,351 bytes)
  - AVIF (w=800, q=80, effort=4 default): **2,045.85 ms** (40,383 bytes)
  - AVIF (w=800, q=80, effort=2): **300.13 ms** (45,125 bytes) — **6.5x faster**
  - AVIF (w=800, q=80, effort=0): **122.96 ms** (49,838 bytes) — **15.8x faster**
  - Concurrency Memory Footprint (20 parallel WebP transforms):
    - JS Heap Delta: **+0.60 MB**
    - Process RSS Delta: **+180.78 MB**

---

## 2. Logic Chain

1. **Premise**: In HTTP caching, conditional GET requests (`If-None-Match`, `If-Modified-Since`) allow clients to validate whether cached representations remain fresh, returning HTTP 304 Not Modified with zero body bytes when valid.
   - *Observation*: Lines 33-40 in `img.get.ts` omit `ETag` generation and ignore `If-None-Match`.
   - *Deduction*: Every client request forces a full disk read and full network transmission of the image binary, even when the client possesses an identical copy.

2. **Premise**: Caching mutable resources under a static cache key without incorporating source file modification metadata causes permanent cache desynchronization.
   - *Observation*: Line 29 creates `hashKey` exclusively from `src`, `w`, `q`, and `targetFormat`. Lines 38-39 return `fs.readFileSync(cachedFilePath)` without checking the source file's `mtime`.
   - *Deduction*: When local images (e.g. in `src/public`) or uploaded banners are replaced, the endpoint permanently serves stale, outdated images from `.data/img-cache`.

3. **Premise**: Non-atomic file writes create an operational window where a file descriptor is opened and written in chunks.
   - *Observation*: Line 119 calls `fs.writeFile(cachedFilePath, outputBuffer)` directly to the destination path.
   - *Observation*: Line 38 checks `fs.existsSync(cachedFilePath)` and synchronously calls `fs.readFileSync(cachedFilePath)`.
   - *Deduction*: When concurrent requests arrive during an ongoing write, subsequent requests detect that the file exists and read incomplete, corrupt data chunks, returning damaged image files to users.

4. **Premise**: Concurrently executing intensive CPU/memory tasks without deduplication or rate limiting leads to resource exhaustion (thundering herd).
   - *Observation*: There is no in-flight promise map in `img.get.ts`.
   - *Observation*: Empirical benchmark demonstrated that 20 parallel Sharp transforms produce a **+180.78 MB RSS spike** in native libvips memory.
   - *Deduction*: A burst of concurrent requests for cold images will execute redundant Sharp transformations, multiplying native memory usage and risking process termination by the OS OOM killer.

5. **Premise**: Long-running CPU operations in HTTP request handlers create severe request queueing delays.
   - *Observation*: Default AVIF transformation takes **2,045 ms**, whereas tuning `effort: 2` takes **300 ms**.
   - *Deduction*: Untuned AVIF encoding is a major latency bottleneck that starves Node worker threads.

---

## 3. Caveats

- **Supabase Storage Integration**: The investigation identified that `src/server/api/admin/menu-upload.post.ts` uploads to Supabase storage (`menu_images` bucket), generating external HTTPS URLs. Remote URL fetching in `/api/img` is required for these assets. SSRF protection must whitelist the Supabase storage origin rather than disabling remote fetching entirely.
- **Node.js Concurrency Default**: `sharp.concurrency()` reported 1 on the execution environment while `os.cpus().length` is 12. Sharp's threadpool configuration should be explicitly declared to ensure consistent behavior between local development and production container deployments.
- **Serverless vs Persistent Storage**: `.data/img-cache` relies on local disk persistence. In serverless deployments with ephemeral filesystems (e.g., Vercel, AWS Lambda), disk caching is ephemeral to each instance. A 2-tier caching model (hot in-memory LRU + disk fallback) provides maximum resiliency.

---

## 4. Conclusion

The current `/api/img` endpoint exhibits critical deficiencies in HTTP cache compliance, concurrency safety, and resource utilization:
1. It does not support conditional GETs (`ETag` / `304 Not Modified`), wasting server bandwidth and client load time.
2. It suffers from cache invalidation failure due to source-agnostic hashing.
3. It has race conditions in file writing and cache stampedes under concurrent loads.
4. It consumes excessive native memory via full-buffer processing without concurrency throttling.
5. It suffers from a severe AVIF CPU bottleneck (~2s per image).

These issues can be fully resolved in Milestone 2 by implementing:
- Robust ETag generation (`W/"<hash>-<mtime>"`) and instant 304 responses via `getHeader(event, 'if-none-match')`.
- Stream caching via `sendStream(event, fs.createReadStream(...))` to eliminate V8 buffer bloat.
- Single-flight in-flight request deduplication map to prevent cache stampedes.
- Atomic temporary file writes (`.tmp` + rename).
- Parameter hardening (`url`, `h`, `fit`, `NaN` guards) and AVIF `effort: 2` tuning.
- SSRF whitelist filtering for remote Supabase URLs.

---

## 5. Verification Method

To independently verify all findings and measurements:

1. **Verify Absence of ETag and 304 Handling**:
   - Inspect `src/server/api/img.get.ts` lines 33-40.
   - Observe that `ETag` header is not set and no check exists for `event.node.req.headers['if-none-match']`.

2. **Reproduce AVIF Latency and Effort Optimization**:
   - Run:
     ```sh
     node -e '
     const sharp = require("sharp");
     const fs = require("fs");
     const buf = fs.readFileSync("src/public/hero-bg.jpg");
     async function run() {
       const t0 = performance.now();
       await sharp(buf).resize({ width: 800 }).avif({ quality: 80, effort: 4 }).toBuffer();
       console.log("Effort 4 time:", (performance.now() - t0).toFixed(2), "ms");
       const t1 = performance.now();
       await sharp(buf).resize({ width: 800 }).avif({ quality: 80, effort: 2 }).toBuffer();
       console.log("Effort 2 time:", (performance.now() - t1).toFixed(2), "ms");
     }
     run();
     '
     ```
   - Invalidation condition: If Effort 4 completes in < 200 ms or does not show an ~85% reduction at Effort 2.

3. **Reproduce Memory Footprint Under Concurrency**:
   - Run:
     ```sh
     node -e '
     const sharp = require("sharp");
     const fs = require("fs");
     const buf = fs.readFileSync("src/public/hero-bg.jpg");
     async function run() {
       const m0 = process.memoryUsage().rss;
       const p = [];
       for (let i = 0; i < 20; i++) p.push(sharp(buf).resize({ width: 800 }).webp({ quality: 80 }).toBuffer());
       await Promise.all(p);
       console.log("RSS delta (MB):", ((process.memoryUsage().rss - m0)/1024/1024).toFixed(2));
     }
     run();
     '
     ```
   - Invalidation condition: If RSS delta is < 30 MB.

4. **Verify TypeScript Correctness of Image Endpoint**:
   - Run: `npx vue-tsc --noEmit` or `npm run typecheck`
   - Observe: `src/server/api/img.get.ts` has **0 TypeScript errors** (pre-existing type errors exist in unrelated admin endpoints importing from `#imports`).
