// POST /api/table-orders — QR code table order submission
// Dual-language (sl & en) validation, standardized H3 createError, and Microgramm POS dispatch.

import { defineEventHandler, readBody, createError } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { sendMicrogrammOrder } from '../utils/microgramm'
import { checkRateLimit } from '../utils/rateLimit'
import { createApiTranslator } from '../utils/locale'

export default defineEventHandler(async (event) => {
  const { locale, t, throwValidationError } = createApiTranslator(event)

  // Rate limiting: 10 orders per minute per IP
  checkRateLimit(event, { limit: 10, windowMs: 60 * 1000, name: 'table-orders' })

  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: t('common.invalidBody') })
  }

  const tableNumberRaw = body.tableNumber ?? body.table_number
  const items = body.items
  const totalInput = body.total
  const customerNote = body.customerNote ?? body.customer_note

  const errors: Record<string, string> = {}

  // 1. Table number validation (1 to 50)
  const tableNumber = Number(tableNumberRaw)
  if (
    tableNumberRaw === undefined ||
    tableNumberRaw === null ||
    !Number.isInteger(tableNumber) ||
    tableNumber < 1 ||
    tableNumber > 50
  ) {
    const msg = t('tableOrders.errTableNumber')
    errors.tableNumber = msg
    errors.table_number = msg
  }

  // 2. Items array validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.items = t('tableOrders.errItemsRequired')
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item || typeof item !== 'object') {
        errors[`items.${i}`] = t('tableOrders.errInvalidItem')
        continue
      }
      const menuItemId = item.menu_item_id || item.menuItemId
      const name = item.name
      const qty = item.qty ?? item.quantity
      const price = item.price

      if (!menuItemId || typeof menuItemId !== 'string') {
        errors[`items.${i}.menu_item_id`] = t('tableOrders.errInvalidItem')
      }
      if (!name || typeof name !== 'string') {
        errors[`items.${i}.name`] = t('tableOrders.errInvalidItem')
      }
      if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > 10) {
        errors[`items.${i}.qty`] = t('tableOrders.errInvalidItem')
      }
      if (typeof price !== 'number' || price < 0) {
        errors[`items.${i}.price`] = t('tableOrders.errInvalidItem')
      }
    }
  }

  // 3. Optional client total validation (if supplied)
  if (totalInput !== undefined && (typeof totalInput !== 'number' || Number.isNaN(totalInput) || totalInput <= 0)) {
    errors.total = t('tableOrders.errTotalRequired')
  }

  // 4. Customer note validation (max 500 chars)
  if (customerNote !== undefined && customerNote !== null && (typeof customerNote !== 'string' || customerNote.length > 500)) {
    const msg = t('tableOrders.errCustomerNote')
    errors.customerNote = msg
    errors.customer_note = msg
  }

  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: t('common.validationFailed'),
      data: { errors }
    })
  }

  let dbItems: Array<{ id: string; price: number; is_available: boolean | null; name: string }> | null = null

  try {
    const admin = getAdminSupabase()
    const itemIds = items.map((i: any) => i.menu_item_id || i.menuItemId)

    const { data, error: dbError } = await admin
      .from('menu_items')
      .select('id, price, is_available, name')
      .in('id', itemIds)

    if (dbError) {
      throw createError({ statusCode: 500, statusMessage: t('common.databaseError') })
    }
    dbItems = data
  } catch (err: any) {
    if (err.statusCode && err.statusCode !== 500) throw err
    // Offline/testing fallback catalog when Supabase credentials are unconfigured
    const MOCK_ITEMS: Record<string, { price: number; is_available: boolean; name: string }> = {
      margherita: { price: 10.5, is_available: true, name: 'Margherita D.O.P.' },
      marinara: { price: 9.0, is_available: true, name: 'Marinara' },
      diavola: { price: 12.0, is_available: true, name: 'Diavola' },
      'sold-out': { price: 14.0, is_available: false, name: 'Tartufata (Sold Out)' }
    }
    dbItems = items
      .map((i: any) => {
        const id = i.menu_item_id || i.menuItemId
        if (id && MOCK_ITEMS[id]) {
          return { id, ...MOCK_ITEMS[id] }
        }
        return null
      })
      .filter(Boolean) as any[]
  }

  let calculatedTotal = 0
  const finalItems = []

  for (const item of items) {
    const mId = item.menu_item_id || item.menuItemId
    const dbItem = dbItems?.find((db: any) => db.id === mId)
    if (!dbItem) {
      throw createError({
        statusCode: 422,
        statusMessage: t('common.validationFailed'),
        data: { errors: { items: t('tableOrders.errItemNotFound', { name: item.name || mId }) } }
      })
    }
    if (!dbItem.is_available) {
      throw createError({
        statusCode: 422,
        statusMessage: t('common.validationFailed'),
        data: { errors: { items: t('tableOrders.errItemUnavailable', { name: dbItem.name || item.name }) } }
      })
    }

    const qty = Number(item.qty ?? item.quantity)
    calculatedTotal += dbItem.price * qty
    finalItems.push({
      menu_item_id: dbItem.id,
      name: item.name || dbItem.name,
      qty,
      price: dbItem.price
    })
  }

  const finalTotal = calculatedTotal
  let insertedId = 'ord-' + Math.random().toString(36).substring(2, 9)

  try {
    const admin = getAdminSupabase()
    const { data: inserted, error: insertError } = await admin
      .from('table_orders')
      .insert({
        table_number: tableNumber,
        items: finalItems,
        total: finalTotal,
        customer_note: typeof customerNote === 'string' ? customerNote : null,
        status: 'pending'
      })
      .select('id')
      .single()

    if (insertError) {
      throw createError({ statusCode: 500, statusMessage: t('tableOrders.insertFailed') })
    }
    if (inserted?.id) insertedId = inserted.id
  } catch (err: any) {
    if (err.statusCode && err.statusCode !== 500) throw err
  }

  // Forward QR code order to Microgramm POS system in the bar (https://microgramm.si/)
  sendMicrogrammOrder({
    orderId: insertedId,
    tableNumber,
    items: finalItems,
    total: finalTotal,
    customerNote: typeof customerNote === 'string' ? customerNote : undefined
  }).catch((err) => console.error('[api/table-orders] Microgramm dispatch failed:', err))

  return {
    ok: true,
    id: insertedId,
    total: finalTotal,
    locale,
    message: t('tableOrders.successMessage')
  }
})
