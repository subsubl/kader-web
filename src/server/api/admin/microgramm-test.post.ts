// POST /api/admin/microgramm-test — send test payload to Microgramm POS system (admin only)

import { createError } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'
import { sendMicrogrammOrder } from '../../utils/microgramm'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleRow?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Send a test order to Microgramm
  const result = await sendMicrogrammOrder({
    orderId: `TEST-${Date.now()}`,
    tableNumber: 99,
    items: [
      { name: 'Kadeljevo Test Pizzeria Slice', qty: 1, price: 4.50 },
      { name: 'Craft IPA 0.5L', qty: 1, price: 3.80 },
    ],
    total: 8.30,
    customerNote: 'Test order from Kader Admin Settings',
  })

  return {
    ok: result.ok,
    message: result.message,
  }
})
