/**
 * Automated Verification Test Suite for Backend i18n (Dual-Language sl/en)
 * Tests /api/inquiries and /api/table-orders with ?lang=sl and ?lang=en
 * Verifies localized validation error messages, status codes, query/cookie/header resolution,
 * and data compatibility.
 */

import { spawn } from 'node:child_process'
import http from 'node:http'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('=== STARTING BACKEND i18n VERIFICATION TEST SUITE ===\n')

let passCount = 0
let failCount = 0
const findings = []

function test(name, fn) {
  try {
    fn()
    passCount++
    console.log(`  ✓ PASS: ${name}`)
  } catch (err) {
    failCount++
    findings.push({ test: name, error: err.message })
    console.error(`  ✗ FAIL: ${name}`)
    console.error(`    -> ${err.message}`)
  }
}

async function asyncTest(name, fn) {
  try {
    await fn()
    passCount++
    console.log(`  ✓ PASS: ${name}`)
  } catch (err) {
    failCount++
    findings.push({ test: name, error: err.message })
    console.error(`  ✗ FAIL: ${name}`)
    console.error(`    -> ${err.message}`)
  }
}

// ---------------------------------------------------------------------------
// 1. Static Verification of Implementation Files
// ---------------------------------------------------------------------------
console.log('--- SECTION 1: Static Code Inspection ---')

test('src/server/utils/locale.ts exports resolveApiLocale, createApiTranslator, and DICTIONARIES', () => {
  const filePath = path.join(ROOT, 'src/server/utils/locale.ts')
  assert.ok(fs.existsSync(filePath), 'src/server/utils/locale.ts must exist')
  const content = fs.readFileSync(filePath, 'utf8')
  assert.ok(content.includes('export function resolveApiLocale'), 'Must export resolveApiLocale')
  assert.ok(content.includes('export function createApiTranslator'), 'Must export createApiTranslator')
  assert.ok(content.includes('export const DICTIONARIES'), 'Must export DICTIONARIES')
  assert.ok(content.includes('sl: {'), 'Must include Slovenian dictionary')
  assert.ok(content.includes('en: {'), 'Must include English dictionary')
})

test('src/server/api/inquiries.post.ts uses createApiTranslator and handles date/preferredDate', () => {
  const filePath = path.join(ROOT, 'src/server/api/inquiries.post.ts')
  assert.ok(fs.existsSync(filePath), 'src/server/api/inquiries.post.ts must exist')
  const content = fs.readFileSync(filePath, 'utf8')
  assert.ok(content.includes('createApiTranslator'), 'Must import or use createApiTranslator')
  assert.ok(content.includes('preferredDate'), 'Must support preferredDate')
  assert.ok(content.includes('statusCode: 422'), 'Must respond with 422 status on validation error')
})

test('src/server/api/table-orders.post.ts uses createApiTranslator and handles tableNumber/table_number', () => {
  const filePath = path.join(ROOT, 'src/server/api/table-orders.post.ts')
  assert.ok(fs.existsSync(filePath), 'src/server/api/table-orders.post.ts must exist')
  const content = fs.readFileSync(filePath, 'utf8')
  assert.ok(content.includes('createApiTranslator'), 'Must import or use createApiTranslator')
  assert.ok(content.includes('table_number'), 'Must support table_number alias')
  assert.ok(content.includes('statusCode: 422'), 'Must respond with 422 status on validation error')
})

test('src/server/api/menu-config.get.ts localizes responses and cache keys', () => {
  const filePath = path.join(ROOT, 'src/server/api/menu-config.get.ts')
  assert.ok(fs.existsSync(filePath), 'src/server/api/menu-config.get.ts must exist')
  const content = fs.readFileSync(filePath, 'utf8')
  assert.ok(content.includes('resolveApiLocale'), 'Must resolve API locale')
  assert.ok(content.includes('`menu-config:${locale}`'), 'Cache key must be localized')
})

test('src/server/api/site-images.get.ts and events.get.ts localize cache keys', () => {
  const imagesContent = fs.readFileSync(path.join(ROOT, 'src/server/api/site-images.get.ts'), 'utf8')
  const eventsContent = fs.readFileSync(path.join(ROOT, 'src/server/api/events.get.ts'), 'utf8')
  assert.ok(imagesContent.includes('`site-images:${locale}`'), 'site-images cache key must be localized')
  assert.ok(eventsContent.includes('`events:${locale}`'), 'events cache key must be localized')
})

// ---------------------------------------------------------------------------
// 2. Integration HTTP Server Verification
// ---------------------------------------------------------------------------
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')

