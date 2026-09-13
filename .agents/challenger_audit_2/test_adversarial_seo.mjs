/**
 * Adversarial SEO, GEO & Schema.org Test Suite for Kader
 * Challenger 2 (Adversarial SEO, GEO & Schema Challenger)
 *
 * Runs against the production Nitro build (`node .output/server/index.mjs`)
 */

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

const TEST_PORT = 3388
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`

let totalAssertions = 0
let passedAssertions = 0
let failedAssertions = 0
const failures = []

function recordAssertion(description, passed, details = '') {
  totalAssertions++
  if (passed) {
    passedAssertions++
    console.log(`  [PASS] [Assert #${totalAssertions}] ${description}`)
  } else {
    failedAssertions++
    const err = `[FAIL] [Assert #${totalAssertions}] ${description} ${details ? `(${details})` : ''}`
    console.error(`  ${err}`)
    failures.push(err)
  }
}

function expect(actual, expected, desc) {
  const ok = actual === expected
  recordAssertion(desc, ok, ok ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

function expectIncludes(haystack, needle, desc) {
  const ok = typeof haystack === 'string' && haystack.includes(needle)
  recordAssertion(desc, ok, ok ? '' : `expected to include ${JSON.stringify(needle)}`)
}

function expectMatches(haystack, regex, desc) {
  const ok = typeof haystack === 'string' && regex.test(haystack)
  recordAssertion(desc, ok, ok ? '' : `expected to match ${regex}`)
}

function expectTrue(val, desc, details) {
  recordAssertion(desc, Boolean(val), details)
}

// Helper to recursively collect all objects inside JSON-LD (including nested)
function collectAllObjects(obj, acc = []) {
  if (!obj || typeof obj !== 'object') return acc
  acc.push(obj)
  if (Array.isArray(obj)) {
    for (const item of obj) {
      collectAllObjects(item, acc)
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object') {
        collectAllObjects(obj[key], acc)
      }
    }
  }
  return acc
}

async function fetchWithRetry(url, options = {}, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options)
      return res
    } catch (e) {
      if (i === maxRetries - 1) throw e
      await new Promise(r => setTimeout(r, 200))
    }
  }
}

