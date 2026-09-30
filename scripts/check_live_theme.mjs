import { chromium } from 'playwright'

const URL = process.argv[2] || 'https://subsubl.github.io/kader-web/'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
const fonts = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('requestfailed', r => errs.push('reqfail: ' + r.url()))
p.on('response', r => { if (/\.woff2?$/.test(r.url())) fonts.push(r.status() + ' ' + r.url().split('/').pop()) })

await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(2500)
await p.screenshot({ path: '/tmp/px_fold.png' })

const info = await p.evaluate(async () => {
  await document.fonts.ready
  return {
    loaded: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight))],
    bodyFont: getComputedStyle(document.body).fontFamily,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    bands: document.querySelectorAll('.parallax-band').length,
    imgs: [...document.querySelectorAll('img')].map(el => ({ f: (el.currentSrc || el.src).split('/').pop(), ok: el.naturalWidth > 0 }))
  }
})
console.log('FONT REQUESTS :', fonts.join(' | ') || 'none')
console.log('LOADED FACES  :', info.loaded.join(' | ') || 'none')
console.log('BODY FONT     :', info.bodyFont)
console.log('BODY BG       :', info.bodyBg, ' COLOR:', info.bodyColor)
console.log('PARALLAX BANDS:', info.bands)
console.log('IMAGES        :', info.imgs.map(i => `${i.f}:${i.ok ? 'ok' : 'FAIL'}`).join(' '))

// prove the parallax actually moves on the live site
const read = () => p.$$eval('.parallax-band__inner', els => els.map(e => e.style.getPropertyValue('--parallax-y')))
const a = await read()
await p.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }))
await p.waitForTimeout(800)
const c = await read()
await p.evaluate(() => window.scrollTo({ top: 3400, behavior: 'instant' }))
await p.waitForTimeout(800)
const d = await read()
console.log('PARALLAX top  :', a.join(', '))
console.log('PARALLAX @2000:', c.join(', '))
console.log('PARALLAX @3400:', d.join(', '))
console.log('MOVES         :', new Set([...a, ...c, ...d]).size > 1 ? 'YES' : 'NO')

await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await p.waitForTimeout(500)
await p.screenshot({ path: '/tmp/px_full.png', fullPage: true })
console.log('ERRORS        :', errs.length ? errs : 'none')
await b.close()
