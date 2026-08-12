// POST /api/admin/events — create or update a custom event (admin only)

import { createError } from '#imports'
import { saveCustomEvent } from '~/server/utils/raSyncEngine'

export default defineEventHandler(async (event) => {
  // Authorization check (bypasses in dev placeholder mode)
  try {
    const config = useRuntimeConfig()
    const url = config.public?.supabaseUrl as string
    if (url && !url.includes('placeholder')) {
      const supabase = createServerSupabaseClient(event)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated.' })
      }
      const { data: role } = await supabase
        .from('users_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!role || role.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
      }
    }
  } catch (e: any) {
    if (e.statusCode) throw e
  }

  const body = await readBody(event)
  if (!body || !body.title || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Title and Date are required.' })
  }

  const record = saveCustomEvent({
    ra_id: body.ra_id ? Number(body.ra_id) : undefined,
    title: body.title,
    date: body.date,
    start_time: body.start_time || body.date,
    end_time: body.end_time || null,
    cost: body.cost !== undefined && body.cost !== '' ? Number(body.cost) : null,
    flyer_url: body.flyer_url || null,
    ra_url: body.ra_url || null,
    lineup: body.lineup || null,
    artists: typeof body.artists === 'string' ? body.artists.split(',').map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(body.artists) ? body.artists : []),
    genres: typeof body.genres === 'string' ? body.genres.split(',').map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(body.genres) ? body.genres : []),
    pretix_event_url: body.pretix_event_url || null,
    ticket_provider: body.ticket_provider || (Number(body.cost) === 0 ? 'free' : 'ra'),
    ticket_url: body.ticket_url || body.ra_url || body.pretix_event_url || null
  })

  return { ok: true, event: record }
})
