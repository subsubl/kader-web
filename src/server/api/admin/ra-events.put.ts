// PUT /api/admin/ra-events — set a synced RA event's pretix_event_url (admin only)
// Self-authorizes (session + admin role). Used by /admin/rae to map events to ticket widgets.

import { createError } from '#imports'

interface Body { ra_id?: unknown; pretix_event_url?: unknown }

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as Body
  const ra_id = Number(body.ra_id)
  const pretix_event_url = String(body.pretix_event_url || '').trim()

  if (!Number.isFinite(ra_id) || ra_id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Valid event id is required.' })
  }
  // Validate: allow https URL to a pretix shop, or empty (to clear)
  if (pretix_event_url && !/^https:\/\/.+/.test(pretix_event_url)) {
    throw createError({ statusCode: 422, statusMessage: 'Pretix event URL must be an https URL to the ticket shop.' })
  }

  // --- Authorization: valid session + admin role ---
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

  // --- Persist via service role ---
  const admin = getAdminSupabase()
  const { error } = await admin
    .from('ra_events')
    .update({ pretix_event_url: pretix_event_url || null, updated_at: new Date().toISOString() })
    .eq('ra_id', ra_id)

  if (error) {
    console.error('[api] ra-event update failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not update event.' })
  }

  return { ok: true, ra_id, pretix_event_url: pretix_event_url || null }
})