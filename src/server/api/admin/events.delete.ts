// DELETE /api/admin/events — delete a custom event (admin only)

import { createError } from '#imports'
import { deleteCustomEvent } from '~/server/utils/raSyncEngine'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required.' })
  }

  const success = deleteCustomEvent(id)
  return { ok: success }
})
