import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  // Prevent MIME type sniffing
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking / framing in external IFrames
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')

  // Control referrer information sent with requests
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // Restrict browser feature access
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
})
