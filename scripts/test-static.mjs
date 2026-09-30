#!/usr/bin/env node
// Verifies the generated static output: the single index page exists, no stray
// pages, no /api or /admin references leaked into HTML, assets are
// subdirectory-safe.
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

// Single page must carry the real content: intro tagline, menu sheet, hours, venue, contact.
for (const [label, needle] of [
  ['intro tagline', 'Pizza bistro in plesni bar na gradu Kodeljevo'],
  ['menu image', 'menu-a3.jpg'],
  ['contact email', 'info@kader.si'],
  ['order phone', '+386 83 836 740'],
  ['reservations phone', '+386 40 175 628'],
  ['address', 'Ulica Carla Benza 20'],
  ['instagram', 'instagram.com/kader.lunapark']
]) {
  assert.ok(index.includes(needle), `index: missing expected content (${label}: "${needle}")`)
}

// The site must render signal-red with white type (no dark theme leaking through).
assert.ok(index.includes('bg-kader-red'), 'index: signal red background class missing')
assert.ok(!/<body[^>]*class="[^"]*bg-black/.test(index), 'index: body must not be dark')
// Fonts are self-hosted from kader.si's own Inter files; no Google Fonts CDN.
// The @font-face rules live in the emitted stylesheet, not in index.html.
const cssFiles = fs.readdirSync(path.join(root, '_nuxt')).filter(f => f.endsWith('.css'))
assert.ok(cssFiles.length > 0, 'no emitted stylesheet found in _nuxt')
const css = cssFiles.map(f => fs.readFileSync(path.join(root, '_nuxt', f), 'utf8')).join('\n')
assert.ok(css.includes('Inter'), 'stylesheet: Inter @font-face missing')
for (const f of ['Inter-Regular.woff', 'Inter-SemiBold.woff', 'Inter-Bold.woff', 'Inter-Black.woff']) {
  assert.ok(fs.existsSync(path.join(root, 'fonts', f)), `missing self-hosted font: ${f}`)
  // copy-fonts also emits them under the deployment base.
  assert.ok(fs.existsSync(path.join(root, base.replace(/^\//, ''), 'fonts', f)), `font not emitted under base: ${f}`)
  assert.ok(css.includes(f), `stylesheet: font ${f} not referenced`)
  // The emitted URL must resolve: either base-prefixed or relative to _nuxt/.
  const urlMatch = css.match(new RegExp(`url\\(([^)]*${f})\\)`))
  assert.ok(urlMatch, `stylesheet: no url() for ${f}`)
  const url = urlMatch[1]
  // Accept absolute base-prefixed, root-relative (served at domain root is wrong
  // for Pages, so we require base), or relative-to-_nuxt forms.
  const ok = url.startsWith('data:') || url.includes(base) || /^(?:\.\.\/)?fonts\//.test(url)
  assert.ok(ok, `stylesheet: ${f} URL does not resolve: ${url}`)
}
assert.ok(!/fonts\.googleapis\.com/.test(index), 'index: must not load Google Fonts')
assert.ok(!/fonts\.googleapis\.com/.test(css), 'stylesheet: must not load Google Fonts')
// Parallax bands must be present.
assert.ok(index.includes('parallax-band'), 'index: parallax band component missing')

// The white KADER wordmark (logo-banner.png) is used for BOTH the header and the
// hero. It is the only logo variant with usable contrast on the red background:
// the black wordmark (logo-asset2.png / asset-7.png) is rgb(11,7,7) on
// rgb(237,34,36) and the 1:1 badge is only ~7% visible pixels.
const heroLogoUses = (index.match(/logo-banner\.jpg|logo-banner\.png/g) || []).length
assert.ok(heroLogoUses >= 1, 'index: white wordmark logo-banner.png not referenced')
for (const p of ['logo-banner.png', 'logo-asset2.png', 'logo-badge.png']) {
  assert.ok(fs.existsSync(path.join(root, p)), `missing logo asset: ${p}`)
}

// No unresolved i18n keys may ship as visible text. t() falls back to the raw
// key on a miss, which renders strings like "site.navMenu" to the visitor.
const leakedKeys = [...index.matchAll(/>\s*(?:site|pizzeria|home|header)\.[a-zA-Z0-9_]+\s*</g)].map(m => m[0].trim())
assert.equal(
  leakedKeys.length,
  0,
  `index: unresolved i18n keys rendered as text: ${[...new Set(leakedKeys)].join(', ')}`
)

// Every src/href pointing at the site root must carry the baseURL prefix when deploying to a subdirectory
if (base) {
  const assets = [...index.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(m => m[1])
  for (const a of assets) {
    assert.ok(a.startsWith(`${base}/`), `index: asset "${a}" is missing baseURL prefix "${base}/"`)
  }
}

console.log('STATIC TESTS PASSED:', required.join(', '), 'present; single-page fork; no backend references; assets base-prefixed')
