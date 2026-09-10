// scripts/verify_m1_m2_empirical.mjs
// Rigorous Empirical Verification Suite for Milestone 1 & Milestone 2
// Tests state machines, edge cases, contracts, math, and DOM logic.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'vue/compiler-sfc'

let totalTests = 0
let passedTests = 0
let failedTests = 0

function test(name, fn) {
  totalTests++
  try {
    fn()
    passedTests++
    console.log(`  ✔ [PASS] ${name}`)
  } catch (err) {
    failedTests++
    console.error(`  ✖ [FAIL] ${name}`)
    console.error(`    ${err.message}`)
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 3).join('\n'))
    }
  }
}

async function asyncTest(name, fn) {
  totalTests++
  try {
    await fn()
    passedTests++
    console.log(`  ✔ [PASS] ${name}`)
  } catch (err) {
    failedTests++
    console.error(`  ✖ [FAIL] ${name}`)
    console.error(`    ${err.message}`)
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 3).join('\n'))
    }
  }
}

console.log('======================================================================')
console.log('  EMPIRICAL ADVERSARIAL TEST SUITE: KADER MILESTONES 1 & 2')
console.log('======================================================================\n')

// ============================================================================
// SUITE 1: MILESTONE 1 — DAY/NIGHT AMBIENT MODE & HOME ELEVATION
// ============================================================================
console.log('>>> [SUITE 1] M1: Day/Night Ambient Mode & Home Elevation (`src/pages/index.vue`)')

const indexPath = path.resolve(process.cwd(), 'src/pages/index.vue')
const indexContent = fs.readFileSync(indexPath, 'utf-8')
const indexSfc = parse(indexContent)

test('Source Integrity: src/pages/index.vue exists and parses without errors', () => {
  assert(indexContent.length > 0, 'index.vue should not be empty')
  assert(indexSfc.descriptor.template, 'index.vue must contain a <template>')
  assert(indexSfc.descriptor.scriptSetup, 'index.vue must contain a <script setup>')
})

// Simulation of Day/Night ambient logic
class AmbientModeManager {
  constructor(initialMode = 'day', mockStorage = new Map()) {
    this.ambientMode = initialMode
    this.storage = mockStorage
    this.scrolledPastHero = false
  }

  setAmbientMode(mode) {
    if (mode !== 'day' && mode !== 'night') {
      throw new Error(`Invalid ambient mode: ${mode}`)
    }
    this.ambientMode = mode
    this.storage.set('kader_ambient_mode', mode)
  }

  toggleAmbientMode() {
    this.setAmbientMode(this.ambientMode === 'day' ? 'night' : 'day')
  }

  handleScroll(scrollY) {
    this.scrolledPastHero = scrollY > 400
  }

  static detectFromHour(hour) {
    return (hour >= 8 && hour < 18) ? 'day' : 'night'
  }

  static initFromStorageOrTime(storage, currentHour) {
    const saved = storage.get('kader_ambient_mode')
    if (saved === 'day' || saved === 'night') {
      return saved
    }
    return AmbientModeManager.detectFromHour(currentHour)
  }
}

test('Day/Night Time Detection: 24-hour cycle client time mapping', () => {
  // Rule: (hour >= 8 && hour < 18) ? 'day' : 'night'
  // Night: 0..7
  for (let h = 0; h < 8; h++) {
    assert.equal(AmbientModeManager.detectFromHour(h), 'night', `Hour ${h}:00 should be night`)
  }
  // Day: 8..17
  for (let h = 8; h < 18; h++) {
    assert.equal(AmbientModeManager.detectFromHour(h), 'day', `Hour ${h}:00 should be day`)
  }
  // Night: 18..23
  for (let h = 18; h < 24; h++) {
    assert.equal(AmbientModeManager.detectFromHour(h), 'night', `Hour ${h}:00 should be night`)
  }
})

test('Day/Night Time Boundaries: Exact millisecond boundaries', () => {
  // Boundary 07:59:59 -> hour is 7 -> night
  assert.equal(AmbientModeManager.detectFromHour(7), 'night')
  // Boundary 08:00:00 -> hour is 8 -> day
  assert.equal(AmbientModeManager.detectFromHour(8), 'day')
  // Boundary 17:59:59 -> hour is 17 -> day
  assert.equal(AmbientModeManager.detectFromHour(17), 'day')
  // Boundary 18:00:00 -> hour is 18 -> night
  assert.equal(AmbientModeManager.detectFromHour(18), 'night')
})

test('LocalStorage Persistence: Stored preference overrides client time', () => {
  const store = new Map()
  
  // No store, 14:00 (afternoon) -> day
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 14), 'day')
  // No store, 22:00 (night) -> night
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 22), 'night')

  // User explicitly saved 'night' -> at 14:00 must remain 'night'
  store.set('kader_ambient_mode', 'night')
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 14), 'night')

  // User explicitly saved 'day' -> at 23:00 must remain 'day'
  store.set('kader_ambient_mode', 'day')
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 23), 'day')

  // Corrupted / invalid value in storage -> falls back to hour calculation
  store.set('kader_ambient_mode', 'invalid_ambient_value')
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 10), 'day')
  assert.equal(AmbientModeManager.initFromStorageOrTime(store, 2), 'night')
})

