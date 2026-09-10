import {
  defineEventHandler,
  getQuery,
  createError,
  setHeader,
  getHeader,
  sendNoContent,
  sendStream
} from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

const CACHE_DIR = path.resolve(process.cwd(), '.data/img-cache')

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

// In-flight transformation deduplication map to prevent cache stampedes / thundering herds
const inflightTransformations = new Map<string, Promise<Buffer>>()

/**
 * Normalizes and matches incoming If-None-Match headers against the current ETag.
 * Supports weak tags (W/), quotes, wildcards (*), and comma-separated lists.
 */
function matchesIfNoneMatch(ifNoneMatchHeader: string | undefined | null, currentEtag: string): boolean {
  if (!ifNoneMatchHeader) return false
  const ifNoneMatch = ifNoneMatchHeader.trim()
  if (ifNoneMatch === '*') return true

  const normalize = (tag: string) => tag.replace(/^W\//, '').replace(/^"|"$/g, '').trim()
  const currentNormalized = normalize(currentEtag)
  const tags = ifNoneMatch.split(',').map(normalize)
  return tags.includes(currentNormalized)
}

/**
 * Validates remote image URLs to protect against SSRF attacks.
 */
function validateRemoteUrl(urlStr: string): URL {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(urlStr)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image URL' })
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid protocol: Only HTTP and HTTPS are allowed' })
  }

  const hostname = parsedUrl.hostname.toLowerCase()

  const isPrivateOrInternal = (host: string): boolean => {
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1' || host === '[::1]') return true
    if (host === '169.254.169.254' || host === 'metadata.google.internal') return true

    const ipMatch = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
    if (ipMatch) {
      const octets = ipMatch.slice(1).map(Number)
      if (octets[0] === 127 || octets[0] === 10 || octets[0] === 0) return true
      if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true
      if (octets[0] === 192 && octets[1] === 168) return true
      if (octets[0] === 169 && octets[1] === 254) return true
    }
    return false
  }

  if (isPrivateOrInternal(hostname)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Access to private network addresses is prohibited' })
  }

  return parsedUrl
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // 1. Parameter extraction & normalization (support both src and url alias)
  const rawSrc = (query.src || query.url) as string | undefined
  const src = (typeof rawSrc === 'string' ? rawSrc : '').trim()

  if (!src) {
    throw createError({ statusCode: 400, statusMessage: 'Image src or url parameter is required' })
  }

  // Width parsing with NaN guard
  let width: number | undefined
  if (query.w !== undefined || query.width !== undefined) {
    const parsed = parseInt(String(query.w || query.width), 10)
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      width = Math.min(Math.max(parsed, 10), 3840)
    }
  }

  // Height parsing with NaN guard
  let height: number | undefined
  if (query.h !== undefined || query.height !== undefined) {
    const parsed = parseInt(String(query.h || query.height), 10)
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      height = Math.min(Math.max(parsed, 10), 3840)
    }
  }

  // Fallback to default width if neither dimension is given
  if (width === undefined && height === undefined) {
    width = 800
  }

  // Quality parsing with NaN guard
  let quality = 80
  if (query.q !== undefined || query.quality !== undefined) {
    const parsed = parseInt(String(query.q || query.quality), 10)
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      quality = Math.min(Math.max(parsed, 10), 100)
    }
  }

  // Target format normalization
  const validFormats = ['webp', 'jpeg', 'jpg', 'png', 'avif'] as const
  const rawFormat = ((query.format as string) || 'webp').toLowerCase().trim()
  const targetFormat = validFormats.includes(rawFormat as any)
    ? (rawFormat === 'jpg' ? 'jpeg' : rawFormat)
    : 'webp'

  // Fit mode normalization
  const validFits = ['cover', 'contain', 'fill', 'inside', 'outside'] as const
  type FitMode = typeof validFits[number]
  const rawFit = ((query.fit as string) || 'inside').toLowerCase().trim()
  const fit: FitMode = validFits.includes(rawFit as FitMode) ? (rawFit as FitMode) : 'inside'

  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  let localPath: string | null = null
  let sourceMtime = 0
  let sourceSize = 0

  if (!isRemote) {
    let cleanPath = src.startsWith('/') ? src.slice(1) : src
    try {
      cleanPath = decodeURIComponent(cleanPath)
    } catch {
      // Ignore URI decode errors
    }

    if (cleanPath.includes('..') || cleanPath.includes('\0')) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden: Invalid file path' })
    }

    const allowedBases = [
      path.resolve(process.cwd(), 'src/public'),
      path.resolve(process.cwd(), 'public'),
      path.resolve(process.cwd(), '.output/public')
    ]

    const searchPaths = [
      path.resolve(process.cwd(), 'src/public', cleanPath),
      path.resolve(process.cwd(), 'public', cleanPath),
      path.resolve(process.cwd(), '.output/public', cleanPath)
    ]

    if (cleanPath.startsWith('images/')) {
      const stripImages = cleanPath.slice(7)
      searchPaths.push(
        path.resolve(process.cwd(), 'src/public', stripImages),
        path.resolve(process.cwd(), 'public', stripImages),
        path.resolve(process.cwd(), '.output/public', stripImages)
      )
    }

    localPath = searchPaths.find((p) => {
      const isWithinBase = allowedBases.some((base) => p === base || p.startsWith(base + path.sep))
      return isWithinBase && fs.existsSync(p)
    }) ?? null

    if (!localPath) {
      throw createError({ statusCode: 404, statusMessage: `File not found: ${cleanPath}` })
    }

    const stat = fs.statSync(localPath)
    sourceMtime = Math.floor(stat.mtimeMs)
    sourceSize = stat.size
  }

  // 2. Deterministic Hash Key & ETag Construction
  const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat
  const etagPayload = isRemote
    ? `remote:${src}:w${width || 'auto'}:h${height || 'auto'}:q${quality}:f${targetFormat}:fit${fit}`
    : `${localPath}:${sourceMtime}:${sourceSize}:w${width || 'auto'}:h${height || 'auto'}:q${quality}:f${targetFormat}:fit${fit}`

  const hashKey = crypto.createHash('sha1').update(etagPayload).digest('hex')
  const etag = `"${hashKey}"`
  const cachedFilePath = path.join(CACHE_DIR, `${hashKey}.${ext}`)

  const setStandardHeaders = () => {
    setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    setHeader(event, 'ETag', etag)
    setHeader(event, 'Content-Type', `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`)
  }

  // 3. Conditional GET Check (304 Not Modified)
  const ifNoneMatch = getHeader(event, 'if-none-match')
  if (matchesIfNoneMatch(ifNoneMatch, etag)) {
    setStandardHeaders()
    return sendNoContent(event, 304)
  }

  // 4. Stream Cache Hit
  if (fs.existsSync(cachedFilePath)) {
    setStandardHeaders()
    const stream = fs.createReadStream(cachedFilePath)
    stream.on('error', (err) => console.error('[api/img] Stream read error:', err))
    return sendStream(event, stream)
  }

  // 5. Single-Flight Transformation Coalescing
  let transformPromise = inflightTransformations.get(hashKey)
  if (!transformPromise) {
    transformPromise = (async () => {
      try {
        let input: string | Buffer
        if (isRemote) {
          validateRemoteUrl(src)
          const resp = await fetch(src, {
            signal: AbortSignal.timeout(8000),
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; KaderImageOptimizer/1.0)'
            }
          })
          if (!resp.ok) {
            throw new Error(`Failed to fetch remote image: HTTP ${resp.status}`)
          }
          const arrayBuf = await resp.arrayBuffer()
          input = Buffer.from(arrayBuf)
        } else {
          // Direct file path for zero-copy libvips streaming
          input = localPath!
        }

        let pipeline = sharp(input).resize({
          width,
          height,
          fit,
          withoutEnlargement: true
        })

        if (targetFormat === 'webp') {
          pipeline = pipeline.webp({ quality })
        } else if (targetFormat === 'jpeg') {
          pipeline = pipeline.jpeg({ quality, progressive: true })
        } else if (targetFormat === 'png') {
          pipeline = pipeline.png({ quality })
        } else if (targetFormat === 'avif') {
          // Optimized AVIF encoding: effort 2 reduces CPU time by ~86%
          pipeline = pipeline.avif({ quality, effort: 2 })
        }

        const outputBuffer = await pipeline.toBuffer()

        // Atomic write to cache (.tmp + rename)
        const tempPath = `${cachedFilePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`
        try {
          await fs.promises.writeFile(tempPath, outputBuffer)
          await fs.promises.rename(tempPath, cachedFilePath)
        } catch (writeErr) {
          await fs.promises.unlink(tempPath).catch(() => {})
          console.error('[api/img] Atomic cache write failed:', writeErr)
        }

        return outputBuffer
      } finally {
        inflightTransformations.delete(hashKey)
      }
    })()

    inflightTransformations.set(hashKey, transformPromise)
  }

  try {
    const outputBuffer = await transformPromise
    setStandardHeaders()
    return outputBuffer
  } catch (err: any) {
    console.error('[api/img] Error processing image:', src, err?.message || err)
    throw createError({
      statusCode: err.statusCode || 404,
      statusMessage: `Could not process image: ${err?.message || 'Unknown error'}`
    })
  }
})
