// scripts/verify_i18n_parity.mjs
// Rigorous verification script for 10-language i18n parity in Kader Grad Kodeljevo
import assert from 'node:assert/strict'
import { createJiti } from 'jiti'

const REQUIRED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']
const EXPECTED_LEAF_COUNT = 927
const EXPECTED_PARAM_KEYS = [
  'buyouts.inquiryMessagePrefill',
  'buyouts.thankYou',
  'buyouts.upTo',
  'craft.phaseBadge',
  'home.viewFullSizeAria',
  'home.visitP',
  'lightbox.showImageAria',
  'lightbox.thumbnailAria'
]

async function verifyI18nParity() {
  console.log('=============================================================')
  console.log('  KADER i18n VERIFICATION SUITE: 10 LOCALES & 938 LEAF KEYS')
  console.log('=============================================================\n')

  const jiti = createJiti(import.meta.url)
  const mod = await jiti.import('../src/composables/useLocale.ts')

  const { SUPPORTED_LOCALES, flatDictionaries, localeLabels, dictionaries } = mod

  // 1. Verify all 10 locales are present in SUPPORTED_LOCALES
  console.log('>>> [CHECK 1] SUPPORTED_LOCALES validation')
  assert.equal(SUPPORTED_LOCALES.length, 10, `Expected 10 SUPPORTED_LOCALES, found ${SUPPORTED_LOCALES.length}`)
  for (const loc of REQUIRED_LOCALES) {
    assert(
      SUPPORTED_LOCALES.includes(loc),
      `SUPPORTED_LOCALES must include '${loc}'`
    )
  }
  console.log(`  ✔ [PASS] SUPPORTED_LOCALES contains all 10 required languages: ${SUPPORTED_LOCALES.join(', ')}`)

  // 2. Verify localeLabels configuration
  console.log('\n>>> [CHECK 2] localeLabels configuration')
  for (const loc of REQUIRED_LOCALES) {
    const labelInfo = localeLabels[loc]
    assert(labelInfo, `localeLabels must contain entry for '${loc}'`)
    assert(labelInfo.label && labelInfo.label.trim(), `localeLabels.${loc}.label must not be empty`)
    assert(labelInfo.name && labelInfo.name.trim(), `localeLabels.${loc}.name must not be empty`)
    assert(labelInfo.native && labelInfo.native.trim(), `localeLabels.${loc}.native must not be empty`)
    assert(labelInfo.flag && labelInfo.flag.trim(), `localeLabels.${loc}.flag must not be empty`)
    console.log(`  ✔ [PASS] ${loc}: ${labelInfo.flag} ${labelInfo.native} (${labelInfo.label})`)
  }

  // 3. Baseline validation on Slovenian (sl)
  console.log('\n>>> [CHECK 3] Baseline leaf key audit (sl)')
  const slDict = flatDictionaries.sl
  assert(slDict, 'Slovenian flat dictionary must exist')
  const slKeys = Object.keys(slDict).sort()
  assert.equal(slKeys.length, EXPECTED_LEAF_COUNT, `Expected exactly ${EXPECTED_LEAF_COUNT} leaf keys in sl, got ${slKeys.length}`)
  console.log(`  ✔ [PASS] sl baseline key count: ${slKeys.length}`)

  // 4. Identify parameterized placeholders in baseline (sl)
  const paramRegex = /\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g
  const paramMap = new Map()
  for (const [k, v] of Object.entries(slDict)) {
    const matches = v.match(paramRegex)
    if (matches) {
      paramMap.set(k, matches.sort())
    }
  }
  assert.equal(paramMap.size, 8, `Expected exactly 8 parameterized keys, found ${paramMap.size}`)
  assert.deepEqual(
    Array.from(paramMap.keys()).sort(),
    EXPECTED_PARAM_KEYS.sort(),
    'Parameterized keys set must match expected 8 keys'
  )
  console.log(`  ✔ [PASS] 8 parameterized keys detected and validated in baseline`)

  // 5. Parity, empty-string, and parameter audit across all 10 locales
  console.log('\n>>> [CHECK 4] Parity, emptiness, and parameter symmetry across all 10 locales')
  const slKeySet = new Set(slKeys)

  for (const loc of REQUIRED_LOCALES) {
    const locDict = flatDictionaries[loc]
    assert(locDict, `flatDictionaries.${loc} must exist`)
    assert(dictionaries[loc], `dictionaries.${loc} must exist`)

    const locKeys = Object.keys(locDict).sort()
    const locKeySet = new Set(locKeys)

    // Key count
    assert.equal(
      locKeys.length,
      EXPECTED_LEAF_COUNT,
      `Locale '${loc}' has ${locKeys.length} keys, expected ${EXPECTED_LEAF_COUNT}`
    )

    // Set difference
    const missing = slKeys.filter(k => !locKeySet.has(k))
    const extra = locKeys.filter(k => !slKeySet.has(k))
    assert.equal(missing.length, 0, `Locale '${loc}' is missing keys: ${missing.join(', ')}`)
    assert.equal(extra.length, 0, `Locale '${loc}' has extra keys: ${extra.join(', ')}`)

    // Emptiness check
    const empty = Object.entries(locDict).filter(
      ([k, v]) => typeof v !== 'string' || v.trim() === ''
    )
    assert.equal(empty.length, 0, `Locale '${loc}' has empty values for: ${empty.map(e => e[0]).join(', ')}`)

    // Parameter symmetry check
    for (const [k, expectedParams] of paramMap.entries()) {
      const val = locDict[k]
      const actualParams = (val.match(paramRegex) || []).sort()
      assert.deepEqual(
        actualParams,
        expectedParams,
        `Locale '${loc}' key '${k}' parameter mismatch: expected ${JSON.stringify(expectedParams)}, got ${JSON.stringify(actualParams)}`
      )
    }

    console.log(`  ✔ [PASS] ${loc}: 100.0% parity (${locKeys.length}/${EXPECTED_LEAF_COUNT} keys), 0 empty, 8/8 parameter signatures symmetric`)
  }

  console.log('\n=============================================================')
  console.log('  ALL 10 LOCALES VERIFIED SUCCESSFULLY (100.0% KEY PARITY)')
  console.log('=============================================================')
}

verifyI18nParity().catch(err => {
  console.error('\n✖ [FAIL] Verification failed:', err)
  process.exit(1)
})