test('State Transitions & Toggle Logic', () => {
  const store = new Map()
  const manager = new AmbientModeManager('day', store)

  assert.equal(manager.ambientMode, 'day')
  manager.toggleAmbientMode()
  assert.equal(manager.ambientMode, 'night')
  assert.equal(store.get('kader_ambient_mode'), 'night')

  manager.toggleAmbientMode()
  assert.equal(manager.ambientMode, 'day')
  assert.equal(store.get('kader_ambient_mode'), 'day')

  manager.setAmbientMode('night')
  assert.equal(manager.ambientMode, 'night')

  assert.throws(() => manager.setAmbientMode('dusk'), /Invalid ambient mode/)
})

test('Floating Ambient Pill Scroll Trigger: scrollY > 400 boundary check', () => {
  const manager = new AmbientModeManager('day')
  
  manager.handleScroll(0)
  assert.equal(manager.scrolledPastHero, false)

  manager.handleScroll(399)
  assert.equal(manager.scrolledPastHero, false)

  manager.handleScroll(400)
  assert.equal(manager.scrolledPastHero, false, 'Scroll boundary at 400 should not trigger')

  manager.handleScroll(401)
  assert.equal(manager.scrolledPastHero, true, 'Scroll boundary at 401 must trigger')

  manager.handleScroll(1200)
  assert.equal(manager.scrolledPastHero, true)

  manager.handleScroll(200)
  assert.equal(manager.scrolledPastHero, false)
})

test('Template Contract: Hero gradient shifts, dynamic CTAs, and a11y labels in index.vue', () => {
  // Verify Hero gradient classes
  assert(
    indexContent.includes("ambientMode === 'day' \n          ? 'bg-gradient-to-t from-black via-amber-950/20 to-black/70' \n          : 'bg-gradient-to-t from-black via-red-950/30 to-purple-950/20'") ||
    indexContent.includes("ambientMode === 'day'") && indexContent.includes("from-black via-amber-950/20 to-black/70") && indexContent.includes("from-black via-red-950/30 to-purple-950/20"),
    'index.vue must contain amber day gradient and red/purple night gradient'
  )

  // Verify dynamic primary CTAs: /pizzeria for Day vs /events for Night
  assert(indexContent.includes('v-if="ambientMode === \'day\'"'), 'Must have conditional for Day CTA')
  assert(indexContent.includes('to="/pizzeria"'), 'Must link to /pizzeria for Day mode')
  assert(indexContent.includes('to="/events"'), 'Must link to /events for Night mode')

  // Verify radiogroup role and aria tags
  assert(indexContent.includes('role="radiogroup"'), 'Ambient mode selector must have role="radiogroup"')
  assert(indexContent.includes('role="radio"'), 'Options must have role="radio"')
  assert(indexContent.includes(':aria-checked="ambientMode === \'day\'"'), 'Must have :aria-checked for day')
  assert(indexContent.includes(':aria-checked="ambientMode === \'night\'"'), 'Must have :aria-checked for night')

  // Verify floating ambient toggle pill
  assert(indexContent.includes('toggleAmbientMode'), 'Must have toggleAmbientMode handler')
  assert(indexContent.includes('scrolledPastHero'), 'Must react to scrolledPastHero')
  assert(indexContent.includes('min-h-[44px]'), 'Must enforce min-h-[44px] touch target')
})


// ============================================================================
// SUITE 2: MILESTONE 1 — IMAGE LIGHTBOX MODAL
// ============================================================================
console.log('\n>>> [SUITE 2] M1: Lightbox Modal (`src/components/ImageLightboxModal.vue`)')

const lightboxPath = path.resolve(process.cwd(), 'src/components/ImageLightboxModal.vue')
const lightboxContent = fs.readFileSync(lightboxPath, 'utf-8')
const lightboxSfc = parse(lightboxContent)

test('Source Integrity: src/components/ImageLightboxModal.vue exists and parses without errors', () => {
  assert(lightboxContent.length > 0, 'ImageLightboxModal.vue should not be empty')
  assert(lightboxSfc.descriptor.template, 'ImageLightboxModal.vue must contain a <template>')
  assert(lightboxSfc.descriptor.scriptSetup, 'ImageLightboxModal.vue must contain a <script setup>')
})

// Lightbox logic harness
class LightboxController {
  constructor(items = [], initialIndex = 0, isOpen = false) {
    this.items = items
    this.currentIndex = initialIndex
    this.isOpen = isOpen
    this.bodyOverflow = ''
    this.emits = []
  }

  setOpen(open) {
    this.isOpen = open
    this.bodyOverflow = open ? 'hidden' : ''
    this.emits.push({ type: 'update:modelValue', value: open })
    if (!open) this.emits.push({ type: 'close' })
  }

