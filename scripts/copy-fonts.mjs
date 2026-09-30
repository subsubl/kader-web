#!/usr/bin/env node
// Copies the self-hosted Inter fonts into the build output under the deployment
// base URL, so @font-face src:'/fonts/...' resolves on GitHub project Pages
// (where the site is served from a /kader-web/ subdirectory).
//
// CSS cannot interpolate var() inside @font-face src, so we solve it on disk:
// emit the fonts at <base>/fonts/ and rewrite the emitted stylesheets' font
// URLs to that prefixed path.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd(), '.output/public')
const base = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')
const fonts = ['Inter-Regular.woff', 'Inter-SemiBold.woff', 'Inter-Bold.woff', 'Inter-Black.woff']

if (!fs.existsSync(root)) {
  console.error('copy-fonts: .output/public missing — run generate first')
  process.exit(1)
}

// 1. Copy fonts into the base-prefixed directory
const destDir = path.join(root, base.replace(/^\//, ''), 'fonts')
fs.mkdirSync(destDir, { recursive: true })
for (const f of fonts) {
  const src = path.join(root, 'fonts', f)
  if (!fs.existsSync(src)) {
    console.error(`copy-fonts: missing source font ${src}`)
    process.exit(1)
  }
  fs.copyFileSync(src, path.join(destDir, f))
}
console.log(`copy-fonts: copied ${fonts.length} fonts to ${base}/fonts`)

// 2. Rewrite font URLs in the emitted stylesheets to the prefixed path
const nuxtDir = path.join(root, '_nuxt')
let rewritten = 0
if (fs.existsSync(nuxtDir)) {
  for (const file of fs.readdirSync(nuxtDir)) {
    if (!file.endsWith('.css')) continue
    const p = path.join(nuxtDir, file)
    const css = fs.readFileSync(p, 'utf8')
    const next = css.replace(
      /url\((["']?)\/fonts\/((?:Inter-[\w-]+\.woff))\1\)/g,
      (_m, q, name) => `url(${q}${base}/fonts/${name}${q})`
    )
    if (next !== css) {
      fs.writeFileSync(p, next)
      rewritten++
    }
  }
}
console.log(`copy-fonts: rewrote font URLs in ${rewritten} stylesheet(s) for base "${base}"`)
