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
  try {
    const buf = await readFile(f)
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
    res.end(buf)
  } catch { res.writeHead(404); res.end('nope') }
})
await new Promise(r => srv.listen(4322, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
const fontReqs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('requestfailed', r => errs.push('reqfail: ' + r.url() + ' ' + (r.failure()?.errorText || '')))
p.on('response', r => { if (/\.(woff2?|ttf)/.test(r.url())) fontReqs.push(r.status() + ' ' + r.url().split('/').slice(-2).join('/')) })

await p.goto('http://localhost:4322' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1800)
await p.screenshot({ path: '/tmp/red_fold.png' })

// --- fonts actually applied? ---
const fontInfo = await p.evaluate(async () => {
  await document.fonts.ready
  const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight)
  const h1 = document.querySelector('h1, h2')
  const bodyFont = getComputedStyle(document.body).fontFamily
  const hFont = h1 ? getComputedStyle(h1).fontFamily : null
  return { loaded: [...new Set(loaded)], bodyFont, hFont, bodyBg: getComputedStyle(document.body).backgroundColor, bodyColor: getComputedStyle(document.body).color, assetBase: getComputedStyle(document.documentElement).getPropertyValue('--kader-asset-base') }
})
console.log('FONT REQUESTS:', fontReqs.length ? fontReqs.join(' | ') : 'NONE')
console.log('LOADED FACES :', fontInfo.loaded.join(' | ') || 'none')
console.log('BODY FONT    :', fontInfo.bodyFont)
console.log('HEADING FONT :', fontInfo.hFont)
console.log('ASSET BASE   :', JSON.stringify(fontInfo.assetBase))
console.log('BODY BG      :', fontInfo.bodyBg)
console.log('BODY COLOR   :', fontInfo.bodyColor)

// --- parallax: does the band transform change on scroll? ---
const readOffsets = () => p.$$eval('.parallax-band__inner', els => els.map(e => e.style.getPropertyValue('--parallax-y') || getComputedStyle(e).transform))
const before = await readOffsets()
await p.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }))
await p.waitForTimeout(700)
const mid = await readOffsets()
await p.evaluate(() => window.scrollTo({ top: 2800, behavior: 'instant' }))
await p.waitForTimeout(700)
const after = await readOffsets()
console.log('PARALLAX top    :', before.join(', '))
console.log('PARALLAX @1400  :', mid.join(', '))
console.log('PARALLAX @2800  :', after.join(', '))
const changed = new Set([...before, ...mid, ...after]).size > 1
console.log('PARALLAX MOVES  :', changed ? 'YES' : 'NO (static!)')

await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await p.waitForTimeout(400)
await p.screenshot({ path: '/tmp/red_full.png', fullPage: true })

const imgs = await p.$$eval('img', els => els.map(el => ({ f: (el.currentSrc || el.src).split('/').pop(), ok: el.naturalWidth > 0, nat: el.naturalWidth + 'x' + el.naturalHeight })))
console.log('IMAGES:', imgs.map(i => `${i.f}:${i.ok ? 'ok' : 'FAIL'}(${i.nat})`).join(' '))
console.log('ERRORS:', errs.length ? errs : 'none')

await b.close()
srv.close()