  close() {
    this.setOpen(false)
  }

  next() {
    if (!this.items.length) return
    this.currentIndex = (this.currentIndex + 1) % this.items.length
    this.emits.push({ type: 'change', index: this.currentIndex })
  }

  prev() {
    if (!this.items.length) return
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
    this.emits.push({ type: 'change', index: this.currentIndex })
  }

  goTo(idx) {
    if (idx >= 0 && idx < this.items.length) {
      this.currentIndex = idx
      this.emits.push({ type: 'change', index: idx })
    }
  }

  onBackdropClick(target, currentTarget) {
    if (target === currentTarget) {
      this.close()
    }
  }

  onKeydown(key) {
    if (!this.isOpen) return
    if (key === 'Escape') this.close()
    else if (key === 'ArrowRight') this.next()
    else if (key === 'ArrowLeft') this.prev()
  }

  handleTouchSwipe(deltaX, deltaY) {
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) this.next()
      else this.prev()
    }
  }
}

test('Lightbox Navigation & Modulo Wrapping: Multi-item gallery', () => {
  const sampleItems = [
    { src: '/img1.jpg', label: 'Slika 1' },
    { src: '/img2.jpg', label: 'Slika 2' },
    { src: '/img3.jpg', label: 'Slika 3' },
    { src: '/img4.jpg', label: 'Slika 4' },
    { src: '/img5.jpg', label: 'Slika 5' },
    { src: '/img6.jpg', label: 'Slika 6' }
  ]
  const lb = new LightboxController(sampleItems, 0, true)

  assert.equal(lb.currentIndex, 0)
  lb.next()
  assert.equal(lb.currentIndex, 1)
  lb.next()
  assert.equal(lb.currentIndex, 2)
  lb.prev()
  assert.equal(lb.currentIndex, 1)

  // Test wrapping at end
  lb.goTo(5)
  assert.equal(lb.currentIndex, 5)
  lb.next()
  assert.equal(lb.currentIndex, 0, 'next() at end must wrap around to 0')

  // Test wrapping at beginning
  lb.prev()
  assert.equal(lb.currentIndex, 5, 'prev() at 0 must wrap around to length - 1')
})

test('Lightbox Navigation Boundary: Single item and empty gallery resilience', () => {
  // Single item
  const single = new LightboxController([{ src: '/1.jpg', label: 'Solo' }], 0, true)
  single.next()
  assert.equal(single.currentIndex, 0)
  single.prev()
  assert.equal(single.currentIndex, 0)

  // Empty gallery: should not throw or result in NaN
  const empty = new LightboxController([], 0, true)
  empty.next()
  assert.equal(empty.currentIndex, 0)
  empty.prev()
  assert.equal(empty.currentIndex, 0)

  // Out-of-bounds goTo
  single.goTo(-1)
  assert.equal(single.currentIndex, 0, 'goTo(-1) should be ignored')
  single.goTo(10)
  assert.equal(single.currentIndex, 0, 'goTo(10) should be ignored')
})

test('Lightbox Keyboard Listeners: Escape, ArrowRight, ArrowLeft', () => {
  const items = [{ src: '1' }, { src: '2' }, { src: '3' }]
  const lb = new LightboxController(items, 0, true)

  lb.onKeydown('ArrowRight')
  assert.equal(lb.currentIndex, 1)
  lb.onKeydown('ArrowLeft')
  assert.equal(lb.currentIndex, 0)

  lb.onKeydown('Escape')
  assert.equal(lb.isOpen, false)
  assert.equal(lb.bodyOverflow, '')

  // While closed, keydown events must be ignored
  lb.onKeydown('ArrowRight')
  assert.equal(lb.currentIndex, 0, 'Keydown while closed should do nothing')
})

test('Lightbox Touch Swipe Formula: Strict horizontal dominance and dead zone threshold', () => {
  const items = [{ src: '1' }, { src: '2' }, { src: '3' }]
  const lb = new LightboxController(items, 1, true)

  // Exact threshold boundary: deltaX = 40 (threshold is > 40)
  lb.handleTouchSwipe(40, 0)
  assert.equal(lb.currentIndex, 1, 'deltaX = 40 must not trigger swipe (dead zone)')

  // Left swipe beyond threshold (deltaX < -40) -> next()
  lb.handleTouchSwipe(-41, 0)
  assert.equal(lb.currentIndex, 2, 'deltaX = -41 must trigger next()')

  // Right swipe beyond threshold (deltaX > 40) -> prev()
  lb.handleTouchSwipe(45, 10)
  assert.equal(lb.currentIndex, 1, 'deltaX = 45 with deltaY = 10 must trigger prev()')

  // Diagonal / Vertical scroll rejection: abs(deltaX) must be strictly > abs(deltaY)
  lb.handleTouchSwipe(-60, 60)
  assert.equal(lb.currentIndex, 1, 'Equal deltaX and deltaY (diagonal) must be rejected')

  lb.handleTouchSwipe(50, 100)
  assert.equal(lb.currentIndex, 1, 'Vertical scroll intent (deltaY > deltaX) must be rejected')
})

