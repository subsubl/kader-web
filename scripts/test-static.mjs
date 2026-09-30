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

// Single page must carry the real content: menu, hours, venue, contact.
for (const [label, needle] of [
  ['menu', 'KADER'],
  ['contact email', 'info@kader.si'],
  ['reservations phone', '+386 40 175 628'],
  ['address', 'Koblarjeva'],
  ['instagram', 'instagram.com/kader.lunapark']
]) {
  assert.ok(index.includes(needle), `index: missing expected content (${label}: "${needle}")`)
}

// Every src/href pointing at the site root must carry the baseURL prefix when deploying to a subdirectory
if (base) {
  const assets = [...index.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(m => m[1])
  for (const a of assets) {
    assert.ok(a.startsWith(`${base}/`), `index: asset "${a}" is missing baseURL prefix "${base}/"`)
  }
}

console.log('STATIC TESTS PASSED:', required.join(', '), 'present; single-page fork; no backend references; assets base-prefixed')
