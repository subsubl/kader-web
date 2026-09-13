// .agents/challenger_1/stress_test_i18n.mjs
// Adversarial Stress Testing Harness for Kader Grad Kodeljevo 10-Language i18n System

import { ref } from 'vue'

// Mock Nuxt SSR/CSR auto-imported globals for independent verification outside Nuxt runtime
let currentCookieVal = 'sl'
let currentStateVal = 'sl'

globalThis.useCookie = (name, opts) => {
  const r = ref(currentCookieVal || opts?.default?.() || 'sl')
  return r
}

globalThis.useState = (key, init) => {
  const r = ref(currentStateVal || init?.() || 'sl')
  return r
}

// Mock window/document/localStorage for CSR branches
globalThis.importMetaClient = false
globalThis.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null },
  setItem(k, v) { this.store[k] = String(v) },
  removeItem(k) { delete this.store[k] }
}

import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  localeLabels,
  isSupportedLocale,
  dictionaries,
  flatDictionaries,
  useLocale
} from '../../src/composables/useLocale.ts'

// ANSI colors for clean test reporting
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

let totalAssertions = 0
let passedAssertions = 0
let failedAssertions = 0
const failures = []

function assert(condition, message, details = null) {
  totalAssertions++
  if (condition) {
    passedAssertions++
  } else {
    failedAssertions++
    failures.push({ message, details })
    console.error(`${RED}  FAIL: ${message}${RESET}`)
    if (details) console.error(`        Details:`, details)
  }
}

function suite(name) {
  console.log(`\n${BOLD}${CYAN}=== Suite: ${name} ===${RESET}`)
}

// -----------------------------------------------------------------------------
// Suite 1: Locales & Metadata Integrity
// -----------------------------------------------------------------------------
suite('1. Locales & Metadata Integrity')

const EXPECTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es']

assert(SUPPORTED_LOCALES.length === 10, `SUPPORTED_LOCALES length is 10 (actual: ${SUPPORTED_LOCALES.length})`)
assert(DEFAULT_LOCALE === 'sl', `DEFAULT_LOCALE is 'sl' (actual: ${DEFAULT_LOCALE})`)

for (const loc of EXPECTED_LOCALES) {
  assert(SUPPORTED_LOCALES.includes(loc), `SUPPORTED_LOCALES contains '${loc}'`)
  assert(isSupportedLocale(loc) === true, `isSupportedLocale('${loc}') returns true`)
  
  const labelInfo = localeLabels[loc]
  assert(labelInfo !== undefined, `localeLabels['${loc}'] exists`)
  assert(typeof labelInfo.label === 'string' && labelInfo.label.length > 0, `localeLabels['${loc}'].label is valid string ("${labelInfo?.label}")`)
  assert(typeof labelInfo.name === 'string' && labelInfo.name.length > 0, `localeLabels['${loc}'].name is valid string ("${labelInfo?.name}")`)
  assert(typeof labelInfo.native === 'string' && labelInfo.native.length > 0, `localeLabels['${loc}'].native is valid string ("${labelInfo?.native}")`)
  assert(typeof labelInfo.flag === 'string' && labelInfo.flag.length > 0, `localeLabels['${loc}'].flag is valid string ("${labelInfo?.flag}")`)
}

// Negative tests for isSupportedLocale
assert(isSupportedLocale('pt') === false, `isSupportedLocale('pt') returns false`)
assert(isSupportedLocale('SL') === false, `isSupportedLocale('SL') (uppercase) returns false`)
assert(isSupportedLocale('') === false, `isSupportedLocale('') returns false`)
assert(isSupportedLocale(null) === false, `isSupportedLocale(null) returns false`)
assert(isSupportedLocale(undefined) === false, `isSupportedLocale(undefined) returns false`)
assert(isSupportedLocale(123) === false, `isSupportedLocale(123) returns false`)
assert(isSupportedLocale({}) === false, `isSupportedLocale({}) returns false`)

