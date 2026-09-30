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
await new Promise(r => srv.listen(4325, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('response', r => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url()) })

await p.goto('http://localhost:4325' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)

const info = await p.evaluate(() => {
  const txt = el => (el.innerText || '').trim()
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  return {
    headerLinks: [...header.querySelectorAll('a')].map(a => ({ t: txt(a).slice(0, 20), href: a.getAttribute('href') })),
    headerHasSelect: !!header.querySelector('select'),
    headerLogos: [...header.querySelectorAll('img')].map(i => (i.currentSrc || i.src).split('/').pop()),
    footerText: txt(footer),
    footerLinks: [...footer.querySelectorAll('a')].length,
    menuImgs: [...document.querySelectorAll('#menu img')].map(i => (i.currentSrc || i.src).split('/').pop()),
    menuLinks: [...document.querySelectorAll('#menu a')].map(a => ({ t: txt(a).slice(0, 24), href: a.getAttribute('href'), dl: a.hasAttribute('download') })),
    clipart: document.querySelectorAll('svg').length,
    dividers: document.querySelectorAll('svg rect[width="1440"]').length,
    totalImgs: document.querySelectorAll('img').length
  }
})
console.log('HEADER links      :', JSON.stringify(info.headerLinks), '| language select:', info.headerHasSelect)
console.log('HEADER logos      :', info.headerLogos.join(', '))
console.log('FOOTER text       :', JSON.stringify(info.footerText), '| links:', info.footerLinks)
console.log('MENU inline imgs  :', info.menuImgs.length ? info.menuImgs.join(', ') : 'none (correct)')
console.log('MENU links        :', JSON.stringify(info.menuLinks))
console.log('CLIPART svgs      :', info.clipart, '| divider bands:', info.dividers)
console.log('TOTAL imgs        :', info.totalImgs)
console.log('ERRORS            :', errs.length ? errs : 'none')

await p.screenshot({ path: '/tmp/v3_hero.png' })
await p.screenshot({ path: '/tmp/v3_full.png', fullPage: true })
await b.close()
srv.close()
