// scripts/test_polish_edge_cases.mjs
// Unit & Integration verification for Worker 3 polish & edge-case implementations

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createJiti } from 'jiti'

const ROOT = process.cwd()

console.log('=== VERIFYING WORKER 3 POLISH & EDGE-CASE IMPLEMENTATIONS ===\n')

let passed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✔ [PASS] ${name}`)
  } catch (err) {
    console.error(`  ✖ [FAIL] ${name}: ${err.message}`)
    throw err
  }
}

async function run() {
  const jiti = createJiti(import.meta.url)

  // -------------------------------------------------------------
  // Test 1: useLocale.ts canonical address & key parity
  // -------------------------------------------------------------
  console.log('--- TEST 1: useLocale.ts address canonicalization & parity ---')
  const useLocaleMod = await jiti.import('../src/composables/useLocale.ts')
  const { SUPPORTED_LOCALES, flatDictionaries } = useLocaleMod

  test('All 10 locales have 0 occurrences of legacy Carla Benza address', () => {
    for (const loc of SUPPORTED_LOCALES) {
      const dict = flatDictionaries[loc]
      for (const [key, val] of Object.entries(dict)) {
        assert.ok(
          !val.includes('Carla Benza'),
          `Locale ${loc} key ${key} contains legacy address: "${val}"`
        )
      }
    }
  })

  test('All 10 locales contain Koblarjeva ulica 34 in visitP and legalCompanyLine', () => {
    for (const loc of SUPPORTED_LOCALES) {
      const dict = flatDictionaries[loc]
      assert.ok(
        dict['home.visitP'].includes('Koblarjeva ulica 34'),
        `Locale ${loc} home.visitP does not contain Koblarjeva ulica 34`
      )
      assert.ok(
        dict['pizzeria.legalCompanyLine'].includes('Koblarjeva ulica 34'),
        `Locale ${loc} pizzeria.legalCompanyLine does not contain Koblarjeva ulica 34`
      )
    }
  })

  test('100% key parity (exactly 938 leaf keys per locale)', () => {
    const baseKeys = Object.keys(flatDictionaries.sl).sort()
    assert.equal(baseKeys.length, 938, `Expected 938 keys in sl, got ${baseKeys.length}`)
    for (const loc of SUPPORTED_LOCALES) {
      const locKeys = Object.keys(flatDictionaries[loc]).sort()
      assert.equal(locKeys.length, 938, `Locale ${loc} does not have 938 keys`)
      assert.deepEqual(locKeys, baseKeys, `Keys mismatch for ${loc}`)
    }
  })

  // -------------------------------------------------------------
  // Test 2: parseAcceptLanguage whitespace trimming in locale.ts
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: parseAcceptLanguage whitespace tolerance ---')
  const localeUtils = await jiti.import('../src/server/utils/locale.ts')
  const { parseAcceptLanguage } = localeUtils

  test('parseAcceptLanguage parses q-factor with whitespace "q = 0.9"', () => {
    const header = 'sl; q = 0.5, en; q = 0.9'
    const parsed = parseAcceptLanguage(header)
    assert.equal(parsed.length, 2)
    assert.equal(parsed[0].code, 'en')
    assert.equal(parsed[0].q, 0.9)
    assert.equal(parsed[1].code, 'sl')
    assert.equal(parsed[1].q, 0.5)
  })

  test('parseAcceptLanguage parses irregular whitespace around semicolon and equals', () => {
    const header = 'en-US ;  q =  0.8 ,  sl-SI ; q =  0.95'
    const parsed = parseAcceptLanguage(header)
    assert.equal(parsed[0].code, 'sl-si')
    assert.equal(parsed[0].q, 0.95)
    assert.equal(parsed[1].code, 'en-us')
    assert.equal(parsed[1].q, 0.8)
  })

  // -------------------------------------------------------------
  // Test 3: Guest validation in inquiries.post.ts
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: inquiries.post.ts integer guest validation ---')
  const inquiriesContent = fs.readFileSync(path.join(ROOT, 'src/server/api/inquiries.post.ts'), 'utf8')

  test('inquiries.post.ts enforces !Number.isInteger(guests) || guests < 1 || guests > 500', () => {
    assert.ok(
      inquiriesContent.includes('!Number.isInteger(guests) || guests < 1 || guests > 500'),
      'Must strictly check !Number.isInteger(guests) || guests < 1 || guests > 500'
    )
    assert.ok(
      !inquiriesContent.includes('!Number.isFinite(guests)'),
      'Must NOT use !Number.isFinite(guests)'
    )
  })

  // -------------------------------------------------------------
  // Test 4: Rate limit localization in rateLimit.ts
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: rateLimit.ts localized 429 statusMessage ---')
  const rateLimitContent = fs.readFileSync(path.join(ROOT, 'src/server/utils/rateLimit.ts'), 'utf8')

  test('rateLimit.ts imports resolveApiLocale and apiMessages', () => {
    assert.ok(rateLimitContent.includes("import { resolveApiLocale, apiMessages } from './locale'"), 'Must import locale utils')
  })

  test('rateLimit.ts resolves locale and uses apiMessages[locale].common.rateLimitExceeded', () => {
    assert.ok(rateLimitContent.includes('const locale = resolveApiLocale(event)'), 'Must resolve locale from event')
    assert.ok(rateLimitContent.includes('apiMessages[locale]?.common?.rateLimitExceeded'), 'Must use localized rateLimitExceeded message')
  })

  // -------------------------------------------------------------
  // Test 5: img.get.ts localization and cache key isolation
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: img.get.ts localized error & locale-aware inflightKey ---')
  const imgContent = fs.readFileSync(path.join(ROOT, 'src/server/api/img.get.ts'), 'utf8')

  test('img.get.ts extracts locale from createApiTranslator', () => {
    assert.ok(imgContent.includes('const { t, locale } = createApiTranslator(event)'), 'Must extract locale from translator')
  })

  test('img.get.ts uses locale-isolated inflightKey', () => {
    assert.ok(imgContent.includes('const inflightKey = `${hashKey}:${locale}`'), 'Must create locale-aware inflightKey')
    assert.ok(imgContent.includes('inflightTransformations.get(inflightKey)'), 'Must query inflightTransformations with inflightKey')
    assert.ok(imgContent.includes('inflightTransformations.set(inflightKey, transformPromise)'), 'Must set inflightTransformations with inflightKey')
    assert.ok(imgContent.includes('inflightTransformations.delete(inflightKey)'), 'Must delete inflightKey in finally block')
  })

  test('img.get.ts uses t("img.errProcessFailed", ...) without hardcoded English prefixes', () => {
    assert.ok(imgContent.includes("t('img.errProcessFailed', { error: err?.message || 'Unknown error' })"), 'Must use t() with errProcessFailed')
    assert.ok(!imgContent.includes("statusMessage: `Could not process image:"), 'Must not have hardcoded English prefix')
  })

  console.log(`\n======================================================`)
  console.log(`  ALL ${passed} POLISH & EDGE-CASE ASSERTIONS PASSED!`)
  console.log(`======================================================\n`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
