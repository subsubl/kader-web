import { readBody, setResponseStatus } from 'h3'
import { getAdminSupabase } from '../utils/supabase'
import { sendMicrogrammOrder } from '../utils/microgramm'

export default defineEventHandler(async (event) => {
  // Rate limiting: 10 orders per minute per IP
  checkRateLimit(event, { limit: 10, windowMs: 60 * 1000, name: 'table-orders' })

  const body = await readBody(event)
  const { table_number, items, customer_note } = body || {}
  
  const errors: Record<string, string> = {}
  
  if (table_number === undefined || typeof table_number !== 'number' || table_number < 1 || table_number > 50) {
    errors.table_number = 'Table number must be an integer between 1 and 50'
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.items = 'Items array is required and must not be empty'
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.menu_item_id || typeof item.menu_item_id !== 'string') errors[`items.${i}.menu_item_id`] = 'Invalid menu_item_id'
      if (!item.name || typeof item.name !== 'string') errors[`items.${i}.name`] = 'Invalid name'
      if (typeof item.qty !== 'number' || item.qty < 1 || item.qty > 10) errors[`items.${i}.qty`] = 'Quantity must be between 1 and 10'
      if (typeof item.price !== 'number') errors[`items.${i}.price`] = 'Price must be a number'
    }
  }
  
  if (customer_note !== undefined && (typeof customer_note !== 'string' || customer_note.length > 500)) {
    errors.customer_note = 'Customer note must be a string up to 500 characters'
  }

  if (Object.keys(errors).length > 0) {
    setResponseStatus(event, 422)
    return { errors }
  }

  const admin = getAdminSupabase()
  
  const itemIds = items.map((i: any) => i.menu_item_id)
  const { data: dbItems, error: dbError } = await admin
    .from('menu_items')
    .select('id, price, is_available')
    .in('id', itemIds)
    
  if (dbError) {
    setResponseStatus(event, 500)
    return { errors: { server: 'Database error' } }
  }
  
  let total = 0
  const finalItems = []
  
  for (const item of items) {
    const dbItem = dbItems?.find((db: any) => db.id === item.menu_item_id)
    if (!dbItem) {
      setResponseStatus(event, 422)
      return { errors: { items: `Item not found in database: ${item.name}` } }
    }
    if (!dbItem.is_available) {
      setResponseStatus(event, 422)
      return { errors: { items: `Item currently unavailable: ${item.name}` } }
    }
    
    total += dbItem.price * item.qty
    finalItems.push({
      menu_item_id: item.menu_item_id,
      name: item.name,
      qty: item.qty,
      price: dbItem.price
    })
  }
  
  const { data: inserted, error: insertError } = await admin
    .from('table_orders')
    .insert({
      table_number,
      items: finalItems,
      total,
      customer_note: customer_note || null,
      status: 'pending'
    })
    .select('id')
    .single()
    
  if (insertError) {
    setResponseStatus(event, 500)
    return { errors: { server: 'Failed to insert order' } }
  }
  
  // Forward QR code order to Microgramm POS system in the bar (https://microgramm.si/)
  sendMicrogrammOrder({
    orderId: inserted.id,
    tableNumber: table_number,
    items: finalItems,
    total,
    customerNote: customer_note
  }).catch((err) => console.error('[api/table-orders] Microgramm dispatch failed:', err))
  
  return { ok: true, id: inserted.id, total }
})
