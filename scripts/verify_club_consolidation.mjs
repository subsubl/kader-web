/**
 * Automated Verification Script: Milestone 3 Club & Events Consolidation
 * Validates:
 * 1. Absence of Floors and Sound System sections in club.vue
 * 2. Presence of Club Culture / Safety and Door Rules & FAQ in club.vue
 * 3. Presence of interactive Events grid, Countdown banner, Category filters, Detail modal with PretixWidget, and Past Archive in club.vue
 * 4. Dual-tier 301 redirection configuration (nuxt.config.ts routeRules & events.vue stub with query forwarding)
 * 5. Clean navigation links in Header.vue, Footer.vue, index.vue, and sitemap.xml
 */

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('===============================================================')
console.log('  MILESTONE 3 VERIFICATION: CLUB & EVENTS CONSOLIDATION')
console.log('===============================================================\n')

let passCount = 0
let failCount = 0
const failures = []

function test(description, fn) {
  try {
    fn()
    passCount++
    console.log(`  ✔ [PASS] ${description}`)
  } catch (err) {
    failCount++
    failures.push({ description, error: err.message })
    console.error(`  ✖ [FAIL] ${description}`)
    console.error(`    -> ${err.message}`)
  }
}

// Read target files
const clubVuePath = path.join(ROOT, 'src/pages/club.vue')
const eventsVuePath = path.join(ROOT, 'src/pages/events.vue')
const nuxtConfigPath = path.join(ROOT, 'nuxt.config.ts')
const headerVuePath = path.join(ROOT, 'src/components/Header.vue')
const footerVuePath = path.join(ROOT, 'src/components/Footer.vue')
const indexVuePath = path.join(ROOT, 'src/pages/index.vue')
const sitemapPath = path.join(ROOT, 'src/public/sitemap.xml')

const clubContent = fs.readFileSync(clubVuePath, 'utf8')
const eventsContent = fs.readFileSync(eventsVuePath, 'utf8')
const nuxtConfigContent = fs.readFileSync(nuxtConfigPath, 'utf8')
const headerContent = fs.readFileSync(headerVuePath, 'utf8')
const footerContent = fs.readFileSync(footerVuePath, 'utf8')
const indexContent = fs.readFileSync(indexVuePath, 'utf8')
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')

// =========================================================================
// CHECK 1: Absence of Floors and Sound System sections
// =========================================================================
console.log('>>> [CHECK 1] Verifying Absence of Floors and Sound System Sections')

test('Floors section removed from club.vue', () => {
  assert.equal(/club\.floorsTitle/.test(clubContent), false, 'club.floorsTitle should be removed')
  assert.equal(/club\.exploreSpaces/.test(clubContent), false, 'club.exploreSpaces should be removed')
  assert.equal(/club_floor1_bg/.test(clubContent), false, 'club_floor1_bg should be removed')
  assert.equal(/club_floor2_bg/.test(clubContent), false, 'club_floor2_bg should be removed')
  assert.equal(/club\.floor01Title/.test(clubContent), false, 'club.floor01Title should be removed')
  assert.equal(/club\.floor02Title/.test(clubContent), false, 'club.floor02Title should be removed')
})

test('Sound System (Klipsch specs) section and state removed from club.vue', () => {
  assert.equal(/club\.theSound/.test(clubContent), false, 'club.theSound should be removed')
  assert.equal(/club\.soundTitle/.test(clubContent), false, 'club.soundTitle should be removed')
  assert.equal(/club_sound_system/.test(clubContent), false, 'club_sound_system should be removed')
  assert.equal(/showSpecs/.test(clubContent), false, 'showSpecs ref should be removed')
  assert.equal(/const\s+specs\s*=\s*computed/.test(clubContent), false, 'specs computed property should be removed')
})

// =========================================================================
// CHECK 2: Presence of Club Culture / Safety and Door Rules & FAQ
// =========================================================================
console.log('\n>>> [CHECK 2] Verifying Retention of Culture, Safety & Door Rules FAQ')

test('Door Policy header & subtitles retained', () => {
  assert.match(clubContent, /club\.doorPolicySub/, 'club.doorPolicySub must be retained')
  assert.match(clubContent, /club\.doorPolicyTitle/, 'club.doorPolicyTitle must be retained')
})

