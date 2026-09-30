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
await new Promise(r => srv.listen(4332, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto('http://localhost:4332' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)

const info = await p.evaluate(() => {
  const header = document.querySelector('header')
  const sel = document.querySelector('select')
  const sr = sel ? sel.getBoundingClientRect() : null
  // does the picker overlap any hero content?
  const overlaps = []
  if (sr) {
    document.querySelectorAll('main p, main a, main img, main h2').forEach(el => {
      const r = el.getBoundingClientRect()
      const hit = !(r.right < sr.left || r.left > sr.right || r.bottom < sr.top || r.top > sr.bottom)
      if (hit) overlaps.push((el.innerText || el.tagName).trim().slice(0, 34))
    })
  }
  return {
    headerElement: !!header,
    picker: sr ? { x: Math.round(sr.x), y: Math.round(sr.y), w: Math.round(sr.width), h: Math.round(sr.height) } : null,
    position: sel ? getComputedStyle(sel.parentElement.parentElement.parentElement).position : null,
    overlaps,
    bodyStartsAt: Math.round(document.querySelector('main').getBoundingClientRect().top),
    logosBeforeMain: document.querySelectorAll('body > * img, header img').length
  }
})

console.log('HEADER ELEMENT     :', info.headerElement, '(expect false)')
console.log('PICKER POSITION    :', info.position)
console.log('PICKER BOX         :', JSON.stringify(info.picker), '(top-right corner)')
console.log('MAIN STARTS AT Y   :', info.bodyStartsAt, '(content no longer pushed down by a bar)')
console.log('OVERLAPS CONTENT   :', info.overlaps.length ? JSON.stringify(info.overlaps) : 'none')
console.log('ERRORS             :', errs.length ? errs : 'none')

// switch language to confirm the picker still works
await p.selectOption('select', 'en')
await p.waitForTimeout(800)
const after = await p.evaluate(() => document.body.innerText.includes('Pizza bistro and dance bar at Kodeljevo Castle'))
console.log('LANG SWITCH WORKS  :', after)
await p.selectOption('select', 'sl')
await p.waitForTimeout(600)

await p.screenshot({ path: '/tmp/v10_top.png' })
await p.screenshot({ path: '/tmp/v10_full.png', fullPage: true })
await b.close(); srv.close()