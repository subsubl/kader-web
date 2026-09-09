// Server-side Telegram Bot API integration for staff alerts
// Sends operational notifications to a configured Telegram group chat.
// No-ops gracefully if token/chatId are not configured (dev mode).

import { useRuntimeConfig } from '#imports'

const TELEGRAM_API = 'https://api.telegram.org'

export async function sendTelegramAlert(
  message: string,
  opts?: { silent?: boolean }
): Promise<boolean> {
  const config = useRuntimeConfig()
  const token = config.telegramBotToken as string
  const chatId = config.telegramChatId as string

  if (!token || !chatId) {
    // Not configured — silently skip in dev/local
    return false
  }

  try {
    const url = `${TELEGRAM_API}/bot${token}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_notification: opts?.silent ?? false
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[telegram] Failed to send alert:', res.status, err)
      return false
    }

    return true
  } catch (err) {
    console.error('[telegram] Network error sending alert:', err)
    return false
  }
}

// Pre-formatted alert helpers with venue emoji vocabulary
export const telegramAlerts = {
  newKitchenOrder: (tableNum: number, itemSummary: string, total: number) =>
    sendTelegramAlert(
      `🍕 <b>New Kitchen Order — Table ${tableNum}</b>\n${itemSummary}\n💰 Total: <b>€${total.toFixed(2)}</b>`
    ),

  newInquiry: (name: string, type: string, guests: number, date: string) =>
    sendTelegramAlert(
      `📋 <b>New Buyout Inquiry</b>\nFrom: ${name}\nType: ${type} · ${guests} guests\nDate: ${date}`
    ),

  pretixOrderPaid: (code: string, total: number) =>
    sendTelegramAlert(
      `🎫 <b>Pretix Order Paid</b>\nCode: <code>${code}</code>\nAmount: <b>€${total.toFixed(2)}</b>`,
      { silent: true }
    ),

  capacityWarning: (current: number, max: number) =>
    sendTelegramAlert(
      `🚪 <b>Capacity Warning</b>\nVenue at <b>${current}/${max}</b> (${Math.round((current / max) * 100)}%)`
    ),

  blacklistAlert: (guestName: string) =>
    sendTelegramAlert(
      `⚠️ <b>Blacklist Alert</b>\nGuest "<b>${guestName}</b>" flagged at door check-in.`
    ),

  customAlert: (message: string) =>
    sendTelegramAlert(`📢 ${message}`)
}
