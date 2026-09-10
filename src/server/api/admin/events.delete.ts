// DELETE /api/admin/events — delete a custom event (admin only)

import { createError, defineEventHandler, getQuery } from 'h3'
import { deleteCustomEvent } from '~/server/utils/raSyncEngine'
import { invalidateCache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required.' })
  }

  const success = deleteCustomEvent(id)
  if (success) {
    invalidateCache('events')
    invalidateCache('ra-events')
  }

  return { ok: success }
})
