import { H3Event, createError, getRequestHeader } from 'h3'

interface RateLimitStore {
  count: number
  resetTime: number
}

const tracker = new Map<string, RateLimitStore>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, store] of tracker.entries()) {
    if (now > store.resetTime) {
      tracker.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Applies sliding window rate limiting by client IP.
 * @param event H3Event
 * @param options { limit: max requests, windowMs: duration in ms, name: identifier }
 */
export function checkRateLimit(
  event: H3Event,
  options: { limit: number; windowMs: number; name?: string }
) {
  const req = event.node.req
  const ip =
    (getRequestHeader(event, 'x-forwarded-for') as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1'

  const prefix = options.name || 'global'
  const key = `${prefix}:${ip}`
  const now = Date.now()

  let record = tracker.get(key)

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + options.windowMs
    }
    tracker.set(key, record)
    return
  }

  record.count += 1

  if (record.count > options.limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests: Please wait before trying again.'
    })
  }
}
