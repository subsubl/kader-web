import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  atomicWriteJson,
  atomicWriteJsonSync,
  readJson,
  readJsonSync,
  memoryStoreCache,
  invalidateFileCache
} from './src/server/utils/fileStore.ts'
import {
  apiCache,
  invalidateCache,
  isEtagMatch,
  send304
} from './src/server/utils/cache.ts'
import {
  readLocalStore,
  writeLocalStore,
  saveCustomEvent,
  deleteCustomEvent,
  updateRaEventPretix,
  getSyncedRaEvents,
  isRaSyncing
} from './src/server/utils/raSyncEngine.ts'

async function runTests() {
  console.log('--- TEST SUITE: Milestone 2 Logic Verification ---')

  // 1. FileStore Unit Tests
  console.log('\n[1] Testing FileStore...')
  const testFile = path.resolve(process.cwd(), '.data/test_store.json')
  
  // Test atomicWriteJson & readJson
  await atomicWriteJson(testFile, { testKey: 'asyncValue', num: 42 })
  assert.equal(fs.existsSync(testFile), true, 'File should exist on disk')
  
  const cachedData = await readJson(testFile, {})
  assert.equal(cachedData.testKey, 'asyncValue')
  assert.equal(cachedData.num, 42)
  assert.equal(memoryStoreCache.has(testFile), true, 'In-memory cache should contain file')

  // Test sync methods
  atomicWriteJsonSync(testFile, { testKey: 'syncValue', num: 100 })
  const syncRead = readJsonSync(testFile, {})
  assert.equal(syncRead.testKey, 'syncValue')
  assert.equal(syncRead.num, 100)

  // Test concurrency stress on fileStore (50 concurrent writes and reads)
  console.log('  Testing 50 concurrent writes & reads on fileStore...')
  const concurrentOps = []
  for (let i = 0; i < 50; i++) {
    concurrentOps.push(
      (async () => {
        await atomicWriteJson(testFile, { counter: i, timestamp: Date.now() })
        const res = await readJson(testFile, { counter: -1 })
        assert(typeof res.counter === 'number' && res.counter >= 0)
      })()
    )
  }
  await Promise.all(concurrentOps)
  console.log('  ✔ FileStore passed all concurrency and atomicity assertions.')

  // Cleanup test file
  try {
    fs.unlinkSync(testFile)
    invalidateFileCache(testFile)
  } catch {}

  // 2. Cache Engine Unit Tests
  console.log('\n[2] Testing Cache Engine...')
  apiCache.clear()

  // ETag formatting & generation
  const entry1 = apiCache.set('test:key', { foo: 'bar' }, 10, 20)
  assert.match(entry1.etag, /^"[a-f0-9]{16}"$/, 'ETag must be 16-char sha1 hex string wrapped in quotes')
  assert.equal(apiCache.get('test:key')?.data.foo, 'bar')

  // Determinism
  const entry2 = apiCache.set('test:key2', { foo: 'bar' }, 10, 20)
  assert.equal(entry1.etag, entry2.etag, 'Deterministic ETag must match for identical JSON payloads')

  // isEtagMatch tests
  assert.equal(isEtagMatch(entry1.etag, entry1.etag), true, 'Exact match should return true')
  assert.equal(isEtagMatch(`W/${entry1.etag}`, entry1.etag), true, 'Weak match should return true')
  assert.equal(isEtagMatch(`"different", ${entry1.etag}`, entry1.etag), true, 'Comma-separated list should return true')
  assert.equal(isEtagMatch('*', entry1.etag), true, 'Wildcard * should return true')
  assert.equal(isEtagMatch('"nonexistent"', entry1.etag), false, 'Mismatched ETag should return false')
  assert.equal(isEtagMatch(undefined, entry1.etag), false, 'Undefined client tag should return false')

  // Invalidation & Prefix Invalidation
  apiCache.set('ra-events:upcoming', [1], 60, 60)
  apiCache.set('ra-events:past', [2], 60, 60)
  apiCache.set('site-images', { img: 1 }, 60, 60)

  const flushedRa = invalidateCache('ra-events')
  assert.equal(flushedRa, 2, 'Should invalidate both ra-events:upcoming and ra-events:past')
  assert.equal(apiCache.get('ra-events:upcoming'), undefined)
  assert.equal(apiCache.get('ra-events:past'), undefined)
  assert.notEqual(apiCache.get('site-images'), undefined, 'site-images should remain intact')

  invalidateCache('site-images')
  assert.equal(apiCache.get('site-images'), undefined)
  console.log('  ✔ Cache engine passed all ETag, RFC 7232, and invalidation assertions.')

  // 3. raSyncEngine Unit Tests
  console.log('\n[3] Testing raSyncEngine...')
  const initialStore = readLocalStore()
  assert(Array.isArray(initialStore.events), 'Store events must be an array')

  // Test saveCustomEvent
  const customEvent = saveCustomEvent({
    title: 'Automated Test Event M2',
    date: new Date(Date.now() + 86400000).toISOString(),
    cost: 15,
    artists: ['DJ Test', 'Producer Example']
  })
  assert.equal(customEvent.title, 'Automated Test Event M2')
  assert.equal(customEvent.is_custom, true)

  // Verify custom event in store
  const storeAfterAdd = readLocalStore()
  const found = storeAfterAdd.events.find(e => e.ra_id === customEvent.ra_id)
  assert(found, 'Custom event must exist in local store')
  assert.equal(found.title, 'Automated Test Event M2')

  // Test updateRaEventPretix
  const pretixUrl = 'https://pretix.eu/kader/test-m2'
  const updatedPretix = await updateRaEventPretix(customEvent.ra_id, pretixUrl)
  assert(updatedPretix, 'Event record must be returned')
  assert.equal(updatedPretix.pretix_event_url, pretixUrl)

  const storeAfterPretix = readLocalStore()
  const foundPretix = storeAfterPretix.events.find(e => e.ra_id === customEvent.ra_id)
  assert.equal(foundPretix?.pretix_event_url, pretixUrl, 'Pretix URL must be persisted in store')

  // Test getSyncedRaEvents non-blocking speed (< 50ms)
  const t0 = performance.now()
  const upcomingEvents = await getSyncedRaEvents('upcoming')
  const duration = performance.now() - t0
  assert(Array.isArray(upcomingEvents), 'Should return array of events')
  assert(duration < 50, `getSyncedRaEvents must be non-blocking (<50ms), took ${duration.toFixed(2)}ms`)
  console.log(`  getSyncedRaEvents duration: ${duration.toFixed(3)}ms (< 50ms requirement satisfied)`)

  // Test deleteCustomEvent
  const deleted = deleteCustomEvent(customEvent.ra_id)
  assert.equal(deleted, true, 'Delete should return true')
  const storeAfterDelete = readLocalStore()
  assert.equal(storeAfterDelete.events.some(e => e.ra_id === customEvent.ra_id), false)

  console.log('  ✔ raSyncEngine passed all non-blocking, custom event, and persistence assertions.')

  console.log('\n--- ALL UNIT ASSERTIONS PASSED SUCCESSFULLY ---')
}

runTests().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
