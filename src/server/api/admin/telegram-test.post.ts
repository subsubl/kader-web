// POST /api/admin/telegram-test — send a test message to verify Telegram bot config (admin only)

import { createError } from '#imports'
import { createServerSupabaseClient, getAdminSupabase } from '../../utils/supabase'
import { sendTelegramAlert } from '../../utils/telegram'

export default defineEventHandler(async (event) => {
  const client = createServerSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const admin = getAdminSupabase()
  const { data: roleRow } = await admin
    .from('users_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (!roleRow || roleRow.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const config = useRuntimeConfig()
  const hasToken = !!(config.telegramBotToken as string)
  const hasChatId = !!(config.telegramChatId as string)

  if (!hasToken || !hasChatId) {
    return {
      ok: false,
      configured: false,
      message: 'Telegram bot is not configured. Set NUXT_TELEGRAM_BOT_TOKEN and NUXT_TELEGRAM_CHAT_ID in .env.'
    }
  }

  const success = await sendTelegramAlert(
    '✅ <b>Kader Telegram Bot — Test</b>\nConnection verified. Staff alerts are active.\n\n🏰 Grad Kodeljevo Ops System'
  )

  return {
    ok: success,
    configured: true,
    message: success
      ? 'Test message sent successfully to Telegram group.'
      : 'Bot is configured but the message failed to send. Check your token and chat ID.'
  }
})
