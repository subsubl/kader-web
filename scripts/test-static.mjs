#!/usr/bin/env node
// Verifies the generated static output: single page present, no stray pages, no
// backend references, assets subdirectory-safe, self-hosted fonts resolve, and
// the layout follows the reference template (narrow columns, nothing centred).
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const root = path.resolve(process.cwd(), '.output/public')
const base = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')

const required = ['index.html', '404.html', '200.html']
for (const f of required) {
  assert.ok(fs.existsSync(path.join(root, f)), `missing generated file: ${f}`)
}

// The fork is a single page: no sub-pages may exist.
const banned = ['shop', 'events', 'club', 'buyouts', 'pizzeria', 'tables', 'admin']
for (const b of banned) {
  assert.ok(!fs.existsSync(path.join(root, b)), `page /${b} should not exist in this fork`)
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
assert.ok(!/["'](\/api\/|\/admin)/.test(index), 'index: leaked backend reference')

// Real content must be present.
for (const [label, needle] of [
  ['hero opening line', 'Pizza bistro in plesni bar na Gradu Kodeljevo v Ljubljani.'],
  ['hero address lead-in', 'Odprti smo na naslovu'],
  ['address', 'Ulica Karla Benza 20'],
  ['groups and events', 'Sprejemamo večje skupine in gostimo različne dogodke.'],
  ['email lead-in', 'Pišite nam na'],
  ['instagram line', 'Spremljajte naš Instagram za novice.'],
  ['sign-off', 'Se vidimo.'],
  ['menu jpg link', 'menu-a3.jpg'],
  ['contact email', 'info@kader.si'],
  ['order phone', '+386 83 836 740'],
  ['reservations phone', '+386 40 175 628'],
  ['instagram', 'instagram.com/kader.lunapark']
]) {
  assert.ok(index.includes(needle), `index: missing expected content (${label}: "${needle}")`)
}

// The hero must link the address, the email and the Instagram handle inline.
assert.ok(
  /<a[^>]+href="https:\/\/maps\.app\.goo\.gl\/[^"]+"[^>]*>\s*Ulica Karla Benza 20\s*<\/a>/.test(index),
  'index: hero address should be a link to Google Maps'
)
assert.ok(
  /<a[^>]+href="mailto:info@kader\.si"[^>]*>info@kader\.si<\/a>/.test(index),
  'index: hero email should be a mailto link'
)
assert.ok(
  /<a[^>]+href="https:\/\/www\.instagram\.com\/kader\.lunapark\/"[^>]*>\s*Spremljajte naš Instagram za novice\./.test(index),
  'index: hero Instagram line should link to @kader.lunapark'
)

// The menu must be a LINK that opens the JPG, not an inline <img>, and the hero
// "Meni" link goes straight to the JPG (there is no menu section).
assert.ok(
  /<a[^>]+href="[^"]*menu-a3\.jpg"/.test(index),
  'index: menu-a3.jpg must be linked, not displayed inline'
)
assert.equal(
  [...index.matchAll(/<img[^>]+src="[^"]*menu-a3\.jpg"/g)].length,
  0,
  'index: menu JPG must not be rendered as an inline <img>'
)
assert.ok(!/id="menu"/.test(index), 'index: the menu section should be removed; Meni links straight to the JPG')
assert.ok(!/Prenesi meni/.test(index), 'index: the menu download blurb should be removed')

// The street is spelled "Karla" everywhere. Google reads the JSON-LD for the
// map pin, so the structured data and the visible copy must not disagree.
assert.ok(!/Carla Benza/.test(index), 'index: the address should be spelled "Karla Benza" everywhere')

// No header bar at all: the language picker is a small fixed control in the
// corner, so there must be no <header> element, no bar and no nav links in it.
assert.ok(!/<header[\s>]/.test(index), 'index: the header bar should be removed; the language picker floats in the corner')
assert.ok(!/<\/header>/.test(index), 'index: no <header> element expected')
assert.ok(!/class="[^"]*\bsticky\b[^"]*"/.test(index), 'index: no sticky bar expected')
assert.ok(index.includes('<select'), 'language picker: selector missing')
assert.ok(
  /<div class="fixed top-0 right-0[^"]*">\s*<div class="relative">\s*<select/.test(index.replace(/\s+/g, ' ')),
  'language picker: should be a fixed control in the top-right corner'
)
assert.ok(!/<a[^>]+href="#(menu|hours|venue|contact|programme)"/.test(index.slice(0, index.indexOf('<main'))), 'nav links should not appear before <main>')
assert.ok(!/<img/.test(index.slice(0, index.indexOf('<main'))), 'no logo before <main>')

// Footer: copyright only.
const footer = index.slice(index.indexOf('<footer'))
assert.ok(!footer.includes('info@kader.si'), 'footer: contact email should be removed')
assert.ok(!footer.includes('+386'), 'footer: phone numbers should be removed')
assert.ok(!footer.includes('Carla Benza'), 'footer: address should be removed')

// Signal-red theme, white type.
assert.ok(index.includes('bg-kader-red'), 'index: signal red background class missing')
assert.ok(!/<body[^>]*class="[^"]*bg-black/.test(index), 'index: body must not be dark')

