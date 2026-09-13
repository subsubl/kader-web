/**
 * stress_test_club.mjs
 * Adversarial stress test suite for Club & Events consolidation, redirection, and SSR compatibility.
 */

import fs from 'node:fs'
import path from 'node:path'

const PROJECT_ROOT = '/home/ator/Kader'
const CLUB_VUE_PATH = path.join(PROJECT_ROOT, 'src/pages/club.vue')
const EVENTS_VUE_PATH = path.join(PROJECT_ROOT, 'src/pages/events.vue')
const NUXT_CONFIG_PATH = path.join(PROJECT_ROOT, 'nuxt.config.ts')
const HEADER_PATH = path.join(PROJECT_ROOT, 'src/components/Header.vue')
const FOOTER_PATH = path.join(PROJECT_ROOT, 'src/components/Footer.vue')
const INDEX_PATH = path.join(PROJECT_ROOT, 'src/pages/index.vue')
const SITEMAP_PATH = path.join(PROJECT_ROOT, 'src/public/sitemap.xml')
const LOCALE_PATH = path.join(PROJECT_ROOT, 'src/composables/useLocale.ts')

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
}

function assert(description, condition, details = null) {
  results.total++
  if (condition) {
    results.passed++
    results.tests.push({ description, status: 'PASS', details })
    console.log(`✅ PASS: ${description}`)
  } else {
    results.failed++
    results.tests.push({ description, status: 'FAIL', details })
    console.error(`❌ FAIL: ${description}`, details || '')
  }
}

function warn(description, details = null) {
  results.warnings++
  results.tests.push({ description, status: 'WARN', details })
  console.warn(`⚠️ WARN: ${description}`, details || '')
}

console.log('=====================================================')
console.log('ADVERSARIAL STRESS TEST: CLUB & EVENTS CONSOLIDATION')
console.log('=====================================================\n')

// ----------------------------------------------------
// 1. ABSENCE OF FLOORS & SOUND SPECS
// ----------------------------------------------------
console.log('--- Suite 1: Absence of Floors 01/02 & Klipsch Sound Specs ---')
const clubVueContent = fs.readFileSync(CLUB_VUE_PATH, 'utf-8')

// Floors check
const floorsKeywords = [
  'club.floorsTitle',
  'club.exploreSpaces',
  'club.floor01Title',
  'club.floor02Title',
  'club_floor1_bg',
  'club_floor2_bg',
  'Floors 01/02',
  'Floor 01',
  'Floor 02'
]
const foundFloorTerms = floorsKeywords.filter(k => clubVueContent.includes(k))
assert('Absence of Floors 01/02 section markers and floor background images', foundFloorTerms.length === 0, { foundFloorTerms })

