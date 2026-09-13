/**
 * test_ssr_server.mjs
 * Empirically launches the production Nitro bundle and sends real HTTP requests to verify:
 * - 301 Redirection (/events -> /club) with headers
 * - SSR rendering of /club (HTML structure, schema, SEO, absence of removed sections)
 * - Navigation links in homepage
 */

import { spawn } from 'node:child_process'
import http from 'node:http'

const PORT = 3088
const BASE_URL = `http://127.0.0.1:${PORT}`

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/_nitro/health`).catch(() => null)
      // Any response or 404/200 means server is bound
      const resRoot = await fetch(`${BASE_URL}/`).catch(() => null)
      if (resRoot) return true
    } catch {}
    await sleep(500)
  }
  return false
}

async function run() {
  console.log('Starting Nitro production server on port ' + PORT + '...')
  const server = spawn('node', ['.output/server/index.mjs'], {
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: 'pipe'
  })

  let serverOutput = ''
  server.stdout.on('data', d => { serverOutput += d.toString() })
  server.stderr.on('data', d => { serverOutput += d.toString() })

  const results = []

  try {
    const ready = await waitForServer()
    if (!ready) {
      throw new Error(`Server failed to start within timeout. Output: ${serverOutput}`)
    }
    console.log('Production server is READY on ' + BASE_URL)

    // Test 1: GET /events -> 301 Redirect to /club
    console.log('\n--- Test 1: GET /events Redirection ---')
    const resEvents = await fetch(`${BASE_URL}/events`, { redirect: 'manual' })
    console.log(`Status: ${resEvents.status}`)
    console.log(`Location header: ${resEvents.headers.get('location')}`)

    results.push({
      test: 'GET /events returns HTTP 301',
      pass: resEvents.status === 301,
      details: { status: resEvents.status, location: resEvents.headers.get('location') }
    })

    results.push({
      test: 'GET /events redirects to /club',
      pass: resEvents.headers.get('location') === '/club',
      details: { location: resEvents.headers.get('location') }
    })

    // Test 2: GET /events?tag=techno
    console.log('\n--- Test 2: GET /events?tag=techno Query Forwarding ---')
    const resQuery = await fetch(`${BASE_URL}/events?tag=techno`, { redirect: 'manual' })
    const locQuery = resQuery.headers.get('location')
    console.log(`Status with query: ${resQuery.status}, location: ${locQuery}`)
    results.push({
      test: 'GET /events?tag=techno returns 301 redirect',
      pass: resQuery.status === 301,
      details: { status: resQuery.status, location: locQuery }
    })

    // Test 3: GET /club SSR HTML
    console.log('\n--- Test 3: GET /club SSR HTML ---')
    const resClub = await fetch(`${BASE_URL}/club`)
    const clubHtml = await resClub.text()
    console.log(`Club page status: ${resClub.status}, HTML size: ${clubHtml.length} bytes`)

    results.push({
      test: 'GET /club returns HTTP 200 OK',
      pass: resClub.status === 200,
      details: { status: resClub.status }
    })

    results.push({
      test: 'SSR HTML includes Club Hero and Location',
      pass: clubHtml.includes('Club<br>Kader') || clubHtml.includes('Club') && clubHtml.includes('Kader'),
      details: 'Hero title verified'
    })

    results.push({
      test: 'SSR HTML contains #events section anchor',
      pass: clubHtml.includes('id="events"'),
      details: 'Events anchor verified'
    })

    results.push({
      test: 'SSR HTML contains Door Policy / Culture & Safety FAQ',
      pass: clubHtml.includes('Ljubljanska klubska kultura, svoboda in varnost') ||
            clubHtml.includes('Pravila na vratih') ||
            clubHtml.includes('doorPolicy'),
      details: 'Door policy verified'
    })

    results.push({
      test: 'SSR HTML contains JSON-LD structured data with NightClub & EventSeries',
      pass: clubHtml.includes('application/ld+json') &&
            clubHtml.includes('NightClub') &&
            clubHtml.includes('EventSeries'),
      details: 'JSON-LD schema verified'
    })

    // Check complete absence of removed sections
    const floorsFound = clubHtml.includes('club.floorsTitle') ||
                        clubHtml.includes('club.exploreSpaces') ||
                        clubHtml.includes('club_floor1_bg')
    results.push({
      test: 'SSR HTML completely lacks Floors 01/02 sections',
      pass: !floorsFound,
      details: { floorsFound }
    })

    const specsFound = clubHtml.includes('Klipsch La Scala Audio Architecture') ||
                       clubHtml.includes('Max Continuous SPL') ||
                       clubHtml.includes('showSpecs')
    results.push({
      test: 'SSR HTML completely lacks Sound System technical specs table',
      pass: !specsFound,
      details: { specsFound }
    })

    // Test 4: GET / Homepage Navigation Cleanliness
    console.log('\n--- Test 4: GET / Homepage Links ---')
    const resHome = await fetch(`${BASE_URL}/`)
    const homeHtml = await resHome.text()
    const homeHasOldEventsLink = /href=["']\/events["']/.test(homeHtml)
    results.push({
      test: 'Homepage SSR HTML contains no links to /events',
      pass: !homeHasOldEventsLink,
      details: { homeHasOldEventsLink }
    })

    const homeHasClubLink = /href=["']\/club["']/.test(homeHtml)
    results.push({
      test: 'Homepage SSR HTML contains links to /club',
      pass: homeHasClubLink,
      details: { homeHasClubLink }
    })

  } finally {
    console.log('Shutting down production server...')
    server.kill('SIGTERM')
  }

  console.log('\n=====================================================')
  console.log('SSR PRODUCTION SERVER TEST RESULTS')
  console.log('=====================================================')
  let passed = 0
  let failed = 0
  for (const r of results) {
    if (r.pass) {
      passed++
      console.log(`✅ PASS: ${r.test}`)
    } else {
      failed++
      console.error(`❌ FAIL: ${r.test}`, r.details)
    }
  }
  console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`)

  if (failed > 0) {
    process.exit(1)
  }
}

run().catch(err => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
