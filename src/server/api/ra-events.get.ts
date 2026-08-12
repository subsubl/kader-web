// GET /api/ra-events — public, returns Resident Advisor events.
// Uses local persistent sync engine (caches flyers, lineup, artists, genres, cost, dates)
// Automatically checks for new events and syncs with DB.

import { getSyncedRaEvents } from '~/server/utils/raSyncEngine'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scope = String(query.scope || 'upcoming')
  return await getSyncedRaEvents(scope)
})