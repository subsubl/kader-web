import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Log the webhook payload for debugging
    console.log('Pretix Webhook Received:', JSON.stringify(body, null, 2))
    
    // Handle different event types
    switch (body.event) {
      case 'order.placed':
        await handleOrderPlaced(body)
        break
      case 'order.paid':
        await handleOrderPaid(body)
        break
      case 'order.cancelled':
        await handleOrderCancelled(body)
        break
      case 'voucher.redeemed':
        await handleVoucherRedeemed(body)
        break
      default:
        console.log(`Unhandled event type: ${body.event}`)
    }
    
    return { status: 'success' }
  } catch (error) {
    console.error('Error processing Pretix webhook:', error)
    return { status: 'error', message: 'Failed to process webhook' }
  }
})

async function handleOrderPlaced(payload: any) {
  console.log('Processing order placed:', payload.order.code)
  // Implement logic to store order in Supabase
  // Example: insert into orders table
}

async function handleOrderPaid(payload: any) {
  console.log('Processing order paid:', payload.order.code)
  // Update order status to paid
  // Send confirmation emails
}

async function handleOrderCancelled(payload: any) {
  console.log('Processing order cancelled:', payload.order.code)
  // Cancel order in system
  // Refund process if applicable
}

async function handleVoucherRedeemed(payload: any) {
  console.log('Processing voucher redeemed:', payload.voucher.code)
  // Update voucher usage count
  // Apply discount to order
}