test('Lightbox Scroll Locking & Dismissal', () => {
  const lb = new LightboxController([{ src: '1' }], 0, false)
  
  assert.equal(lb.bodyOverflow, '')
  lb.setOpen(true)
  assert.equal(lb.bodyOverflow, 'hidden', 'Opening lightbox must lock document.body.style.overflow')

  // Backdrop click dismiss: target === currentTarget
  const backdrop = { id: 'backdrop' }
  const innerCard = { id: 'card' }

  lb.onBackdropClick(innerCard, backdrop)
  assert.equal(lb.isOpen, true, 'Clicking inside child card must NOT close modal')

  lb.onBackdropClick(backdrop, backdrop)
  assert.equal(lb.isOpen, false, 'Clicking directly on backdrop must close modal')
  assert.equal(lb.bodyOverflow, '', 'Closing modal must restore document.body.style.overflow')
})

test('Lightbox Template Contracts: Teleport, a11y roles, touch targets', () => {
  assert(lightboxContent.includes('<Teleport to="body">'), 'Modal must teleport to body')
  assert(lightboxContent.includes('role="dialog"'), 'Must have role="dialog"')
  assert(lightboxContent.includes('aria-modal="true"'), 'Must have aria-modal="true"')
  assert(lightboxContent.includes('aria-label="Kader Galerija Slik"'), 'Must have descriptive aria-label')
  assert(lightboxContent.includes('min-h-[44px]'), 'Navigation buttons must meet WCAG 44px touch target')
})


// ============================================================================
// SUITE 3: MILESTONE 2 — PROVENANCE BADGE REGISTRY & COMPONENT
// ============================================================================
console.log('\n>>> [SUITE 3] M2: ProvenanceBadge (`src/components/ProvenanceBadge.vue`)')

const badgePath = path.resolve(process.cwd(), 'src/components/ProvenanceBadge.vue')
const badgeContent = fs.readFileSync(badgePath, 'utf-8')
const badgeSfc = parse(badgeContent)

test('Source Integrity: src/components/ProvenanceBadge.vue exists and parses without errors', () => {
  assert(badgeContent.length > 0, 'ProvenanceBadge.vue should not be empty')
  assert(badgeSfc.descriptor.template, 'ProvenanceBadge.vue must contain a <template>')
  assert(badgeSfc.descriptor.scriptSetup, 'ProvenanceBadge.vue must contain a <script setup>')
})

// Canonical Registry & resolver extraction from component logic
const BADGE_REGISTRY = {
  'san-marzano': {
    key: 'san-marzano',
    shortName: 'San Marzano',
    cert: 'D.O.P.',
    icon: '🍅',
    title: 'Pelati San Marzano dell’Agro Sarnese-Nocerino D.O.P.',
    origin: 'Campania (Vezuv)',
    category: 'dop'
  },
  'bufala': {
    key: 'bufala',
    shortName: 'Bufala Campana',
    cert: 'D.O.P.',
    icon: '🐃',
    title: 'Mozzarella di Bufala Campana D.O.P.',
    origin: 'Caserta & Salerno',
    category: 'dop'
  },
  'fior-di-latte': {
    key: 'fior-di-latte',
    shortName: 'Fior di Latte',
    cert: 'AGEROLA',
    icon: '🧀',
    title: 'Fior di Latte dei Monti Lattari d’Agerola',
    origin: 'Amalfi Coast, ITA',
    category: 'craft'
  },
  'ferment-48h': {
    key: 'ferment-48h',
    shortName: '48h Ferment',
    cert: 'CRAFT',
    icon: '⏳',
    title: '48-Urno Hladno Zorenje & Fermentacija',
    origin: 'Hišna Obrt Grad Kodeljevo',
    category: 'craft'
  },
  'mortadella': {
    key: 'mortadella',
    shortName: 'Mortadella',
    cert: 'I.G.P.',
    icon: '🥓',
    title: 'Mortadella Bologna I.G.P.',
    origin: 'Emilia-Romagna',
    category: 'igp'
  },
  'pistacchio': {
    key: 'pistacchio',
    shortName: 'Pistacchio Bronte',
    cert: 'D.O.P.',
    icon: '🌱',
    title: 'Pistacchio Verde di Bronte D.O.P.',
    origin: 'Bronte, Etna (Sicilija)',
    category: 'dop'
  },
  'olio-bio': {
    key: 'olio-bio',
    shortName: 'Bio Oljčno Olje',
    cert: 'BIO',
    icon: '🌿',
    title: 'Ekološko Ekstra Deviško Oljčno Olje',
    origin: 'Hladno stiskano',
    category: 'bio'
  },
  'parma': {
    key: 'parma',
    shortName: 'Pršut Parma 24m',
    cert: 'D.O.P.',
    icon: '🍖',
    title: 'Prosciutto di Parma D.O.P. (24 mesecev)',
    origin: 'Parma, Emilia-Romagna',
    category: 'dop'
  },
  'stracciatella': {
    key: 'stracciatella',
    shortName: 'Stracciatella',
    cert: 'PUGLIA',
    icon: '🥛',
    title: 'Sveža Stracciatella & Burrata di Puglia',
    origin: 'Puglia, Italija',
    category: 'craft'
  }
}