test('6 Door Policy Pillars configured in faqItems', () => {
  const pillars = ['photo', 'dress', 'age', 'safer', 'payment', 'sound']
  for (const p of pillars) {
    assert.match(clubContent, new RegExp(`id:\\s*'${p}'`), `Pillar '${p}' must be present in faqItems`)
  }
})

test('Interactive FAQ accordion state & accessible bindings retained', () => {
  assert.match(clubContent, /openFaqIndex/, 'openFaqIndex state must exist')
  assert.match(clubContent, /toggleFaq/, 'toggleFaq handler must exist')
  assert.match(clubContent, /:aria-expanded="openFaqIndex === idx"/, 'Accordion must have aria-expanded binding')
  assert.match(clubContent, /:aria-controls="'faq-content-' \+ idx"/, 'Accordion must have aria-controls binding')
  assert.match(clubContent, /gridTemplateRows:\s*openFaqIndex\s*===\s*idx\s*\?\s*'1fr'\s*:\s*'0fr'/, 'Smooth grid transition pattern retained')
})

// =========================================================================
// CHECK 3: Presence of Complete Interactive Events Experience
// =========================================================================
console.log('\n>>> [CHECK 3] Verifying Interactive Events Integration on /club')

test('Live Event Countdown Banner present', () => {
  assert.match(clubContent, /v-if="nextEvent"/, 'Countdown banner rendered when nextEvent exists')
  assert.match(clubContent, /countdown\.days/, 'Countdown days rendered')
  assert.match(clubContent, /countdown\.hours/, 'Countdown hours rendered')
  assert.match(clubContent, /countdown\.minutes/, 'Countdown minutes rendered')
  assert.match(clubContent, /countdown\.seconds/, 'Countdown seconds rendered')
  assert.match(clubContent, /countdownInterval/, 'Countdown interval tracked')
  assert.match(clubContent, /clearInterval\(countdownInterval\)/, 'Countdown interval cleared on unmount')
})

test('Category filter tabs present', () => {
  assert.match(clubContent, /categoryFilters/, 'categoryFilters computed list exists')
  assert.match(clubContent, /events\.allEvents/, 'All events filter label exists')
  assert.match(clubContent, /events\.filterClub/, 'Club filter label exists')
  assert.match(clubContent, /events\.filterLive/, 'Live filter label exists')
  assert.match(clubContent, /events\.filterPizzeria/, 'Pizzeria filter label exists')
  assert.match(clubContent, /activeCategory/, 'activeCategory reactive state exists')
})

test('Upcoming RA Events grid present with reactive cards', () => {
  assert.match(clubContent, /v-for="event in displayEvents"/, 'Iterates over displayEvents')
  assert.match(clubContent, /@click="openModal\(event\)"/, 'Card click opens detail modal')
  assert.match(clubContent, /aspect-\[4\/3\]/, 'Flyer aspect ratio class')
  assert.match(clubContent, /event\.genres/, 'Genre tags displayed')
  assert.match(clubContent, /listDate\(event\)/, 'Formatted date displayed')
  assert.match(clubContent, /event\.artists\.join\(', '\)/, 'Lineup artists displayed')
  assert.match(clubContent, /formatTime\(event\.start_time\)/, 'Start time formatted')
  assert.match(clubContent, /events\.details/, 'Details action label')
})

test('Event detail modal with Teleport, PretixWidget & fallbacks present', () => {
  assert.match(clubContent, /<Teleport\s+to="body">/, 'Modal teleported to body')
  assert.match(clubContent, /v-if="selectedEvent"/, 'Modal bound to selectedEvent')
  assert.match(clubContent, /<PretixWidget/, 'PretixWidget component integrated')
  assert.match(clubContent, /events\.buyOnOlaii/, 'Olaii ticket purchase fallback')
  assert.match(clubContent, /events\.buyTicket/, 'Direct ticketing fallback')
  assert.match(clubContent, /events\.freeAdmission/, 'Free admission banner')
  assert.match(clubContent, /events\.concludedBadge/, 'Past event notice badge')
  assert.match(clubContent, /@click\.self="closeModal"/, 'Backdrop click dismisses modal')
  assert.match(clubContent, /e\.key\s*===\s*'Escape'/, 'ESC key listener dismisses modal')
})

