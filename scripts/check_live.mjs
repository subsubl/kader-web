import { chromium } from 'playwright'

const URL = process.argv[2] || 'https://subsubl.github.io/kader-web/'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('pageerror: ' + e.message))

await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(2000)
await p.screenshot({ path: '/tmp/live_full.png', fullPage: true })
await p.screenshot({ path: '/tmp/live_fold.png' })

const info = await p.evaluate(() => ({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  htmlClass: document.documentElement.className,
  title: document.title,
  height: document.body.scrollHeight,
  h: [...document.querySelectorAll('h1,h2')].map(e => e.innerText.trim().slice(0, 40)),
  imgs: [...document.querySelectorAll('img')].map(el => {
    const r = el.getBoundingClientRect()
    return { f: (el.currentSrc || el.src).split('/').pop(), w: Math.round(r.width), h: Math.round(r.height), nat: el.naturalWidth + 'x' + el.naturalHeight, ok: el.naturalWidth > 0 }
  })
}))
console.log('TITLE      :', info.title)
console.log('BODY BG    :', info.bodyBg)
console.log('HTML CLASS :', JSON.stringify(info.htmlClass))
console.log('HEIGHT     :', info.height)
console.log('HEADINGS   :', info.h.join(' / '))
console.log('IMAGES:')
info.imgs.forEach(i => console.log(`   ${String(i.w).padStart(4)}x${String(i.h).padStart(4)} natural=${i.nat.padEnd(10)} loaded=${i.ok}  ${i.f}`))
console.log('ERRORS     :', errs.length ? errs : 'none')
await b.close()