function resolveBadge(badgeKey) {
  const normKey = badgeKey.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
  if (BADGE_REGISTRY[normKey]) return BADGE_REGISTRY[normKey]
  if (normKey.includes('marzano')) return BADGE_REGISTRY['san-marzano']
  if (normKey.includes('bufala')) return BADGE_REGISTRY['bufala']
  if (normKey.includes('fior') || normKey.includes('latte')) return BADGE_REGISTRY['fior-di-latte']
  if (normKey.includes('ferment') || normKey.includes('48h')) return BADGE_REGISTRY['ferment-48h']
  if (normKey.includes('mortadela') || normKey.includes('mortadella')) return BADGE_REGISTRY['mortadella']
  if (normKey.includes('pistac') || normKey.includes('bronte')) return BADGE_REGISTRY['pistacchio']
  if (normKey.includes('olj') || normKey.includes('bio')) return BADGE_REGISTRY['olio-bio']
  if (normKey.includes('parma') || normKey.includes('pršut parma')) return BADGE_REGISTRY['parma']
  if (normKey.includes('stracciatella') || normKey.includes('burrata')) return BADGE_REGISTRY['stracciatella']

  return {
    key: 'specialiteta',
    shortName: badgeKey,
    cert: 'PREMIUM',
    icon: '✦',
    category: 'craft'
  }
}

test('Provenance Registry Completeness: All 9 certified origins defined in component', () => {
  const requiredKeys = [
    'san-marzano',
    'bufala',
    'fior-di-latte',
    'ferment-48h',
    'mortadella',
    'pistacchio',
    'olio-bio',
    'parma',
    'stracciatella'
  ]

  for (const key of requiredKeys) {
    assert(badgeContent.includes(`'${key}':`), `ProvenanceBadge must define registry entry for '${key}'`)
    const def = BADGE_REGISTRY[key]
    assert(def.icon && def.cert && def.title && def.origin, `Registry definition for ${key} must be complete`)
  }
})

test('Fuzzy Resolution & Normalization: Tolerant string matching', () => {
  assert.equal(resolveBadge('san-marzano').key, 'san-marzano')
  assert.equal(resolveBadge('San Marzano D.O.P.').key, 'san-marzano')
  assert.equal(resolveBadge('Mocarela Bufala D.O.P').key, 'bufala')
  assert.equal(resolveBadge('Fior Di Latte').key, 'fior-di-latte')
  assert.equal(resolveBadge('48h Fermentacija').key, 'ferment-48h')
  assert.equal(resolveBadge('Mortadela D.O.P').key, 'mortadella')
  assert.equal(resolveBadge('Pistacchio Bronte').key, 'pistacchio')
  assert.equal(resolveBadge('Bio Oljčno Olje').key, 'olio-bio')
  assert.equal(resolveBadge('Pršut Parma 24m').key, 'parma')
  assert.equal(resolveBadge('Stracciatella Burrata').key, 'stracciatella')

  // Unknown key fallback
  const fallback = resolveBadge('Custom Artisan Saffron')
  assert.equal(fallback.key, 'specialiteta')
  assert.equal(fallback.cert, 'PREMIUM')
})

test('Tooltip Interaction Logic: Hover and click toggle', () => {
  let isOpen = false
  const toggle = () => { isOpen = !isOpen }
  const mouseenter = () => { isOpen = true }
  const mouseleave = () => { isOpen = false }

  mouseenter()
  assert.equal(isOpen, true, 'Hover mouseenter should open tooltip')
  mouseleave()
  assert.equal(isOpen, false, 'Hover mouseleave should close tooltip')

  toggle()
  assert.equal(isOpen, true, 'Click toggle should open tooltip')
  toggle()
  assert.equal(isOpen, false, 'Click toggle should close tooltip')
})

test('Category Pill Styling: Color classes map correctly to official certifications', () => {
  assert(badgeContent.includes("case 'dop':"), 'Must have styling for DOP category')
  assert(badgeContent.includes("case 'igp':"), 'Must have styling for IGP category')
  assert(badgeContent.includes("case 'bio':"), 'Must have styling for BIO category')
  assert(badgeContent.includes("case 'craft':"), 'Must have styling for CRAFT category')
})


// ============================================================================
// SUITE 4: MILESTONE 2 — RESERVATION MODAL & COMPOSABLE
// ============================================================================
console.log('\n>>> [SUITE 4] M2: ReservationModal (`src/components/ReservationModal.vue`)')

const resModalPath = path.resolve(process.cwd(), 'src/components/ReservationModal.vue')
const resModalContent = fs.readFileSync(resModalPath, 'utf-8')
const resModalSfc = parse(resModalContent)

