// GET /api/events — public, returns published upcoming events
// Reads via admin client (service role). Public-anon reads are allowed by RLS too,
// but service role keeps this resilient regardless of RLS policy.

import { createError } from '#imports'

export default defineEventHandler(async () => {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from('events')
    .select('id, title, slug, date, type, description, image_url, ra_link')
    .eq('status', 'published')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })

  if (error) {
    console.error('[api] events fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not load events.' })
  }

  return data
})
