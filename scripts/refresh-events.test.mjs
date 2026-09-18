import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeEvent, fetchEvents, refresh } from './refresh-events.mjs'

test('normalizeEvent: valid record', () => {
  const e = normalizeEvent({
    id: '42', title: 'Test Night', startTime: '2026-10-01T20:00:00Z',
    endTime: '2026-10-01T23:00:00Z', cost: 15,
    contentUrl: '/events/42', flyerFront: '/fly/42.jpg',
    artists: [{ name: 'Artist' }], genres: [{ name: 'Techno' }]
  })
  assert.equal(e.ra_id, 42)
  assert.equal(e.title, 'Test Night')
  assert.equal(e.cost, 15)
  assert.ok(e.ra_url.endsWith('/events/42'))
})

test('normalizeEvent: rejects missing id/title', () => {
  assert.throws(() => normalizeEvent({ id: '0', title: 'x' }))
  assert.throws(() => normalizeEvent({ id: '5', title: '   ' }))
})

test('normalizeEvent: safe URL, blocks javascript protocol', () => {
  assert.throws(() => normalizeEvent({ id: '1', title: 'X', contentUrl: 'javascript:alert(1)' }))
})

test('refresh: aborts (throws) on RA error, never touches output', async () => {
  const fetcher = async () => ({ ok: false, status: 500 })
  await assert.rejects(() => refresh({ fetcher }))
})

test('refresh: rejects invalid batch, keeps last good', async () => {
  const fetcher = async () => ({
    ok: true, status: 200,
    json: async () => ({ data: { venue: { events: [{ id: 'bad', title: '' }] } }, errors: [] })
  })
  await assert.rejects(() => refresh({ fetcher }))
})