// Self-hosted Inter; no Google Fonts.
const cssFiles = fs.readdirSync(path.join(root, '_nuxt')).filter(f => f.endsWith('.css'))
assert.ok(cssFiles.length > 0, 'no emitted stylesheet found in _nuxt')
const css = cssFiles.map(f => fs.readFileSync(path.join(root, '_nuxt', f), 'utf8')).join('\n')
assert.ok(css.includes('Inter'), 'stylesheet: Inter @font-face missing')
for (const f of ['Inter-Regular.woff', 'Inter-SemiBold.woff', 'Inter-Bold.woff', 'Inter-Black.woff']) {
  assert.ok(fs.existsSync(path.join(root, 'fonts', f)), `missing self-hosted font: ${f}`)
  assert.ok(fs.existsSync(path.join(root, base.replace(/^\//, ''), 'fonts', f)), `font not emitted under base: ${f}`)
  assert.ok(css.includes(f), `stylesheet: font ${f} not referenced`)
}
assert.ok(!/fonts\.googleapis\.com/.test(index + css), 'must not load Google Fonts')

// Parallax bands present, with oversize matching the JS strength.
assert.ok(index.includes('parallax-band'), 'index: parallax band component missing')
assert.ok(css.includes('--oversize'), 'stylesheet: --oversize missing')

// No unresolved i18n keys may ship as visible text.
const leaked = [...index.matchAll(/>\s*(?:site|pizzeria|home|header)\.[a-zA-Z0-9_]+\s*</g)].map(m => m[0].trim())
assert.equal(leaked.length, 0, `index: unresolved i18n keys rendered as text: ${[...new Set(leaked)].join(', ')}`)

// Reference-template frames: nothing is centred except the closing bar.
// Copy sits in narrow columns, so long-form text must NOT use text-align:center.
const main = index.slice(index.indexOf('<main'), index.indexOf('</main>'))
assert.ok(
  !/\btext-center\b/.test(main),
  'index: centred text found inside <main> (the reference left-aligns all copy)'
)
assert.ok(
  /<footer[^>]*\btext-center\b/.test(index),
  'index: the closing bar should be centred, as in the reference'
)
// Narrative body copy should be justified 22px, as in the reference.
assert.ok(index.includes('text-justify'), 'index: expected justified body copy (reference uses text-align: justify)')
assert.ok(index.includes('text-[22px]'), 'index: expected 22px body copy (reference body size)')
assert.ok(index.includes('text-[40px]'), 'index: expected 40px big links (reference link size)')
assert.ok(index.includes('max-w-[430px]') || index.includes('max-w-[420px]'), 'index: expected narrow text columns')

// Every src/href pointing at the site root must carry the baseURL prefix.
if (base) {
  const assets = [...index.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(m => m[1])
  for (const a of assets) {
    assert.ok(a.startsWith(`${base}/`), `index: asset "${a}" is missing baseURL prefix "${base}/"`)
  }
}

console.log('STATIC TESTS PASSED:', required.join(', '), 'present; single-page fork; red/white; self-hosted fonts; reference frames; no backend references; assets base-prefixed')