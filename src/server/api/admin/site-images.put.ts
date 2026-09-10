import { defineEventHandler, readBody, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const CONFIG_FILE = path.resolve(process.cwd(), '.data/site_images.json')
const DATA_DIR = path.resolve(process.cwd(), '.data')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  let current = {}
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      current = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
    } catch (e) {
      console.error('[admin/site-images] Error reading existing config:', e)
    }
  }

  const updated = { ...current, ...body, updated_at: new Date().toISOString() }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2))

  return { ok: true, config: updated }
})
