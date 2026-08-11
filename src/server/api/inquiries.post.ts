// POST /api/inquiries — public buyout/venue inquiry submission
// Uses the service-role client (bypasses staff-only RLS) to persist verified inquiries.

import { useRuntimeConfig, createError } from '#imports'
import type { Database } from '../../types/database'

// Allowed inquiry types (map from the public form's eventType values)
const TYPE_MAP: Record<string, string> = {
  wedding: 'private',
  corporate: 'corporate',
  'private-party': 'private',
  cultural: 'private',
  other: 'buyout'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body.' })
  }

  const errors: Record<string, string> = {}

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const eventType = String(body.eventType || '').trim()
  const guests = Number(body.guests)
  const preferredDate = String(body.date || '').trim() || String(body.preferredDate || '').trim()
  const message = String(body.message || '').trim()

  // --- Server-side validation (authoritative; mirrors client) ---
  if (name.length < 2) errors.name = 'Please enter your full name.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.'
  if (!phone || phone.replace(/\D/g, '').length < 6) errors.phone = 'Please enter a valid phone number.'
  if (!eventType || !TYPE_MAP[eventType]) errors.eventType = 'Please select an event type.'
  if (!Number.isFinite(guests) || guests < 1 || guests > 500) errors.guests = 'Please enter a guest count between 1 and 500.'
  if (!preferredDate || Number.isNaN(Date.parse(preferredDate))) {
    errors.preferredDate = 'Please choose a valid date.'
  } else if (new Date(preferredDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
    errors.preferredDate = 'The preferred date must be in the future.'
  }

  if (Object.keys(errors).length > 0) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed.', data: { errors } })
  }

  // Persist via service role (public visitors cannot write through RLS)
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name,
      email,
      type: TYPE_MAP[eventType],
      party_size: guests,
      date: new Date(preferredDate).toISOString(),
      notes: [message, phone ? `Phone: ${phone}` : ''].filter(Boolean).join('\n')
    })
    .select('id')
    .single()

  if (error) {
    console.error('[api] inquiry insert failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not save your inquiry. Please try again.' })
  }

  return { ok: true, id: data.id }
})
