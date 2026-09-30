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
await new Promise(r => srv.listen(4324, r))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
await p.goto('http://localhost:4324' + BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)

const info = await p.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) } }
  const hero = document.querySelector('section')
  const logo = document.querySelector('section img')
  const navLinks = [...document.querySelectorAll('nav a')].map(a => ({ t: a.textContent.trim().slice(0, 22), ...box(a), size: getComputedStyle(a).fontSize }))
  const menuImg = [...document.querySelectorAll('#menu img')][0]
  const menuBox = menuImg ? box(menuImg) : null
  const svgs = document.querySelectorAll('svg').length
  const dividers = document.querySelectorAll('svg rect[width="1440"]').length
  return {
    hero: box(hero), logo: logo ? { ...box(logo), nat: logo.naturalWidth + 'x' + logo.naturalHeight, file: (logo.currentSrc || logo.src).split('/').pop() } : null,
    navLinks, menuBox, svgs, dividers,
    anchorIds: [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean)
  }
})
console.log('HERO   :', JSON.stringify(info.hero))
console.log('LOGO   :', JSON.stringify(info.logo))
console.log('NAV LINKS (right column, 40px in the reference):')
info.navLinks.forEach(l => console.log(`   x=${String(l.x).padStart(4)} y=${String(l.y).padStart(4)} ${l.size.padStart(6)}  "${l.t}"`))
console.log('MENU IMG (should be right of centre):', JSON.stringify(info.menuBox), info.menuBox ? `centre=${info.menuBox.x + info.menuBox.w / 2}` : '')
console.log('SVG COUNT:', info.svgs, '| full-bleed divider bands:', info.dividers)
console.log('ANCHOR IDS:', info.anchorIds.join(', '))
await p.screenshot({ path: '/tmp/v2_hero.png' })
await p.screenshot({ path: '/tmp/v2_full.png', fullPage: true })
console.log('ERRORS :', errs.length ? errs : 'none')

await b.close()
srv.close()
