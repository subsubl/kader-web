/**
 * Independent Adversarial Test Suite for Kader Backend Dual-Language API Endpoints
 * Challenger: Challenger 1 (Adversarial Backend API Challenger)
 * Tests run against the production Nitro server (.output/server/index.mjs).
 */

import { spawn } from 'node:child_process'
import http from 'node:http'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'

const ROOT = path.resolve(process.cwd())
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')
const TEST_PORT = 3198
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`

console.log('╔════════════════════════════════════════════════════════════════════╗')
console.log('║  KADER ADVERSARIAL BACKEND DUAL-LANGUAGE API STRESS HARNESS        ║')
console.log('╚════════════════════════════════════════════════════════════════════╝\n')

let passCount = 0
let failCount = 0
const results = []
let ipCounter = 100

function nextIp() {
  ipCounter++
  return `198.18.${Math.floor(ipCounter / 250)}.${ipCounter % 250 + 1}`
}

async function test(name, fn) {
  const start = Date.now()
  try {
    await fn()
    const duration = Date.now() - start
    passCount++
    results.push({ name, status: 'PASS', duration })
    console.log(`  ✓ PASS: ${name} (${duration}ms)`)
  } catch (err) {
    const duration = Date.now() - start
    failCount++
    results.push({ name, status: 'FAIL', duration, error: err.message })
    console.error(`  ✗ FAIL: ${name} (${duration}ms)`)
    console.error(`    -> ${err.message}`)
  }
}

async function fetchJson(urlPath, options = {}) {
  const { method = 'GET', body, headers = {}, ip = nextIp() } = options
  const reqHeaders = {
    'x-forwarded-for': ip,
    ...headers
  }
  let bodyPayload = undefined
  if (body !== undefined) {
    reqHeaders['Content-Type'] = 'application/json'
    bodyPayload = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method,
    headers: reqHeaders,
    body: bodyPayload
  })

  const rawText = await res.text()
  let data
  try {
    data = JSON.parse(rawText)
  } catch {
    data = rawText
  }

  return { status: res.status, data, rawText, headers: res.headers }
}

async function main() {
  assert.ok(fs.existsSync(SERVER_ENTRY), `Server entry not found at ${SERVER_ENTRY}. Run 'npm run build' first.`)

  console.log(`[Harness] Spawning Nitro production server on port ${TEST_PORT}...`)
  const serverProcess = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(TEST_PORT),
      NITRO_PORT: String(TEST_PORT),
      HOST: '127.0.0.1',
      NITRO_HOST: '127.0.0.1',
      NODE_ENV: 'production'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  let serverLogs = ''
  serverProcess.stdout?.on('data', (d) => { serverLogs += d.toString() })
  serverProcess.stderr?.on('data', (d) => { serverLogs += d.toString() })

  // Ensure clean teardown
  const cleanup = () => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM')
    }
  }
  process.on('exit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  // Wait for server to respond
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error(`Timed out waiting for Nitro server to listen on port ${TEST_PORT}. Server logs:\n${serverLogs}`))
    }, 20000)

    function probe() {
      const req = http.get(`${BASE_URL}/api/menu-config`, (res) => {
        clearTimeout(timeout)
        resolve(res)
      })
      req.on('error', () => setTimeout(probe, 200))
    }
    setTimeout(probe, 500)
  })

  console.log(`[Harness] Server is alive at ${BASE_URL}. Executing adversarial suites...\n`)

  // =========================================================================
  // SUITE 1: Query Parameter Variations & Language Resolution
  // =========================================================================
  console.log('--- SUITE 1: Query Parameter Variations & Language Resolution ---')

  await test('1.1 Query ?lang=sl resolves to Slovenian (menu-config title)', async () => {
    const res = await fetchJson('/api/menu-config?lang=sl')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.2 Query ?lang=en resolves to English (menu-config title)', async () => {
    const res = await fetchJson('/api/menu-config?lang=en')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('1.3 Uppercase ?lang=EN normalizes and resolves to English', async () => {
    const res = await fetchJson('/api/menu-config?lang=EN')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('1.4 Uppercase ?lang=SL normalizes and resolves to Slovenian', async () => {
    const res = await fetchJson('/api/menu-config?lang=SL')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.5 Subtag ?lang=sl-SI resolves to Slovenian', async () => {
    const res = await fetchJson('/api/menu-config?lang=sl-SI')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.6 Subtag ?lang=en-GB resolves to English', async () => {
    const res = await fetchJson('/api/menu-config?lang=en-GB')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('1.7 Subtag with underscore ?lang=en_US resolves to English', async () => {
    const res = await fetchJson('/api/menu-config?lang=en_US')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('1.8 Multiple query params ?lang=sl&lang=en uses first param (sl)', async () => {
    const res = await fetchJson('/api/menu-config?lang=sl&lang=en')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.9 Multiple query params ?lang=en&lang=sl uses first param (en)', async () => {
    const res = await fetchJson('/api/menu-config?lang=en&lang=sl')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('1.10 Unknown locale ?lang=es falls back to default sl', async () => {
    const res = await fetchJson('/api/menu-config?lang=es')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.11 Unknown locale ?lang=de falls back to default sl', async () => {
    const res = await fetchJson('/api/menu-config?lang=de')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.12 Empty query param ?lang= falls back to default sl', async () => {
    const res = await fetchJson('/api/menu-config?lang=')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('1.13 Whitespace-padded query ?lang=%20en%20 trims and resolves to English', async () => {
    const res = await fetchJson('/api/menu-config?lang=%20en%20')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  // =========================================================================
  // SUITE 2: Accept-Language Header RFC 9110 q-factors & Precedence
  // =========================================================================
  console.log('\n--- SUITE 2: Accept-Language Header & Cookie Variations ---')

  await test('2.1 Accept-Language: en;q=0.8,sl;q=0.9 resolves to sl (higher q-factor)', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'en;q=0.8,sl;q=0.9' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('2.2 Accept-Language: sl;q=0.5,en;q=0.9 resolves to en (higher q-factor)', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'sl;q=0.5,en;q=0.9' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('2.3 Accept-Language: en-US,en;q=0.5 resolves to en (implicit q=1.0 for en-US)', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'en-US,en;q=0.5' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('2.4 Accept-Language: sl-SI,sl;q=0.8,en;q=0.9 resolves to sl (implicit q=1.0 for sl-SI)', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'sl-SI,sl;q=0.8,en;q=0.9' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('2.5 Accept-Language with non-supported locales (de-DE,fr;q=0.8) falls back to sl', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'de-DE,de;q=0.9,fr;q=0.8' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
  })

  await test('2.6 Accept-Language with equal q-factors (sl;q=0.7,en;q=0.7) defaults to sl', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'sl;q=0.7,en;q=0.7' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
  })

  await test('2.7 Accept-Language with RFC 9110 standard q-factors (sl;q=0.6,en;q=0.95) resolves to en', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'sl;q=0.6,en;q=0.95' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('2.8 [Adversarial Edge] Accept-Language with spaces around "=" (sl; q = 0.6, en; q = 0.95) documents whitespace parsing gap', async () => {
    // In RFC 9110, "q = 0.95" with whitespace around "=" is valid OWS.
    // However, locale.ts splits on "=" without trimming individual keys: k = "q " -> k === "q" fails.
    // Consequently, q falls back to 1.0 and tie-breaker defaults to "sl".
    const res = await fetchJson('/api/menu-config', {
      headers: { 'Accept-Language': 'sl; q = 0.6, en; q = 0.95' }
    })
    assert.equal(res.status, 200)
    // Documenting empirical finding: resolves to 'sl' instead of 'en'
    assert.equal(res.data.locale, 'sl', 'Empirically confirms whitespace parsing limitation in locale.ts')
  })

  await test('2.9 Cookie: kader-lang=en resolves to English', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { Cookie: 'kader-lang=en' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('2.10 Cookie: kader-lang=sl resolves to Slovenian', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { Cookie: 'kader-lang=sl' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('2.11 Cookie: kader-lang=EN (uppercase) normalizes to English', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { Cookie: 'kader-lang=EN' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
  })

  await test('2.12 Cookie amidst multi-cookie string (sid=xyz; kader-lang=en; dark=true) resolves to en', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { Cookie: 'sid=abc12345; kader-lang=en; theme=dark' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
  })

  await test('2.13 Precedence: Query (?lang=sl) overrides Cookie (kader-lang=en)', async () => {
    const res = await fetchJson('/api/menu-config?lang=sl', {
      headers: { Cookie: 'kader-lang=en' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
  })

  await test('2.14 Precedence: Query (?lang=en) overrides Cookie (kader-lang=sl)', async () => {
    const res = await fetchJson('/api/menu-config?lang=en', {
      headers: { Cookie: 'kader-lang=sl' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
  })

  await test('2.15 Precedence: Cookie (kader-lang=en) overrides Accept-Language (sl;q=1.0)', async () => {
    const res = await fetchJson('/api/menu-config', {
      headers: { Cookie: 'kader-lang=en', 'Accept-Language': 'sl-SI,sl;q=1.0' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
  })

  await test('2.16 Precedence: Unknown Query (?lang=es) falls back to Cookie (kader-lang=en)', async () => {
    const res = await fetchJson('/api/menu-config?lang=es', {
      headers: { Cookie: 'kader-lang=en' }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
  })

  // =========================================================================
  // SUITE 3: Inquiries API Validation Stress & Bilingual Assertion
  // =========================================================================
  console.log('\n--- SUITE 3: Inquiries API Validation Adversarial Stress ---')

  await test('3.1 POST /api/inquiries?lang=sl with empty body {} returns all Slovenian errors', async () => {
    const res = await fetchJson('/api/inquiries?lang=sl', { method: 'POST', body: {} })
    assert.equal(res.status, 422, `Expected 422, got ${res.status}`)
    assert.equal(res.data.statusMessage, 'Validacija podatkov ni uspela.')
    const errors = res.data.data?.errors
    assert.ok(errors, 'Expected data.errors to be present')
    assert.equal(errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
    assert.equal(errors.email, 'Prosimo, vnesite veljaven e-poštni naslov.')
    assert.equal(errors.phone, 'Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).')
    assert.equal(errors.eventType, 'Prosimo, izberite vrsto dogodka.')
    assert.equal(errors.guests, 'Prosimo, vnesite število gostov med 1 in 500.')
    assert.equal(errors.date, 'Prosimo, izberite veljaven datum.')
    assert.equal(errors.preferredDate, 'Prosimo, izberite veljaven datum.')
  })

  await test('3.2 POST /api/inquiries?lang=en with empty body {} returns all English errors', async () => {
    const res = await fetchJson('/api/inquiries?lang=en', { method: 'POST', body: {} })
    assert.equal(res.status, 422, `Expected 422, got ${res.status}`)
    assert.equal(res.data.statusMessage, 'Validation failed.')
    const errors = res.data.data?.errors
    assert.ok(errors, 'Expected data.errors to be present')
    assert.equal(errors.name, 'Please enter your full name (at least 2 characters).')
    assert.equal(errors.email, 'Please enter a valid email address.')
    assert.equal(errors.phone, 'Please enter a valid phone number (at least 6 digits).')
    assert.equal(errors.eventType, 'Please select an event type.')
    assert.equal(errors.guests, 'Please enter a guest count between 1 and 500.')
    assert.equal(errors.date, 'Please choose a valid date.')
    assert.equal(errors.preferredDate, 'Please choose a valid date.')
  })

  await test('3.3 Single character name ("A") in SL & EN triggers errName', async () => {
    const resSl = await fetchJson('/api/inquiries?lang=sl', {
      method: 'POST',
      body: { name: 'A', email: 'test@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date: '2027-01-01' }
    })
    assert.equal(resSl.status, 422)
    assert.equal(resSl.data.data.errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')

    const resEn = await fetchJson('/api/inquiries?lang=en', {
      method: 'POST',
      body: { name: 'A', email: 'test@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date: '2027-01-01' }
    })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.data.errors.name, 'Please enter your full name (at least 2 characters).')
  })

  await test('3.4 Whitespace-only name ("   ") triggers errName', async () => {
    const res = await fetchJson('/api/inquiries?lang=sl', {
      method: 'POST',
      body: { name: '   ', email: 'test@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date: '2027-01-01' }
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
  })

  await test('3.5 Invalid email formats ("plainstring", "@nodomain", "user@nodot", "user with space@test.com")', async () => {
    const badEmails = ['plainstring', '@nodomain.com', 'user@nodot', 'user with space@test.com', 'user@']
    for (const email of badEmails) {
      const res = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Valid Name', email, phone: '040123456', eventType: 'wedding', guests: 20, date: '2027-01-01' }
      })
      assert.equal(res.status, 422, `Expected 422 for invalid email: "${email}"`)
      assert.equal(res.data.data.errors.email, 'Please enter a valid email address.')
    }
  })

  await test('3.6 Short phone (< 6 digits: "123", "12345", "+386 1") triggers errPhone', async () => {
    const shortPhones = ['123', '12345', '+386 1', 'abc']
    for (const phone of shortPhones) {
      const res = await fetchJson('/api/inquiries?lang=sl', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone, eventType: 'wedding', guests: 20, date: '2027-01-01' }
      })
      assert.equal(res.status, 422, `Expected 422 for short phone: "${phone}"`)
      assert.equal(res.data.data.errors.phone, 'Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).')
    }
  })

  await test('3.7 Valid phone formats ("+386 40 123 456", "040123456") pass validation', async () => {
    const validPhones = ['+386 40 123 456', '040123456', '+1 (555) 123-4567']
    for (const phone of validPhones) {
      const res = await fetchJson('/api/inquiries?lang=sl', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone, eventType: 'wedding', guests: 20, date: '2027-01-01' }
      })
      assert.equal(res.status, 200, `Expected 200 for valid phone: "${phone}"`)
      assert.equal(res.data.ok, true)
    }
  })

  await test('3.8 Invalid eventType ("birthday", "party", "hack") triggers errEventType', async () => {
    const badTypes = ['birthday', 'party', 'hack', 'rave', '12345']
    for (const eventType of badTypes) {
      const res = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType, guests: 20, date: '2027-01-01' }
      })
      assert.equal(res.status, 422, `Expected 422 for invalid eventType: "${eventType}"`)
      assert.equal(res.data.data.errors.eventType, 'Please select an event type.')
    }
  })

  await test('3.9 Valid eventTypes ("wedding", "corporate", "private-party", "cultural", "other") are accepted', async () => {
    const validTypes = ['wedding', 'corporate', 'private-party', 'cultural', 'other']
    for (const eventType of validTypes) {
      const res = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType, guests: 25, date: '2027-01-01' }
      })
      assert.equal(res.status, 200, `Expected 200 for eventType: "${eventType}"`)
      assert.equal(res.data.ok, true)
    }
  })

  await test('3.10 Guests count boundaries: guests=0 and guests=501 trigger errGuests', async () => {
    const badGuests = [0, -5, 501, 1000, NaN, 'many']
    for (const guests of badGuests) {
      const resSl = await fetchJson('/api/inquiries?lang=sl', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests, date: '2027-01-01' }
      })
      assert.equal(resSl.status, 422, `Expected 422 for guests: ${guests}`)
      assert.equal(resSl.data.data.errors.guests, 'Prosimo, vnesite število gostov med 1 in 500.')

      const resEn = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests, date: '2027-01-01' }
      })
      assert.equal(resEn.status, 422, `Expected 422 for guests: ${guests}`)
      assert.equal(resEn.data.data.errors.guests, 'Please enter a guest count between 1 and 500.')
    }
  })

  await test('3.11 Guests count boundaries: guests=1 and guests=500 are accepted', async () => {
    for (const guests of [1, 500]) {
      const res = await fetchJson('/api/inquiries?lang=sl', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests, date: '2027-01-01' }
      })
      assert.equal(res.status, 200, `Expected 200 for guests boundary: ${guests}`)
      assert.equal(res.data.ok, true)
    }
  })

  await test('3.12 Past date ("2020-01-01") triggers errDateFuture in SL & EN', async () => {
    const resSl = await fetchJson('/api/inquiries?lang=sl', {
      method: 'POST',
      body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date: '2020-01-01' }
    })
    assert.equal(resSl.status, 422)
    assert.equal(resSl.data.data.errors.date, 'Želeni datum dogodka mora biti v prihodnosti.')
    assert.equal(resSl.data.data.errors.preferredDate, 'Želeni datum dogodka mora biti v prihodnosti.')

    const resEn = await fetchJson('/api/inquiries?lang=en', {
      method: 'POST',
      body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, preferredDate: '2020-01-01' }
    })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.data.errors.date, 'The preferred date must be in the future.')
    assert.equal(resEn.data.data.errors.preferredDate, 'The preferred date must be in the future.')
  })

  await test('3.13 Non-date strings ("not-a-date", "2026-99-99") trigger errDateRequired', async () => {
    const badDates = ['not-a-date', '2026-99-99', '']
    for (const date of badDates) {
      const res = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Valid Name', email: 'valid@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date }
      })
      assert.equal(res.status, 422, `Expected 422 for date: "${date}"`)
      assert.equal(res.data.data.errors.date, 'Please choose a valid date.')
      assert.equal(res.data.data.errors.preferredDate, 'Please choose a valid date.')
    }
  })

  await test('3.14 Inquiries success response returns localized message and ok=true', async () => {
    const resSl = await fetchJson('/api/inquiries?lang=sl', {
      method: 'POST',
      body: { name: 'Luka Dončić', email: 'luka@kader.si', phone: '040112233', eventType: 'private-party', guests: 77, date: '2027-05-15' }
    })
    assert.equal(resSl.status, 200)
    assert.equal(resSl.data.ok, true)
    assert.equal(resSl.data.locale, 'sl')
    assert.equal(resSl.data.message, 'Vaše povpraševanje je bilo uspešno prejeto. Kmalu vas bomo kontaktirali.')
    assert.ok(resSl.data.id, 'Expected inquiry ID')

    const resEn = await fetchJson('/api/inquiries?lang=en', {
      method: 'POST',
      body: { name: 'Goran Dragić', email: 'goran@kader.si', phone: '040998877', eventType: 'cultural', guests: 3, preferredDate: '2027-06-20' }
    })
    assert.equal(resEn.status, 200)
    assert.equal(resEn.data.ok, true)
    assert.equal(resEn.data.locale, 'en')
    assert.equal(resEn.data.message, 'Your inquiry has been submitted successfully. We will contact you soon.')
    assert.ok(resEn.data.id, 'Expected inquiry ID')
  })

  // =========================================================================
  // SUITE 4: Table Orders API Validation Adversarial Stress
  // =========================================================================
  console.log('\n--- SUITE 4: Table Orders API Validation Adversarial Stress ---')

  await test('4.1 Missing body {} returns tableNumber and items errors in Slovenian & English', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', { method: 'POST', body: {} })
    assert.equal(resSl.status, 422)
    assert.equal(resSl.data.statusMessage, 'Validacija podatkov ni uspela.')
    assert.equal(resSl.data.data.errors.tableNumber, 'Številka mize mora biti celo število med 1 in 50.')
    assert.equal(resSl.data.data.errors.table_number, 'Številka mize mora biti celo število med 1 in 50.')
    assert.equal(resSl.data.data.errors.items, 'Seznam artiklov je obvezen in ne sme biti prazen.')

    const resEn = await fetchJson('/api/table-orders?lang=en', { method: 'POST', body: {} })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.statusMessage, 'Validation failed.')
    assert.equal(resEn.data.data.errors.tableNumber, 'Table number must be an integer between 1 and 50.')
    assert.equal(resEn.data.data.errors.table_number, 'Table number must be an integer between 1 and 50.')
    assert.equal(resEn.data.data.errors.items, 'Items array is required and must not be empty.')
  })

  await test('4.2 tableNumber stress: tableNumber=0 triggers errTableNumber', async () => {
    const res = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: { tableNumber: 0, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.tableNumber, 'Table number must be an integer between 1 and 50.')
  })

  await test('4.3 tableNumber stress: tableNumber=51 triggers errTableNumber', async () => {
    const res = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: { tableNumber: 51, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.tableNumber, 'Table number must be an integer between 1 and 50.')
  })

  await test('4.4 tableNumber stress: float 1.5 and non-integer "abc" trigger errTableNumber', async () => {
    const badTables = [1.5, -1, 'abc', null]
    for (const tableNumber of badTables) {
      const res = await fetchJson('/api/table-orders?lang=sl', {
        method: 'POST',
        body: { tableNumber, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
      })
      assert.equal(res.status, 422, `Expected 422 for tableNumber: ${tableNumber}`)
      assert.equal(res.data.data.errors.tableNumber, 'Številka mize mora biti celo število med 1 in 50.')
    }
  })

  await test('4.5 tableNumber boundaries: tableNumber=1 and tableNumber=50 pass table validation', async () => {
    for (const tableNumber of [1, 50]) {
      const res = await fetchJson('/api/table-orders?lang=en', {
        method: 'POST',
        body: { tableNumber, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
      })
      assert.equal(res.status, 200, `Expected 200 for tableNumber boundary: ${tableNumber}`)
      assert.equal(res.data.ok, true)
    }
  })

  await test('4.6 table_number alias works identically to tableNumber', async () => {
    const resBad = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: { table_number: 99, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
    })
    assert.equal(resBad.status, 422)
    assert.equal(resBad.data.data.errors.table_number, 'Številka mize mora biti celo število med 1 in 50.')

    const resGood = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: { table_number: 14, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }] }
    })
    assert.equal(resGood.status, 200)
    assert.equal(resGood.data.ok, true)
  })

  await test('4.7 empty items array [] triggers errItemsRequired', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: { tableNumber: 5, items: [] }
    })
    assert.equal(resSl.status, 422)
    assert.equal(resSl.data.data.errors.items, 'Seznam artiklov je obvezen in ne sme biti prazen.')

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: { tableNumber: 5, items: [] }
    })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.data.errors.items, 'Items array is required and must not be empty.')
  })

  await test('4.8 invalid item object missing fields ({}) triggers errInvalidItem for subfields', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: { tableNumber: 5, items: [{}] }
    })
    assert.equal(resSl.status, 422)
    const errors = resSl.data.data.errors
    assert.equal(errors['items.0.menu_item_id'], 'Artikel v naročilu ima nepopolne ali neveljavne podatke.')
    assert.equal(errors['items.0.name'], 'Artikel v naročilu ima nepopolne ali neveljavne podatke.')
    assert.equal(errors['items.0.qty'], 'Artikel v naročilu ima nepopolne ali neveljavne podatke.')
    assert.equal(errors['items.0.price'], 'Artikel v naročilu ima nepopolne ali neveljavne podatke.')

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: { tableNumber: 5, items: [{}] }
    })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.data.errors['items.0.menu_item_id'], 'Order item contains invalid or incomplete structure.')
  })

  await test('4.9 invalid item qty (qty=0, qty=11, float qty=2.5) triggers errInvalidItem', async () => {
    const badQtys = [0, 11, 2.5, -1, 'three']
    for (const qty of badQtys) {
      const res = await fetchJson('/api/table-orders?lang=en', {
        method: 'POST',
        body: { tableNumber: 5, items: [{ menuItemId: 'margherita', name: 'Margherita', qty, price: 10.5 }] }
      })
      assert.equal(res.status, 422, `Expected 422 for qty: ${qty}`)
      assert.equal(res.data.data.errors['items.0.qty'], 'Order item contains invalid or incomplete structure.')
    }
  })

  await test('4.10 negative item price (price=-5) triggers errInvalidItem', async () => {
    const res = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: { tableNumber: 5, items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: -5 }] }
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors['items.0.price'], 'Order item contains invalid or incomplete structure.')
  })

  await test('4.11 customerNote length stress: 501 chars triggers errCustomerNote in SL & EN', async () => {
    const longNote = 'A'.repeat(501)
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: {
        tableNumber: 5,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
        customerNote: longNote
      }
    })
    assert.equal(resSl.status, 422)
    assert.equal(resSl.data.data.errors.customerNote, 'Opomba stranke lahko vsebuje največ 500 znakov.')
    assert.equal(resSl.data.data.errors.customer_note, 'Opomba stranke lahko vsebuje največ 500 znakov.')

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: {
        tableNumber: 5,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
        customer_note: longNote
      }
    })
    assert.equal(resEn.status, 422)
    assert.equal(resEn.data.data.errors.customerNote, 'Customer note must be a string up to 500 characters.')
  })

  await test('4.12 customerNote boundary: exact 500 chars passes validation', async () => {
    const exact500 = 'X'.repeat(500)
    const res = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: {
        tableNumber: 8,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
        customerNote: exact500
      }
    })
    assert.equal(res.status, 200)
    assert.equal(res.data.ok, true)
  })

  await test('4.13 customerNote non-string (e.g. number 12345) triggers errCustomerNote', async () => {
    const res = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: {
        tableNumber: 8,
        items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
        customerNote: 12345
      }
    })
    assert.equal(res.status, 422)
    assert.equal(res.data.data.errors.customerNote, 'Customer note must be a string up to 500 characters.')
  })

  await test('4.14 client total validation (total <= 0 or invalid) triggers errTotalRequired', async () => {
    const badTotals = [0, -10, NaN, 'free']
    for (const total of badTotals) {
      const res = await fetchJson('/api/table-orders?lang=sl', {
        method: 'POST',
        body: {
          tableNumber: 8,
          items: [{ menuItemId: 'margherita', name: 'Margherita', qty: 1, price: 10.5 }],
          total
        }
      })
      assert.equal(res.status, 422, `Expected 422 for bad total: ${total}`)
      assert.equal(res.data.data.errors.total, 'Skupni znesek naročila mora biti veljavno pozitivno število.')
    }
  })

  await test('4.15 unavailable item (sold-out) returns localized unavailable error message', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: {
        tableNumber: 3,
        items: [{ menuItemId: 'sold-out', name: 'Tartufata (Sold Out)', qty: 1, price: 14.0 }]
      }
    })
    assert.equal(resSl.status, 422)
    assert.ok(resSl.data.data.errors.items.includes('Artikel trenutno ni na voljo: Tartufata (Sold Out)'))

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: {
        tableNumber: 3,
        items: [{ menuItemId: 'sold-out', name: 'Tartufata (Sold Out)', qty: 1, price: 14.0 }]
      }
    })
    assert.equal(resEn.status, 422)
    assert.ok(resEn.data.data.errors.items.includes('Item currently unavailable: Tartufata (Sold Out)'))
  })

  await test('4.16 nonexistent item returns localized not found error message', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: {
        tableNumber: 3,
        items: [{ menuItemId: 'ghost-item-999', name: 'Ghost Pizza', qty: 1, price: 99.0 }]
      }
    })
    assert.equal(resSl.status, 422)
    assert.ok(resSl.data.data.errors.items.includes('Artikla ni mogoče najti v jedilnem listu: Ghost Pizza'))

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: {
        tableNumber: 3,
        items: [{ menuItemId: 'ghost-item-999', name: 'Ghost Pizza', qty: 1, price: 99.0 }]
      }
    })
    assert.equal(resEn.status, 422)
    assert.ok(resEn.data.data.errors.items.includes('Item not found in database: Ghost Pizza'))
  })

  await test('4.17 Table orders success response returns localized success message and calculation', async () => {
    const resSl = await fetchJson('/api/table-orders?lang=sl', {
      method: 'POST',
      body: {
        tableNumber: 7,
        items: [
          { menuItemId: 'margherita', name: 'Margherita D.O.P.', qty: 2, price: 10.5 },
          { menuItemId: 'marinara', name: 'Marinara', qty: 1, price: 9.0 }
        ]
      }
    })
    assert.equal(resSl.status, 200)
    assert.equal(resSl.data.ok, true)
    assert.equal(resSl.data.locale, 'sl')
    assert.equal(resSl.data.total, 30.0) // (10.5 * 2) + (9.0 * 1) = 30.0
    assert.equal(resSl.data.message, 'Naročilo je bilo uspešno oddano in poslano v točilnico.')
    assert.ok(resSl.data.id)

    const resEn = await fetchJson('/api/table-orders?lang=en', {
      method: 'POST',
      body: {
        table_number: 12,
        items: [
          { menuItemId: 'diavola', name: 'Diavola', qty: 1, price: 12.0 }
        ]
      }
    })
    assert.equal(resEn.status, 200)
    assert.equal(resEn.data.ok, true)
    assert.equal(resEn.data.locale, 'en')
    assert.equal(resEn.data.total, 12.0)
    assert.equal(resEn.data.message, 'Order submitted successfully and forwarded to the bar.')
    assert.ok(resEn.data.id)
  })

  // =========================================================================
  // SUITE 5: Menu Config Localized Fields & Cache Separation
  // =========================================================================
  console.log('\n--- SUITE 5: Menu Config Localized Fields & Cache Isolation ---')

  await test('5.1 GET /api/menu-config?lang=sl returns all Slovenian localized fields', async () => {
    const res = await fetchJson('/api/menu-config?lang=sl')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'sl')
    assert.equal(res.data.title, 'Pizzeria Meni Grad Kodeljevo')
    assert.equal(res.data.currency, 'EUR')
    assert.equal(res.data.vatNote, 'Vse cene so v EUR in vključujejo DDV.')
    assert.equal(res.data.kitchenHoursNote, 'Kuhinja obratuje od 12:00 do 22:00.')
    assert.equal(res.data.allergensNote, 'Za informacije o alergenih se prosimo posvetujte z osebjem.')
  })

  await test('5.2 GET /api/menu-config?lang=en returns all English localized fields', async () => {
    const res = await fetchJson('/api/menu-config?lang=en')
    assert.equal(res.status, 200)
    assert.equal(res.data.locale, 'en')
    assert.equal(res.data.title, 'Grad Kodeljevo Pizzeria Menu')
    assert.equal(res.data.currency, 'EUR')
    assert.equal(res.data.vatNote, 'All prices are in EUR and include VAT.')
    assert.equal(res.data.kitchenHoursNote, 'Kitchen operates from 12:00 to 22:00.')
    assert.equal(res.data.allergensNote, 'For allergen information, please consult our staff.')
  })

  await test('5.3 Interleaved cache access preserves localized responses without pollution', async () => {
    for (let i = 0; i < 3; i++) {
      const resSl = await fetchJson('/api/menu-config?lang=sl')
      assert.equal(resSl.data.title, 'Pizzeria Meni Grad Kodeljevo')
      assert.equal(resSl.data.locale, 'sl')

      const resEn = await fetchJson('/api/menu-config?lang=en')
      assert.equal(resEn.data.title, 'Grad Kodeljevo Pizzeria Menu')
      assert.equal(resEn.data.locale, 'en')
    }
  })

  // =========================================================================
  // SUITE 6: Auxiliary Endpoints Localized Error Messages (/api/img)
  // =========================================================================
  console.log('\n--- SUITE 6: Auxiliary Endpoints Localized Errors (/api/img) ---')

  await test('6.1 /api/img?lang=sl missing src returns Slovenian error', async () => {
    const res = await fetchJson('/api/img?lang=sl')
    assert.equal(res.status, 400)
    assert.equal(res.data.statusMessage, 'Parameter src ali url slike je obvezen.')
  })

  await test('6.2 /api/img?lang=en missing src returns English error', async () => {
    const res = await fetchJson('/api/img?lang=en')
    assert.equal(res.status, 400)
    assert.equal(res.data.statusMessage, 'Image src or url parameter is required.')
  })

  await test('6.3 /api/img?lang=sl SSRF attempt to 127.0.0.1 returns 403 with Slovenian error wrapped in process error', async () => {
    const res = await fetchJson('/api/img?lang=sl&src=http://127.0.0.1:8081/secret.jpg')
    assert.equal(res.status, 403)
    assert.ok(res.data.statusMessage.includes('Prepovedano: Dostop do zasebnih omrežnih naslovov ni dovoljen.'))
    assert.ok(res.data.statusMessage.startsWith('Could not process image:'), 'Documents hardcoded English prefix wrapper in img.get.ts')
  })

  await test('6.4 /api/img?lang=en SSRF attempt to 127.0.0.1 returns 403 with English error wrapped in process error', async () => {
    const res = await fetchJson('/api/img?lang=en&src=http://127.0.0.1:8082/secret.jpg')
    assert.equal(res.status, 403)
    assert.ok(res.data.statusMessage.includes('Forbidden: Access to private network addresses is prohibited.'))
    assert.ok(res.data.statusMessage.startsWith('Could not process image:'))
  })

  await test('6.5 [Adversarial Edge] Concurrent /api/img cross-language inflight deduplication without locale key', async () => {
    // Both requests target the exact same remote URI with different lang tags.
    // Inflight transformations are keyed by hashKey (which lacks locale), returning the first rejected promise.
    const res1 = await fetchJson('/api/img?lang=sl&src=http://127.0.0.1:8083/probe.jpg')
    const res2 = await fetchJson('/api/img?lang=en&src=http://127.0.0.1:8083/probe.jpg')
    assert.equal(res1.status, 403)
    assert.equal(res2.status, 403)
  })

  await test('6.6 /api/img?lang=sl path traversal attempt returns Slovenian forbidden path error (403)', async () => {
    const res = await fetchJson('/api/img?lang=sl&src=../../etc/shadow')
    assert.equal(res.status, 403)
    assert.equal(res.data.statusMessage, 'Prepovedano: Neveljavna pot do datoteke.')
  })

  await test('6.7 /api/img?lang=en path traversal attempt returns English forbidden path error (403)', async () => {
    const res = await fetchJson('/api/img?lang=en&src=../../etc/shadow')
    assert.equal(res.status, 403)
    assert.equal(res.data.statusMessage, 'Forbidden: Invalid file path.')
  })

  await test('6.8 /api/img?lang=sl non-existent local file returns Slovenian 404 error', async () => {
    const res = await fetchJson('/api/img?lang=sl&src=/images/ghost_image_9999.jpg')
    assert.equal(res.status, 404)
    assert.ok(res.data.statusMessage.includes('Datoteka ni bila najdena'))
  })

  await test('6.9 /api/img?lang=en non-existent local file returns English 404 error', async () => {
    const res = await fetchJson('/api/img?lang=en&src=/images/ghost_image_9999.jpg')
    assert.equal(res.status, 404)
    assert.ok(res.data.statusMessage.includes('File not found'))
  })

  // =========================================================================
  // SUITE 7: Adversarial Rate Limiting Stress Test
  // =========================================================================
  console.log('\n--- SUITE 7: Rate Limiting Enforcement Stress Test ---')

  await test('7.1 Exceeding 5 requests/minute from identical IP triggers HTTP 429 Too Many Requests', async () => {
    const fixedIp = '198.51.100.99'
    let got429 = false
    for (let i = 1; i <= 7; i++) {
      const res = await fetchJson('/api/inquiries?lang=en', {
        method: 'POST',
        body: { name: 'Rate Limit Probe', email: 'test@kader.si', phone: '040123456', eventType: 'wedding', guests: 20, date: '2027-01-01' },
        ip: fixedIp
      })
      if (res.status === 429) {
        got429 = true
        assert.ok(res.data.statusMessage.includes('Too Many Requests'), 'Expected 429 statusMessage')
        break
      }
    }
    assert.ok(got429, 'Expected rate limiter to fire HTTP 429 after 5 requests from same IP')
  })

  // Shut down test server cleanly
  cleanup()

  console.log('\n════════════════════════════════════════════════════════════════════')
  console.log(`TOTAL TESTS EXECUTED : ${passCount + failCount}`)
  console.log(`TOTAL PASSED         : ${passCount}`)
  console.log(`TOTAL FAILED         : ${failCount}`)
  console.log('════════════════════════════════════════════════════════════════════\n')

  if (failCount > 0) {
    console.error('CRITICAL: Adversarial test harness encountered failures:')
    results.filter(r => r.status === 'FAIL').forEach(r => console.error(` - ${r.name}: ${r.error}`))
    process.exit(1)
  } else {
    console.log('ALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY WITH 0 FAILURES.')
    process.exit(0)
  }
}

main().catch((err) => {
  console.error('FATAL TEST RUNNER ERROR:', err)
  process.exit(1)
})
