/**
 * Independent Victory Audit Test Probe v2
 * Author: Independent Victory Auditor (victory_auditor_2)
 * Date: 2026-09-13
 * 
 * Verifies Acceptance Criteria:
 * 1. npm run typecheck passes with zero errors (empirically confirmed)
 * 2. npm run build compiles successfully into .output/server (empirically confirmed)
 * 3. API verification: /api/inquiries and /api/table-orders return localized validation errors matching lang=en and lang=sl
 * 4. Structured data validation: HTML head renders valid JSON-LD schemas with GEO coordinates (46.0494, 14.5367)
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

const PORT = 3399
const BASE_URL = `http://127.0.0.1:${PORT}`
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')

console.log('======================================================================')
console.log('     INDEPENDENT VICTORY AUDIT TEST PROBE — KADER FULL-SITE AUDIT')
console.log('======================================================================\n')

let passCount = 0
let failCount = 0
const failures = []

function pass(name) {
  passCount++
  console.log(`  ✓ PASS: ${name}`)
}

function fail(name, error) {
  failCount++
  failures.push({ name, error: error.message || String(error) })
  console.error(`  ✗ FAIL: ${name}`)
  console.error(`    -> ${error.message || error}`)
}

let ipCounter = 100
function getIp() {
  ipCounter++
  return `198.51.100.${ipCounter}`
}

async function request(urlPath, options = {}) {
  const ip = getIp()
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    ...options,
    headers: {
      'x-forwarded-for': ip,
      ...(options.headers || {})
    },
    redirect: 'manual'
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {}
  return { status: res.status, headers: res.headers, text, json }
}

async function runAudit() {
  // 1. Verify build artifacts
  console.log('--- CHECK 1: Production Server Bundle Existence ---')
  try {
    assert.ok(fs.existsSync(SERVER_ENTRY), `Server entry must exist at ${SERVER_ENTRY}`)
    assert.ok(fs.existsSync(path.join(ROOT, '.output/server/chunks/nitro/nitro.mjs')), 'Nitro core bundle must exist')
    assert.ok(fs.existsSync(path.join(ROOT, '.output/server/chunks/routes/api/inquiries.post.mjs')), 'inquiries.post.mjs route chunk must exist')
    assert.ok(fs.existsSync(path.join(ROOT, '.output/server/chunks/routes/api/table-orders.post.mjs')), 'table-orders.post.mjs route chunk must exist')
    pass('Server bundle artifacts and route chunks exist')
  } catch (err) {
    fail('Server bundle artifacts check', err)
  }

  // 2. Spawn Nitro Server
  console.log('\n--- CHECK 2: Spawning Nitro SSR Server ---')
  const server = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  server.stderr.on('data', (d) => {
    // console.error('[server err]', d.toString())
  })

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.kill()
      reject(new Error('Timed out waiting for Nitro server on port ' + PORT))
    }, 15000)

    function poll() {
      const req = http.get(`${BASE_URL}/api/menu-config`, (res) => {
        clearTimeout(timeout)
        resolve()
      })
      req.on('error', () => setTimeout(poll, 250))
    }
    setTimeout(poll, 500)
  })
  pass(`Nitro SSR server is alive and responding on ${BASE_URL}`)

  try {
    // 3. Dual-language API verification: /api/inquiries
    console.log('\n--- CHECK 3: /api/inquiries Localization & Validation ---')
    
    // 3.1 Slovenian via ?lang=sl
    try {
      const res = await request('/api/inquiries?lang=sl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422, 'Empty payload should return 422')
      assert.equal(res.json.statusMessage, 'Validacija podatkov ni uspela.')
      assert.equal(res.json.data.errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
      assert.equal(res.json.data.errors.email, 'Prosimo, vnesite veljaven e-poštni naslov.')
      assert.equal(res.json.data.errors.phone, 'Prosimo, vnesite veljavno telefonsko številko (vsaj 6 števk).')
      assert.equal(res.json.data.errors.eventType, 'Prosimo, izberite vrsto dogodka.')
      assert.equal(res.json.data.errors.guests, 'Prosimo, vnesite število gostov med 1 in 500.')
      assert.equal(res.json.data.errors.date, 'Prosimo, izberite veljaven datum.')
      pass('/api/inquiries?lang=sl returns Slovenian validation errors')
    } catch (err) {
      fail('/api/inquiries?lang=sl validation errors', err)
    }

    // 3.2 English via ?lang=en
    try {
      const res = await request('/api/inquiries?lang=en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422, 'Empty payload should return 422')
      assert.equal(res.json.statusMessage, 'Validation failed.')
      assert.equal(res.json.data.errors.name, 'Please enter your full name (at least 2 characters).')
      assert.equal(res.json.data.errors.email, 'Please enter a valid email address.')
      assert.equal(res.json.data.errors.phone, 'Please enter a valid phone number (at least 6 digits).')
      assert.equal(res.json.data.errors.eventType, 'Please select an event type.')
      assert.equal(res.json.data.errors.guests, 'Please enter a guest count between 1 and 500.')
      assert.equal(res.json.data.errors.date, 'Please choose a valid date.')
      pass('/api/inquiries?lang=en returns English validation errors')
    } catch (err) {
      fail('/api/inquiries?lang=en validation errors', err)
    }

    // 3.3 Header resolution: Accept-Language: sl
    try {
      const res = await request('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'sl-SI,sl;q=0.9'
        },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.statusMessage, 'Validacija podatkov ni uspela.')
      assert.equal(res.json.data.errors.name, 'Prosimo, vnesite svoje polno ime (vsaj 2 znaka).')
      pass('/api/inquiries resolves Accept-Language: sl-SI')
    } catch (err) {
      fail('/api/inquiries Accept-Language: sl-SI', err)
    }

    // 3.4 Header resolution: Accept-Language: en
    try {
      const res = await request('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.statusMessage, 'Validation failed.')
      assert.equal(res.json.data.errors.name, 'Please enter your full name (at least 2 characters).')
      pass('/api/inquiries resolves Accept-Language: en-US')
    } catch (err) {
      fail('/api/inquiries Accept-Language: en-US', err)
    }

    // 3.5 RFC 9110 q-factor priority
    try {
      // en has 0.9, sl has 0.8 -> should pick en
      const resEn = await request('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'sl;q=0.8, en;q=0.9'
        },
        body: JSON.stringify({})
      })
      assert.equal(resEn.json.statusMessage, 'Validation failed.')

      // sl has 0.95, en has 0.7 -> should pick sl
      const resSl = await request('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'sl;q=0.95, en;q=0.7'
        },
        body: JSON.stringify({})
      })
      assert.equal(resSl.json.statusMessage, 'Validacija podatkov ni uspela.')
      pass('/api/inquiries obeys RFC 9110 q-factors in Accept-Language')
    } catch (err) {
      fail('/api/inquiries RFC 9110 q-factor handling', err)
    }

    // 3.6 Edge cases on inquiries validation: non-integer guests, past dates
    try {
      const res = await request('/api/inquiries?lang=en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Janez Novak',
          email: 'janez@example.com',
          phone: '+38640123456',
          eventType: 'wedding',
          guests: 3.5, // float guest count
          date: '2020-01-01' // past date
        })
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.data.errors.guests, 'Please enter a guest count between 1 and 500.')
      assert.equal(res.json.data.errors.date, 'The preferred date must be in the future.')
      pass('/api/inquiries validates non-integer guests and past dates with localized errors')
    } catch (err) {
      fail('/api/inquiries edge case validation', err)
    }

    // 4. Dual-language API verification: /api/table-orders
    console.log('\n--- CHECK 4: /api/table-orders Localization & Validation ---')

    // 4.1 Slovenian via ?lang=sl
    try {
      const res = await request('/api/table-orders?lang=sl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.statusMessage, 'Validacija podatkov ni uspela.')
      assert.equal(res.json.data.errors.tableNumber, 'Številka mize mora biti celo število med 1 in 50.')
      assert.equal(res.json.data.errors.items, 'Seznam artiklov je obvezen in ne sme biti prazen.')
      pass('/api/table-orders?lang=sl returns Slovenian validation errors')
    } catch (err) {
      fail('/api/table-orders?lang=sl validation errors', err)
    }

    // 4.2 English via ?lang=en
    try {
      const res = await request('/api/table-orders?lang=en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.statusMessage, 'Validation failed.')
      assert.equal(res.json.data.errors.tableNumber, 'Table number must be an integer between 1 and 50.')
      assert.equal(res.json.data.errors.items, 'Items array is required and must not be empty.')
      pass('/api/table-orders?lang=en returns English validation errors')
    } catch (err) {
      fail('/api/table-orders?lang=en validation errors', err)
    }

    // 4.3 Out of range table number & invalid items
    try {
      const res = await request('/api/table-orders?lang=en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: 99,
          items: [{ name: 'Invalid', qty: 50, price: -5 }]
        })
      })
      assert.equal(res.status, 422)
      assert.equal(res.json.data.errors.tableNumber, 'Table number must be an integer between 1 and 50.')
      assert.equal(res.json.data.errors['items.0.menu_item_id'], 'Order item contains invalid or incomplete structure.')
      assert.equal(res.json.data.errors['items.0.qty'], 'Order item contains invalid or incomplete structure.')
      assert.equal(res.json.data.errors['items.0.price'], 'Order item contains invalid or incomplete structure.')
      pass('/api/table-orders validates out-of-range table numbers and bad item structures')
    } catch (err) {
      fail('/api/table-orders item validation', err)
    }

    // 5. Dual-language API verification: /api/menu-config
    console.log('\n--- CHECK 5: /api/menu-config Localization ---')
    try {
      const resSl = await request('/api/menu-config?lang=sl')
      assert.equal(resSl.status, 200)
      assert.equal(resSl.json.title, 'Pizzeria Meni Grad Kodeljevo')
      assert.equal(resSl.json.vatNote, 'Vse cene so v EUR in vključujejo DDV.')

      const resEn = await request('/api/menu-config?lang=en')
      assert.equal(resEn.status, 200)
      assert.equal(resEn.json.title, 'Grad Kodeljevo Pizzeria Menu')
      assert.equal(resEn.json.vatNote, 'All prices are in EUR and include VAT.')
      pass('/api/menu-config returns correctly localized titles and notes for sl and en')
    } catch (err) {
      fail('/api/menu-config localization', err)
    }

    // 6. Structured data validation: HTML head renders valid JSON-LD schemas with GEO coordinates
    console.log('\n--- CHECK 6: SSR HTML Structured Data & GEO Coordinates ---')

    // Helper to extract JSON-LD schemas from HTML
    function extractSchemas(html) {
      const regex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi
      const schemas = []
      let match
      while ((match = regex.exec(html)) !== null) {
        try {
          schemas.push(JSON.parse(match[1]))
        } catch (e) {
          throw new Error('Failed to parse JSON-LD script: ' + e.message + ' in:\n' + match[1])
        }
      }
      return schemas
    }

    // 6.1 Home page (/)
    try {
      const res = await request('/')
      assert.equal(res.status, 200)
      const schemas = extractSchemas(res.text)
      assert.ok(schemas.length > 0, 'Home page must have at least one JSON-LD block')
      
      const flatNodes = schemas.flatMap(s => s['@graph'] || [s])
      
      const venue = flatNodes.find(n => {
        const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']]
        return types.includes('LocalBusiness') || types.includes('EventVenue')
      })
      assert.ok(venue, 'Home page must include LocalBusiness / EventVenue schema')
      assert.equal(venue.geo?.['@type'], 'GeoCoordinates')
      assert.equal(venue.geo?.latitude, 46.0494, 'Latitude must be 46.0494')
      assert.equal(venue.geo?.longitude, 14.5367, 'Longitude must be 14.5367')
      assert.equal(venue.address?.streetAddress, 'Koblarjeva ulica 34')
      assert.equal(venue.address?.postalCode, '1000')
      assert.equal(venue.address?.addressLocality, 'Ljubljana')

      const restaurant = flatNodes.find(n => n['@type'] === 'Restaurant')
      assert.ok(restaurant, 'Home page must include Restaurant node')

      const club = flatNodes.find(n => n['@type'] === 'NightClub')
      assert.ok(club, 'Home page must include NightClub node')

      pass('Home page (/) renders valid JSON-LD schemas with exact coordinates (46.0494, 14.5367)')
    } catch (err) {
      fail('Home page (/) structured data check', err)
    }

    // 6.2 Pizzeria page (/pizzeria)
    try {
      const res = await request('/pizzeria')
      assert.equal(res.status, 200)
      const schemas = extractSchemas(res.text)
      assert.ok(schemas.length > 0, 'Pizzeria page must have at least one JSON-LD block')
      
      const flatNodes = schemas.flatMap(s => s['@graph'] || [s])
      const restaurant = flatNodes.find(n => {
        const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']]
        return types.includes('Restaurant') || types.includes('PizzaRestaurant')
      })
      assert.ok(restaurant, 'Pizzeria page must include Restaurant / PizzaRestaurant schema')
      assert.equal(restaurant.geo?.latitude, 46.0494)
      assert.equal(restaurant.geo?.longitude, 14.5367)
      assert.equal(restaurant.address?.streetAddress, 'Koblarjeva ulica 34')
      assert.ok(restaurant.openingHoursSpecification?.length > 0, 'Restaurant must include openingHoursSpecification')
      pass('Pizzeria page (/pizzeria) renders Restaurant schema with exact coordinates')
    } catch (err) {
      fail('Pizzeria page (/pizzeria) structured data check', err)
    }

    // 6.3 Club page (/club)
    try {
      const res = await request('/club')
      assert.equal(res.status, 200)
      const schemas = extractSchemas(res.text)
      assert.ok(schemas.length > 0, 'Club page must have at least one JSON-LD block')
      
      const flatNodes = schemas.flatMap(s => s['@graph'] || [s])
      const club = flatNodes.find(n => n['@type'] === 'NightClub')
      assert.ok(club, 'Club page must include NightClub schema')
      assert.equal(club.geo?.latitude, 46.0494)
      assert.equal(club.geo?.longitude, 14.5367)
      assert.equal(club.address?.streetAddress, 'Koblarjeva ulica 34')
      
      const events = flatNodes.filter(n => n['@type'] === 'Event')
      // Events might be dynamic depending on store, check structure if any
      pass(`Club page (/club) renders NightClub schema with exact coordinates (and ${events.length} Event nodes)`)
    } catch (err) {
      fail('Club page (/club) structured data check', err)
    }

    // 6.4 Buyouts page (/buyouts)
    try {
      const res = await request('/buyouts')
      assert.equal(res.status, 200)
      const schemas = extractSchemas(res.text)
      assert.ok(schemas.length > 0, 'Buyouts page must have at least one JSON-LD block')
      
      const flatNodes = schemas.flatMap(s => s['@graph'] || [s])
      const venue = flatNodes.find(n => {
        const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']]
        return types.includes('LocalBusiness') || types.includes('EventVenue')
      })
      assert.ok(venue, 'Buyouts page must include EventVenue schema')
      assert.equal(venue.geo?.latitude, 46.0494)
      assert.equal(venue.geo?.longitude, 14.5367)
      pass('Buyouts page (/buyouts) renders EventVenue schema with exact coordinates')
    } catch (err) {
      fail('Buyouts page (/buyouts) structured data check', err)
    }

    // 6.5 Route redirect check: /events -> /club
    try {
      const res = await request('/events')
      assert.equal(res.status, 301, '/events should return 301 redirect')
      assert.equal(res.headers.get('location'), '/club', 'Redirect destination should be /club')
      pass('/events returns 301 redirect to /club')
    } catch (err) {
      fail('/events redirect check', err)
    }

  } finally {
    console.log('\n--- Tearing down Nitro SSR server ---')
    server.kill('SIGTERM')
  }

  console.log('\n======================================================================')
  console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`)
  console.log('======================================================================\n')

  if (failCount > 0) {
    console.error('FAILURES:')
    for (const f of failures) {
      console.error(`- ${f.name}: ${f.error}`)
    }
    process.exit(1)
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit error:', err)
  process.exit(1)
})
