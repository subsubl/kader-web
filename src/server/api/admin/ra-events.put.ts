// PUT /api/admin/ra-events — set a synced RA event's pretix_event_url (admin only)
// Self-authorizes (session + admin role). Used by /admin/rae to map events to ticket widgets.
// Dual persistence: updates local .data/ra_events_store.json and Supabase database.

import { createError, defineEventHandler, readBody } from 'h3'
import { updateRaEventPretix } from '~/server/utils/raSyncEngine'
import { invalidateCache } from '~/server/utils/cache'
import { createServerSupabaseClient, getAdminSupabase } from '~/server/utils/supabase'

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

  // --- Authorization: valid session + admin role (bypassed in dev placeholder mode) ---
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

  // --- Dual Persistence Step 1: Update local .data/ra_events_store.json ---
  const updatedLocal = await updateRaEventPretix(ra_id, pretix_event_url || null)

  // --- Dual Persistence Step 2: Update Supabase if configured ---
  try {
    const config = useRuntimeConfig()
    const url = config.public?.supabaseUrl as string
    if (url && !url.includes('placeholder')) {
      const admin = getAdminSupabase()
      const { error } = await admin
        .from('ra_events')
        .update({ pretix_event_url: pretix_event_url || null, updated_at: new Date().toISOString() })
        .eq('ra_id', ra_id)

      if (error) {
        console.error('[api] ra-event Supabase update failed:', error.message)
      }
    }
  } catch (err: any) {
    console.error('[api] Supabase sync optional hop failed:', err?.message || err)
  }

  // Invalidate public RA events cache
  invalidateCache('ra-events')

  return { ok: true, ra_id, pretix_event_url: pretix_event_url || null }
})