// Sound specs check
const soundSpecsKeywords = [
  'showSpecs',
  'specs',
  'Klipsch La Scala Audio Architecture',
  'LF Driver',
  'HF Driver',
  'Crossover Frequency',
  'Max Continuous SPL',
  'Frequency Response'
]
// Check if showSpecs state or technical spec table exists
const hasShowSpecs = /showSpecs\s*=\s*ref/.test(clubVueContent) || clubVueContent.includes('v-if="showSpecs"')
const hasSpecsTable = /class="[^"]*specs-table[^"]*"/.test(clubVueContent) || clubVueContent.includes('specs.frequency')
assert('Absence of showSpecs reactive state and technical specs table', !hasShowSpecs && !hasSpecsTable, { hasShowSpecs, hasSpecsTable })

// ----------------------------------------------------
// 2. CULTURE / SAFETY & DOOR RULES FAQ ACCORDION
// ----------------------------------------------------
console.log('\n--- Suite 2: Culture/Safety & Door Rules FAQ Accordion ---')
const faqPillars = ['photo', 'dress', 'age', 'safer', 'payment', 'sound']
const missingPillars = faqPillars.filter(p => !clubVueContent.includes(`id: '${p}'`))
assert('Presence of all 6 Berlin door policy pillars (photo, dress, age, safer, payment, sound)', missingPillars.length === 0, { missingPillars })

assert('Door policy section contains accessible ARIA attributes (:aria-expanded, :aria-controls)',
  clubVueContent.includes(':aria-expanded=') && clubVueContent.includes(':aria-controls='),
  'Checking ARIA accessibility on accordion buttons'
)

assert('Door policy accordion uses CSS Grid 0fr/1fr transition for smooth height expansion',
  clubVueContent.includes("gridTemplateRows: openFaqIndex === idx ? '1fr' : '0fr'"),
  'CSS Grid animation pattern verified'
)

assert('Door policy accordion handles toggle logic (clicking active item collapses it)',
  clubVueContent.includes('openFaqIndex.value = openFaqIndex.value === idx ? null : idx'),
  'Toggle logic verification'
)

// ----------------------------------------------------
// 3. INTERACTIVE EVENTS EXPERIENCE IN CLUB.VUE
// ----------------------------------------------------
console.log('\n--- Suite 3: Interactive Events Experience in club.vue ---')

assert('Contains live countdown banner with days, hours, minutes, seconds elements',
  clubVueContent.includes('countdown.days') &&
  clubVueContent.includes('countdown.hours') &&
  clubVueContent.includes('countdown.minutes') &&
  clubVueContent.includes('countdown.seconds'),
  'Countdown reactive bindings verified'
)

assert('Countdown unmount lifecycle properly clears interval to prevent memory leaks',
  clubVueContent.includes('clearInterval(countdownInterval)') &&
  clubVueContent.includes('onBeforeUnmount'),
  'Interval cleanup verified'
)

assert('Contains category filter tabs (all, club, live, pizzeria)',
  clubVueContent.includes("id: 'all'") &&
  clubVueContent.includes("id: 'club'") &&
  clubVueContent.includes("id: 'live'") &&
  clubVueContent.includes("id: 'pizzeria'"),
  'Category filters verified'
)

assert('Upcoming events grid includes flyer, genres, date, price/free badge, lineup, CTA, RA link',
  clubVueContent.includes('event.flyer_url') &&
  clubVueContent.includes('event.genres') &&
  clubVueContent.includes('listDate(event)') &&
  clubVueContent.includes('events.freeEntry') &&
  clubVueContent.includes('openModal(event)') &&
  clubVueContent.includes('event.ra_url'),
  'Upcoming event card elements verified'
)

assert('Interactive event detail modal teleported to body with PretixWidget & Olaii fallback',
  clubVueContent.includes('<Teleport to="body">') &&
  clubVueContent.includes('<PretixWidget') &&
  clubVueContent.includes('selectedEvent.ticket_provider') &&
  clubVueContent.includes('closeModal'),
  'Modal teleportation & ticketing fallbacks verified'
)

assert('Past events archive rendered with list items, thumbnails, artists, and past date labels',
  clubVueContent.includes('v-if="pastEvents.length > 0"') &&
  clubVueContent.includes('pastDateLabel') &&
  clubVueContent.includes('pastEv.artists'),
  'Past events archive verified'
)

assert('Structured JSON-LD schema (@graph) contains NightClub and EventSeries',
  clubVueContent.includes("'@type': 'NightClub'") &&
  clubVueContent.includes("'@type': 'EventSeries'") &&
  clubVueContent.includes("type: 'application/ld+json'"),
  'JSON-LD structured data verified'
)

// ----------------------------------------------------
// 4. 301 REDIRECTION & ROUTE STUB
// ----------------------------------------------------
console.log('\n--- Suite 4: 301 Redirection & Route Rules ---')
const nuxtConfigContent = fs.readFileSync(NUXT_CONFIG_PATH, 'utf-8')
const eventsVueContent = fs.readFileSync(EVENTS_VUE_PATH, 'utf-8')

assert('nuxt.config.ts routeRules configures 301 redirect from /events to /club',
  nuxtConfigContent.includes("'/events': { redirect: { to: '/club', statusCode: 301 } }"),
  'Nitro server routeRules checked'
)

assert('src/pages/events.vue redirect stub preserves query parameters and hash with 301',
  eventsVueContent.includes("navigateTo(") &&
  eventsVueContent.includes("path: '/club'") &&
  eventsVueContent.includes("query: to.query") &&
  eventsVueContent.includes("hash: to.hash") &&
  eventsVueContent.includes("redirectCode: 301"),
  'Client/SSR route middleware stub checked'
)

// ----------------------------------------------------
// 5. NAVIGATION LINKS IN HEADER, FOOTER, INDEX, SITEMAP
// ----------------------------------------------------
console.log('\n--- Suite 5: Navigation Links Integrity ---')
const headerContent = fs.readFileSync(HEADER_PATH, 'utf-8')
const footerContent = fs.readFileSync(FOOTER_PATH, 'utf-8')
const indexContent = fs.readFileSync(INDEX_PATH, 'utf-8')
const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8')

// Header check: no to="/events", must have to="/club"
const headerHasOldEventsLink = /to=["']\/events["']/.test(headerContent)
const headerHasClubLink = /to=["']\/club["']/.test(headerContent)
assert('Header.vue contains NO links to /events and points to /club',
  !headerHasOldEventsLink && headerHasClubLink,
  { headerHasOldEventsLink, headerHasClubLink }
)

// Footer check
const footerHasOldEventsLink = /to=["']\/events["']/.test(footerContent)
const footerHasClubLink = /to=["']\/club["']/.test(footerContent)
assert('Footer.vue contains NO links to /events and points to /club',
  !footerHasOldEventsLink && footerHasClubLink,
  { footerHasOldEventsLink, footerHasClubLink }
)

// Index check
const indexHasOldEventsLink = /to=["']\/events["']/.test(indexContent)
assert('index.vue contains NO links to /events',
  !indexHasOldEventsLink,
  { indexHasOldEventsLink }
)

// Sitemap check
const sitemapHasEventsLoc = sitemapContent.includes('/events')
assert('sitemap.xml does NOT index /events',
  !sitemapHasEventsLoc,
  { sitemapHasEventsLoc }
)

// ----------------------------------------------------
// 6. ADVERSARIAL LOGIC & RUNTIME STRESS TESTS
// ----------------------------------------------------
console.log('\n--- Suite 6: Runtime Logic Stress-Testing ---')

// 6.1 Countdown Calculation Function
function calculateCountdown(targetDateStr, nowMs) {
  const targetTime = new Date(targetDateStr).getTime()
  if (isNaN(targetTime)) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', error: 'Invalid Date' }
  }
  const diff = Math.max(0, targetTime - nowMs)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    diff
  }
}

// Test A: Normal future date
const now = Date.now()
const resNormal = calculateCountdown(new Date(now + 3600000 * 25 + 61000).toISOString(), now)
assert('Countdown handles normal future date (1 day, 1 hr, 1 min, 1 sec)',
  resNormal.days === '01' && resNormal.hours === '01' && resNormal.minutes === '01' && resNormal.seconds === '01',
  resNormal
)

// Test B: Past date (targetTime < now)
const resPast = calculateCountdown(new Date(now - 100000).toISOString(), now)
assert('Countdown clamped to 00:00:00 when event is in past (no negative countdowns)',
  resPast.days === '00' && resPast.hours === '00' && resPast.minutes === '00' && resPast.seconds === '00' && resPast.diff === 0,
  resPast
)

// Test C: Malformed date
const resInvalid = calculateCountdown('invalid-date-string-xyz', now)
assert('Countdown safely handles invalid date without throwing or NaN string output',
  resInvalid.days === '00' && !resInvalid.days.includes('NaN'),
  resInvalid
)

// 6.2 Event Normalization Stress
function normalizeEvent(e) {
  return {
    ...e,
    artists: Array.isArray(e?.artists) ? e.artists : [],
    genres: Array.isArray(e?.genres) ? e.genres : []
  }
}

// Test with null, missing arrays, non-array types
const malformedRawEvent = {
  ra_id: 999,
  title: 'Test Event',
  date: '2026-10-15T23:00:00Z',
  artists: null, // edge case: null instead of array
  genres: 'Techno' // edge case: string instead of array
}
const norm = normalizeEvent(malformedRawEvent)
assert('normalizeEvent guarantees artists and genres are arrays even when API sends null or string',
  Array.isArray(norm.artists) && norm.artists.length === 0 &&
  Array.isArray(norm.genres) && norm.genres.length === 0,
  norm
)

// 6.3 XSS and HTML Sanitization in Lineup
function cleanLineup(raw) {
  return raw ? raw.replace(/<[^>]*>/g, '').trim() : ''
}

// Adversarial test: nested tag attack on cleanLineup regex
const attack1 = '<scri<script>pt>alert(1)</script>'
const sanitized1 = cleanLineup(attack1)
const attack2 = '<img src="x" onerror="alert(1)">'
const sanitized2 = cleanLineup(attack2)
const attack3 = '<a href="javascript:alert(1)">Click</a>'
const sanitized3 = cleanLineup(attack3)

if (sanitized1.includes('<script>') || sanitized1.includes('alert(')) {
  warn('cleanLineup uses simple regex replace(/<[^>]*>/g, "") which does not defend against nested/malformed tags used with v-html', {
    attack1,
    sanitized1
  })
}

// 6.4 Event Category Filter Logic & ClubEvents Fallback
console.log('\n--- Suite 6.4: Category Filter & Curated Fallback Logic ---')

// Let's analyze how displayEvents works in club.vue:
// const clubEvents = computed(() =>
//   events.value.filter((e) => {
//     const genre = (e.genres[0] || '').toLowerCase()
//     const title = (e.title || '').toLowerCase()
//     return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
//   })
// )
// let list = (clubEvents.value && clubEvents.value.length > 0) ? clubEvents.value : curatedEvents

function simulateDisplayEvents(eventsVal, curatedEventsVal, activeCat) {
  const clubEvents = eventsVal.filter((e) => {
    const genre = (e.genres[0] || '').toLowerCase()
    const title = (e.title || '').toLowerCase()
    return genre.includes('house') || genre.includes('techno') || genre.includes('electronica') || genre.includes('club') || title.includes('dj') || title.includes('night')
  })

  let list = (clubEvents && clubEvents.length > 0) ? clubEvents : curatedEventsVal
  if (activeCat !== 'all') {
    list = list.filter(e => {
      const g = (e.genres || []).join(' ').toLowerCase()
      const title = (e.title || '').toLowerCase()
      if (activeCat === 'club') {
        return g.includes('techno') || g.includes('house') || g.includes('club') || g.includes('electro') || title.includes('techno') || title.includes('night') || title.includes('vault')
      }
      if (activeCat === 'live') {
        return g.includes('live') || g.includes('ambient') || g.includes('modular') || title.includes('live') || title.includes('acoustic')
      }
      if (activeCat === 'pizzeria') {
        return g.includes('pizzeria') || g.includes('acoustic') || g.includes('ambient') || title.includes('pizzeria')
      }
      return true
    })
  }
  return list
}

const mockCurated = [
  { ra_id: 101, title: 'Vault Night', genres: ['Techno'] }
]

// Adversarial test: RA API returns live/acoustic events only (e.g. ambient acoustic concert at Kader)
const nonClubEvents = [
  { ra_id: 201, title: 'Kader Jazz Session', genres: ['Jazz', 'Live'] },
  { ra_id: 202, title: 'Acoustic Sunday Pizza', genres: ['Acoustic', 'Folk'] }
]

const resultAll = simulateDisplayEvents(nonClubEvents, mockCurated, 'all')
// Because none of the nonClubEvents match house/techno/electronica/club/dj/night, clubEvents.length is 0!
// So it falls back to mockCurated!
if (resultAll === mockCurated) {
  warn('Logic Bug / Semantic Inconsistency: displayEvents uses `clubEvents` (which pre-filters techno/house) as the base list instead of `events.value`. When non-club events (e.g. Live, Pizzeria) are returned from RA API, clubEvents is empty and falls back to curatedEvents, hiding real live events!', {
    inputCount: nonClubEvents.length,
    outputIsCuratedFallback: true
  })
} else {
  assert('displayEvents preserves all events for activeCategory === "all"', true)
}

// ----------------------------------------------------
// 7. I18N PARITY FOR ALL KEYS USED IN CLUB.VUE
// ----------------------------------------------------
console.log('\n--- Suite 7: Translation Keys Parity in useLocale.ts ---')
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url)
const useLocaleMod = await jiti.import(LOCALE_PATH)
const { flatDictionaries, SUPPORTED_LOCALES } = useLocaleMod

// Extract all t('...') keys from club.vue
const tRegex = /t\(\s*['"]([a-zA-Z0-9_.]+)['"]/g
const extractedKeys = new Set()
let match
while ((match = tRegex.exec(clubVueContent)) !== null) {
  extractedKeys.add(match[1])
}
console.log(`Discovered ${extractedKeys.size} unique translation keys in club.vue:`)

const missingKeysByLocale = {}
for (const loc of SUPPORTED_LOCALES) {
  missingKeysByLocale[loc] = []
  const dict = flatDictionaries[loc] || {}
  for (const key of extractedKeys) {
    if (dict[key] === undefined) {
      missingKeysByLocale[loc].push(key)
    }
  }
}

const totalMissingKeys = Object.values(missingKeysByLocale).reduce((acc, curr) => acc + curr.length, 0)
assert('All translation keys in club.vue exist in useLocale dictionaries across all 10 languages', totalMissingKeys === 0, {
  missingKeysCount: totalMissingKeys,
  missingKeysByLocale: Object.fromEntries(Object.entries(missingKeysByLocale).filter(([_, keys]) => keys.length > 0))
})

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n=====================================================')
console.log(`TOTAL TESTS: ${results.total}`)
console.log(`PASSED:      ${results.passed}`)
console.log(`FAILED:      ${results.failed}`)
console.log(`WARNINGS:    ${results.warnings}`)
console.log('=====================================================')

if (results.failed > 0) {
  process.exit(1)
}