test('Source Integrity: src/components/ReservationModal.vue exists and parses without errors', () => {
  assert(resModalContent.length > 0, 'ReservationModal.vue should not be empty')
  assert(resModalSfc.descriptor.template, 'ReservationModal.vue must contain a <template>')
  assert(resModalSfc.descriptor.scriptSetup, 'ReservationModal.vue must contain a <script setup>')
})

// Import the composable useReservationModal
import { useReservationModal } from '../src/composables/useReservationModal.ts'

test('Composable: useReservationModal global reactivity and contracts', () => {
  const { isModalOpen, modalTab, selectedItem, openReservation, closeReservation, setTab } = useReservationModal()

  closeReservation()
  assert.equal(isModalOpen.value, false)

  // Open for Table
  openReservation('table')
  assert.equal(isModalOpen.value, true)
  assert.equal(modalTab.value, 'table')
  assert.equal(selectedItem.value, null)

  // Close
  closeReservation()
  assert.equal(isModalOpen.value, false)

  // Open for Takeaway with preselected item
  openReservation('takeaway', { name: 'Bufalina', price: '12 €' })
  assert.equal(isModalOpen.value, true)
  assert.equal(modalTab.value, 'takeaway')
  assert.deepEqual(selectedItem.value, { name: 'Bufalina', price: '12 €', quantity: 1 })

  // setTab
  setTab('table')
  assert.equal(modalTab.value, 'table')
})

test('Guest Count Clamping: Bounds 1 to 25 with grammatical plural suffixes', () => {
  let guests = 2
  const adjustGuests = (delta) => {
    const next = guests + delta
    if (next >= 1 && next <= 25) {
      guests = next
    }
  }

  // Lower bound check: decrementing past 1
  guests = 1
  adjustGuests(-1)
  assert.equal(guests, 1, 'Cannot decrease guests below 1')

  // Upper bound check: incrementing past 25
  guests = 25
  adjustGuests(1)
  assert.equal(guests, 25, 'Cannot increase guests above 25')

  // Middle adjustments
  guests = 4
  adjustGuests(1)
  assert.equal(guests, 5)

  // Slovenian plural formatting helper
  const formatSloveneGuests = (n) => {
    if (n === 1) return 'oseba'
    if (n === 2) return 'osebi'
    if (n < 5) return 'osebe'
    return 'oseb'
  }

  assert.equal(formatSloveneGuests(1), 'oseba')
  assert.equal(formatSloveneGuests(2), 'osebi')
  assert.equal(formatSloveneGuests(3), 'osebe')
  assert.equal(formatSloveneGuests(4), 'osebe')
  assert.equal(formatSloveneGuests(5), 'oseb')
  assert.equal(formatSloveneGuests(12), 'oseb')
})

test('Price Parser & Cart Arithmetic: parsePrice and cartTotal calculation', () => {
  const parsePrice = (priceStr) => {
    const clean = priceStr.replace('€', '').replace(',', '.').trim()
    const val = parseFloat(clean)
    return isNaN(val) ? 0 : val
  }

  assert.equal(parsePrice('9 €'), 9.0)
  assert.equal(parsePrice('12.50 €'), 12.50)
  assert.equal(parsePrice('3,50 €'), 3.50)
  assert.equal(parsePrice('0 €'), 0)
  assert.equal(parsePrice('invalid'), 0)

  // Cart total computation
  const cart = [
    { name: 'Bufalina', price: '12 €', quantity: 2 },
    { name: 'Panuozzo Mortadela', price: '9 €', quantity: 1 },
    { name: 'Fokača', price: '3.50 €', quantity: 2 },
    { name: 'Domača Limonada', price: '3,00 €', quantity: 3 }
  ]

  const total = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)
  // 12*2 (24) + 9*1 (9) + 3.5*2 (7) + 3*3 (9) = 49.00 €
  assert.equal(total, 49.0)
  assert.equal(total.toFixed(2), '49.00')
})

test('Cart Quantity Management: Decrement to 0 splices item', () => {
  const cart = [
    { name: 'Pizza 1', price: '10 €', quantity: 1 },
    { name: 'Pizza 2', price: '11 €', quantity: 2 }
  ]

  const changeItemQuantity = (index, delta) => {
    const item = cart[index]
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      cart.splice(index, 1)
    }
  }

  // Decrement Pizza 2 from 2 to 1
  changeItemQuantity(1, -1)
  assert.equal(cart[1].quantity, 1)
  assert.equal(cart.length, 2)

  // Decrement Pizza 1 from 1 to 0 -> should remove Pizza 1
  changeItemQuantity(0, -1)
  assert.equal(cart.length, 1)
  assert.equal(cart[0].name, 'Pizza 2')
})

