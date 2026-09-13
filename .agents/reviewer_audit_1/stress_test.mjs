// .agents/reviewer_audit_1/stress_test.mjs
import assert from 'node:assert/strict'
import { parseAcceptLanguage } from '../../src/server/utils/locale.ts'

console.log('=== STARTING ADVERSARIAL STRESS TEST SUITE ===\n')

let passed = 0
let failed = 0

function run(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✓ PASS: ${name}`)
  } catch (err) {
    failed++
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`)
  }
}

// 1. Stress-testing parseAcceptLanguage
run('parseAcceptLanguage handles null/undefined/empty gracefully', () => {
  assert.deepEqual(parseAcceptLanguage(null), [])
  assert.deepEqual(parseAcceptLanguage(undefined), [])
  assert.deepEqual(parseAcceptLanguage(''), [])
  assert.deepEqual(parseAcceptLanguage('   '), [])
})

run('parseAcceptLanguage handles malformed q-factors without NaN or crash', () => {
  const res = parseAcceptLanguage('en;q=invalid,sl;q=notanumber')
  assert.equal(res.length, 2)
  assert.equal(res[0].code, 'en')
  assert.equal(res[0].q, 1.0)
  assert.equal(res[1].code, 'sl')
  assert.equal(res[1].q, 1.0)
})

run('parseAcceptLanguage clamps out-of-range q-factors [0, 1]', () => {
  const res = parseAcceptLanguage('en;q=999,sl;q=-5')
  assert.equal(res[0].code, 'en')
  assert.equal(res[0].q, 1.0)
  assert.equal(res[1].code, 'sl')
  assert.equal(res[1].q, 0.0)
})

run('parseAcceptLanguage sorts descending by q-factor', () => {
  const res = parseAcceptLanguage('de;q=0.3,en;q=0.9,sl;q=0.6')
  assert.equal(res[0].code, 'en')
  assert.equal(res[1].code, 'sl')
  assert.equal(res[2].code, 'de')
})

console.log(`\nAdversarial Stress Test Summary: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
