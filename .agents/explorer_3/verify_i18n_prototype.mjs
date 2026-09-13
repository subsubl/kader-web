// Prototype verification script for i18n key parity and parameter integrity
import assert from 'node:assert/strict'
import { createJiti } from 'jiti'

const TARGET_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']

async function testParity() {
  console.log('--- Testing i18n key parity and parameter integrity ---')
  const jiti = createJiti(import.meta.url)
  const mod = await jiti.import('../../src/composables/useLocale.ts')

  const { SUPPORTED_LOCALES, flatDictionaries, localeLabels } = mod
  console.log('Current SUPPORTED_LOCALES:', SUPPORTED_LOCALES)
  
  const slDict = flatDictionaries.sl
  assert(slDict, 'Slovenian dictionary must exist')
  const slKeys = Object.keys(slDict).sort()
  console.log(`Total baseline keys in sl: ${slKeys.length}`)

  // Identify placeholder keys in sl
  const paramMap = new Map()
  for (const [key, val] of Object.entries(slDict)) {
    const matches = val.match(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g)
    if (matches) {
      paramMap.set(key, matches.sort())
    }
  }
  console.log(`Keys with interpolation parameters: ${paramMap.size}`)

  for (const loc of SUPPORTED_LOCALES) {
    const locDict = flatDictionaries[loc]
    assert(locDict, `Dictionary for ${loc} must exist in flatDictionaries`)

    // Key parity
    const missing = slKeys.filter(k => !(k in locDict))
    const extra = Object.keys(locDict).filter(k => !(k in slDict))
    assert.equal(missing.length, 0, `Locale ${loc} is missing ${missing.length} keys: ${missing.slice(0, 5).join(', ')}`)
    assert.equal(extra.length, 0, `Locale ${loc} has ${extra.length} extra keys: ${extra.slice(0, 5).join(', ')}`)

    // Value integrity
    const empty = Object.entries(locDict).filter(([k, v]) => typeof v !== 'string' || v.trim() === '')
    assert.equal(empty.length, 0, `Locale ${loc} has ${empty.length} empty values: ${empty.slice(0, 5).map(e => e[0]).join(', ')}`)

    // Parameter integrity
    for (const [key, expectedParams] of paramMap.entries()) {
      const val = locDict[key]
      const actualParams = (val.match(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g) || []).sort()
      assert.deepEqual(
        actualParams,
        expectedParams,
        `Locale ${loc} key "${key}" param mismatch: expected ${JSON.stringify(expectedParams)}, got ${JSON.stringify(actualParams)}`
      )
    }

    console.log(`  ✔ [PASS] ${loc}: ${Object.keys(locDict).length} keys, 100% parity, 0 empty, all params match`)
  }

  console.log('\nAll current locales verified successfully!')
}

testParity().catch(err => {
  console.error('Audit failed:', err)
  process.exit(1)
})