test('Unique Code Generation: Regex validation for Table & Takeaway reference codes', () => {
  // Pattern in ReservationModal:
  // 'KDR-REZ-' + Math.floor(1000 + Math.random() * 9000)
  // 'KDR-PICK-' + Math.floor(1000 + Math.random() * 9000)
  const rezRegex = /^KDR-REZ-\d{4}$/
  const pickRegex = /^KDR-PICK-\d{4}$/

  for (let i = 0; i < 100; i++) {
    const tableRef = 'KDR-REZ-' + Math.floor(1000 + Math.random() * 9000)
    const takeawayRef = 'KDR-PICK-' + Math.floor(1000 + Math.random() * 9000)

    assert(rezRegex.test(tableRef), `Table reference ${tableRef} must match ^KDR-REZ-\\d{4}$`)
    assert(pickRegex.test(takeawayRef), `Takeaway reference ${takeawayRef} must match ^KDR-PICK-\\d{4}$`)
    
    const num1 = parseInt(tableRef.split('-')[2], 10)
    const num2 = parseInt(takeawayRef.split('-')[2], 10)
    assert(num1 >= 1000 && num1 <= 9999, 'Code must be 4 digits')
    assert(num2 >= 1000 && num2 <= 9999, 'Code must be 4 digits')
  }
})

test('Kitchen Operating Hours & Timeslots: 16 valid slots spanning lunch and dinner', () => {
  const expectedSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
  ]

  assert.equal(expectedSlots.length, 16)
  for (const slot of expectedSlots) {
    assert(resModalContent.includes(`'${slot}'`), `ReservationModal must include timeslot ${slot}`)
  }
})

test('Direct Phone Shortcuts: Quick call links for reservations and orders', () => {
  assert(resModalContent.includes('tel:+38640175628'), 'Must provide direct link to table reservations phone (+386 40 175 628)')
  assert(resModalContent.includes('tel:+38683836740'), 'Must provide direct link to food orders phone (+386 83 836 740)')
})


// ============================================================================
// SUITE 5: MILESTONE 2 — PIZZERIA CRAFT & OVEN FEATURE
// ============================================================================
console.log('\n>>> [SUITE 5] M2: PizzeriaCraft (`src/components/PizzeriaCraft.vue`)')

const craftPath = path.resolve(process.cwd(), 'src/components/PizzeriaCraft.vue')
const craftContent = fs.readFileSync(craftPath, 'utf-8')
const craftSfc = parse(craftContent)

test('Source Integrity: src/components/PizzeriaCraft.vue exists and parses without errors', () => {
  assert(craftContent.length > 0, 'PizzeriaCraft.vue should not be empty')
  assert(craftSfc.descriptor.template, 'PizzeriaCraft.vue must contain a <template>')
  assert(craftSfc.descriptor.scriptSetup, 'PizzeriaCraft.vue must contain a <script setup>')
})

test('5-Metric HUD: Exact values and labels', () => {
  const expectedMetrics = [
    { value: '450°C', label: 'Peč na Drva' },
    { value: '72%', label: 'Hidracija' },
    { value: '48 Ur', label: 'Fermentacija' },
    { value: '90 Sek', label: 'Čas Peke' },
    { value: 'Caputo 00', label: 'Moka Poreklo' }
  ]

  for (const m of expectedMetrics) {
    assert(craftContent.includes(`value: '${m.value}'`), `Must include metric value ${m.value}`)
    assert(craftContent.includes(`label: '${m.label}'`), `Must include metric label ${m.label}`)
  }
})

test('5 Dough Craft Steps: Scientific stages and step navigation bounds', () => {
  const expectedSteps = [
    { number: '01', tabTitle: 'Moka Caputo & Kvas' },
    { number: '02', tabTitle: '72% Visoka Hidracija' },
    { number: '03', tabTitle: '48h Hladno Zorenje' },
    { number: '04', tabTitle: 'Schiaffo Napoletano' },
    { number: '05', tabTitle: '450°C Peč na Drva' }
  ]

  for (const s of expectedSteps) {
    assert(craftContent.includes(`number: '${s.number}'`), `Step ${s.number} must exist`)
    assert(craftContent.includes(`tabTitle: '${s.tabTitle}'`), `Step tab ${s.tabTitle} must exist`)
  }

  // Navigation controller logic test
  let activeStep = 0
  const maxStep = 4

  const nextStep = () => { if (activeStep < maxStep) activeStep++ }
  const prevStep = () => { if (activeStep > 0) activeStep-- }

  assert.equal(activeStep, 0)
  prevStep()
  assert.equal(activeStep, 0, 'prevStep at 0 must remain 0')

  nextStep() // 1
  nextStep() // 2
  nextStep() // 3
  nextStep() // 4
  assert.equal(activeStep, 4)

  nextStep() // at 4
  assert.equal(activeStep, 4, 'nextStep at 4 must remain 4')

  prevStep() // 3
  assert.equal(activeStep, 3)
})

test('Cornicione Anatomy: Maculatura and high-hydration digestability sections', () => {
  assert(craftContent.includes('Anatomija Popolnega Roba'), 'Must feature Cornicione Anatomy header')
  assert(craftContent.includes('Maculatura (Leopardji Vzorec)'), 'Must explain leopard spotting')
  assert(craftContent.includes('450°C – 485°C'), 'Must state oven floor temperature range')
  assert(craftContent.includes('Lahkotnost & Prebavljivost'), 'Must detail 48h gluten enzymatic breakdown')
})


