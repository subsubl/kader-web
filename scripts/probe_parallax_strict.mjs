import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.output/public')
const BASE = process.env.NUXT_APP_BASE_URL || '/'
const BASE_DIR = BASE.replace(/\/$/, '')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2' }
const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (BASE_DIR && p.startsWith(BASE_DIR)) p = p.slice(BASE_DIR.length) || '/'
  let f = path.join(ROOT, p)
  if (!existsSync(f) || statSync(f).isDirectory()) {
    if (/\.(js|css|jpg|png|svg|ico|webp|json|woff2?|ttf)$/i.test(p)) { res.writeHead(404); res.end('nf'); return }
    f = path.join(ROOT, 'index.html')
  }
  try { const b = await readFile(f); res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b) }
  catch { res.writeHead(404); res.end('x') }
})
await new Promise(r => srv.listen(4328, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4328' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)

// Walk the whole page slowly, checking coverage at every step.
const gaps = []
let maxTravel = 0
for (let y = 0; y <= 4200; y += 150) {
  await p.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await p.waitForTimeout(160)
  const r = await p.evaluate(() => {
    const out = []
    document.querySelectorAll('.parallax-band').forEach((band, i) => {
      const inner = band.querySelector('.parallax-band__inner')
      const bb = band.getBoundingClientRect()
      const nb = inner.getBoundingClientRect()
      const travel = parseFloat(inner.style.getPropertyValue('--parallax-y') || '0')
      // only judge bands actually intersecting the viewport
      if (bb.bottom < 0 || bb.top > window.innerHeight) return
      const covers = nb.top <= bb.top + 1 && nb.bottom >= bb.bottom - 1
      out.push({ i, travel: Math.round(travel), covers, gapTop: Math.round(bb.top - nb.top), gapBottom: Math.round(nb.bottom - bb.bottom) })
    })
    return out
  })
  for (const x of r) {
    if (Math.abs(x.travel) > maxTravel) maxTravel = Math.abs(x.travel)
    if (!x.covers) gaps.push({ scrollY: y, ...x })
  }
}
console.log('MAX TRAVEL OBSERVED :', maxTravel, 'px')
console.log('OVERSIZE PER SIDE   :', Math.round(0.38 * 522), 'px (0.38 x 522)')
console.log('BANDS SHOWING A GAP :', gaps.length ? JSON.stringify(gaps.slice(0, 5)) : 'none')
console.log(maxTravel <= Math.round(0.38 * 522) + 1 ? 'PASS: travel never exceeds the oversize' : 'FAIL: travel exceeds oversize')

// reduced motion honoured?
await p.emulateMedia({ reducedMotion: 'reduce' })
await p.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }))
await p.waitForTimeout(500)
const rm = await p.evaluate(() => [...document.querySelectorAll('.parallax-band__inner')].map(i => getComputedStyle(i).transform))
console.log('UNDER prefers-reduced-motion, transforms:', rm)
await p.emulateMedia({ reducedMotion: 'no-preference' })
await b.close(); srv.close()