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
await new Promise(r => srv.listen(4331, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto('http://localhost:4331' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)

const info = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('.clipart').forEach(el => {
    const svg = el.querySelector('svg')
    const cs = getComputedStyle(el)
    const ss = svg ? getComputedStyle(svg) : null
    const r = el.getBoundingClientRect()
    out.push({
      size: Math.round(r.width) + 'x' + Math.round(r.height),
      color: cs.color,
      opacity: cs.opacity,
      stroke: ss ? ss.stroke : null,
      paths: svg ? svg.querySelectorAll('path').length : 0,
      visible: r.width > 0 && r.height > 0 && parseFloat(cs.opacity) > 0.01
    })
  })
  return {
    clips: out,
    total: document.querySelectorAll('.clipart').length,
    // divider chevrons (ArrowDivider renders its own svg, not via Clipart)
    chevrons: document.querySelectorAll('svg rect[width="1440"]').length
  }
})

console.log('CLIPART NODES :', info.total, '| divider bands:', info.chevrons)
info.clips.forEach((c, i) => console.log(`  ${String(i).padStart(2)} ${c.size.padEnd(10)} color=${c.color} opacity=${c.opacity} stroke=${c.stroke} paths=${c.paths} visible=${c.visible}`))
const nonWhite = info.clips.filter(c => c.color !== 'rgb(255, 255, 255)')
console.log('NON-WHITE    :', nonWhite.length ? JSON.stringify(nonWhite) : 'none  <-- all clipart is white')
const shapes = await p.evaluate(() => [...document.querySelectorAll('.clipart svg path')].length)
console.log('TOTAL PATHS   :', shapes)
console.log('ERRORS        :', errs.length ? errs : 'none')

await p.screenshot({ path: '/tmp/v9_hero.png' })
await p.screenshot({ path: '/tmp/v9_full.png', fullPage: true })
await b.close(); srv.close()