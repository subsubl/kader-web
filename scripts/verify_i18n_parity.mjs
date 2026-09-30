// scripts/verify_i18n_parity.mjs
// Rigorous verification script for 10-language i18n parity in Kader Grad Kodeljevo
import assert from 'node:assert/strict'
import { createJiti } from 'jiti'

const REQUIRED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']
const EXPECTED_LEAF_COUNT = 73
const EXPECTED_PARAM_KEYS = []

async function verifyI18nParity() {
  console.log('=============================================================')
  console.log(`  KADER i18n VERIFICATION SUITE: 10 LOCALES & ${EXPECTED_LEAF_COUNT} LEAF KEYS`)
  console.log('=============================================================\n')

  const jiti = createJiti(import.meta.url)
  const mod = await jiti.import('../src/composables/useLocale.ts')

  const { SUPPORTED_LOCALES, flatDictionaries, localeLabels, dictionaries } = mod

  // 1. Verify all 10 locales are present in SUPPORTED_LOCALES
  console.log('>>> [CHECK 1] SUPPORTED_LOCALES validation')
  assert.equal(SUPPORTED_LOCALES.length, 10, `Expected 10 SUPPORTED_LOCALES, found ${SUPPORTED_LOCALES.length}`)

  for (const loc of REQUIRED_LOCALES) {
    assert.ok(SUPPORTED_LOCALES.includes(loc), `Missing locale in SUPPORTED_LOCALES: ${loc}`)
  }
  console.log('  ✔ [PASS] All 10 required locales present\n')

  // 2. Verify localeLabels metadata
  console.log('>>> [CHECK 2] localeLabels metadata')
  for (const loc of REQUIRED_LOCALES) {
    const info = localeLabels[loc]
    assert.ok(info, `Missing localeLabels entry: ${loc}`)
    assert.ok(info.flag, `Missing flag for locale: ${loc}`)
    assert.ok(info.native, `Missing native name for locale: ${loc}`)
  }
  console.log('  ✔ [PASS] All 10 localeLabels entries have flag + native name\n')

  // 3. Verify dictionaries exist and baseline leaf count
  console.log('>>> [CHECK 3] Baseline leaf count (sl)')
  const baselineKeys = Object.keys(flatDictionaries.sl)
  assert.equal(
    baselineKeys.length,
    EXPECTED_LEAF_COUNT,
    `Expected exactly ${EXPECTED_LEAF_COUNT} leaf keys in sl, got ${baselineKeys.length}`
  )
  console.log(`  ✔ [PASS] sl baseline key count: ${baselineKeys.length}\n`)

  // 4. Parameterized keys
  console.log('>>> [CHECK 4] Parameterized key audit')
  const paramMap = new Map()
  for (const k of baselineKeys) {
    const v = flatDictionaries.sl[k]
    if (typeof v !== 'string') continue
    const matches = v.match(/\{\{\s*\w+\s*\}\}/g)
    if (matches) {
      paramMap.set(k, matches.sort())
    }
  }
  assert.equal(
    paramMap.size,
    EXPECTED_PARAM_KEYS.length,
    `Expected exactly ${EXPECTED_PARAM_KEYS.length} parameterized keys, found ${paramMap.size}`
  )
  assert.deepEqual(
    Array.from(paramMap.keys()).sort(),
    [...EXPECTED_PARAM_KEYS].sort(),
    `Parameterized keys set must match expected ${EXPECTED_PARAM_KEYS.length} keys`
  )
  console.log(`  ✔ [PASS] ${EXPECTED_PARAM_KEYS.length} parameterized keys detected and validated in baseline\n`)

  // 5. Parity, empty-string, and parameter audit across all 10 locales
  console.log('>>> [CHECK 5] Parity, emptiness, and parameter symmetry across all 10 locales')

  // 4b. No unresolved keys may reach the rendered page. t() falls back to the raw
  // key when a lookup misses, which silently ships "site.navMenu" as visible text.
  // This catches keys written into the wrong namespace object.
  const usedInSource = new Set()
  for (const key of baselineKeys) {
    if (typeof flatDictionaries.sl[key] !== 'string') continue
    // a value identical to its own fully-qualified key means a bad write
    if (flatDictionaries.sl[key] === key) usedInSource.add(key)
  }
  assert.equal(
    usedInSource.size,
    0,
    `keys whose value equals the key (written into the wrong namespace): ${[...usedInSource].join(', ')}`
  )
  // spot-check the keys the hero nav depends on
  for (const k of ['site.menuTitle', 'site.menuDownload', 'site.eventsTitle', 'site.hoursTitle', 'site.venueTitle', 'site.contactTitle']) {
    assert.ok(k in flatDictionaries.sl, `missing hero nav key: ${k}`)
    assert.ok(flatDictionaries.sl[k] !== k, `hero nav key ${k} resolves to itself (wrong namespace)`)
  }
  console.log('  ✔ [PASS] no self-referential (mis-namespaced) keys; hero nav keys resolve')

  const problems = []
  for (const loc of REQUIRED_LOCALES) {
    const flat = flatDictionaries[loc]
    const keys = Object.keys(flat)

    const missing = baselineKeys.filter(k => !(k in flat))
    const extra = keys.filter(k => !baselineKeys.includes(k))
    const empty = keys.filter(k => flat[k] === '')
    const sameAsSl = loc === 'sl' ? 0 : keys.filter(k => flat[k] === flatDictionaries.sl[k]).length

    const parity = ((keys.length - missing.length) / baselineKeys.length) * 100

    if (missing.length || extra.length || empty.length) {
      problems.push(
        `${loc}: missing=${missing.length} extra=${extra.length} empty=${empty.length}`
      )
      if (missing.length) console.log(`    missing: ${missing.slice(0, 10).join(', ')}`)
      if (extra.length) console.log(`    extra:   ${extra.slice(0, 10).join(', ')}`)
      if (empty.length) console.log(`    empty:   ${empty.slice(0, 10).join(', ')}`)
    } else {
      console.log(
        `  ✔ [PASS] ${loc}: 100.0% parity (${keys.length}/${baselineKeys.length} keys), 0 empty`
      )
    }

    // Parameter signature symmetry for this locale
    for (const [k, sig] of paramMap) {
      const lv = flat[k]
      const lMatches = typeof lv === 'string' ? (lv.match(/\{\{\s*\w+\s*\}\}/g) || []).sort() : []
      if (JSON.stringify(lMatches) !== JSON.stringify(sig)) {
        problems.push(`${loc}: param signature mismatch on ${k}`)
      }
    }
  }

  assert.equal(problems.length, 0, `i18n problems found:\n${problems.join('\n')}`)
  console.log('\n>>> [CHECK 6] No orphaned namespaces / dictionaries consistency')
  for (const loc of REQUIRED_LOCALES) {
    assert.ok(dictionaries[loc], `Missing dictionary object: ${loc}`)
  }
  console.log('  ✔ [PASS] All 10 dictionary objects present\n')

  console.log('=============================================================')
  console.log('  ALL 10 LOCALES VERIFIED SUCCESSFULLY (100.0% KEY PARITY)')
  console.log('=============================================================')
}

verifyI18nParity().catch(err => {
  console.error('\n✖ [FAIL] Verification failed:', err && err.message ? err.message : err)
  process.exit(1)
})
