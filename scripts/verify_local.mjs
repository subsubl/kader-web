import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.output/public')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp' }

const BASE = process.env.NUXT_APP_BASE_URL || '/'
const BASE_DIR = BASE.replace(/\/$/, '')   // '' for '/', '/kader-web' otherwise

const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  // strip the deployment base prefix so files resolve from .output/public
  if (BASE_DIR && p.startsWith(BASE_DIR)) p = p.slice(BASE_DIR.length) || '/'
  let f = path.join(ROOT, p)
  if (!existsSync(f) || statSync(f).isDirectory()) {
    // SPA fallback: only for navigations, never for assets
    if (/\.(js|css|jpg|png|svg|ico|webp|json|woff2?)$/i.test(p)) { res.writeHead(404); res.end('not found'); return }
    f = path.join(ROOT, 'index.html')
  }
  try {
    const buf = await readFile(f)
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
    res.end(buf)
  } catch { res.writeHead(404); res.end('nope') }
})
await new Promise(r => srv.listen(4321, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))

await p.goto('http://localhost:4321' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.screenshot({ path: '/tmp/new_full.png', fullPage: true })
await p.screenshot({ path: '/tmp/new_fold.png' })

const info = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(el => {
    const r = el.getBoundingClientRect()
    return { file: (el.currentSrc || el.src).split('/').pop(), w: Math.round(r.width), h: Math.round(r.height), nat: el.naturalWidth + 'x' + el.naturalHeight, ok: el.naturalWidth > 0 }
  })
  return {
    bodyBg: getComputedStyle(document.body).backgroundColor,
    color: getComputedStyle(document.body).color,
    htmlClass: document.documentElement.className,
    height: document.body.scrollHeight,
    imgs
  }
})
console.log('BODY BG   :', info.bodyBg)
console.log('TEXT COLOR:', info.color)
console.log('HTML CLASS:', JSON.stringify(info.htmlClass))
console.log('PAGE HEIGHT:', info.height)
console.log('IMAGES:')
info.imgs.forEach(i => console.log(`   ${String(i.w).padStart(4)}x${String(i.h).padStart(4)}  natural=${i.nat.padEnd(10)} loaded=${i.ok}  ${i.file}`))
console.log('CONSOLE ERRORS:', errs.length ? errs : 'none')

await b.close()
srv.close()