async function runHttpTests() {
  console.log('\n--- SECTION 2: End-to-End HTTP API i18n Tests ---')

  if (!fs.existsSync(SERVER_ENTRY)) {
    console.warn(`WARNING: Built server not found at ${SERVER_ENTRY}. Run npm run build first.`)
    return
  }

  const TEST_PORT = 3192
  const BASE_URL = `http://127.0.0.1:${TEST_PORT}`

  // Spawn server process
  const serverProcess = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(TEST_PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  // Wait for server ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      serverProcess.kill()
      reject(new Error('Timed out waiting for server to start on port ' + TEST_PORT))
    }, 15000)

    function tryConnect() {
      const req = http.get(`${BASE_URL}/api/menu-config`, (res) => {
        clearTimeout(timeout)
        resolve(res)
      })
      req.on('error', () => {
        setTimeout(tryConnect, 200)
      })
    }
    setTimeout(tryConnect, 500)
  })

  console.log(`  * Nitro server online on ${BASE_URL}`)

  let clientCounter = 10
  function nextIp() {
    clientCounter++
    return `198.51.100.${clientCounter}`
  }

  async function postJson(urlPath, body, headers = {}) {
    const ip = nextIp()
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
        ...headers
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, headers: res.headers }
  }

  async function getJson(urlPath, headers = {}) {
    const ip = nextIp()
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      headers: {
        'x-forwarded-for': ip,
        ...headers
      }
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, headers: res.headers }
  }

  // --- Test Inquiries API Validation Errors in Slovenian (?lang=sl) ---
  await asyncTest('POST /api/inquiries?lang=sl validation errors are localized in Slovenian', async () => {
    const res = await postJson('/api/inquiries?lang=sl', {})
    assert.equal(res.status, 422, 'Expected status 422 for empty body')
    assert.ok(res.data.data?.errors, 'Expected data.errors object')
    const errors = res.data.data.errors
    assert.equal(errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
    assert.equal(errors.email, 'Prosimo, vnesite veljaven e-poštni naslov.')
    assert.equal(errors.eventType, 'Prosimo, izberite vrsto dogodka.')
  })

  // --- Test Inquiries API Validation Errors in English (?lang=en) ---
  await asyncTest('POST /api/inquiries?lang=en validation errors are localized in English', async () => {
    const res = await postJson('/api/inquiries?lang=en', {})
    assert.equal(res.status, 422, 'Expected status 422 for empty body')
    assert.ok(res.data.data?.errors, 'Expected data.errors object')
    const errors = res.data.data.errors
    assert.equal(errors.name, 'Please enter your full name (at least 2 characters).')
    assert.equal(errors.email, 'Please enter a valid email address.')
    assert.equal(errors.eventType, 'Please select an event type.')
  })

  // --- Test Inquiries Email and Guest count errors in Slovenian ---
  await asyncTest('POST /api/inquiries?lang=sl invalid email and negative guests', async () => {
    const res = await postJson('/api/inquiries?lang=sl', {
      name: 'Janez Novak',
      email: 'invalid-email-string',
      eventType: 'wedding',
      guests: -4
    })
    assert.equal(res.status, 422)
    const errors = res.data.data.errors
    assert.equal(errors.email, 'Prosimo, vnesite veljaven e-poštni naslov.')
    assert.equal(errors.guests, 'Prosimo, vnesite število gostov med 1 in 500.')
  })

  // --- Test Inquiries Email and Guest count errors in English ---
  await asyncTest('POST /api/inquiries?lang=en invalid email and negative guests', async () => {
    const res = await postJson('/api/inquiries?lang=en', {
      name: 'John Doe',
      email: 'invalid-email-string',
      eventType: 'wedding',
      guests: -4
    })
    assert.equal(res.status, 422)
    const errors = res.data.data.errors
    assert.equal(errors.email, 'Please enter a valid email address.')
    assert.equal(errors.guests, 'Please enter a guest count between 1 and 500.')
  })

  // --- Test Inquiries Cookie-based locale detection ---
  await asyncTest('POST /api/inquiries with Cookie: kader-lang=en returns English errors', async () => {
    const res = await postJson('/api/inquiries', {}, { Cookie: 'kader-lang=en' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.name, 'Please enter your full name (at least 2 characters).')
  })

  // --- Test Inquiries Accept-Language header-based locale detection ---
  await asyncTest('POST /api/inquiries with Accept-Language: en-US,en;q=0.9 returns English errors', async () => {
    const res = await postJson('/api/inquiries', {}, { 'Accept-Language': 'en-US,en;q=0.9,sl;q=0.8' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.name, 'Please enter your full name (at least 2 characters).')
  })

  await asyncTest('POST /api/inquiries with Accept-Language: sl-SI,sl;q=0.9 returns Slovenian errors', async () => {
    const res = await postJson('/api/inquiries', {}, { 'Accept-Language': 'sl-SI,sl;q=0.9,en;q=0.8' })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
  })

  // --- Test Inquiries Successful submission with date vs preferredDate in English & Slovenian ---
  await asyncTest('POST /api/inquiries?lang=en with valid fields and preferredDate succeeds', async () => {
    const res = await postJson('/api/inquiries?lang=en', {
      name: 'Alice Wonder',
      email: 'alice@example.com',
      phone: '+386 40 123 456',
      eventType: 'corporate',
      preferredDate: '2026-10-15',
      guests: 50,
      message: 'Testing English inquiry submission'
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.ok, true)
    assert.equal(res.data.message, 'Your inquiry has been submitted successfully. We will contact you soon.')
    assert.ok(res.data.id, 'Must return id')
  })

  await asyncTest('POST /api/inquiries?lang=sl with valid fields and date succeeds', async () => {
    const res = await postJson('/api/inquiries?lang=sl', {
      name: 'Bojan Kranjc',
      email: 'bojan@example.com',
      phone: '+386 31 654 321',
      eventType: 'corporate',
      date: '2026-11-20',
      guests: 80,
      message: 'Testiranje slovenskega povpraševanja'
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.ok, true)
    assert.equal(res.data.message, 'Vaše povpraševanje je bilo uspešno prejeto. Kmalu vas bomo kontaktirali.')
    assert.ok(res.data.id, 'Must return id')
  })

  // --- Test Table Orders API in Slovenian (?lang=sl) ---
  await asyncTest('POST /api/table-orders?lang=sl validation errors are localized in Slovenian', async () => {
    const res = await postJson('/api/table-orders?lang=sl', {})
    assert.equal(res.status, 422)
    const errors = res.data.data.errors
    assert.equal(errors.tableNumber, 'Številka mize mora biti celo število med 1 in 50.')
    assert.equal(errors.items, 'Seznam artiklov je obvezen in ne sme biti prazen.')
  })

  // --- Test Table Orders API in English (?lang=en) ---
  await asyncTest('POST /api/table-orders?lang=en validation errors are localized in English', async () => {
    const res = await postJson('/api/table-orders?lang=en', {})
    assert.equal(res.status, 422)
    const errors = res.data.data.errors
    assert.equal(errors.tableNumber, 'Table number must be an integer between 1 and 50.')
    assert.equal(errors.items, 'Items array is required and must not be empty.')
  })

  // --- Test Table Orders table_number alias and customer note length limits ---
  await asyncTest('POST /api/table-orders?lang=en customerNote exceeding 500 chars returns error', async () => {
    const longNote = 'x'.repeat(501)
    const res = await postJson('/api/table-orders?lang=en', {
      table_number: 12,
      items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
      total: 10.5,
      customerNote: longNote
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.customerNote, 'Customer note must be a string up to 500 characters.')
  })

  await asyncTest('POST /api/table-orders?lang=sl customerNote exceeding 500 chars returns Slovenian error', async () => {
    const longNote = 'x'.repeat(501)
    const res = await postJson('/api/table-orders?lang=sl', {
      tableNumber: 12,
      items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
      total: 10.5,
      customerNote: longNote
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.customerNote, 'Opomba stranke lahko vsebuje največ 500 znakov.')
  })

  // --- Test Table Orders unavailable item error in English and Slovenian ---
  await asyncTest('POST /api/table-orders?lang=en with unavailable item', async () => {
    const res = await postJson('/api/table-orders?lang=en', {
      tableNumber: 5,
      items: [{ menuItemId: 'sold-out', name: 'Tartufata', qty: 1, price: 14.0 }],
      total: 14.0
    })
    assert.equal(res.status, 422)
    assert.ok(res.data.data.errors.items.includes('currently unavailable') || res.data.data.errors.items.includes('not found'))
  })

  await asyncTest('POST /api/table-orders?lang=sl with unavailable item', async () => {
    const res = await postJson('/api/table-orders?lang=sl', {
      tableNumber: 5,
      items: [{ menuItemId: 'sold-out', name: 'Tartufata', qty: 1, price: 14.0 }],
      total: 14.0
    })
    assert.equal(res.status, 422)
    assert.ok(res.data.data.errors.items.includes('trenutno ni na voljo') || res.data.data.errors.items.includes('ni mogoče najti'))
  })

  // --- Test Menu Config Localization and Cache Separation ---
  await asyncTest('GET /api/menu-config?lang=sl returns Slovenian metadata and vatNote', async () => {
    const res = await getJson('/api/menu-config?lang=sl')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
    assert.ok(res.data.vatNote.includes('DDV'), 'Must mention DDV in Slovenian vatNote')
    assert.ok(res.data.kitchenHoursNote.includes('Kuhinja obratuje'), 'Must have Slovenian kitchen note')
  })

  await asyncTest('GET /api/menu-config?lang=en returns English metadata and vatNote', async () => {
    const res = await getJson('/api/menu-config?lang=en')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
    assert.ok(res.data.vatNote.includes('VAT'), 'Must mention VAT in English vatNote')
    assert.ok(res.data.kitchenHoursNote.includes('Kitchen operates'), 'Must have English kitchen note')
  })

  // Clean shutdown
  serverProcess.kill('SIGTERM')
}

await runHttpTests()

console.log(`\n======================================================`)
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`======================================================`)

if (failCount > 0) {
  console.error('\nFAILURES ENCOUNTERED:')
  findings.forEach(f => console.error(`- ${f.test}: ${f.error}`))
  process.exit(1)
} else {
  console.log('\nALL BACKEND i18n VERIFICATIONS PASSED WITH 0 ERRORS.')
  process.exit(0)
}
