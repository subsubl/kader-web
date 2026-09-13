// Prototype verification script for Club & Events consolidation, sections, and redirect architecture
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

function testReport() {
  console.log('--- Inspecting Current Club & Events Architecture State ---')

  const clubPath = path.join(ROOT, 'src/pages/club.vue')
  const eventsPath = path.join(ROOT, 'src/pages/events.vue')
  const nuxtConfigPath = path.join(ROOT, 'nuxt.config.ts')
  const headerPath = path.join(ROOT, 'src/components/Header.vue')
  const footerPath = path.join(ROOT, 'src/components/Footer.vue')
  const sitemapPath = path.join(ROOT, 'src/public/sitemap.xml')

  const clubContent = fs.readFileSync(clubPath, 'utf8')
  const eventsContent = fs.readFileSync(eventsPath, 'utf8')
  const nuxtConfigContent = fs.readFileSync(nuxtConfigPath, 'utf8')
  const headerContent = fs.readFileSync(headerPath, 'utf8')
  const footerContent = fs.readFileSync(footerPath, 'utf8')
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')

  console.log('\n[1] Section checks on src/pages/club.vue:')
  const hasSoundSystem = /club\.theSound|club\.soundTitle|club_sound_system|showSpecs/.test(clubContent)
  const hasFloors = /club\.floorsTitle|club\.exploreSpaces|club_floor1_bg|club_floor2_bg/.test(clubContent)
  const hasDoorRules = /club\.doorPolicySub|club\.doorPolicyTitle|faqItems/.test(clubContent)
  const hasPretixModal = /<PretixWidget|<Teleport\s+to="body"/.test(clubContent)
  const hasPastEvents = /pastEvents/.test(clubContent)

  console.log('  - Sound System present:', hasSoundSystem, '(Target for M3: FALSE)')
  console.log('  - Floors 01/02 present:', hasFloors, '(Target for M3: FALSE)')
  console.log('  - Door Rules & FAQ present:', hasDoorRules, '(Target for M3: TRUE)')
  console.log('  - Pretix / Event Modal present:', hasPretixModal, '(Target for M3: TRUE)')
  console.log('  - Past Events Archive present:', hasPastEvents, '(Target for M3: TRUE)')

  console.log('\n[2] Redirect checks on /events:')
  const eventsHasRedirect = /navigateTo\(['"]\/club['"]/.test(eventsContent) || /redirect:\s*['"]\/club['"]/.test(eventsContent)
  const nuxtConfigHasRouteRules = /routeRules[\s\S]*['"]\/events['"][\s\S]*['"]\/club['"]/.test(nuxtConfigContent)
  console.log('  - events.vue has redirect stub:', eventsHasRedirect, '(Target for M3: TRUE)')
  console.log('  - nuxt.config.ts has routeRules redirect:', nuxtConfigHasRouteRules, '(Target for M3: TRUE)')

  console.log('\n[3] Navigation link checks in Header & Footer:')
  const headerHasEventsLink = /to=["']\/events["']/.test(headerContent)
  const headerHasClubLink = /to=["']\/club["']/.test(headerContent)
  const footerHasEventsLink = /to=["']\/events["']/.test(footerContent)
  const footerHasClubLink = /to=["']\/club["']/.test(footerContent)
  console.log('  - Header.vue links to /events:', headerHasEventsLink, '(Target for M3: FALSE)')
  console.log('  - Header.vue links to /club:', headerHasClubLink, '(Target for M3: TRUE)')
  console.log('  - Footer.vue links to /events:', footerHasEventsLink, '(Target for M3: FALSE)')
  console.log('  - Footer.vue links to /club:', footerHasClubLink, '(Target for M3: TRUE)')

  console.log('\n[4] Sitemap check:')
  const sitemapHasEvents = /https:\/\/www\.kader\.si\/events/.test(sitemapContent)
  const sitemapHasClub = /https:\/\/www\.kader\.si\/club/.test(sitemapContent)
  console.log('  - sitemap.xml has /events:', sitemapHasEvents, '(Target for M3: FALSE)')
  console.log('  - sitemap.xml has /club:', sitemapHasClub, '(Target for M3: TRUE)')
}

testReport()
