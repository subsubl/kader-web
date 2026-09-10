import { defineEventHandler, readRawBody, getHeader, createError } from 'h3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Database, Json } from '../../../types/database'
import { invalidateCache } from '../../utils/cache'

// ── Typed Supabase server client (service role — bypasses RLS for writes) ──
function getSupabase(): SupabaseClient<Database> {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.supabaseServiceKey as string
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

// ── Pretix webhook signature (HMAC-SHA256 of the raw body) ──
function verifySignature(signature: string | undefined, rawBody: string): boolean {
  const secret = (useRuntimeConfig().pretixWebhookSecret as string) || ''
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// ── Types ──
interface PretixOrderPosition {
  id: number
  positionid?: number
  item: number
  count: number
  attendee_name?: string | null
  checkins?: Array<{ type?: number; datetime?: string; from_desired_date?: boolean }>
}

interface PretixWebhook {
  event?: string
  notification_id?: string
  organizer?: string
  event_slug?: string
  order?: {
    code: string
    status?: 'p' | 'c' | 'r' | 'n' | 'e'
    email?: string
    total?: string
    positions?: PretixOrderPosition[]
  }
  checkin?: {
    positionid?: number
    list?: number
    datetime?: string
    type?: 'entry' | 'exit'
    from_desired_date?: boolean
  }
  position?: PretixOrderPosition
  voucher?: { code?: string; value?: number; avail?: number }
}

const STATUS_MAP: Record<string, string> = {
  p: 'paid',
  c: 'cancelled',
  r: 'refunded',
  n: 'pending',
  e: 'expired'
}

// ── Router ──
export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event)) ?? ''
  const message = getHeader(event, 'x-pretix-message-hmac-sha256')
  if (!rawBody || !verifySignature(message, rawBody)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Pretix signature' })
  }

  const body: PretixWebhook = JSON.parse(rawBody)
  const supabase = getSupabase()

  try {
    switch (body.event) {
      case 'pretix.event.order.paid':
        await syncOrder(supabase, body)
        break
      case 'pretix.event.order.canceled':
        await updateOrderStatus(supabase, body, 'cancelled')
        break
      case 'pretix.event.order.refunded':
        await updateOrderStatus(supabase, body, 'refunded')
        break
      case 'pretix.event.checkin':
        await handleCheckin(supabase, body)
        break
      case 'pretix.event.order.expired':
        await updateOrderStatus(supabase, body, 'expired')
        break
      default:
        console.log(`[pretix] unhandled event: ${body.event}`)
    }
    invalidateCache('events')
    return { status: 'success' }
  } catch (err) {
    console.error('[pretix] webhook error', err)
    throw createError({ statusCode: 500, statusMessage: 'Webhook processing failed' })
  }
})

// ── Upsert an order + its ticket positions ──
async function syncOrder(supabase: SupabaseClient<Database>, body: PretixWebhook) {
  const { order } = body
  if (!order) return

  const { data: evt } = await supabase
    .from('events')
    .select('id')
    .eq('slug', body.event_slug as string)
    .maybeSingle()

  const status = STATUS_MAP[order.status || 'n'] || 'pending'
  const total = parseFloat(order.total || '0')

  const { data: saved, error: upsertErr } = await supabase
    .from('pretix_orders')
    .upsert({
      order_code: order.code,
      event_id: evt?.id ?? null,
      status,
      email: order.email,
      total,
      raw_payload: order as unknown as Json,
      paid_at: status === 'paid' ? new Date().toISOString() : null
    }, { onConflict: 'order_code' })
    .select('id')
    .single()
  if (upsertErr) throw upsertErr

  const orderId = saved.id
  // Upsert each ticket position (check-inable person)
  const rows = (order.positions ?? []).map((pos: PretixOrderPosition, i: number) => ({
    order_id: orderId,
    event_id: evt?.id ?? null,
    position_id: String(pos.positionid ?? pos.id ?? i),
    name: pos.attendee_name ?? null
  }))
  if (rows.length) {
    const { error: tickErr } = await supabase
      .from('pretix_tickets')
      .upsert(rows, { onConflict: 'position_id' })
    if (tickErr) throw tickErr
  }
  console.log(`[pretix] synced order ${order.code} (${status}) with ${rows.length} tickets`)

  // Log status update
  if (status === 'paid') {
    console.log(`[pretix] Order ${order.code} paid total €${total}`)
  }
}

async function updateOrderStatus(supabase: SupabaseClient<Database>, body: PretixWebhook, status: string) {
  const code = body.order?.code
  if (!code) return
  const { error } = await supabase
    .from('pretix_orders')
    .update({ status })
    .eq('order_code', code)
  if (error) throw error
  console.log(`[pretix] order ${code} → ${status}`)
}

// ── Check-in / exit from the pretixPOS door scanner ──
async function handleCheckin(supabase: SupabaseClient<Database>, body: PretixWebhook) {
  const posId = String(body.checkin?.positionid)
  if (!posId) return

  const { data: ticket } = await supabase
    .from('pretix_tickets')
    .select('id')
    .eq('position_id', posId)
    .maybeSingle()
  if (!ticket) {
    console.warn(`[pretix] check-in for unknown position ${posId}; awaiting order sync`)
    return
  }

  const checkingIn = body.checkin?.type === 'entry'
  const { error } = await supabase
    .from('pretix_tickets')
    .update({
      checkin_status: checkingIn ? 'checked_in' : 'unchecked',
      checked_in_at: checkingIn ? new Date().toISOString() : null
    })
    .eq('id', ticket.id)
  if (error) throw error
  console.log(`[pretix] position ${posId} ${checkingIn ? 'checked in' : 'exited'}`)
}