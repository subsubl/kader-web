// /home/ator/Kader/.agents/victory_auditor/independent_audit.mjs
// Independent Victory Verification Script for Kader Grad Kodeljevo
import assert from 'node:assert/strict'
import http from 'node:http'
import { createJiti } from 'jiti'

const REQUIRED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']

async function runIndependentAudit() {
  console.log('====================================================')
  console.log('  INDEPENDENT VICTORY AUDIT: KADER GRAD KODELJEVO')
  console.log('====================================================\n')

  const jiti = createJiti(import.meta.url)
  const useLocaleModule = await jiti.import('../src/composables/useLocale.ts')

  const {
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    localeLabels,
    dictionaries,
    flatDictionaries,
    useLocale
  } = useLocaleModule

  // ----------------------------------------------------
  // TEST 1: Locale Configuration & Metadata
  // ----------------------------------------------------
  console.log('>>> [1] Validating SUPPORTED_LOCALES and localeLabels...')
  assert.equal(SUPPORTED_LOCALES.length, 10, 'Must have exactly 10 supported locales')
  for (const loc of REQUIRED_LOCALES) {
    assert(SUPPORTED_LOCALES.includes(loc), `Missing locale ${loc} in SUPPORTED_LOCALES`)
    const label = localeLabels[loc]
    assert(label, `Missing localeLabels for ${loc}`)
    assert(label.label && label.name && label.native && label.flag, `Incomplete label info for ${loc}`)
  }
  console.log('  ✔ SUPPORTED_LOCALES and localeLabels validated.')

  // ----------------------------------------------------
  // TEST 2: Key Parity & Leaf Key Analysis
  // ----------------------------------------------------
  console.log('\n>>> [2] Auditing 100% key parity across all 10 locales...')
  const baseKeys = Object.keys(flatDictionaries.sl).sort()
  const baseKeyCount = baseKeys.length
  console.log(`  Base key count (sl): ${baseKeyCount}`)
  assert(baseKeyCount > 900, `Expected > 900 keys, found ${baseKeyCount}`)

  const baseKeySet = new Set(baseKeys)
  const auditResults = {}

  for (const loc of REQUIRED_LOCALES) {
    const dict = flatDictionaries[loc]
    assert(dict, `flatDictionaries.${loc} must exist`)
    const keys = Object.keys(dict).sort()
    const keySet = new Set(keys)

    const missing = baseKeys.filter(k => !keySet.has(k))
    const extra = keys.filter(k => !baseKeySet.has(k))
    const empty = Object.entries(dict).filter(([k, v]) => typeof v !== 'string' || v.trim().length === 0)

    auditResults[loc] = {
      keyCount: keys.length,
      missingCount: missing.length,
      extraCount: extra.length,
      emptyCount: empty.length
    }

    assert.equal(missing.length, 0, `Locale ${loc} missing keys: ${missing.slice(0, 5).join(', ')}`)
    assert.equal(extra.length, 0, `Locale ${loc} has extra keys: ${extra.slice(0, 5).join(', ')}`)
    assert.equal(empty.length, 0, `Locale ${loc} has empty values`)
    assert.equal(keys.length, baseKeyCount, `Locale ${loc} key count mismatch`)

    console.log(`  ✔ [${loc}] keys: ${keys.length}/${baseKeyCount}, missing: 0, extra: 0, empty: 0`)
  }

  // ----------------------------------------------------
  // TEST 3: Parameter Placeholders Symmetry
  // ----------------------------------------------------
  console.log('\n>>> [3] Auditing parameterized placeholder consistency...')
  const paramPattern = /\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g
  const paramKeys = []
  for (const [key, val] of Object.entries(flatDictionaries.sl)) {
    const matches = val.match(paramPattern)
    if (matches) {
      paramKeys.push({ key, params: matches.sort() })
    }
  }
  console.log(`  Found ${paramKeys.length} parameterized keys in baseline.`)

  for (const { key, params } of paramKeys) {
    for (const loc of REQUIRED_LOCALES) {
      const val = flatDictionaries[loc][key]
      const locParams = (val.match(paramPattern) || []).sort()
      assert.deepEqual(locParams, params, `Param mismatch on ${loc}.${key}: expected ${params}, got ${locParams}`)
    }
  }
  console.log('  ✔ All parameter signatures match across all 10 locales.')

  // ----------------------------------------------------
  // TEST 4: Linguistic Authenticity Spot Checks
  // ----------------------------------------------------
  console.log('\n>>> [4] Linguistic Authenticity Spot Checks for new locales (pl, cs, es)...')
  
  // Polish checks
  assert.equal(flatDictionaries.pl['nav.club'], 'Klub')
  assert.equal(flatDictionaries.pl['nav.events'], 'Wydarzenia')
  assert.equal(flatDictionaries.pl['common.close'], 'Zamknij')
  assert.equal(flatDictionaries.pl['header.orderNow'], 'Zamów i odbierz')
  assert.equal(flatDictionaries.pl['club.theVenue'], 'Miejsce')

  // Czech checks
  assert.equal(flatDictionaries.cs['nav.club'], 'Klub')
  assert.equal(flatDictionaries.cs['nav.events'], 'Události')
  assert.equal(flatDictionaries.cs['common.close'], 'Zavřít')
  assert.equal(flatDictionaries.cs['header.orderNow'], 'Objednat a vyzvednout')
  assert.equal(flatDictionaries.cs['club.theVenue'], 'Místo')

  // Spanish checks
  assert.equal(flatDictionaries.es['nav.club'], 'Club')
  assert.equal(flatDictionaries.es['nav.events'], 'Eventos')
  assert.equal(flatDictionaries.es['common.close'], 'Cerrar')
  assert.equal(flatDictionaries.es['header.orderNow'], 'Pedir y recoger')
  assert.equal(flatDictionaries.es['club.theVenue'], 'El Espacio')

  console.log('  ✔ Linguistic content authentic and distinct per language.')

  // ----------------------------------------------------
  // TEST 5: SSR Production Server Live HTTP Redirection & Rendering
  // ----------------------------------------------------
  console.log('\n>>> [5] Starting production Nitro SSR server to test live HTTP endpoints...')
  const testPort = 39821
  process.env.PORT = String(testPort)
  process.env.HOST = '127.0.0.1'

  const serverProcess = (await import('../.output/server/index.mjs'))
  
  // Give server a moment to bind
  await new Promise(r => setTimeout(r, 1500))

  function httpGet(path) {
    return new Promise((resolve, reject) => {
      const req = http.get({
        hostname: '127.0.0.1',
        port: testPort,
        path: path,
        agent: false
      }, (res) => {
        let body = ''
        res.on('data', chunk => { body += chunk })
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body
          })
        })
      })
      req.on('error', reject)
    })
  }

  // 5.1 Test /events -> /club 301 redirect
  console.log('  Testing GET /events...')
  const resEvents = await httpGet('/events')
  console.log(`  Response: status ${resEvents.statusCode}, Location: ${resEvents.headers.location}`)
  assert.equal(resEvents.statusCode, 301, `Expected 301, got ${resEvents.statusCode}`)
  assert.equal(resEvents.headers.location, '/club', `Expected Location /club, got ${resEvents.headers.location}`)
  console.log('  ✔ GET /events returned HTTP 301 Location: /club')

  // 5.2 Test /events with query parameters
  console.log('  Testing GET /events?tag=techno&month=10...')
  const resEventsQuery = await httpGet('/events?tag=techno&month=10')
  console.log(`  Response: status ${resEventsQuery.statusCode}, Location: ${resEventsQuery.headers.location}`)
  assert.equal(resEventsQuery.statusCode, 301, `Expected 301, got ${resEventsQuery.statusCode}`)
  assert.equal(resEventsQuery.headers.location, '/club?tag=techno&month=10', 'Expected query preservation')
  console.log('  ✔ GET /events?tag=techno&month=10 returned HTTP 301 Location: /club?tag=techno&month=10')

  // 5.3 Test /club page rendering
  console.log('  Testing GET /club...')
  const resClub = await httpGet('/club')
  console.log(`  Response: status ${resClub.statusCode}, body length: ${resClub.body.length}`)
  assert.equal(resClub.statusCode, 200, `Expected 200, got ${resClub.statusCode}`)
  
  // Verify expected elements in rendered HTML or title
  assert(resClub.body.includes('Kader') || resClub.body.includes('club'), 'Page should include Kader')
  // Verify absence of Klipsch sound system specs section and floors section
  assert(!resClub.body.includes('showSpecs'), 'Should NOT contain showSpecs button/state')
  assert(!resClub.body.includes('club.theSound'), 'Should NOT contain club.theSound section')
  assert(!resClub.body.includes('club.floorsTitle'), 'Should NOT contain club.floorsTitle section')
  assert(!resClub.body.includes('FLOOR 01: BASEMENT'), 'Should NOT contain old Floors 01 section')
  console.log('  ✔ GET /club returned HTTP 200 and verified content constraints.')

  console.log('\n====================================================')
  console.log('  ALL INDEPENDENT AUDIT TESTS PASSED SUCCESSFULLY!  ')
  console.log('====================================================')
  process.exit(0)
}

runIndependentAudit().catch(err => {
  console.error('\n✖ INDEPENDENT AUDIT FAILED:', err)
  process.exit(1)
})
