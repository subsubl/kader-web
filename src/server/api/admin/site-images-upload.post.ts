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

  const ext = path.extname(fileItem.filename).toLowerCase() || '.jpg'
  const safeHash = crypto.randomBytes(8).toString('hex')
  const newFilename = `upload_${Date.now()}_${safeHash}${ext}`
  const targetPath = path.join(UPLOAD_DIR, newFilename)

  fs.writeFileSync(targetPath, fileItem.data)

  const publicUrl = `/images/uploads/${newFilename}`
  return { ok: true, url: publicUrl, filename: newFilename }
})
