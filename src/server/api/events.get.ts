// GET /api/events — public, returns published upcoming events
// Reads via admin client (service role). Resilient caching with graceful fallback on database errors.
// Localized cache key: events:${locale}

import { defineEventHandler } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { handleCachedJsonRequest } from '../utils/cache'
import { resolveApiLocale } from '../utils/locale'

export default defineEventHandler(async (event) => {
  const locale = resolveApiLocale(event)

  return handleCachedJsonRequest(event, {
    key: `events:${locale}`,
    maxAge: 60,
    staleWhileRevalidate: 300,
    fetcher: async () => {
      const supabase = getAdminSupabase()
      const { data, error } = await supabase
        .from('events')
        .select('id, title, slug, date, type, description, image_url, ra_link')
        .eq('status', 'published')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) {
        throw new Error(`[api] events query error: ${error.message}`)
      }

      return data || []
    },
    // If Supabase is unconfigured, unreachable, or throwing errors:
    // Fall back to empty array rather than a 500 error!
    fallback: []
  })
})
