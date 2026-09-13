// Forensic Integrity Probe for Kader Nuxt 3 / Nitro Server
// Conducts independent, zero-trust black-box & white-box verification

import { spawn } from 'node:child_process'
import http from 'node:http'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'

const ROOT = '/home/ator/Kader'
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')
const TEST_PORT = 3198
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`

console.log('=== FORENSIC INTEGRITY AUDIT PROBE STARTING ===')

const results = []

function record(name, pass, details = '') {
  results.push({ name, pass, details })
  if (pass) {
    console.log(`[PASS] ${name}`)
  } else {
    console.error(`[FAIL] ${name}: ${details}`)
  }
}

async function runProbe() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error('Built server entry not found at ' + SERVER_ENTRY)
  }

  // 1. Spawn clean Nitro server on isolated port
  const server = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(TEST_PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  // Wait for server ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.kill()
      reject(new Error('Server start timed out'))
    }, 15000)

    function poll() {
      const req = http.get(`${BASE_URL}/api/menu-config`, (res) => {
        clearTimeout(timeout)
        resolve()
      })
      req.on('error', () => setTimeout(poll, 200))
    }
    setTimeout(poll, 400)
  })

  console.log(`Server online on ${BASE_URL}`)

  let ipCounter = 200
  function freshIp() {
    ipCounter++
    return `198.51.100.${ipCounter}`
  }

  async function postJson(urlPath, body, headers = {}) {
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': freshIp(),
        ...headers
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, headers: res.headers }
  }

  async function get(urlPath, headers = {}) {
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      headers: {
        'x-forwarded-for': freshIp(),
        ...headers
      }
    })
    const text = await res.text()
    return { status: res.status, text, headers: res.headers }
  }

  // Probe 1: Arbitrary, unseen adversarial payload on /api/inquiries
  try {
    const randomName = 'Xavier_Forensic_' + Math.random().toString(36).slice(2, 6)
    const res = await postJson('/api/inquiries?lang=en', {
      name: randomName,
      email: 'not-an-email',
      phone: '12', // too short (<6 digits)
      eventType: 'invalid-type-123',
      guests: 9999, // out of range (>500)
      date: '1999-01-01' // past date
    })

    assert.equal(res.status, 422, 'Status should be 422')
    const errors = res.data.data?.errors
    assert.ok(errors, 'Must return data.errors')
    assert.equal(errors.email, 'Please enter a valid email address.')
    assert.equal(errors.phone, 'Please enter a valid phone number (at least 6 digits).')
    assert.equal(errors.eventType, 'Please select an event type.')
    assert.equal(errors.guests, 'Please enter a guest count between 1 and 500.')
    assert.equal(errors.date, 'The preferred date must be in the future.')
    assert.equal(errors.preferredDate, 'The preferred date must be in the future.')
    record('Inquiries validation catches all fields on arbitrary inputs (EN)', true)
  } catch (err) {
    record('Inquiries validation catches all fields on arbitrary inputs (EN)', false, err.message)
  }

  // Probe 2: Slovenian translation on same adversarial payload
  try {
    const res = await postJson('/api/inquiries?lang=sl', {
      name: 'M', // too short (<2 chars)
      email: 'bad@',
      phone: '000',
      eventType: 'wrong',
      guests: 0,
      date: 'not-a-date'
    })

    assert.equal(res.status, 422)
    const errors = res.data.data?.errors
    assert.equal(errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
    assert.equal(errors.email, 'Prosimo, vnesite veljaven e-poštni naslov.')
    assert.equal(errors.phone, 'Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).')
    assert.equal(errors.eventType, 'Prosimo, izberite vrsto dogodka.')
    assert.equal(errors.guests, 'Prosimo, vnesite število gostov med 1 in 500.')
    assert.equal(errors.date, 'Prosimo, izberite veljaven datum.')
    record('Inquiries validation catches all fields on arbitrary inputs (SL)', true)
  } catch (err) {
    record('Inquiries validation catches all fields on arbitrary inputs (SL)', false, err.message)
  }

  // Probe 3: Complex RFC 9110 q-factor Accept-Language resolution
  try {
    // en has q=0.9, sl has q=0.8 -> should resolve 'en'
    const resEn = await postJson('/api/inquiries', { name: 'A' }, {
      'Accept-Language': 'fr-CH, fr;q=0.9, en;q=0.85, sl;q=0.5'
    })
    assert.equal(resEn.data.data?.errors?.name, 'Please enter your full name (at least 2 characters).')

    // sl has q=0.95, en has q=0.4 -> should resolve 'sl'
    const resSl = await postJson('/api/inquiries', { name: 'A' }, {
      'Accept-Language': 'de-DE, de;q=0.9, sl-SI;q=0.85, en;q=0.3'
    })
    assert.equal(resSl.data.data?.errors?.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')

    record('RFC 9110 q-factor resolution operates authentically', true)
  } catch (err) {
    record('RFC 9110 q-factor resolution operates authentically', false, err.message)
  }

  // Probe 4: Table orders boundary checks
  try {
    // table number 0 (invalid), items empty
    const res0 = await postJson('/api/table-orders?lang=en', {
      tableNumber: 0,
      items: []
    })
    assert.equal(res0.status, 422)
    assert.equal(res0.data.data?.errors?.tableNumber, 'Table number must be an integer between 1 and 50.')
    assert.equal(res0.data.data?.errors?.items, 'Items array is required and must not be empty.')

    // table number 51 (invalid)
    const res51 = await postJson('/api/table-orders?lang=sl', {
      table_number: 51,
      items: []
    })
    assert.equal(res51.status, 422)
    assert.equal(res51.data.data?.errors?.table_number, 'Številka mize mora biti celo število med 1 in 50.')

    record('Table orders bounds checking (table 0, 51) authentic', true)
  } catch (err) {
    record('Table orders bounds checking (table 0, 51) authentic', false, err.message)
  }

  // Probe 5: SSR HTML check on / with exact coordinates and schema
  try {
    const { status, text: html } = await get('/')
    assert.equal(status, 200)

    // Check exact GEO
    assert.ok(html.includes('"latitude":46.0494') || html.includes('"latitude": 46.0494'), 'Latitude 46.0494 present')
    assert.ok(html.includes('"longitude":14.5367') || html.includes('"longitude": 14.5367'), 'Longitude 14.5367 present')
    assert.ok(html.includes('Koblarjeva ulica 34'), 'Koblarjeva ulica 34 present')
    assert.ok(html.includes('1000'), 'Postal code 1000 present')
    assert.ok(html.includes('Ljubljana'), 'Ljubljana present')

    // Check 10 hreflang links
    const allLangs = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']
    for (const l of allLangs) {
      assert.ok(html.includes(`hreflang="${l}"`), `hreflang="${l}" present`)
    }
    assert.ok(html.includes('hreflang="x-default"'), 'x-default present')

    record('SSR / contains exact coordinates 46.0494, 14.5367 and 10 hreflang links', true)
  } catch (err) {
    record('SSR / contains exact coordinates 46.0494, 14.5367 and 10 hreflang links', false, err.message)
  }

  // Probe 6: Dynamic SSR query language switching
  try {
    const { text: htmlEn } = await get('/?lang=en')
    assert.ok(/<html[^>]*\blang="en"/i.test(htmlEn), 'SSR /?lang=en renders <html lang="en"')

    const { text: htmlSl } = await get('/?lang=sl')
    assert.ok(/<html[^>]*\blang="sl"/i.test(htmlSl), 'SSR /?lang=sl renders <html lang="sl"')

    const { text: htmlDe } = await get('/?lang=de')
    assert.ok(/<html[^>]*\blang="de"/i.test(htmlDe), 'SSR /?lang=de renders <html lang="de"')

    record('Dynamic SSR language switching via ?lang= authentic', true)
  } catch (err) {
    record('Dynamic SSR language switching via ?lang= authentic', false, err.message)
  }

  // Probe 7: Pizzeria SSR schema
  try {
    const { text: htmlPizzeria } = await get('/pizzeria')
    assert.ok(htmlPizzeria.includes('PizzaRestaurant') || htmlPizzeria.includes('Restaurant'), 'Pizzeria Restaurant schema present')
    assert.ok(htmlPizzeria.includes('46.0494') && htmlPizzeria.includes('14.5367'), 'Pizzeria coordinates present')
    assert.ok(htmlPizzeria.includes('Koblarjeva ulica 34'), 'Pizzeria address present')
    record('SSR /pizzeria schema and coordinates authentic', true)
  } catch (err) {
    record('SSR /pizzeria schema and coordinates authentic', false, err.message)
  }

  // Probe 8: Club SSR schema
  try {
    const { text: htmlClub } = await get('/club')
    assert.ok(htmlClub.includes('NightClub'), 'NightClub schema present')
    assert.ok(htmlClub.includes('46.0494') && htmlClub.includes('14.5367'), 'Club coordinates present')
    assert.ok(htmlClub.includes('Event'), 'Event schema present on /club')
    record('SSR /club NightClub & Event schema authentic', true)
  } catch (err) {
    record('SSR /club NightClub & Event schema authentic', false, err.message)
  }

  // Probe 9: Route rules X-Robots-Tag
  try {
    const adminRes = await get('/admin')
    const apiRes = await get('/api/menu-config')
    const adminRobots = adminRes.headers.get('x-robots-tag')
    const apiRobots = apiRes.headers.get('x-robots-tag')
    assert.ok(adminRobots && adminRobots.includes('noindex'), 'Admin must have noindex')
    assert.ok(apiRobots && apiRobots.includes('noindex'), 'API must have noindex')
    record('Route rules X-Robots-Tag: noindex, nofollow authentic', true)
  } catch (err) {
    record('Route rules X-Robots-Tag: noindex, nofollow authentic', false, err.message)
  }

  // Clean shutdown
  server.kill('SIGTERM')
}

runProbe()
  .then(() => {
    console.log('\n=== PROBE COMPLETE ===')
    const failed = results.filter(r => !r.pass)
    console.log(`Total: ${results.length}, Passed: ${results.length - failed.length}, Failed: ${failed.length}`)
    if (failed.length > 0) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  })
  .catch(err => {
    console.error('Fatal probe error:', err)
    process.exit(1)
  })
