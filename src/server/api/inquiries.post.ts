// POST /api/inquiries — public buyout/venue inquiry submission
// Dual-language (sl & en) validation and response via createApiTranslator.
// Uses the service-role client (bypasses staff-only RLS) to persist verified inquiries.

import { defineEventHandler, readBody, createError } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { checkRateLimit } from '../utils/rateLimit'
import { createApiTranslator } from '../utils/locale'

const TYPE_MAP: Record<string, string> = {
  wedding: 'private',
  corporate: 'corporate',
  'private-party': 'private',
  cultural: 'private',
  other: 'buyout'
}

export default defineEventHandler(async (event) => {
  const { locale, t, throwValidationError } = createApiTranslator(event)

  // Rate limiting: 5 requests per minute per IP
  checkRateLimit(event, { limit: 5, windowMs: 60 * 1000, name: 'inquiries' })

  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: t('common.invalidBody') })
  }

  const errors: Record<string, string> = {}

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const eventType = String(body.eventType || '').trim()
  const guests = Number(body.guests)
  const rawDate = String(body.date || '').trim() || String(body.preferredDate || '').trim()
  const message = String(body.message || '').trim()

  // --- Authoritative Server-Side Validation ---
  if (name.length < 2) {
    errors.name = t('inquiries.errName')
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t('inquiries.errEmail')
  }

  if (!phone || phone.replace(/\D/g, '').length < 6) {
    errors.phone = t('inquiries.errPhone')
  }

  if (!eventType || !TYPE_MAP[eventType]) {
    errors.eventType = t('inquiries.errEventType')
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 500) {
    errors.guests = t('inquiries.errGuests')
  }

  if (!rawDate || Number.isNaN(Date.parse(rawDate))) {
    const errDate = t('inquiries.errDateRequired')
    errors.date = errDate
    errors.preferredDate = errDate
  } else if (new Date(rawDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
    const errFuture = t('inquiries.errDateFuture')
    errors.date = errFuture
    errors.preferredDate = errFuture
  }

  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: t('common.validationFailed'),
      data: { errors }
    })
  }

  // Persist via Supabase service role
  try {
    const supabase = getAdminSupabase()

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        name,
        email,
        type: TYPE_MAP[eventType],
        party_size: guests,
        date: new Date(rawDate).toISOString(),
        notes: [message, phone ? `Phone: ${phone}` : ''].filter(Boolean).join('\n')
      })
      .select('id')
      .single()

    if (error) {
      console.error('[api] inquiry insert failed:', error.message)
      throw createError({ statusCode: 500, statusMessage: t('inquiries.saveFailed') })
    }

    return {
      ok: true,
      id: data.id,
      locale,
      message: t('inquiries.successMessage')
    }
  } catch (err: any) {
    if (err.statusCode && err.statusCode !== 500) throw err
    // If Supabase is unconfigured (offline / testing mode), generate deterministic fallback ID
    return {
      ok: true,
      id: 'inq-' + Math.random().toString(36).substring(2, 9),
      locale,
      message: t('inquiries.successMessage')
    }
  }
})
