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
await new Promise(r => srv.listen(4329, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto('http://localhost:4329' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)

const info = await p.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) } }
  const out = { centred: [], body: [] }
  // any centred text inside main?
  document.querySelectorAll('main *').forEach(el => {
    const s = getComputedStyle(el)
    if (s.textAlign === 'center' && (el.innerText || '').trim()) out.centred.push((el.innerText || '').trim().slice(0, 30))
  })
  // body copy: sizes + widths + alignment
  document.querySelectorAll('main p').forEach(el => {
    const s = getComputedStyle(el)
    out.body.push({ size: s.fontSize, w: Math.round(el.getBoundingClientRect().width), align: s.textAlign, text: (el.innerText || '').trim().slice(0, 28) })
  })
  // hero nav
  out.nav = [...document.querySelectorAll('section nav a')].map(a => ({ t: a.innerText.trim().slice(0, 16), size: getComputedStyle(a).fontSize, align: getComputedStyle(a).textAlign, x: Math.round(a.getBoundingClientRect().x) }))
  out.logo = (() => { const i = document.querySelector('main img'); return i ? { ...box(i), file: (i.currentSrc || i.src).split('/').pop() } : null })()
  out.headerImgs = document.querySelectorAll('header img').length
  out.bands = document.querySelectorAll('.parallax-band').length
  return out
})

console.log('HEADER <img> COUNT  :', info.headerImgs, '(expect 0 — logo removed)')
console.log('HERO LOGO           :', JSON.stringify(info.logo))
console.log('HERO NAV (right-aligned, 40px like the reference):')
info.nav.forEach(n => console.log(`   x=${String(n.x).padStart(4)} ${n.size.padStart(6)} align=${n.align.padEnd(6)} "${n.t}"`))
console.log('\nBODY COPY (reference: 22px, narrow ~430px, left/justify):')
info.body.slice(0, 10).forEach(x => console.log(`   ${x.size.padStart(6)} w=${String(x.w).padStart(4)} ${x.align.padEnd(7)} "${x.text}"`))
console.log('\nPARALLAX BANDS       :', info.bands)
console.log('CENTRED TEXT IN MAIN:', info.centred.length ? info.centred : 'none  <-- matches the reference')
console.log('ERRORS              :', errs.length ? errs : 'none')

await p.screenshot({ path: '/tmp/v5_hero.png' })
await p.screenshot({ path: '/tmp/v5_full.png', fullPage: true })
await b.close(); srv.close()