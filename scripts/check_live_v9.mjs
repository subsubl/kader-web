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

const info = await p.evaluate(() => {
  const clips = [...document.querySelectorAll('.clipart')].map(el => {
    const cs = getComputedStyle(el)
    return { color: cs.color, size: Math.round(el.getBoundingClientRect().width) }
  })
  const body = document.body.innerText
  return {
    clips: clips.length,
    nonWhite: clips.filter(c => c.color !== 'rgb(255, 255, 255)').length,
    heroLines: [...document.querySelectorAll('main p')].slice(0, 6).map(e => e.innerText.trim()).filter(Boolean),
    heroLinks: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('#')).slice(0, 6),
    signoff: body.includes('Se vidimo.'),
    hasOldSignoff: body.includes('Liefs, Kader.'),
    hasOldIntro: body.includes('rustičnim testom')
  }
})

console.log('URL             :', URL)
console.log('CLIPART NODES   :', info.clips, '| non-white:', info.nonWhite, '(expect 0)')
console.log('HERO LINES      :')
info.heroLines.forEach(l => console.log('   ', l))
console.log('HERO LINKS      :', JSON.stringify(info.heroLinks))
console.log('NEW SIGNOFF     :', info.signoff, '| old "Liefs, Kader." present:', info.hasOldSignoff, '| old intro present:', info.hasOldIntro)
console.log('ERRORS          :', errs.length ? errs : 'none')

await p.screenshot({ path: '/tmp/live_v9_hero.png' })
await p.screenshot({ path: '/tmp/live_v9_full.png', fullPage: true })
await b.close()