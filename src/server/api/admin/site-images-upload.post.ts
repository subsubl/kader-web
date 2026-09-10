import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const UPLOAD_DIR = path.resolve(process.cwd(), 'src/public/images/uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const fileItem = formData.find(item => item.name === 'file' || item.filename)

  if (!fileItem || !fileItem.data || !fileItem.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file payload' })
  }

  // File size limit: 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  if (fileItem.data.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'File size exceeds maximum limit of 10MB' })
  }

  // Extension & MIME type whitelist
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

  const ext = path.extname(fileItem.filename).toLowerCase()
  const mimeType = (fileItem.type || '').toLowerCase()

  if (!allowedExtensions.includes(ext) || (mimeType && !allowedMimeTypes.includes(mimeType))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Allowed formats: JPG, PNG, WebP, AVIF' })
  }

  const safeHash = crypto.randomBytes(8).toString('hex')
  const newFilename = `upload_${Date.now()}_${safeHash}${ext}`
  const targetPath = path.join(UPLOAD_DIR, newFilename)

  fs.writeFileSync(targetPath, fileItem.data)

  const publicUrl = `/images/uploads/${newFilename}`
  return { ok: true, url: publicUrl, filename: newFilename }
})