async function runAdversarialSuite() {
  console.log('======================================================================')
  console.log('  CHALLENGER 2: ADVERSARIAL SEO, GEO & SCHEMA.ORG TEST SUITE')
  console.log('======================================================================\n')

  // =========================================================================
  // TEST GROUP 1: Static Source & Built Output Grep Verification
  // =========================================================================
  console.log('--- TEST GROUP 1: Grep Outdated Coords, Typos & Addresses ---')

  const scanDirs = ['src', 'public', '.output']
  const forbiddenPatterns = [
    { pattern: '46.0515', label: 'Outdated latitude 46.0515' },
    { pattern: '14.5361', label: 'Outdated longitude 14.5361' },
    { pattern: /kobalarjeva/i, label: 'Misspelled street name Kobalarjeva' }
  ]

  function scanFileForPatterns(filePath) {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      const children = fs.readdirSync(filePath)
      for (const child of children) {
        scanFileForPatterns(path.join(filePath, child))
      }
    } else if (stat.isFile()) {
      // Check text or binary content
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        for (const { pattern, label } of forbiddenPatterns) {
          const matched = typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content)
          if (matched) {
            recordAssertion(`ZERO occurrences of ${label} in ${filePath}`, false, `Found match in ${filePath}`)
          }
        }
      } catch (err) {
        // Skip unreadable files
      }
    }
  }

  for (const dir of scanDirs) {
    const fullDirPath = path.join(ROOT, dir)
    if (fs.existsSync(fullDirPath)) {
      scanFileForPatterns(fullDirPath)
    }
  }
  // Check nuxt.config.ts explicitly
  scanFileForPatterns(path.join(ROOT, 'nuxt.config.ts'))

  recordAssertion('Grep scan completed across src/, public/, nuxt.config.ts, and .output/', true)

  // =========================================================================
  // TEST GROUP 2: Spawn Production Nitro Server
  // =========================================================================
  console.log('\n--- TEST GROUP 2: Production Server Spawning & Readiness ---')

  expectTrue(fs.existsSync(SERVER_ENTRY), 'Nitro server bundle entry exists at .output/server/index.mjs')

  const serverProc = spawn('node', [SERVER_ENTRY], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(TEST_PORT), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  let serverStarted = false
  serverProc.stdout.on('data', d => {
    const msg = d.toString()
    if (msg.includes('Listening')) serverStarted = true
  })

  // Poll for connection
  let ready = false
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const checkRes = await fetch(`${BASE_URL}/`)
      if (checkRes.status === 200) {
        ready = true
        break
      }
    } catch (err) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  expectTrue(ready, `Production Nitro server is responsive on port ${TEST_PORT}`)

  try {
    // =========================================================================
    // TEST GROUP 3: SSR HTML Inspection & Canonical / Hreflang on All Public Routes
    // =========================================================================
    console.log('\n--- TEST GROUP 3: SSR HTML, Canonical & 10 Hreflang Alternates ---')

    const publicRoutes = [
      { route: '/', canonical: 'https://www.kader.si' },
      { route: '/pizzeria', canonical: 'https://www.kader.si/pizzeria' },
      { route: '/club', canonical: 'https://www.kader.si/club' },
      { route: '/buyouts', canonical: 'https://www.kader.si/buyouts' },
      { route: '/shop', canonical: 'https://www.kader.si/shop' }
    ]

    const expectedLocales = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']

    const routeHtmlMap = new Map()

    for (const { route, canonical } of publicRoutes) {
      console.log(`\n  Checking route: ${route}`)
      const res = await fetchWithRetry(`${BASE_URL}${route}`)
      expect(res.status, 200, `Route ${route} returns HTTP 200 OK`)
      
      const html = await res.text()
      routeHtmlMap.set(route, html)

      // 1. Canonical tag assertion
      const canonicalRegex = /<link\s+[^>]*rel="canonical"[^>]*>/gi
      const canonicalMatches = [...html.matchAll(canonicalRegex)]
      expect(canonicalMatches.length, 1, `Route ${route} must have EXACTLY ONE canonical link tag`)
      
      if (canonicalMatches.length > 0) {
        const tag = canonicalMatches[0][0]
        const hrefMatch = tag.match(/href="([^"]+)"/i)
        expectTrue(hrefMatch, `Route ${route} canonical tag has href attribute`)
        if (hrefMatch) {
          const hrefVal = hrefMatch[1]
          // Allow trailing slash on homepage, but strictly no trailing slash on subpages
          if (route === '/') {
            expectTrue(
              hrefVal === 'https://www.kader.si' || hrefVal === 'https://www.kader.si/',
              `Homepage canonical must be https://www.kader.si (got ${hrefVal})`
            )
          } else {
            expect(hrefVal, canonical, `Subpage ${route} canonical must be strictly ${canonical}`)
          }
        }
      }

      // 2. 10 Hreflang alternate tags + x-default assertion
      const hreflangRegex = /<link\s+[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*>/gi
      const altRegex = /<link\s+[^>]*hreflang="([^"]+)"[^>]*rel="alternate"[^>]*>/gi
      
      const foundHreflangs = new Map()
      
      // Match both tag attribute orders
      for (const m of [...html.matchAll(hreflangRegex), ...html.matchAll(altRegex)]) {
        const fullTag = m[0]
        const lang = m[1]
        const hrefM = fullTag.match(/href="([^"]+)"/i)
        if (hrefM) {
          foundHreflangs.set(lang, hrefM[1])
        }
      }

      for (const loc of expectedLocales) {
        const expectedHref = `${canonical}?lang=${loc}`
        const actualHref = foundHreflangs.get(loc)
        expect(
          actualHref,
          expectedHref,
          `Route ${route} has hreflang="${loc}" pointing to ${expectedHref}`
        )
      }

      // x-default hreflang assertion
      const actualXDefault = foundHreflangs.get('x-default')
      if (route === '/') {
        expectTrue(
          actualXDefault === 'https://www.kader.si' || actualXDefault === 'https://www.kader.si/',
          `Homepage x-default hreflang points to https://www.kader.si (got ${actualXDefault})`
        )
      } else {
        expect(
          actualXDefault,
          canonical,
          `Subpage ${route} x-default hreflang must point to ${canonical}`
        )
      }

      // ADVERSARIAL CHECK: Ensure subpages do NOT leak root '/' as canonical or hreflang alternate!
      if (route !== '/') {
        const leaksRoot = (foundHreflangs.get('sl') === 'https://www.kader.si?lang=sl') ||
                          (foundHreflangs.get('sl') === 'https://www.kader.si/?lang=sl') ||
                          (foundHreflangs.get('x-default') === 'https://www.kader.si')
        expectTrue(!leaksRoot, `Subpage ${route} does NOT leak root '/' hreflang links from nuxt.config.ts`)
      }

      // 3. OpenGraph and Twitter Meta Tags
      expectMatches(html, /<meta\s+[^>]*property="og:title"/i, `Route ${route} has og:title`)
      expectMatches(html, /<meta\s+[^>]*property="og:description"/i, `Route ${route} has og:description`)
      expectMatches(html, /<meta\s+[^>]*property="og:image"/i, `Route ${route} has og:image`)
      expectMatches(html, /<meta\s+[^>]*property="og:url"/i, `Route ${route} has og:url`)
      expectMatches(html, /<meta\s+[^>]*name="twitter:card"/i, `Route ${route} has twitter:card`)
    }

    // =========================================================================
    // TEST GROUP 4: Schema.org JSON-LD Extraction, Parsing & Syntax Verification
    // =========================================================================
    console.log('\n--- TEST GROUP 4: Schema.org JSON-LD Extraction & Validation ---')

    const allExtractedSchemas = []

    for (const [route, html] of routeHtmlMap.entries()) {
      const scriptRegex = /<script\s+[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
      const matches = [...html.matchAll(scriptRegex)]

      expectTrue(matches.length >= 1, `Route ${route} must have at least one application/ld+json script tag`)

      for (let i = 0; i < matches.length; i++) {
        const rawJson = matches[i][1].trim()
        let parsed = null
        let parseError = null
        try {
          parsed = JSON.parse(rawJson)
        } catch (err) {
          parseError = err.message
        }

        expect(parseError, null, `Route ${route} script #${i+1} JSON.parse() syntax check (0 errors)`)
        expectTrue(parsed !== null && typeof parsed === 'object', `Route ${route} script #${i+1} produces valid non-null object`)

        if (parsed) {
          expect(parsed['@context'], 'https://schema.org', `Route ${route} script #${i+1} has @context "https://schema.org"`)
          allExtractedSchemas.push({ route, schema: parsed })
        }
      }
    }

    // =========================================================================
    // TEST GROUP 5: GEO Coordinates Strict Assertion (46.0494, 14.5367)
    // =========================================================================
    console.log('\n--- TEST GROUP 5: Exact GEO Coordinates Verification ---')

    let totalGeoEntitiesFound = 0

    for (const { route, schema } of allExtractedSchemas) {
      const objects = collectAllObjects(schema)
      for (const obj of objects) {
        if (obj && obj.geo) {
          totalGeoEntitiesFound++
          const geo = obj.geo
          const entityType = obj['@type'] || 'UnknownEntity'
          const entityName = obj.name || obj['@id'] || 'Unnamed'

          console.log(`  Found geo on [${route}] ${Array.isArray(entityType) ? entityType.join('/') : entityType} (${entityName})`)

          expect(geo['@type'], 'GeoCoordinates', `Geo on [${route}] ${entityName} has @type 'GeoCoordinates'`)
          expect(geo.latitude, 46.0494, `Geo on [${route}] ${entityName} latitude === 46.0494`)
          expect(geo.longitude, 14.5367, `Geo on [${route}] ${entityName} longitude === 14.5367`)
          expect(typeof geo.latitude, 'number', `Geo on [${route}] ${entityName} latitude is numeric type`)
          expect(typeof geo.longitude, 'number', `Geo on [${route}] ${entityName} longitude is numeric type`)
        }
      }
    }

    expectTrue(totalGeoEntitiesFound >= 5, `Must find at least 5 geo entities across all routes (found ${totalGeoEntitiesFound})`)

    // =========================================================================
    // TEST GROUP 6: Postal Address Strict Assertion ("Koblarjeva ulica 34")
    // =========================================================================
    console.log('\n--- TEST GROUP 6: Postal Address Strict Verification ---')

    let totalAddressesFound = 0

    for (const { route, schema } of allExtractedSchemas) {
      const objects = collectAllObjects(schema)
      for (const obj of objects) {
        if (obj && (obj.address || obj['@type'] === 'PostalAddress')) {
          const addr = obj['@type'] === 'PostalAddress' ? obj : obj.address
          if (typeof addr === 'object' && addr !== null) {
            totalAddressesFound++
            const entityName = obj.name || obj['@id'] || 'Unnamed'
            console.log(`  Found postal address on [${route}] ${entityName}: ${addr.streetAddress}`)

            expect(addr.streetAddress, 'Koblarjeva ulica 34', `Address on [${route}] ${entityName} has streetAddress 'Koblarjeva ulica 34'`)
            expect(addr.addressLocality, 'Ljubljana', `Address on [${route}] ${entityName} has addressLocality 'Ljubljana'`)
            expect(addr.postalCode, '1000', `Address on [${route}] ${entityName} has postalCode '1000'`)
            expect(addr.addressCountry, 'SI', `Address on [${route}] ${entityName} has addressCountry 'SI'`)
          }
        }
      }
    }

    expectTrue(totalAddressesFound >= 5, `Must find at least 5 postal addresses across all routes (found ${totalAddressesFound})`)

    // =========================================================================
    // TEST GROUP 7: Dynamic HTML lang Attribute via SSR Query Parameter
    // =========================================================================
    console.log('\n--- TEST GROUP 7: Dynamic HTML lang Attribute Verification ---')

    const langTestCases = [
      { url: '/?lang=en', expectedLang: 'en' },
      { url: '/?lang=sl', expectedLang: 'sl' },
      { url: '/?lang=de', expectedLang: 'de' },
      { url: '/?lang=fr', expectedLang: 'fr' },
      { url: '/?lang=it', expectedLang: 'it' },
      { url: '/?lang=sr', expectedLang: 'sr' },
      { url: '/?lang=nl', expectedLang: 'nl' },
      { url: '/?lang=pl', expectedLang: 'pl' },
      { url: '/?lang=cs', expectedLang: 'cs' },
      { url: '/?lang=es', expectedLang: 'es' },
      { url: '/pizzeria?lang=en', expectedLang: 'en' },
      { url: '/club?lang=de', expectedLang: 'de' },
      { url: '/?lang=INVALID_LANG', expectedLang: 'sl' } // Fallback check
    ]

    for (const { url, expectedLang } of langTestCases) {
      const res = await fetchWithRetry(`${BASE_URL}${url}`)
      const html = await res.text()
      const langMatch = html.match(/<html[^>]*\blang="([^"]+)"/i)
      
      expectTrue(langMatch !== null, `HTML tag on ${url} contains lang attribute`)
      if (langMatch) {
        expect(langMatch[1], expectedLang, `HTML lang attribute on ${url} is '${expectedLang}'`)
      }
    }

    // =========================================================================
    // TEST GROUP 8: X-Robots-Tag Route Rules on /admin and /api
    // =========================================================================
    console.log('\n--- TEST GROUP 8: X-Robots-Tag Route Rules Verification ---')

    const restrictedRoutes = [
      { path: '/admin', desc: '/admin root' },
      { path: '/admin/', desc: '/admin/ trailing slash' },
      { path: '/admin/login', desc: '/admin/login child route' },
      { path: '/api', desc: '/api root' },
      { path: '/api/', desc: '/api/ trailing slash' },
      { path: '/api/menu-config', desc: '/api/menu-config endpoint' },
      { path: '/api/ra-events', desc: '/api/ra-events endpoint' }
    ]

    for (const { path: routePath, desc } of restrictedRoutes) {
      const res = await fetchWithRetry(`${BASE_URL}${routePath}`)
      const xRobots = res.headers.get('x-robots-tag')
      expectTrue(xRobots !== null, `Route ${desc} sends X-Robots-Tag header`)
      if (xRobots) {
        expectIncludes(xRobots, 'noindex', `Route ${desc} X-Robots-Tag contains 'noindex' (got: ${xRobots})`)
        expectIncludes(xRobots, 'nofollow', `Route ${desc} X-Robots-Tag contains 'nofollow' (got: ${xRobots})`)
      }
    }

    // ADVERSARIAL CHECK: Public routes must NOT have X-Robots-Tag: noindex
    for (const { route } of publicRoutes) {
      const res = await fetchWithRetry(`${BASE_URL}${route}`)
      const xRobots = res.headers.get('x-robots-tag')
      const hasNoindex = xRobots && xRobots.includes('noindex')
      expectTrue(!hasNoindex, `Public route ${route} must NOT have X-Robots-Tag: noindex`)
    }

    // =========================================================================
    // TEST GROUP 9: Entity Type & Schema Specifics per Route
    // =========================================================================
    console.log('\n--- TEST GROUP 9: Specific Schema Types per Public Route ---')

    // / (Home)
    const homeObjects = collectAllObjects(allExtractedSchemas.find(s => s.route === '/')?.schema)
    const homeTypes = homeObjects.map(o => o['@type']).flat()
    expectTrue(homeTypes.includes('EventVenue') || homeTypes.includes('LocalBusiness'), 'Homepage contains EventVenue or LocalBusiness')
    expectTrue(homeTypes.includes('Restaurant'), 'Homepage contains Restaurant reference')
    expectTrue(homeTypes.includes('NightClub'), 'Homepage contains NightClub reference')

    // /pizzeria
    const pizzeriaObjects = collectAllObjects(allExtractedSchemas.find(s => s.route === '/pizzeria')?.schema)
    const pizzeriaTypes = pizzeriaObjects.map(o => o['@type']).flat()
    expectTrue(pizzeriaTypes.includes('Restaurant') || pizzeriaTypes.includes('PizzaRestaurant'), '/pizzeria contains Restaurant or PizzaRestaurant')

    // /club
    const clubObjects = collectAllObjects(allExtractedSchemas.find(s => s.route === '/club')?.schema)
    const clubTypes = clubObjects.map(o => o['@type']).flat()
    expectTrue(clubTypes.includes('NightClub'), '/club contains NightClub')
    expectTrue(clubTypes.includes('Event'), '/club contains dynamic Event schemas')

    // /buyouts
    const buyoutsObjects = collectAllObjects(allExtractedSchemas.find(s => s.route === '/buyouts')?.schema)
    const buyoutsTypes = buyoutsObjects.map(o => o['@type']).flat()
    expectTrue(buyoutsTypes.includes('EventVenue') || buyoutsTypes.includes('LocalBusiness'), '/buyouts contains EventVenue or LocalBusiness')

    // /shop
    const shopObjects = collectAllObjects(allExtractedSchemas.find(s => s.route === '/shop')?.schema)
    const shopTypes = shopObjects.map(o => o['@type']).flat()
    expectTrue(shopTypes.includes('Store'), '/shop contains Store schema')

    // =========================================================================
    // TEST GROUP 10: Adversarial Edge Cases (Query Pollution, Casing, UI Residuals)
    // =========================================================================
    console.log('\n--- TEST GROUP 10: Adversarial Edge Cases & Stress-Testing ---')

    // 1. Query parameter pollution on canonical
    const pollutedUrl = '/pizzeria?utm_source=google&fbclid=12345&lang=sl'
    const pollRes = await fetchWithRetry(`${BASE_URL}${pollutedUrl}`)
    const pollHtml = await pollRes.text()
    const pollCanonicalMatch = pollHtml.match(/<link\s+[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i)
    expectTrue(pollCanonicalMatch !== null, 'Canonical tag exists even under query pollution')
    if (pollCanonicalMatch) {
      expect(
        pollCanonicalMatch[1],
        'https://www.kader.si/pizzeria',
        'Canonical URL remains clean (https://www.kader.si/pizzeria) under query pollution'
      )
    }

    // 2. Uppercase query parameter handling
    const upperRes = await fetchWithRetry(`${BASE_URL}/?lang=EN`)
    const upperHtml = await upperRes.text()
    const upperLangMatch = upperHtml.match(/<html[^>]*\blang="([^"]+)"/i)
    expectTrue(upperLangMatch !== null, 'HTML lang attribute exists for ?lang=EN')
    if (upperLangMatch) {
      expect(upperLangMatch[1], 'en', 'Dynamic lang attribute handles uppercase ?lang=EN correctly')
    }

    // 3. UI Body Address Adversarial Scan: Check for legacy "Ulica Carla Benza 20" in SSR HTML
    let carlaBenzaOccurrences = 0
    const carlaBenzaLocations = []
    for (const { route } of publicRoutes) {
      for (const loc of expectedLocales) {
        const pageRes = await fetchWithRetry(`${BASE_URL}${route}?lang=${loc}`)
        const pageHtml = await pageRes.text()
        if (pageHtml.includes('Carla Benza')) {
          carlaBenzaOccurrences++
          carlaBenzaLocations.push(`${route}?lang=${loc}`)
        }
      }
    }

    // Adversarial assertion: Body HTML across all routes and locales should have ZERO "Carla Benza"
    expect(
      carlaBenzaOccurrences,
      0,
      `ZERO occurrences of legacy 'Ulica Carla Benza 20' in SSR body HTML across all routes and locales (Found in: ${carlaBenzaLocations.slice(0, 5).join(', ')}${carlaBenzaLocations.length > 5 ? '...' : ''})`
    )

  } finally {
    // Teardown production server process
    serverProc.kill('SIGTERM')
  }

  console.log('\n======================================================================')
  console.log('  TEST EXECUTION SUMMARY')
  console.log('======================================================================')
  console.log(`  Total Assertions Checked : ${totalAssertions}`)
  console.log(`  Passed Assertions        : ${passedAssertions}`)
  console.log(`  Failed Assertions        : ${failedAssertions}`)
  console.log('======================================================================')

  if (failures.length > 0) {
    console.error('\nFAILURES:')
    failures.forEach(f => console.error(`  - ${f}`))
    process.exit(1)
  } else {
    console.log('\nALL ADVERSARIAL SEO, GEO & SCHEMA ASSERTIONS PASSED EMPIRICALLY.')
    process.exit(0)
  }
}

runAdversarialSuite().catch(err => {
  console.error('Fatal Test Runner Exception:', err)
  process.exit(1)
})
