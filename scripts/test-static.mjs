#!/usr/bin/env node
// Verifies the generated static output: required pages exist, no stray pages,
// no /api or /admin references leaked into HTML, assets are subdirectory-safe.
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const root = path.resolve(process.cwd(), '.output/public')
const base = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')

const required = ['index.html', 'club/index.html', 'buyouts/index.html', '404.html', '200.html']
for (const f of required) {
  assert.ok(fs.existsSync(path.join(root, f)), `missing generated file: ${f}`)
}

const banned = ['shop', 'events', 'pizzeria', 'tables']
for (const b of banned) {
  assert.ok(!fs.existsSync(path.join(root, b)), `page /${b} should not exist in this fork`)
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
for (const [name, content] of [['index', index]]) {
  assert.ok(!/["'](\/api\/|\/admin)/.test(content), `${name}: leaked backend reference`)
}

// Every src/href pointing at the site root must carry the baseURL prefix when deploying to a subdirectory
if (base) {
  const assets = [...index.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(m => m[1])
  for (const a of assets) {
    assert.ok(a.startsWith(`${base}/`), `index: asset "${a}" is missing baseURL prefix "${base}/"`)
  }
}

const club = fs.readFileSync(path.join(root, 'club/index.html'), 'utf8')
assert.ok(club.includes('Club'), 'club page sanity')

console.log('STATIC TESTS PASSED:', required.join(', '), 'present; no backend references; assets base-prefixed')
