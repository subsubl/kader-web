import { chromium } from 'playwright'

const URL = process.argv[2] || 'https://subsubl.github.io/kader-web/'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('response', r => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url()) })

await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(2500)

// parallax travel across the live page
let maxTravel = 0
let gaps = 0
for (let y = 0; y <= 4400; y += 200) {
  await p.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await p.waitForTimeout(140)
  const r = await p.evaluate(() => {
    const res = []
    document.querySelectorAll('.parallax-band').forEach(band => {
      const inner = band.querySelector('.parallax-band__inner')
      const bb = band.getBoundingClientRect()
      const nb = inner.getBoundingClientRect()
      if (bb.bottom < 0 || bb.top > window.innerHeight) return
      const t = Math.abs(parseFloat(inner.style.getPropertyValue('--parallax-y') || '0'))
      const covers = nb.top <= bb.top + 1 && nb.bottom >= bb.bottom - 1
      res.push({ t: Math.round(t), covers })
    })
    return res
  })
  for (const x of r) { if (x.t > maxTravel) maxTravel = x.t; if (!x.covers) gaps++ }
}

const info = await p.evaluate(() => ({
  headerImgs: document.querySelectorAll('header img').length,
  centredInMain: [...document.querySelectorAll('main *')].filter(e => getComputedStyle(e).textAlign === 'center' && (e.innerText || '').trim()).length,
  bodySizes: [...new Set([...document.querySelectorAll('main p')].map(e => getComputedStyle(e).fontSize))],
  navSize: (() => { const a = document.querySelector('section nav a'); return a ? getComputedStyle(a).fontSize : null })(),
  bands: document.querySelectorAll('.parallax-band').length,
  signoff: document.body.innerText.includes('Liefs, Kader.'),
  intro: (document.querySelector('main p') || {}).innerText?.slice(0, 70)
}))

console.log('URL                  :', URL)
console.log('HEADER <img> COUNT   :', info.headerImgs, '(expect 0)')
console.log('CENTRED IN <main>    :', info.centredInMain, '(expect 0)')
console.log('BODY FONT SIZES      :', info.bodySizes.join(', '), '(reference: 22px)')
console.log('HERO NAV SIZE        :', info.navSize, '(reference: 40px)')
console.log('PARALLAX BANDS       :', info.bands)
console.log('MAX PARALLAX TRAVEL  :', maxTravel, 'px')
console.log('BANDS SHOWING A GAP  :', gaps, '(expect 0)')
console.log('SIGNOFF PRESENT      :', info.signoff)
console.log('INTRO                :', info.intro)
console.log('ERRORS               :', errs.length ? errs : 'none')

await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await p.waitForTimeout(400)
await p.screenshot({ path: '/tmp/live_v5_hero.png' })
await p.screenshot({ path: '/tmp/live_v5_full.png', fullPage: true })
await b.close()