test('Past events archive present', () => {
  assert.match(clubContent, /pastEvents/, 'pastEvents ref exists')
  assert.match(clubContent, /loadPastEvents/, 'loadPastEvents function exists')
  assert.match(clubContent, /events\.pastEvents/, 'Past events heading label exists')
  assert.match(clubContent, /pastDateLabel/, 'pastDateLabel formatting helper exists')
})

test('JSON-LD structured data schema markup configured', () => {
  assert.match(clubContent, /type:\s*'application\/ld\+json'/, 'LD+JSON script tag in useHead')
  assert.match(clubContent, /'@type':\s*'NightClub'/, 'NightClub schema included')
  assert.match(clubContent, /'@type':\s*'EventSeries'/, 'EventSeries schema included')
})

// =========================================================================
// CHECK 4: Dual-Tier 301 Redirection Configuration
// =========================================================================
console.log('\n>>> [CHECK 4] Verifying Dual-Tier 301 Redirection (/events -> /club)')

test('nuxt.config.ts has routeRules 301 redirect', () => {
  assert.match(
    nuxtConfigContent,
    /routeRules:\s*\{[\s\S]*?'\/events':\s*\{\s*redirect:\s*\{\s*to:\s*'\/club',\s*statusCode:\s*301\s*\}\s*\}[\s\S]*?\}/,
    'nuxt.config.ts must configure 301 routeRules redirect from /events to /club'
  )
})

test('src/pages/events.vue has SSR/client 301 redirect stub with query forwarding', () => {
  assert.match(eventsContent, /definePageMeta/, 'events.vue must define route middleware')
  assert.match(eventsContent, /navigateTo\(/, 'events.vue must use navigateTo')
  assert.match(eventsContent, /path:\s*'\/club'/, 'navigateTo must point to /club')
  assert.match(eventsContent, /query:\s*to\.query/, 'navigateTo must forward query params')
  assert.match(eventsContent, /redirectCode:\s*301/, 'navigateTo must specify redirectCode 301')
})

// =========================================================================
// CHECK 5: Clean Navigation Links & Internal References
// =========================================================================
console.log('\n>>> [CHECK 5] Verifying Clean Navigation Links & Internal References')

test('Header.vue consolidates to /club and removes /events', () => {
  assert.equal(/to="\/events"/.test(headerContent), false, 'Header.vue must not contain to="/events"')
  assert.match(headerContent, /to="\/club"/, 'Header.vue must link to /club')
  assert.match(headerContent, /t\('nav\.club'\)[\s\S]*?&amp;[\s\S]*?t\('nav\.events'\)/, 'Header.vue link must display consolidated label')
})

test('Footer.vue consolidates to /club and removes /events', () => {
  assert.equal(/to="\/events"/.test(footerContent), false, 'Footer.vue must not contain to="/events"')
  assert.match(footerContent, /to="\/club"/, 'Footer.vue must link to /club')
  assert.match(footerContent, /t\('nav\.club'\)[\s\S]*?&amp;[\s\S]*?t\('nav\.events'\)/, 'Footer.vue link must display consolidated label')
})

test('src/pages/index.vue CTAs point to /club without linking to /events', () => {
  assert.equal(/to="\/events"/.test(indexContent), false, 'index.vue must not contain to="/events"')
  assert.match(indexContent, /to="\/club"/, 'index.vue CTAs must link to /club')
})

test('src/public/sitemap.xml lists /club and removes /events', () => {
  assert.equal(/<loc>https:\/\/www\.kader\.si\/events<\/loc>/.test(sitemapContent), false, 'sitemap.xml must not list /events')
  assert.match(sitemapContent, /<loc>https:\/\/www\.kader\.si\/club<\/loc>/, 'sitemap.xml must list /club')
})

// =========================================================================
// SUMMARY
// =========================================================================
console.log(`\n===============================================================`)
console.log(`VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`===============================================================`)

if (failCount > 0) {
  console.error('\nFAILURES:')
  failures.forEach(f => console.error(`- ${f.description}: ${f.error}`))
  process.exit(1)
} else {
  console.log('\nALL 17 CONSOLIDATION CHECKS PASSED WITH 0 ERRORS.')
  process.exit(0)
}
