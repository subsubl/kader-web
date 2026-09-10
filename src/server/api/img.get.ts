import { defineEventHandler, getQuery, createError, setHeader, setResponseStatus } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

const CACHE_DIR = path.resolve(process.cwd(), '.data/img-cache')

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const src = (query.src as string || '').trim()

  if (!src) {
    throw createError({ statusCode: 400, statusMessage: 'Image src parameter is required' })
  }

  const width = Math.min(Math.max(parseInt(query.w as string || '800', 10), 50), 3840)
  const quality = Math.min(Math.max(parseInt(query.q as string || '80', 10), 10), 100)
  const format = (query.format as string || 'webp').toLowerCase()

  const validFormats = ['webp', 'jpeg', 'jpg', 'png', 'avif']
  const targetFormat = validFormats.includes(format) ? (format === 'jpg' ? 'jpeg' : format) : 'webp'

  // Hashing for cache key
  const hashKey = crypto.createHash('md5').update(`${src}_w${width}_q${quality}_f${targetFormat}`).digest('hex')
  const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat
  const cachedFilePath = path.join(CACHE_DIR, `${hashKey}.${ext}`)

  // Set caching headers
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'Content-Type', `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`)

  // Return cached file if exists
  if (fs.existsSync(cachedFilePath)) {
    return fs.readFileSync(cachedFilePath)
  }

  try {
    let inputBuffer: Buffer

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
    } else {
      // Clean local path & prevent directory traversal attacks
      let cleanPath = src.startsWith('/') ? src.slice(1) : src

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

      // If cleanPath starts with "images/", also try without "images/"
      if (cleanPath.startsWith('images/')) {
        const stripImages = cleanPath.slice(7)
        searchPaths.push(
          path.resolve(process.cwd(), 'src/public', stripImages),
          path.resolve(process.cwd(), 'public', stripImages),
          path.resolve(process.cwd(), '.output/public', stripImages)
        )
      }

      let localPath = searchPaths.find(p => {
        // Ensure resolved path stays inside one of the allowed base directories
        const isWithinBase = allowedBases.some(base => p.startsWith(base))
        return isWithinBase && fs.existsSync(p)
      })

      if (!localPath) {
        throw new Error(`File not found: ${cleanPath}`)
      }

      inputBuffer = fs.readFileSync(localPath)
    }

    // Transform with Sharp
    let pipeline = sharp(inputBuffer).resize({
      width,
      withoutEnlargement: true,
      fit: 'inside'
    })

    if (targetFormat === 'webp') {
      pipeline = pipeline.webp({ quality })
    } else if (targetFormat === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive: true })
    } else if (targetFormat === 'png') {
      pipeline = pipeline.png({ quality })
    } else if (targetFormat === 'avif') {
      pipeline = pipeline.avif({ quality })
    }

    const outputBuffer = await pipeline.toBuffer()

    // Write to cache asynchronously
    fs.writeFile(cachedFilePath, outputBuffer, (err) => {
      if (err) console.error('[img-cache] Error writing cache:', err)
    })

    return outputBuffer
  } catch (err: any) {
    console.error('[api/img] Error processing image:', src, err.message)
    throw createError({
      statusCode: 404,
      statusMessage: `Could not process image: ${err.message}`
    })
  }
})
