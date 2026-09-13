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

console.log('=== STARTING ADVERSARIAL STRESS TEST SUITE ===\n')

let pass = 0
let fail = 0
const failures = []

async function runTest(name, fn) {
  try {
    await fn()
    pass++
    console.log(`  ✓ PASS: ${name}`)
  } catch (err) {
    fail++
    failures.push({ name, err: err.message })
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`)
  }
}

async function main() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error('Server entry not found. Build first.')
  }

  const PORT = 3198
  const BASE = `http://127.0.0.1:${PORT}`

  const proc = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      proc.kill()
      reject(new Error('Server start timed out'))
    }, 15000)

    function ping() {
      const req = http.get(`${BASE}/api/menu-config`, (res) => {
        clearTimeout(timer)
        resolve(res)
      })
      req.on('error', () => setTimeout(ping, 200))
    }
    setTimeout(ping, 500)
  })

  console.log(`Server online on ${BASE}`)

  let ipCounter = 200
  function nextIp() {
    ipCounter++
    return `198.51.100.${ipCounter}`
  }

  async function postJson(urlPath, body, headers = {}) {
    const res = await fetch(`${BASE}${urlPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp(),
        ...headers
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, headers: res.headers }
  }

  async function getJson(urlPath, headers = {}) {
    const res = await fetch(`${BASE}${urlPath}`, {
      headers: {
        'x-forwarded-for': nextIp(),
        ...headers
      }
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, headers: res.headers }
  }

  // --- ADVERSARIAL LOCALE RESOLUTION PRIORITY & PARSING ---
  await runTest('Query param case insensitivity (?lang=EN) yields English', async () => {
    const res = await postJson('/api/inquiries?lang=EN', {})
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Please enter your full name (at least 2 characters).')
  })

  await runTest('Unsupported query locale (?lang=es) gracefully defaults to Slovenian', async () => {
    const res = await postJson('/api/inquiries?lang=es', {})
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
  })

  await runTest('Query overrides Cookie (query=en, cookie=sl -> English)', async () => {
    const res = await postJson('/api/inquiries?lang=en', {}, { Cookie: 'kader-lang=sl' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Please enter your full name (at least 2 characters).')
  })

  await runTest('Cookie overrides Header (cookie=en, header=sl -> English)', async () => {
    const res = await postJson('/api/inquiries', {}, { Cookie: 'kader-lang=en', 'Accept-Language': 'sl-SI,sl;q=0.9' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Please enter your full name (at least 2 characters).')
  })

  await runTest('Complex Accept-Language q-factor: en;q=0.8 > sl;q=0.4 -> English', async () => {
    const res = await postJson('/api/inquiries', {}, { 'Accept-Language': 'de-DE,de;q=0.9,en-US,en;q=0.8,sl;q=0.4' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Please enter your full name (at least 2 characters).')
  })

  await runTest('Complex Accept-Language q-factor: sl;q=0.8 > en;q=0.5 -> Slovenian', async () => {
    const res = await postJson('/api/inquiries', {}, { 'Accept-Language': 'en-GB;q=0.5,sl-SI;q=0.8' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
  })

  // --- ADVERSARIAL INQUIRIES BOUNDARY CONDITIONS ---
  await runTest('Inquiry with past date fails validation', async () => {
    const res = await postJson('/api/inquiries?lang=en', {
      name: 'Past Traveler',
      email: 'past@example.com',
      phone: '+38640111222',
      eventType: 'wedding',
      guests: 20,
      date: '2020-01-01'
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data?.errors?.date, 'The preferred date must be in the future.')
    assert.equal(res.data.data?.errors?.preferredDate, 'The preferred date must be in the future.')
  })

  await runTest('Inquiry with guest boundaries: 0 fails, 501 fails, 500 passes', async () => {
    const res0 = await postJson('/api/inquiries?lang=en', {
      name: 'Zero Guest',
      email: 'zero@example.com',
      phone: '+38640111222',
      eventType: 'wedding',
      guests: 0,
      date: '2028-01-01'
    })
    assert.equal(res0.status, 422)
    assert.ok(res0.data.data?.errors?.guests)

    const res501 = await postJson('/api/inquiries?lang=en', {
      name: 'Too Many',
      email: 'toomany@example.com',
      phone: '+38640111222',
      eventType: 'wedding',
      guests: 501,
      date: '2028-01-01'
    })
    assert.equal(res501.status, 422)
    assert.ok(res501.data.data?.errors?.guests)

    const res500 = await postJson('/api/inquiries?lang=en', {
      name: 'Max Cap',
      email: 'maxcap@example.com',
      phone: '+38640111222',
      eventType: 'corporate',
      guests: 500,
      date: '2028-01-01'
    })
    assert.equal(res500.status, 200)
    assert.equal(res500.data.ok, true)
  })

  // --- ADVERSARIAL TABLE ORDERS BOUNDARY CONDITIONS ---
  await runTest('Table orders table number boundaries: 0 fails, 51 fails, 1 passes, 50 passes', async () => {
    const basePayload = {
      items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
      total: 10.5
    }

    const res0 = await postJson('/api/table-orders?lang=en', { ...basePayload, tableNumber: 0 })
    assert.equal(res0.status, 422)
    assert.ok(res0.data.data?.errors?.tableNumber)

    const res51 = await postJson('/api/table-orders?lang=en', { ...basePayload, tableNumber: 51 })
    assert.equal(res51.status, 422)
    assert.ok(res51.data.data?.errors?.tableNumber)

    const res1 = await postJson('/api/table-orders?lang=en', { ...basePayload, tableNumber: 1 })
    assert.equal(res1.status, 200)
    assert.equal(res1.data.ok, true)

    const res50 = await postJson('/api/table-orders?lang=en', { ...basePayload, table_number: 50 })
    assert.equal(res50.status, 200)
    assert.equal(res50.data.ok, true)
  })

  await runTest('Table orders note boundary: exactly 500 chars passes, 501 chars fails', async () => {
    const basePayload = {
      tableNumber: 10,
      items: [{ menuItemId: 'marinara', name: 'Marinara', qty: 1, price: 9.0 }],
      total: 9.0
    }

    const res500 = await postJson('/api/table-orders?lang=en', {
      ...basePayload,
      customerNote: 'a'.repeat(500)
    })
    assert.equal(res500.status, 200)

    const res501 = await postJson('/api/table-orders?lang=en', {
      ...basePayload,
      customer_note: 'a'.repeat(501)
    })
    assert.equal(res501.status, 422)
    assert.ok(res501.data.data?.errors?.customerNote)
  })

  // --- ADVERSARIAL CACHE ISOLATION ---
  await runTest('Menu config cache returns isolated localized objects', async () => {
    const slRes = await getJson('/api/menu-config?lang=sl')
    const enRes = await getJson('/api/menu-config?lang=en')
    assert.equal(slRes.status, 200)
    assert.equal(enRes.status, 200)
    assert.equal(slRes.data.locale, 'sl')
    assert.equal(enRes.data.locale, 'en')
    assert.equal(slRes.data.title, 'Pizzeria Meni Grad Kodeljevo')
    assert.equal(enRes.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  proc.kill('SIGTERM')
}

await main()

console.log(`\n======================================================`)
console.log(`ADVERSARIAL SUMMARY: ${pass} PASSED, ${fail} FAILED`)
console.log(`======================================================`)

if (fail > 0) {
  failures.forEach(f => console.error(`- ${f.name}: ${f.err}`))
  process.exit(1)
} else {
  console.log('ALL ADVERSARIAL STRESS TESTS PASSED.')
  process.exit(0)
}
