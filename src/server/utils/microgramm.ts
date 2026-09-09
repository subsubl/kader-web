// Microgramm POS Integration Helper (https://microgramm.si/)
// Sends table/bar QR orders directly to the Microgramm bar terminal system.

import { useRuntimeConfig } from '#imports'

export interface MicrogrammOrderItem {
  name: string
  qty: number
  price: number
}

export interface MicrogrammOrderPayload {
  orderId: string
  tableNumber: number
  items: MicrogrammOrderItem[]
  total: number
  customerNote?: string
}

export async function sendMicrogrammOrder(payload: MicrogrammOrderPayload): Promise<{ ok: boolean; message?: string }> {
  const config = useRuntimeConfig()
  const apiUrl = (config.microgrammApiUrl as string) || 'https://api.microgramm.si/v1/orders'
  const apiKey = (config.microgrammApiKey as string) || ''
  const posId = (config.microgrammPosId as string) || 'BAR-KODELJEVO-1'

  // If no API key configured in dev/test, log and gracefully return mock success
  if (!apiKey) {
    console.log(`[microgramm] Order #${payload.orderId} for Table ${payload.tableNumber} logged locally (Microgramm API key not set). Total: €${payload.total.toFixed(2)}`)
    return { ok: true, message: 'Simulated locally (NUXT_MICROGRAMM_API_KEY not configured)' }
  }

  const microgrammPayload = {
    pos_id: posId,
    order_id: payload.orderId,
    table_number: payload.tableNumber,
    timestamp: new Date().toISOString(),
    currency: 'EUR',
    total_amount: payload.total,
    customer_note: payload.customerNote || '',
    items: payload.items.map((item) => ({
      name: item.name,
      quantity: item.qty,
      unit_price: item.price,
      subtotal: item.price * item.qty,
    })),
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-POS-ID': posId,
      },
      body: JSON.stringify(microgrammPayload),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error(`[microgramm] Failed to send order #${payload.orderId}: HTTP ${response.status} ${errorText}`)
      return { ok: false, message: `Microgramm HTTP ${response.status}: ${errorText || 'Server Error'}` }
    }

    console.log(`[microgramm] Order #${payload.orderId} (Table ${payload.tableNumber}) sent successfully to Microgramm POS system.`)
    return { ok: true, message: 'Order sent successfully to Microgramm POS system.' }
  } catch (err: any) {
    console.error(`[microgramm] Network error sending order to Microgramm:`, err.message)
    return { ok: false, message: `Microgramm Connection Error: ${err.message}` }
  }
}
