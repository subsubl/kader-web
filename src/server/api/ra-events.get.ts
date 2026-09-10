// GET /api/ra-events — public, returns Resident Advisor events.
// Uses local persistent sync engine (caches flyers, lineup, artists, genres, cost, dates)
// High-performance API caching with ETag and RFC 7232 304 conditional support.

import { defineEventHandler, getQuery } from 'h3'
import { getSyncedRaEvents } from '~/server/utils/raSyncEngine'
import { handleCachedJsonRequest } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scope = String(query.scope || 'upcoming')

  return handleCachedJsonRequest(event, {
    key: `ra-events:${scope}`,
    maxAge: 120,
    staleWhileRevalidate: 600,
    fetcher: async () => {
      return await getSyncedRaEvents(scope)
    },
    fallback: []
  })
})