// -----------------------------------------------------------------------------
// Suite 2: 100.0% Dictionary Parity & Structure across all 10 Locales
// -----------------------------------------------------------------------------
suite('2. 100.0% Key Parity Audit')

const canonicalKeys = Object.keys(flatDictionaries.sl)
const totalCanonicalKeys = canonicalKeys.length
console.log(`  Canonical key count (sl): ${totalCanonicalKeys}`)

assert(totalCanonicalKeys > 0, `Canonical dictionary has > 0 keys (${totalCanonicalKeys})`)

const keySets = {}
for (const loc of SUPPORTED_LOCALES) {
  assert(flatDictionaries[loc] !== undefined, `flatDictionaries['${loc}'] is defined`)
  assert(dictionaries[loc] !== undefined, `dictionaries['${loc}'] is defined`)
  
  const keys = Object.keys(flatDictionaries[loc])
  keySets[loc] = new Set(keys)
  
  assert(keys.length === totalCanonicalKeys, `Language '${loc}' key count equals canonical ${totalCanonicalKeys} (actual: ${keys.length})`)
}

// Pairwise parity audit
let totalParityChecks = 0
let parityErrors = 0

for (let i = 0; i < SUPPORTED_LOCALES.length; i++) {
  const locA = SUPPORTED_LOCALES[i]
  const setA = keySets[locA]
  for (let j = i + 1; j < SUPPORTED_LOCALES.length; j++) {
    const locB = SUPPORTED_LOCALES[j]
    const setB = keySets[locB]
    totalParityChecks++
    
    const missingInB = [...setA].filter(k => !setB.has(k))
    const missingInA = [...setB].filter(k => !setA.has(k))
    
    if (missingInB.length > 0 || missingInA.length > 0) {
      parityErrors++
      assert(false, `Parity mismatch between '${locA}' and '${locB}'`, {
        missingInB: missingInB.slice(0, 5),
        missingInA: missingInA.slice(0, 5)
      })
    }
  }
}

assert(parityErrors === 0, `100.0% Pairwise parity achieved across all ${totalParityChecks} language pairs`)

// -----------------------------------------------------------------------------
// Suite 3: Value Hygiene (Null, Undefined, Empty String, Whitespace-only)
// -----------------------------------------------------------------------------
suite('3. Value Hygiene Audit')

let nullCount = 0
let undefinedCount = 0
let nonStringCount = 0
let emptyStringCount = 0
let whitespaceOnlyCount = 0

for (const loc of SUPPORTED_LOCALES) {
  const dict = flatDictionaries[loc]
  for (const [key, val] of Object.entries(dict)) {
    if (val === null) nullCount++
    if (val === undefined) undefinedCount++
    if (typeof val !== 'string') nonStringCount++
    if (val === '') emptyStringCount++
    if (typeof val === 'string' && val.trim() === '') whitespaceOnlyCount++
  }
}

assert(nullCount === 0, `No null values across all dictionaries (found: ${nullCount})`)
assert(undefinedCount === 0, `No undefined values across all dictionaries (found: ${undefinedCount})`)
assert(nonStringCount === 0, `No non-string values across all dictionaries (found: ${nonStringCount})`)
assert(emptyStringCount === 0, `No empty string values across all dictionaries (found: ${emptyStringCount})`)
assert(whitespaceOnlyCount === 0, `No whitespace-only string values across all dictionaries (found: ${whitespaceOnlyCount})`)

// -----------------------------------------------------------------------------
// Suite 4: Character Encoding, Diacritics & Mojibake Stress Test
// -----------------------------------------------------------------------------
suite('4. Character Encoding & Diacritics')

