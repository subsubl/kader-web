/**
 * Automated Verification Test Suite for SEO, GEO & Schema.org Structured Data
 * Tests SSR HTML head tags, canonicals, hreflang alternates, JSON-LD schemas,
 * exact coordinates 46.0494, 14.5367, address Koblarjeva ulica 34, and route rules.
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

console.log('=== STARTING SEO, GEO & SCHEMA.ORG VERIFICATION SUITE ===\n')

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

test('src/composables/usePageSeo.ts defines exact coordinates and address', () => {
  const filePath = path.join(ROOT, 'src/composables/usePageSeo.ts')
  assert.ok(fs.existsSync(filePath), 'usePageSeo.ts must exist')
  const content = fs.readFileSync(filePath, 'utf8')

  assert.ok(content.includes('46.0494'), 'Must contain exact latitude 46.0494')
  assert.ok(content.includes('14.5367'), 'Must contain exact longitude 14.5367')
  assert.ok(content.includes('Koblarjeva ulica 34'), 'Must contain Koblarjeva ulica 34')
  assert.ok(content.includes('1000'), 'Must contain postalCode 1000')
  assert.ok(content.includes('Ljubljana'), 'Must contain Ljubljana')
  assert.ok(content.includes('useHead'), 'Must use useHead')
  assert.ok(content.includes('useSeoMeta'), 'Must use useSeoMeta')
  assert.ok(content.includes('x-default'), 'Must define x-default hreflang')
})

test('nuxt.config.ts has routeRules for noindex, nofollow on /admin/** and /api/**', () => {
  const content = fs.readFileSync(path.join(ROOT, 'nuxt.config.ts'), 'utf8')
  assert.ok(content.includes("'/admin/**'"), "Must have '/admin/**' route rule")
  assert.ok(content.includes("'/api/**'"), "Must have '/api/**' route rule")
  assert.ok(content.includes('noindex, nofollow'), 'Must set noindex, nofollow')
  assert.ok(content.includes('family=Inter'), 'Must include Inter font in Google Fonts link')
})

test('src/app.vue dynamically binds <html lang="..." class="dark"> via useHead', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app.vue'), 'utf8')
  assert.ok(content.includes('locale.value'), 'Must bind locale.value')
  assert.ok(content.includes('useLocale()'), 'Must use useLocale() composable')
  assert.ok(content.includes("class: 'dark'"), "Must set class: 'dark'")
})

test('src/composables/useLocale.ts handles route query lang during SSR', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/composables/useLocale.ts'), 'utf8')
  assert.ok(content.includes('useRoute()'), 'Must use useRoute')
  assert.ok(content.includes('query'), 'Must access route query')
  assert.ok(content.includes('lang'), 'Must read lang query parameter')
})

test('All public pages integrate usePageSeo', () => {
  const pages = ['index.vue', 'pizzeria.vue', 'club.vue', 'buyouts.vue', 'shop.vue']
  for (const page of pages) {
    const pageContent = fs.readFileSync(path.join(ROOT, `src/pages/${page}`), 'utf8')
    assert.ok(pageContent.includes('usePageSeo('), `${page} must invoke usePageSeo`)
  }
})

// ---------------------------------------------------------------------------
// 2. Integration SSR HTML Verification
// ---------------------------------------------------------------------------
const SERVER_ENTRY = path.join(ROOT, '.output/server/index.mjs')

async function runSsrTests() {
  console.log('\n--- SECTION 2: End-to-End SSR HTML Tests ---')

  if (!fs.existsSync(SERVER_ENTRY)) {
    console.warn(`WARNING: Built server not found at ${SERVER_ENTRY}. Run npm run build first.`)
    return
  }

  const TEST_PORT = 3194
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
      const req = http.get(`${BASE_URL}/`, (res) => {
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

  async function fetchHtml(urlPath) {
    const res = await fetch(`${BASE_URL}${urlPath}`)
    const html = await res.text()
    return { status: res.status, html, headers: res.headers }
  }

  function extractJsonLdItems(html) {
    const regex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    const items = []
    let match
    while ((match = regex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1])
        if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
          items.push(...parsed['@graph'])
        } else {
          items.push(parsed)
        }
      } catch (err) {
        console.warn('Failed to parse JSON-LD chunk:', err)
      }
    }
    return items
  }

  function matchesType(item, targetType) {
    if (!item || !item['@type']) return false
    if (Array.isArray(item['@type'])) {
      return item['@type'].includes(targetType)
    }
    return item['@type'] === targetType
  }

  // --- Home Page SSR Verification ---
  await asyncTest('SSR Homepage / has canonical, 10 hreflangs + x-default, and OpenGraph/Twitter', async () => {
    const { status, html } = await fetchHtml('/')
    assert.equal(status, 200)

    // Canonical link
    assert.ok(
      /<link [^>]*rel="canonical"[^>]*href="https:\/\/www\.kader\.si\/?/i.test(html),
      'Homepage canonical link must point to https://www.kader.si'
    )

    // 10 hreflangs + x-default
    const locales = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']
    for (const loc of locales) {
      const locRegex = new RegExp(`hreflang="${loc}"[^>]*href="https://www\\.kader\\.si/?\\?lang=${loc}"`, 'i')
      const altRegex = new RegExp(`href="https://www\\.kader\\.si/?\\?lang=${loc}"[^>]*hreflang="${loc}"`, 'i')
      assert.ok(
        locRegex.test(html) || altRegex.test(html),
        `Homepage must include alternate hreflang="${loc}"`
      )
    }
    assert.ok(
      html.includes('hreflang="x-default"') && html.includes('https://www.kader.si'),
      'Homepage must include x-default hreflang pointing to base url'
    )

    // OpenGraph & Twitter
    assert.ok(html.includes('property="og:title"'), 'Must include og:title')
    assert.ok(html.includes('property="og:description"'), 'Must include og:description')
    assert.ok(html.includes('property="og:url"'), 'Must include og:url')
    assert.ok(html.includes('name="twitter:card"'), 'Must include twitter:card')
  })

  await asyncTest('SSR Homepage / JSON-LD schema has exact coordinates and address', async () => {
    const { html } = await fetchHtml('/')
    const items = extractJsonLdItems(html)
    assert.ok(items.length > 0, 'Homepage must render JSON-LD items')

    const mainSchema = items.find(s => matchesType(s, 'EventVenue') || matchesType(s, 'LocalBusiness'))
    assert.ok(mainSchema, 'Must find EventVenue or LocalBusiness schema')

    // Exact GEO
    assert.equal(mainSchema.geo?.latitude, 46.0494, 'Latitude must be exactly 46.0494')
    assert.equal(mainSchema.geo?.longitude, 14.5367, 'Longitude must be exactly 14.5367')

    // Exact Address
    assert.equal(mainSchema.address?.streetAddress, 'Koblarjeva ulica 34')
    assert.equal(mainSchema.address?.postalCode, '1000')
    assert.equal(mainSchema.address?.addressLocality, 'Ljubljana')
    assert.equal(mainSchema.address?.addressCountry, 'SI')
  })

  // --- Locale Switching via Query Param in SSR ---
  await asyncTest('SSR /?lang=en renders <html lang="en"', async () => {
    const { html } = await fetchHtml('/?lang=en')
    assert.ok(/<html[^>]*\blang="en"/i.test(html), 'Must render <html lang="en" in SSR')
  })

  await asyncTest('SSR /?lang=sl renders <html lang="sl"', async () => {
    const { html } = await fetchHtml('/?lang=sl')
    assert.ok(/<html[^>]*\blang="sl"/i.test(html), 'Must render <html lang="sl" in SSR')
  })

  // --- Pizzeria Page SSR Verification ---
  await asyncTest('SSR /pizzeria has canonical, Restaurant schema, and exact coordinates', async () => {
    const { status, html } = await fetchHtml('/pizzeria')
    assert.equal(status, 200)

    assert.ok(
      /<link [^>]*rel="canonical"[^>]*href="https:\/\/www\.kader\.si\/pizzeria/i.test(html),
      'Pizzeria canonical must be https://www.kader.si/pizzeria'
    )

    // Hreflang
    assert.ok(html.includes('https://www.kader.si/pizzeria?lang=sl'))
    assert.ok(html.includes('https://www.kader.si/pizzeria?lang=en'))

    // Schema
    const items = extractJsonLdItems(html)
    const restaurantSchema = items.find(s => matchesType(s, 'Restaurant') || matchesType(s, 'PizzaRestaurant'))
    assert.ok(restaurantSchema, 'Must have Restaurant or PizzaRestaurant schema')
    assert.equal(restaurantSchema.geo?.latitude, 46.0494)
    assert.equal(restaurantSchema.geo?.longitude, 14.5367)
    assert.equal(restaurantSchema.address?.streetAddress, 'Koblarjeva ulica 34')
  })

  // --- Club Page SSR Verification ---
  await asyncTest('SSR /club has canonical, NightClub schema, and exact coordinates', async () => {
    const { status, html } = await fetchHtml('/club')
    assert.equal(status, 200)

    assert.ok(
      /<link [^>]*rel="canonical"[^>]*href="https:\/\/www\.kader\.si\/club/i.test(html),
      'Club canonical must be https://www.kader.si/club'
    )

    // Schema
    const items = extractJsonLdItems(html)
    const clubSchema = items.find(s => matchesType(s, 'NightClub'))
    assert.ok(clubSchema, 'Must have NightClub schema')
    assert.equal(clubSchema.geo?.latitude, 46.0494)
    assert.equal(clubSchema.geo?.longitude, 14.5367)
    assert.equal(clubSchema.address?.streetAddress, 'Koblarjeva ulica 34')

    // Also verify dynamic event schemas are attached
    const eventSchemas = items.filter(s => matchesType(s, 'Event'))
    assert.ok(eventSchemas.length > 0, 'Club page must render Event schemas')
  })

  // --- Buyouts Page SSR Verification ---
  await asyncTest('SSR /buyouts has canonical and EventVenue schema', async () => {
    const { status, html } = await fetchHtml('/buyouts')
    assert.equal(status, 200)

    assert.ok(
      /<link [^>]*rel="canonical"[^>]*href="https:\/\/www\.kader\.si\/buyouts/i.test(html),
      'Buyouts canonical must be https://www.kader.si/buyouts'
    )

    const items = extractJsonLdItems(html)
    const venueSchema = items.find(s => matchesType(s, 'EventVenue') || matchesType(s, 'LocalBusiness'))
    assert.ok(venueSchema, 'Must have EventVenue or LocalBusiness schema')
    assert.equal(venueSchema.geo?.latitude, 46.0494)
    assert.equal(venueSchema.geo?.longitude, 14.5367)
  })

  // --- Shop Page SSR Verification ---
  await asyncTest('SSR /shop has canonical and Store schema', async () => {
    const { status, html } = await fetchHtml('/shop')
    assert.equal(status, 200)

    assert.ok(
      /<link [^>]*rel="canonical"[^>]*href="https:\/\/www\.kader\.si\/shop/i.test(html),
      'Shop canonical must be https://www.kader.si/shop'
    )

    const items = extractJsonLdItems(html)
    const shopSchema = items.find(s => matchesType(s, 'Store') || matchesType(s, 'LocalBusiness'))
    assert.ok(shopSchema, 'Must have Store or LocalBusiness schema')
    assert.equal(shopSchema.geo?.latitude, 46.0494)
    assert.equal(shopSchema.geo?.longitude, 14.5367)
  })

  // --- Route Rules X-Robots-Tag Verification ---
  await asyncTest('/admin and /api route rules send X-Robots-Tag: noindex, nofollow', async () => {
    const adminRes = await fetch(`${BASE_URL}/admin`)
    const apiRes = await fetch(`${BASE_URL}/api/menu-config`)

    const adminRobots = adminRes.headers.get('x-robots-tag')
    const apiRobots = apiRes.headers.get('x-robots-tag')

    assert.ok(adminRobots?.includes('noindex'), 'Admin route must have noindex in X-Robots-Tag')
    assert.ok(apiRobots?.includes('noindex'), 'API route must have noindex in X-Robots-Tag')
  })

  // Clean shutdown
  serverProcess.kill('SIGTERM')
}

await runSsrTests()

console.log(`\n======================================================`)
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`======================================================`)

if (failCount > 0) {
  console.error('\nFAILURES ENCOUNTERED:')
  findings.forEach(f => console.error(`- ${f.test}: ${f.error}`))
  process.exit(1)
} else {
  console.log('\nALL SEO, GEO & SCHEMA VERIFICATIONS PASSED WITH 0 ERRORS.')
  process.exit(0)
}