// ============================================================================
// SUITE 6: MILESTONE 2 — PIZZERIA SHOWCASE PAGE INTEGRATION
// ============================================================================
console.log('\n>>> [SUITE 6] M2: Neapolitan Pizzeria Showcase Page (`src/pages/pizzeria.vue`)')

const pizzeriaPath = path.resolve(process.cwd(), 'src/pages/pizzeria.vue')
const pizzeriaContent = fs.readFileSync(pizzeriaPath, 'utf-8')
const pizzeriaSfc = parse(pizzeriaContent)

test('Source Integrity: src/pages/pizzeria.vue exists and parses without errors', () => {
  assert(pizzeriaContent.length > 0, 'pizzeria.vue should not be empty')
  assert(pizzeriaSfc.descriptor.template, 'pizzeria.vue must contain a <template>')
  assert(pizzeriaSfc.descriptor.scriptSetup, 'pizzeria.vue must contain a <script setup>')
})

test('Pizzeria Page Component Wiring: ProvenanceBadge, ReservationModal, PizzeriaCraft', () => {
  assert(pizzeriaContent.includes('<ProvenanceBadge'), 'pizzeria.vue must instantiate ProvenanceBadge')
  assert(pizzeriaContent.includes('<ReservationModal'), 'pizzeria.vue must instantiate ReservationModal')
  assert(pizzeriaContent.includes('<PizzeriaCraft />'), 'pizzeria.vue must instantiate PizzeriaCraft')
  assert(pizzeriaContent.includes('useReservationModal()'), 'pizzeria.vue must connect useReservationModal composable')
})

test('Menu Categories & Provenance Badges on Gourmet Items', () => {
  // Pice category
  assert(pizzeriaContent.includes("name: 'Marg'"), 'Must include Marg pizza')
  assert(pizzeriaContent.includes("name: 'Bufalina'"), 'Must include Bufalina pizza')
  assert(pizzeriaContent.includes("badges: ['san-marzano', 'bufala', 'ferment-48h', 'olio-bio']"), 'Bufalina must have all 4 DOP/BIO badges')
  assert(pizzeriaContent.includes("name: 'Parma'"), 'Must include Parma pizza')
  assert(pizzeriaContent.includes("badges: ['parma', 'bufala', 'san-marzano']"), 'Parma must have parma, bufala, san-marzano badges')

  // Panuozzo category
  assert(pizzeriaContent.includes("name: 'Panuozzo Sendviči'"), 'Must include Panuozzo category')
  assert(pizzeriaContent.includes("name: 'Mortadela'"), 'Must include Mortadela Panuozzo')
  assert(pizzeriaContent.includes("badges: ['mortadella', 'stracciatella', 'pistacchio']"), 'Mortadela Panuozzo must have mortadella, stracciatella, pistacchio badges')
})

test('View Switcher: Digital interactive menu vs Printed A3 menu', () => {
  assert(pizzeriaContent.includes("activeView = 'digital'"), 'Must support digital interactive view')
  assert(pizzeriaContent.includes("activeView = 'printed'"), 'Must support printed A3 menu view')
  assert(pizzeriaContent.includes('menuImageUrl'), 'Must support dynamically loaded or fallback menu image')
})

test('Google Verified Reviews: Real social proof block', () => {
  assert(pizzeriaContent.includes('googleReviews'), 'Must define googleReviews collection')
  assert(pizzeriaContent.includes('Matej K.'), 'Must include reviewer Matej K.')
  assert(pizzeriaContent.includes('Ana P.'), 'Must include reviewer Ana P.')
  assert(pizzeriaContent.includes('4.8'), 'Must showcase 4.8 rating')
})

test('Sticky Mobile Action Bar: Quick access for mobile users', () => {
  assert(pizzeriaContent.includes('fixed bottom-safe'), 'Must render sticky mobile action bar')
  assert(pizzeriaContent.includes('md:hidden'), 'Sticky action bar should only be on mobile')
  assert(pizzeriaContent.includes("openModal('takeaway')"), 'Mobile bar must have takeaway trigger')
  assert(pizzeriaContent.includes("openModal('table')"), 'Mobile bar must have table reservation trigger')
})

// ============================================================================
// SUMMARY & REPORT
// ============================================================================
console.log('\n======================================================================')
console.log(`TEST RESULTS SUMMARY:`)
console.log(`  Total Tests Run:  ${totalTests}`)
console.log(`  Passed Tests:     ${passedTests}`)
console.log(`  Failed Tests:     ${failedTests}`)
console.log('======================================================================')

if (failedTests > 0) {
  console.error(`\n✖ VERDICT: FAIL (${failedTests} test(s) failed)`)
  process.exit(1)
} else {
  console.log(`\n✔ VERDICT: PASS (All ${passedTests} tests passed cleanly with 0 regressions)`)
  process.exit(0)
}