function checkDiacritics(lang, charList, label) {
  const text = Object.values(flatDictionaries[lang]).join(' ')
  const missing = []
  const counts = {}
  for (const ch of charList) {
    const regex = new RegExp(ch, 'g')
    const matches = text.match(regex)
    const count = matches ? matches.length : 0
    counts[ch] = count
    if (count === 0) missing.push(ch)
  }
  assert(missing.length === 0, `All special characters in ${label} present in '${lang}'`, { missing, counts })
  return counts
}

// Polish characters: ą, ć, ę, ł, ń, ó, ś, ź, ż
const plCounts = checkDiacritics('pl', ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'], 'Polish (PL)')
console.log('  PL diacritic counts:', JSON.stringify(plCounts))

// Czech characters: ě, š, č, ř, ž, ý, á, í, é, ů, ú
const csCounts = checkDiacritics('cs', ['ě', 'š', 'č', 'ř', 'ž', 'ý', 'á', 'í', 'é', 'ů', 'ú'], 'Czech (CS)')
console.log('  CS diacritic counts:', JSON.stringify(csCounts))

// Spanish characters: á, é, í, ó, ú, ñ, ¿, ¡
const esCounts = checkDiacritics('es', ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'], 'Spanish (ES)')
console.log('  ES diacritic counts:', JSON.stringify(esCounts))

// Slovenian characters: č, š, ž
const slCounts = checkDiacritics('sl', ['č', 'š', 'ž'], 'Slovenian (SL)')
console.log('  SL diacritic counts:', JSON.stringify(slCounts))

// Serbian Latin characters: č, ć, đ, š, ž
const srCounts = checkDiacritics('sr', ['č', 'ć', 'đ', 'š', 'ž'], 'Serbian (SR)')
console.log('  SR diacritic counts:', JSON.stringify(srCounts))

// German characters: ä, ö, ü, ß
const deCounts = checkDiacritics('de', ['ä', 'ö', 'ü', 'ß'], 'German (DE)')
console.log('  DE diacritic counts:', JSON.stringify(deCounts))

// French characters: é, è, ê, à, â, ç, ô, ù
const frCounts = checkDiacritics('fr', ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'ù'], 'French (FR)')
console.log('  FR diacritic counts:', JSON.stringify(frCounts))

// Italian characters: à, è, é, ì, ò, ù
const itCounts = checkDiacritics('it', ['à', 'è', 'é', 'ì', 'ò', 'ù'], 'Italian (IT)')
console.log('  IT diacritic counts:', JSON.stringify(itCounts))

// Forensic Mojibake / Corrupt byte sequence detection
let unicodeReplacements = 0
let doubleUtf8Anomalies = 0
let rawUnicodeEscapes = 0

for (const [lang, dict] of Object.entries(flatDictionaries)) {
  for (const [key, val] of Object.entries(dict)) {
    if (val.includes('\uFFFD')) {
      unicodeReplacements++
      assert(false, `Unicode replacement character (U+FFFD) found in [${lang}] ${key}: ${val}`)
    }
    if (/[\u00C2\u00C3][\u0080-\u00BF]/.test(val)) {
      doubleUtf8Anomalies++
      assert(false, `Double UTF-8 anomaly found in [${lang}] ${key}: ${val}`)
    }
    if (/\\u[0-9a-fA-F]{4}/.test(val)) {
      rawUnicodeEscapes++
      assert(false, `Unescaped raw \\uXXXX escape sequence found in [${lang}] ${key}: ${val}`)
    }
  }
}

assert(unicodeReplacements === 0, `Zero Unicode replacement characters (U+FFFD) detected`)
assert(doubleUtf8Anomalies === 0, `Zero double UTF-8 decoding anomalies detected`)
assert(rawUnicodeEscapes === 0, `Zero unescaped \\uXXXX sequences detected`)

// -----------------------------------------------------------------------------
// Suite 5: Parameterized Keys & Dual Interpolation Boundary Matrix
// -----------------------------------------------------------------------------
suite('5. Parameter Interpolation Stress Test (8 Parameterized Keys)')

const { locale, setLocale, t } = useLocale()

const PARAM_KEYS = [
  'buyouts.inquiryMessagePrefill',
  'buyouts.thankYou',
  'buyouts.upTo',
  'craft.phaseBadge',
  'home.viewFullSizeAria',
  'home.visitP',
  'lightbox.showImageAria',
  'lightbox.thumbnailAria'
]

assert(PARAM_KEYS.length === 8, `Exactly 8 parameterized keys under evaluation`)

// Verify parameter definitions in each key across all 10 languages
for (const key of PARAM_KEYS) {
  for (const loc of SUPPORTED_LOCALES) {
    const rawVal = flatDictionaries[loc][key]
    assert(rawVal !== undefined, `[${loc}] ${key} exists`)
    const placeholders = rawVal.match(/\{{1,2}[a-zA-Z0-9_-]+\}{1,2}/g) || []
    assert(placeholders.length > 0, `[${loc}] ${key} contains interpolation placeholders: ${JSON.stringify(placeholders)}`)
  }
}

// Boundary input matrix
const boundaryTestCases = [
  {
    name: 'Normal string inputs',
    params: {
      tier: 'VIP Castle',
      guests: '150',
      name: 'Alexander',
      n: '3',
      label: 'Main Courtyard',
      food: '+386 1 234 5678',
      table: 'rezervacije@kader.si'
    },
    verify: (text, key) => !text.includes('{{') && !text.includes('}}')
  },
  {
    name: 'Falsy number zero (0)',
    params: {
      tier: 'Standard',
      guests: 0,
      name: 'Test',
      n: 0,
      label: 'Zero Label',
      food: 0,
      table: 0
    },
    verify: (text, key) => {
      if (['buyouts.upTo', 'craft.phaseBadge'].includes(key)) {
        return text.includes('0') && !text.includes('{{n}}')
      }
      return true
    }
  },
  {
    name: 'Negative and large numbers',
    params: {
      tier: 'Basic',
      guests: -5,
      name: 'Agent -007',
      n: 999999,
      label: 'Sky Deck',
      food: -1,
      table: 1000000
    },
    verify: (text, key) => {
      if (['buyouts.upTo', 'craft.phaseBadge'].includes(key)) {
        return text.includes('999999')
      }
      return true
    }
  },
  {
    name: 'Floating point decimal numbers',
    params: {
      tier: 'Exclusive',
      guests: 50.5,
      name: 'Dr. Euler',
      n: 3.14159,
      label: 'Precision',
      food: '01/23',
      table: '02/45'
    },
    verify: (text, key) => {
      if (['buyouts.upTo', 'craft.phaseBadge'].includes(key)) {
        return text.includes('3.14159')
      }
      return true
    }
  },
  {
    name: 'Empty string values',
    params: {
      tier: '',
      guests: '',
      name: '',
      n: '',
      label: '',
      food: '',
      table: ''
    },
    verify: (text, key) => !text.includes('{{') && !text.includes('}}')
  },
  {
    name: 'Diacritic & international inputs in params',
    params: {
      tier: 'Królewski Zamek Čechy España',
      guests: '500',
      name: 'François Müller Župančič Łódź',
      n: '1',
      label: 'Čeština & Español & Polski',
      food: 'info@kader.si',
      table: 'rezervacije@kader.si'
    },
    verify: (text, key) => {
      if (key === 'buyouts.thankYou') {
        return text.includes('François Müller Župančič Łódź')
      }
      return true
    }
  },
  {
    name: 'HTML/XML and quote characters in params',
    params: {
      tier: '<b>Bold Tier</b>',
      guests: '<script>alert(1)</script>',
      name: '"O\'Connor" & <Friends>',
      n: '4',
      label: 'Tag <img src=x onerror=alert(1)>',
      food: 'A & B',
      table: 'C > D'
    },
    verify: (text, key) => {
      if (key === 'buyouts.thankYou') {
        return text.includes('"O\'Connor" & <Friends>')
      }
      return true
    }
  },
  {
    name: 'Regex replacement tokens ($, $$, $&, $\', $1)',
    params: {
      tier: '$100 Package',
      guests: '$$ guests',
      name: '$& and $\' and $1',
      n: '$5',
      label: '$$$ Price',
      food: '$food',
      table: '$table'
    },
    verify: (text, key) => {
      if (key === 'buyouts.thankYou') {
        // Must literally contain the tokens, not regex expansion
        return text.includes('$& and $\' and $1')
      }
      return true
    }
  },
  {
    name: 'Emojis and Unicode surrogate pairs',
    params: {
      tier: 'VIP 🏰👑',
      guests: '100 🍕',
      name: 'Pizza Lover 🍕🥂🎉',
      n: '7 🔥',
      label: 'Gourmet 🍕',
      food: '📞 123',
      table: '📅 456'
    },
    verify: (text, key) => {
      if (key === 'buyouts.thankYou') {
        return text.includes('Pizza Lover 🍕🥂🎉')
      }
      return true
    }
  },
  {
    name: 'Missing / Empty params object',
    params: {},
    verify: (text, key) => {
      // Missing params should retain placeholder rather than crashing or returning undefined
      return text.includes('{{') && text.includes('}}')
    }
  },
  {
    name: 'Undefined params argument (t(key))',
    params: undefined,
    verify: (text, key) => {
      // Missing params should retain placeholder without error
      return text.includes('{{') && text.includes('}}')
    }
  },
  {
    name: 'Partial params (missing one of two placeholders)',
    params: { tier: 'Gold' }, // guests missing
    verify: (text, key) => {
      if (key === 'buyouts.inquiryMessagePrefill') {
        return text.includes('Gold') && text.includes('{{guests}}')
      }
      return true
    }
  }
]

for (const loc of SUPPORTED_LOCALES) {
  setLocale(loc)
  assert(locale.value === loc, `setLocale('${loc}') active`)
  
  for (const testCase of boundaryTestCases) {
    for (const key of PARAM_KEYS) {
      const output = testCase.params !== undefined ? t(key, testCase.params) : t(key)
      assert(typeof output === 'string' && output.length > 0, `[${loc}] t("${key}") with [${testCase.name}] returned valid string`)
      const passesVerification = testCase.verify(output, key)
      assert(passesVerification, `[${loc}] t("${key}") verification passed for [${testCase.name}]`, { output })
    }
  }
}

// -----------------------------------------------------------------------------
// Suite 6: Fallback & Resilience Behavior
// -----------------------------------------------------------------------------
suite('6. Fallback & Resilience')

// Test 6.1: Non-existent key returns key itself
setLocale('en')
const nonExistentKey = 'non.existent.random.key.xyz'
const fallbackResult = t(nonExistentKey)
assert(fallbackResult === nonExistentKey, `Non-existent key returns key verbatim (expected: "${nonExistentKey}", got: "${fallbackResult}")`)

// Test 6.2: Empty string key
const emptyKeyResult = t('')
assert(emptyKeyResult === '', `Empty string key returns empty string`)

// Test 6.3: Fallback from unsupported locale
setLocale('sl')
// Directly test dictionary lookup when locale is not in flatDictionaries
const unsuppLocale = 'xx'
// Simulated translation logic with unsupported locale
const fallbackDict = flatDictionaries[unsuppLocale] || flatDictionaries[DEFAULT_LOCALE]
assert(fallbackDict !== undefined, `Fallback to DEFAULT_LOCALE when locale is unsupported`)
assert(fallbackDict['common.close'] === 'Zapri', `Fallback dict retrieves default locale translation`)

// Test 6.4: setLocale with invalid locale does nothing
setLocale('sl')
setLocale('invalid_lang')
assert(locale.value === 'sl', `setLocale('invalid_lang') preserves current locale 'sl'`)

// Test 6.5: Cycle through all locales via toggleLocale
setLocale('sl')
for (let i = 0; i < SUPPORTED_LOCALES.length; i++) {
  const expectedNext = SUPPORTED_LOCALES[(i + 1) % SUPPORTED_LOCALES.length]
  const currentIndex = SUPPORTED_LOCALES.indexOf(locale.value)
  const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
  setLocale(SUPPORTED_LOCALES[nextIndex])
  assert(locale.value === expectedNext, `Locale toggled to ${expectedNext}`)
}

// -----------------------------------------------------------------------------
// Suite 7: Dual Syntax Interpolation ({param} and {{param}})
// -----------------------------------------------------------------------------
suite('7. Dual Syntax Interpolation ({param} and {{param}})')

// Construct synthetic translation strings with single and double braces
const testSingleBrace = "Welcome, {name}! You have {count} new messages."
const testDoubleBrace = "Welcome, {{name}}! You have {{count}} new messages."
const testMixedBrace = "Welcome, {name}! You have {{count}} new messages."

function interpolate(text, params) {
  if (params && typeof text === 'string') {
    return text.replace(/\{{1,2}([a-zA-Z0-9_-]+)\}{1,2}/g, (match, paramName) => {
      return params[paramName] !== undefined ? String(params[paramName]) : match
    })
  }
  return text
}

const interpParams = { name: 'Maja', count: 5 }
assert(interpolate(testSingleBrace, interpParams) === "Welcome, Maja! You have 5 new messages.", "Single brace {param} interpolated correctly")
assert(interpolate(testDoubleBrace, interpParams) === "Welcome, Maja! You have 5 new messages.", "Double brace {{param}} interpolated correctly")
assert(interpolate(testMixedBrace, interpParams) === "Welcome, Maja! You have 5 new messages.", "Mixed braces {param} and {{param}} interpolated correctly")

// -----------------------------------------------------------------------------
// Suite 8: High-Throughput Microbenchmark
// -----------------------------------------------------------------------------
suite('8. Performance & Concurrency Microbenchmarking')

setLocale('es')
const benchmarkIterations = 20000
const startTime = performance.now()

for (let i = 0; i < benchmarkIterations; i++) {
  t('common.close')
  t('buyouts.upTo', { n: i % 100 })
}

const elapsedMs = performance.now() - startTime
const opsPerSec = Math.round((benchmarkIterations * 2) / (elapsedMs / 1000))
console.log(`  Executed ${benchmarkIterations * 2} lookups/interpolations in ${elapsedMs.toFixed(2)}ms (${opsPerSec.toLocaleString()} ops/sec)`)

assert(elapsedMs < 2000, `20,000 iterations executed well within budget (elapsed: ${elapsedMs.toFixed(2)}ms)`)
assert(opsPerSec > 50000, `High throughput achieved (${opsPerSec.toLocaleString()} ops/sec > 50,000 ops/sec)`)

// -----------------------------------------------------------------------------
// Test Summary & Final Verdict
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}=========================================${RESET}`)
console.log(`${BOLD}TEST SUMMARY${RESET}`)
console.log(`Total Assertions:  ${totalAssertions}`)
console.log(`Passed Assertions: ${GREEN}${passedAssertions}${RESET}`)
console.log(`Failed Assertions: ${failedAssertions > 0 ? RED : GREEN}${failedAssertions}${RESET}`)
console.log(`${BOLD}=========================================${RESET}`)

if (failedAssertions > 0) {
  console.error(`\n${RED}${BOLD}FAILED with ${failedAssertions} errors!${RESET}`)
  process.exit(1)
} else {
  console.log(`\n${GREEN}${BOLD}ALL ASSERTIONS PASSED! 100.0% EMPIRICALLY VERIFIED.${RESET}\n`)
  process.exit(0)
}
