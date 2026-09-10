import { defineEventHandler, readBody, createError } from 'h3'
import path from 'node:path'
import { readJson, atomicWriteJson } from '~/server/utils/fileStore'
import { invalidateCache } from '~/server/utils/cache'

const CONFIG_FILE = path.resolve(process.cwd(), '.data/site_images.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  const current = await readJson<Record<string, any>>(CONFIG_FILE, {})
  const updated = { ...current, ...body, updated_at: new Date().toISOString() }

  await atomicWriteJson(CONFIG_FILE, updated)
  invalidateCache('site-images')

  return { ok: true, config: updated }
})
