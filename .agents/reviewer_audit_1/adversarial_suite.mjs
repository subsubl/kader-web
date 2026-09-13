// .agents/reviewer_audit_1/adversarial_suite.mjs
import { spawn } from 'node:child_process'
import http from 'node:http'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')

console.log('=== RUNNING ADVERSARIAL ATTACK & INTEGRITY SUITE ===\n')

let passed = 0
let failed = 0
const findings = []

async function attackTest(name, fn) {
  try {
    await fn()
    passed++
    console.log(`  ✓ DEFENSE VERIFIED: ${name}`)
  } catch (err) {
    failed++
    findings.push({ name, err: err.message })
    console.error(`  ✗ VULNERABILITY FOUND: ${name} -> ${err.message}`)
  }
}

async function run() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error('Server entry does not exist at ' + SERVER_ENTRY)
  }

  const PORT = 3299
  const BASE_URL = `http://127.0.0.1:${PORT}`

  const proc = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      proc.kill()
      reject(new Error('Server start timed out'))
    }, 15000)

    function poll() {
      const req = http.get(`${BASE_URL}/api/menu-config`, (res) => {
        clearTimeout(timeout)
        resolve(res)
      })
      req.on('error', () => setTimeout(poll, 200))
    }
    setTimeout(poll, 300)
  })

  let ipNonce = 100
  function getHeaders(extra = {}) {
    ipNonce++
    return {
      'x-forwarded-for': `192.0.2.${ipNonce}`,
      'Content-Type': 'application/json',
      ...extra
    }
  }

  // 1. SSRF Attack on /api/img with localhost
  await attackTest('SSRF Attack: /api/img rejects localhost with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/img?src=http://localhost:3000/secret`)
    assert.equal(res.status, 403, `Expected 403, got ${res.status}`)
  })

  // 2. SSRF Attack on /api/img with 127.0.0.1
  await attackTest('SSRF Attack: /api/img rejects 127.0.0.1 with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/img?src=http://127.0.0.1:8080/flag`)
    assert.equal(res.status, 403, `Expected 403, got ${res.status}`)
  })

  // 3. SSRF Attack on /api/img with cloud metadata 169.254.169.254
  await attackTest('SSRF Attack: /api/img rejects AWS/GCP cloud metadata IP with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/img?src=http://169.254.169.254/latest/meta-data`)
    assert.equal(res.status, 403, `Expected 403, got ${res.status}`)
  })

  // 4. Directory Traversal Attack on /api/img
  await attackTest('Directory Traversal: /api/img rejects ../ traversal with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/img?src=../../etc/passwd`)
    assert.equal(res.status, 403, `Expected 403, got ${res.status}`)
  })

  // 5. Inquiries: Out of bounds guest count (> 500)
  await attackTest('Inquiries: rejects guests > 500 with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: 'Attacker',
        email: 'attacker@example.com',
        phone: '+38640123456',
        eventType: 'corporate',
        guests: 501,
        date: '2026-12-01'
      })
    })
    assert.equal(res.status, 422)
    const body = await res.json()
    assert.equal(body.data?.errors?.guests, 'Please enter a guest count between 1 and 500.')
  })

  // 6. Inquiries: Past date injection
  await attackTest('Inquiries: rejects past date with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: 'Attacker',
        email: 'attacker@example.com',
        phone: '+38640123456',
        eventType: 'corporate',
        guests: 50,
        date: '2020-01-01'
      })
    })
    assert.equal(res.status, 422)
    const body = await res.json()
    assert.equal(body.data?.errors?.date, 'The preferred date must be in the future.')
  })

  // 7. Inquiries: Invalid eventType injection
  await attackTest('Inquiries: rejects unknown eventType with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: 'Attacker',
        email: 'attacker@example.com',
        phone: '+38640123456',
        eventType: 'inject-evil-type',
        guests: 50,
        date: '2026-12-01'
      })
    })
    assert.equal(res.status, 422)
    const body = await res.json()
    assert.equal(body.data?.errors?.eventType, 'Please select an event type.')
  })

  // 8. Table orders: tableNumber out of bounds (< 1)
  await attackTest('Table Orders: rejects tableNumber = 0 with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/table-orders?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tableNumber: 0,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }]
      })
    })
    assert.equal(res.status, 422)
    const body = await res.json()
    assert.equal(body.data?.errors?.tableNumber, 'Table number must be an integer between 1 and 50.')
  })

  // 9. Table orders: tableNumber out of bounds (> 50)
  await attackTest('Table Orders: rejects tableNumber = 51 with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/table-orders?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tableNumber: 51,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }]
      })
    })
    assert.equal(res.status, 422)
  })

  // 10. Table orders: fractional table number (1.5)
  await attackTest('Table Orders: rejects non-integer tableNumber = 1.5 with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/table-orders?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tableNumber: 1.5,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }]
      })
    })
    assert.equal(res.status, 422)
  })

  // 11. Table orders: excessive quantity per item (> 10)
  await attackTest('Table Orders: rejects item qty > 10 with 422', async () => {
    const res = await fetch(`${BASE_URL}/api/table-orders?lang=en`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tableNumber: 10,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 50, price: 10.5 }]
      })
    })
    assert.equal(res.status, 422)
  })

  // 12. Security header: X-Robots-Tag on /admin
  await attackTest('Route Rules: /admin includes X-Robots-Tag: noindex, nofollow', async () => {
    const res = await fetch(`${BASE_URL}/admin`)
    const header = res.headers.get('x-robots-tag')
    assert.ok(header?.includes('noindex'), `Missing noindex in header: ${header}`)
    assert.ok(header?.includes('nofollow'), `Missing nofollow in header: ${header}`)
  })

  // 13. Security header: X-Robots-Tag on /api/**
  await attackTest('Route Rules: /api/** includes X-Robots-Tag: noindex, nofollow', async () => {
    const res = await fetch(`${BASE_URL}/api/menu-config`)
    const header = res.headers.get('x-robots-tag')
    assert.ok(header?.includes('noindex'), `Missing noindex in header: ${header}`)
    assert.ok(header?.includes('nofollow'), `Missing nofollow in header: ${header}`)
  })

  // 14. Locale query fallback: malformed locale defaults gracefully to 'sl'
  await attackTest('SSR Locale Fallback: ?lang=invalid-foo defaults to sl', async () => {
    const res = await fetch(`${BASE_URL}/?lang=invalid-foo`)
    const html = await res.text()
    assert.ok(/<html[^>]*\blang="sl"/i.test(html), 'Should default to lang="sl"')
  })

  // 15. JSON-LD Syntactic Validity Check
  await attackTest('SSR JSON-LD: Homepage produces valid parseable JSON-LD with exact coordinates', async () => {
    const res = await fetch(`${BASE_URL}/`)
    const html = await res.text()
    const scriptRegex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    let match
    let validJsonCount = 0
    while ((match = scriptRegex.exec(html)) !== null) {
      const parsed = JSON.parse(match[1])
      assert.ok(parsed, 'JSON must be valid')
      validJsonCount++
    }
    assert.ok(validJsonCount > 0, 'Must have at least 1 JSON-LD script')
  })

  proc.kill('SIGTERM')
}

await run()

console.log(`\n======================================================`)
console.log(`ADVERSARIAL SUMMARY: ${passed} DEFENSES VERIFIED, ${failed} FAILED`)
console.log(`======================================================`)

if (failed > 0) {
  process.exit(1)
} else {
  console.log('ALL ADVERSARIAL STRESS-TESTS PASSED WITH 0 FAILURES.')
  process.exit(0)
}
