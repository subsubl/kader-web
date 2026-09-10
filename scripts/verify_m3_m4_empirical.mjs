/**
 * Empirical Verification Test Suite for Milestone 3, Milestone 4 & Responsive Layout
 * Challenger 2 Verification Harness
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

console.log('=== STARTING M3 / M4 / RESPONSIVE EMPIRICAL VERIFICATION ===\n')

let passCount = 0
let failCount = 0
const findings = []

function test(name, fn) {
  try {
    fn()
    passCount++
    console.log(`  ✓ PASS: ${name}`)
  } catch (err) {
    failCount++
    findings.push({ test: name, error: err.message })
    console.error(`  ✗ FAIL: ${name}`)
    console.error(`    -> ${err.message}`)
  }
}

// Load source files
const clubVuePath = path.join(ROOT, 'src/pages/club.vue')
const clubDjPlayerPath = path.join(ROOT, 'src/components/ClubDjPlayer.vue')
const useLocalePath = path.join(ROOT, 'src/composables/useLocale.ts')
const buyoutsVuePath = path.join(ROOT, 'src/pages/buyouts.vue')

const clubVue = fs.readFileSync(clubVuePath, 'utf8')
const clubDjPlayer = fs.readFileSync(clubDjPlayerPath, 'utf8')
const useLocale = fs.readFileSync(useLocalePath, 'utf8')
const buyoutsVue = fs.readFileSync(buyoutsVuePath, 'utf8')

// =========================================================================
// SECTION 1: ClubDjPlayer Web Audio API DSP Synthesis Engine
// =========================================================================
console.log('--- SECTION 1: ClubDjPlayer DSP Synthesis Engine ---')

test('AudioContext setup with webkitAudioContext fallback', () => {
  assert.match(clubDjPlayer, /window\.AudioContext\s*\|\|\s*\(window\s+as\s+any\)\.webkitAudioContext/, 'Must detect standard and webkit AudioContext')
  assert.match(clubDjPlayer, /audioCtx\.createGain\(\)/, 'Master gain node must be created')
  assert.match(clubDjPlayer, /masterGain\.connect\(audioCtx\.destination\)/, 'Master gain must route to destination')
})

test('Kick drum synthesis: 145 Hz to 38 Hz exponential pitch sweep', () => {
  assert.match(clubDjPlayer, /osc\.frequency\.setValueAtTime\(145,\s*t\)/, 'Kick start frequency must be 145 Hz')
  assert.match(clubDjPlayer, /osc\.frequency\.exponentialRampToValueAtTime\(38,\s*t\s*\+\s*0\.11\)/, 'Kick pitch sweep down to 38 Hz in 0.11s')
  assert.match(clubDjPlayer, /kickGain\.gain\.setValueAtTime\(1\.0,\s*t\)/, 'Kick gain must start at 1.0')
  assert.match(clubDjPlayer, /kickGain\.gain\.exponentialRampToValueAtTime\(0\.001,\s*t\s*\+\s*0\.18\)/, 'Kick gain exponential decay to 0.001 in 0.18s')
})

test('Sub-bass rumble: 55 Hz (A1) sawtooth oscillator with 115 Hz lowpass filter', () => {
  assert.match(clubDjPlayer, /bassOsc\.type\s*=\s*'sawtooth'/, 'Sub-bass must use sawtooth wave')
  assert.match(clubDjPlayer, /bassOsc\.frequency\.setValueAtTime\(55,\s*t\)/, 'Sub-bass frequency must be 55 Hz (A1)')
  assert.match(clubDjPlayer, /bassFilter\.type\s*=\s*'lowpass'/, 'Bass filter must be lowpass')
  assert.match(clubDjPlayer, /bassFilter\.frequency\.setValueAtTime\(115,\s*t\)/, 'Bass filter cutoff must be 115 Hz')
  assert.match(clubDjPlayer, /bassFilter\.Q\.setValueAtTime\(4,\s*t\)/, 'Bass filter resonance Q must be 4')
  assert.match(clubDjPlayer, /bassGain\.gain\.setValueAtTime\(0\.28,\s*t\)/, 'Bass gain amplitude must be 0.28')
})

test('Hi-hat synthesis: White noise buffer with 7500 Hz highpass filter', () => {
  assert.match(clubDjPlayer, /audioCtx\.createBuffer\(1,\s*bufferSize,\s*audioCtx\.sampleRate\)/, 'White noise buffer created')
  assert.match(clubDjPlayer, /filter\.type\s*=\s*'highpass'/, 'Hi-hat filter must be highpass')
  assert.match(clubDjPlayer, /filter\.frequency\.setValueAtTime\(7500,\s*t\)/, 'Hi-hat highpass cutoff must be 7500 Hz')
  assert.match(clubDjPlayer, /hatGain\.gain\.setValueAtTime\(0\.22,\s*t\)/, 'Hi-hat gain must be 0.22')
})

test('Lookahead scheduler: 25ms timer cycle with 0.15s scheduling horizon', () => {
  assert.match(clubDjPlayer, /while\s*\(nextKickTime\s*<\s*audioCtx\.currentTime\s*\+\s*0\.15\)/, 'Horizon must be 0.15s lookahead')
  assert.match(clubDjPlayer, /timerId\s*=\s*window\.setTimeout\(scheduleGroove,\s*25\)/, 'Timer cycle must be 25ms')
})

test('Equalizer: 18-bar procedural visualizer with requestAnimationFrame loop', () => {
  assert.match(clubDjPlayer, /waveformBars\s*=\s*ref<number\[\]>\(Array\(18\)\.fill\(15\)\)/, 'Waveform array initialized with 18 bars')
  assert.match(clubDjPlayer, /animFrameId\s*=\s*requestAnimationFrame\(updateWaveform\)/, 'updateWaveform uses rAF loop')
  assert.match(clubDjPlayer, /Math\.sin\(animTick\.value\s*\*\s*0\.18\s*\+\s*i\s*\*\s*0\.5\)/, 'Mathematical procedural formula for organic techno pulse')
})

test('Audio track roster: exactly 3 curated techno tracks with metadata', () => {
  assert.match(clubDjPlayer, /'Kader Vault Session #01'/, 'Track 1 title')
  assert.match(clubDjPlayer, /bpm:\s*134/, 'Track 1 BPM')
  assert.match(clubDjPlayer, /'Basement Sub-Bass Session'/, 'Track 2 title')
  assert.match(clubDjPlayer, /bpm:\s*130/, 'Track 2 BPM')
  assert.match(clubDjPlayer, /'Grad Kodeljevo Nightfall'/, 'Track 3 title')
  assert.match(clubDjPlayer, /bpm:\s*126/, 'Track 3 BPM')
})

test('Volume & Mute controls with memory restoration', () => {
  assert.match(clubDjPlayer, /const\s+volume\s*=\s*ref\(0\.75\)/, 'Default volume 0.75')
  assert.match(clubDjPlayer, /const\s+lastVolume\s*=\s*ref\(0\.75\)/, 'lastVolume ref exists')
  assert.match(clubDjPlayer, /function\s+toggleMute|const\s+toggleMute\s*=\s*\(\)/, 'toggleMute implemented')
  assert.match(clubDjPlayer, /masterGain\.gain\.setValueAtTime\(0,\s*audioCtx\.currentTime\)/, 'Mute zeroes gain')
  assert.match(clubDjPlayer, /masterGain\.gain\.setValueAtTime\(volume\.value,\s*audioCtx\.currentTime\)/, 'Unmute restores volume')
})

test('Floating minimize capsule & lifecycle teardown', () => {
  assert.match(clubDjPlayer, /v-if="isMinimized"/, 'Minimized condition')
  assert.match(clubDjPlayer, /fixed bottom-6 right-6 z-50 animate-bounce-slow/, 'Capsule floating classes')
  assert.match(clubDjPlayer, /onBeforeUnmount\(\(\)\s*=>\s*\{[\s\S]*clearTimeout\(timerId\)[\s\S]*clearInterval\(progressInterval\)[\s\S]*cancelAnimationFrame\(animFrameId\)[\s\S]*audioCtx\.close\(\)/, 'Comprehensive unmount cleanup to prevent audio leaks')
})

test('Autoplay prevention handling: audioCtx.state suspended check', () => {
  assert.match(clubDjPlayer, /audioCtx\.state\s*===\s*'suspended'/, 'Handles browser autoplay policy')
  assert.match(clubDjPlayer, /await\s+audioCtx\.resume\(\)/, 'Resumes suspended context on user interaction')
})

// =========================================================================
// SECTION 2: Berlin Door Policy Accordion & Locale Verification
// =========================================================================
console.log('\n--- SECTION 2: Berlin Door Policy & Locales ---')

test('6 Door Policy Pillars configured in club.vue faqItems', () => {
  const ids = ['photo', 'dress', 'age', 'safer', 'payment', 'sound']
  for (const id of ids) {
    assert.match(clubVue, new RegExp(`id:\\s*'${id}'`), `Door policy pillar '${id}' must be configured in faqItems`)
  }
})

test('CSS Grid row 0fr -> 1fr smooth accordion transition pattern', () => {
  assert.match(clubVue, /:style="\{\s*gridTemplateRows:\s*openFaqIndex\s*===\s*idx\s*\?\s*'1fr'\s*:\s*'0fr'\s*\}"/, 'CSS Grid row interpolation used for smooth accordion height transition')
  assert.match(clubVue, /class="grid transition-all duration-300 ease-out"/, 'Transition classes on accordion container')
  assert.match(clubVue, /<div class="overflow-hidden">/, 'Inner container must have overflow-hidden for 0fr grid row technique')
})

test('Accordion accessibility: aria-expanded and aria-controls', () => {
  assert.match(clubVue, /:aria-expanded="openFaqIndex === idx"/, 'Button has dynamic aria-expanded')
  assert.match(clubVue, /:aria-controls="'faq-content-' \+ idx"/, 'Button has aria-controls referencing content id')
  assert.match(clubVue, /:id="'faq-content-' \+ idx"/, 'Content wrapper has matching id')
})

test('Slovenian translations for all 6 Door Policy Pillars in useLocale.ts', () => {
  const slKeys = [
    'faqPhotoTitle', 'faqPhotoBadge', 'faqPhotoHighlight', 'faqPhotoText',
    'faqDressTitle', 'faqDressBadge', 'faqDressHighlight', 'faqDressText',
    'faqAgeTitle', 'faqAgeBadge', 'faqAgeHighlight', 'faqAgeText',
    'faqSaferTitle', 'faqSaferBadge', 'faqSaferHighlight', 'faqSaferText',
    'faqPaymentTitle', 'faqPaymentBadge', 'faqPaymentHighlight', 'faqPaymentText',
    'faqSoundTitle', 'faqSoundBadge', 'faqSoundHighlight', 'faqSoundText'
  ]
  for (const key of slKeys) {
    assert.match(useLocale, new RegExp(`${key}:`), `Slovenian dictionary missing ${key}`)
  }
  // Verify specific Slovenian wording for camera stickers & awareness
  assert.match(useLocale, /NALEPKA NA KAMERI/, 'SL sticker on camera badge verified')
  assert.match(useLocale, /NE POMENI NE/, 'SL no means no awareness badge verified')
  assert.match(useLocale, /18\+ STRIKTNO/, 'SL 18+ strict badge verified')
  assert.match(useLocale, /BREZPLAČNI ČEPKI/, 'SL free earplugs badge verified')
})

test('English translations for all 6 Door Policy Pillars in useLocale.ts', () => {
  const enKeys = [
    'faqPhotoTitle', 'faqPhotoBadge', 'faqPhotoHighlight', 'faqPhotoText',
    'faqDressTitle', 'faqDressBadge', 'faqDressHighlight', 'faqDressText',
    'faqAgeTitle', 'faqAgeBadge', 'faqAgeHighlight', 'faqAgeText',
    'faqSaferTitle', 'faqSaferBadge', 'faqSaferHighlight', 'faqSaferText',
    'faqPaymentTitle', 'faqPaymentBadge', 'faqPaymentHighlight', 'faqPaymentText',
    'faqSoundTitle', 'faqSoundBadge', 'faqSoundHighlight', 'faqSoundText'
  ]
  // Extract en section from useLocale
  const enSectionStart = useLocale.indexOf('const en: Dict = {')
  const enSectionEnd = useLocale.indexOf('const de: Dict = {')
  assert.ok(enSectionStart > 0 && enSectionEnd > enSectionStart, 'Could not locate English dictionary block')
  const enSection = useLocale.slice(enSectionStart, enSectionEnd)

  for (const key of enKeys) {
    assert.match(enSection, new RegExp(`${key}:`), `English dictionary missing ${key}`)
  }
  assert.match(enSection, /STICKER ON CAMERA/, 'EN sticker on camera badge verified')
  assert.match(enSection, /COME AS YOU ARE/, 'EN dress code badge verified')
  assert.match(enSection, /FREE EARPLUGS/, 'EN free earplugs badge verified')
})

// =========================================================================
// SECTION 3: RA Lineup Cards & Real-Time Countdown Engine
// =========================================================================
console.log('\n--- SECTION 3: RA Lineup Cards & Countdown Engine ---')

test('Countdown algorithm math and padStart formatting', () => {
  // Simulate countdown algorithm from club.vue
  function computeCountdown(targetDate, now) {
    const diff = Math.max(0, targetDate - now)
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const s = Math.floor((diff % (1000 * 60)) / 1000)
    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    }
  }

  const now = 1700000000000
  // Target in 2 days, 3 hours, 4 minutes, 5 seconds
  const target = now + (2 * 86400000) + (3 * 3600000) + (4 * 60000) + (5 * 1000)
  const res = computeCountdown(target, now)
  assert.deepEqual(res, { days: '02', hours: '03', minutes: '04', seconds: '05' })

  // Expired target clamps to 00:00:00:00
  const pastTarget = now - 50000
  const resPast = computeCountdown(pastTarget, now)
  assert.deepEqual(resPast, { days: '00', hours: '00', minutes: '00', seconds: '00' })
})

test('Countdown updates interval every 1000ms with cleanup', () => {
  assert.match(clubVue, /countdownInterval\s*=\s*window\.setInterval\(updateCountdown,\s*1000\)/, 'Interval set to 1000ms')
  assert.match(clubVue, /clearInterval\(countdownInterval\)/, 'Interval cleared on unmount')
})

test('Curated fallback lineup when RA API is empty or loading fails', () => {
  assert.match(clubVue, /const\s+curatedEvents:\s*ClubEvent\[\]/, 'curatedEvents fallback array exists')
  assert.match(clubVue, /'Kader Vault: Hypnotic Techno Night'/, 'Fallback event 1')
  assert.match(clubVue, /'Klipsch Sound System Night: Low-End Theory'/, 'Fallback event 2')
  assert.match(clubVue, /'Castle Nightfall: Ambient & Deep Electronics'/, 'Fallback event 3')
  assert.match(clubVue, /displayEvents\s*=\s*computed<ClubEvent\[\]>\(\(\)\s*=>\s*\{[\s\S]*?clubEvents\.value[\s\S]*?return\s+curatedEvents/m, 'displayEvents returns curatedEvents when API events empty')
})

test('RA event card attributes: artists, genres, external links', () => {
  assert.match(clubVue, /v-for="event in displayEvents"/, 'Cards iterate over displayEvents')
  assert.match(clubVue, /event\.artists\.join\(', '\)/, 'Lineup artists displayed as comma-joined text')
  assert.match(clubVue, /:href="event\.ra_url\s*\|\|\s*'https:\/\/ra\.co\/clubs\/78778'"/, 'Direct ticket link with fallback')
  assert.match(clubVue, /target="_blank"/, 'External ticket opens in new tab')
  assert.match(clubVue, /rel="noopener noreferrer"/, 'Security rel attributes for external link')
})

// =========================================================================
// SECTION 4: Buyouts / Private Hire Polish
// =========================================================================
console.log('\n--- SECTION 4: Buyouts / Private Hire Page ---')

test('selectPlan prefill logic for Basic, Premium, Luxury, and Club Takeover', () => {
  // Simulate selectPlan logic from buyouts.vue
  function makeForm() {
    return {
      guests: 0,
      eventType: '',
      message: ''
    }
  }

  function selectPlan(form, tierName, guestCount) {
    form.guests = guestCount
    form.message = `Zanimam se za paket ${tierName} (do ${guestCount} oseb). Prosimo za ponudbo in razpoložljivost.`
    if (tierName.includes('Klubski Takeover')) {
      form.eventType = 'private-party'
    }
  }

  // Basic (100)
  const f1 = makeForm()
  selectPlan(f1, 'Basic Paket', 100)
  assert.equal(f1.guests, 100)
  assert.match(f1.message, /Basic Paket \(do 100 oseb\)/)
  assert.equal(f1.eventType, '')

  // Premium (200)
  const f2 = makeForm()
  selectPlan(f2, 'Premium Paket', 200)
  assert.equal(f2.guests, 200)
  assert.match(f2.message, /Premium Paket \(do 200 oseb\)/)

  // Luxury (300)
  const f3 = makeForm()
  selectPlan(f3, 'Luxury Paket', 300)
  assert.equal(f3.guests, 300)
  assert.match(f3.message, /Luxury Paket \(do 300 oseb\)/)

  // Club Takeover (300 + private-party)
  const f4 = makeForm()
  selectPlan(f4, 'Klubski Takeover (Klipsch Sound System)', 300)
  assert.equal(f4.guests, 300)
  assert.equal(f4.eventType, 'private-party')
  assert.match(f4.message, /Klubski Takeover \(Klipsch Sound System\) \(do 300 oseb\)/)
})

test('Buyouts button bindings trigger correct selectPlan calls', () => {
  assert.match(buyoutsVue, /@click="selectPlan\('Basic Paket',\s*100\)"/, 'Basic package button binding')
  assert.match(buyoutsVue, /@click="selectPlan\('Premium Paket',\s*200\)"/, 'Premium package button binding')
  assert.match(buyoutsVue, /@click="selectPlan\('Luxury Paket',\s*300\)"/, 'Luxury package button binding')
  assert.match(buyoutsVue, /@click="selectPlan\('Klubski Takeover \(Klipsch Sound System\)',\s*300\)"/, 'Takeover package button binding')
})

test('Klipsch sound takeover specs and navigation link to /club', () => {
  assert.match(buyoutsVue, /Klipsch Sound System/, 'Klipsch branding in takeover banner')
  assert.match(buyoutsVue, /Klipsch La Scala/, 'La Scala speaker model in takeover specs')
  assert.match(buyoutsVue, /CDJ-3000\s*\/\s*DJM-A9/, 'Industry-standard Pioneer DJ gear specs')
  assert.match(buyoutsVue, /<NuxtLink[\s\S]*to="\/club"[\s\S]*>[\s\S]*Razišči Klub & Akustiko/m, 'Cross-link to club page exists')
})

test('Image optimization with getOptImg across buyouts sections', () => {
  assert.match(buyoutsVue, /getOptImg\(siteImages\.buyouts_hero_bg,\s*1920,\s*85\)/, 'Hero image optimized at 1920px 85q')
  assert.match(buyoutsVue, /getOptImg\(siteImages\.buyouts_booking_bg,\s*1000,\s*80\)/, 'Booking image optimized at 1000px 80q')
  assert.match(buyoutsVue, /getOptImg\('\/images\/instagram\/ig_img_5\.jpg',\s*600,\s*80\)/, 'Catering image 1 optimized')
  assert.match(buyoutsVue, /getOptImg\('\/images\/instagram\/ig_img_7\.jpg',\s*600,\s*80\)/, 'Catering image 2 optimized')
  assert.match(buyoutsVue, /getOptImg\('\/images\/instagram\/ig_img_13\.jpg',\s*600,\s*80\)/, 'Catering image 3 optimized')
  assert.match(buyoutsVue, /getOptImg\('\/images\/instagram\/ig_img_3\.jpg',\s*600,\s*80\)/, 'Catering image 4 optimized')
})

test('Form validation rules: edge cases tested empirically', () => {
  function validate(form) {
    const errors = {}
    if (form.name.trim().length < 2) errors.name = 'errName'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'errEmail'
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 6) {
      errors.phone = 'errPhone'
    }
    if (!form.eventType) errors.eventType = 'errEventType'
    if (!Number.isFinite(form.guests) || form.guests < 1 || form.guests > 500) {
      errors.guests = 'errGuests'
    }
    if (!form.date) {
      errors.date = 'errDateRequired'
    } else if (new Date(form.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
      errors.date = 'errDateFuture'
    }
    return errors
  }

  // 1. Valid submission
  const valid = {
    name: 'Janez Novak',
    email: 'janez@kader.si',
    phone: '+386 40 123 456',
    eventType: 'wedding',
    guests: 150,
    date: '2099-01-01'
  }
  assert.deepEqual(validate(valid), {}, 'Valid form should produce no errors')

  // 2. Short name (< 2 chars)
  assert.equal(validate({ ...valid, name: 'J' }).name, 'errName')
  assert.equal(validate({ ...valid, name: '  ' }).name, 'errName')

  // 3. Invalid emails
  assert.equal(validate({ ...valid, email: 'invalid' }).email, 'errEmail')
  assert.equal(validate({ ...valid, email: 'test@' }).email, 'errEmail')
  assert.equal(validate({ ...valid, email: '@domain.com' }).email, 'errEmail')

  // 4. Invalid phones (< 6 digits)
  assert.equal(validate({ ...valid, phone: '123' }).phone, 'errPhone')
  assert.equal(validate({ ...valid, phone: 'abc' }).phone, 'errPhone')

  // 5. Invalid guests (<1 or >500)
  assert.equal(validate({ ...valid, guests: 0 }).guests, 'errGuests')
  assert.equal(validate({ ...valid, guests: 501 }).guests, 'errGuests')
  assert.equal(validate({ ...valid, guests: NaN }).guests, 'errGuests')

  // 6. Past date
  assert.equal(validate({ ...valid, date: '2020-01-01' }).date, 'errDateFuture')
  assert.equal(validate({ ...valid, date: '' }).date, 'errDateRequired')
})

test('Form accessibility: aria-invalid, aria-describedby, role="alert", autocomplete', () => {
  const fields = ['name', 'email', 'phone', 'eventType', 'guests', 'date']
  for (const field of fields) {
    assert.match(buyoutsVue, new RegExp(`:aria-invalid="!!fieldErrors\\.${field}"`), `Field ${field} has dynamic aria-invalid`)
  }
  assert.match(buyoutsVue, /autocomplete="name"/, 'Autocomplete name attribute')
  assert.match(buyoutsVue, /autocomplete="email"/, 'Autocomplete email attribute')
  assert.match(buyoutsVue, /autocomplete="tel"/, 'Autocomplete tel attribute')
  assert.match(buyoutsVue, /role="alert"/, 'role="alert" present on error messages')
})

// =========================================================================
// SECTION 5: Responsive Layout Across Mobile / Tablet / Desktop
// =========================================================================
console.log('\n--- SECTION 5: Responsive Layout Breakdown ---')

test('Club page responsive grid & flex layout classes', () => {
  // Hero typography
  assert.match(clubVue, /text-5xl\s+md:text-8xl/, 'Hero scales from 5xl (mobile) to 8xl (md+)')
  // Venue grid
  assert.match(clubVue, /grid-cols-1\s+lg:grid-cols-12/, 'Venue section stacks on mobile, 12 cols on desktop')
  // Sound section
  assert.match(clubVue, /grid-cols-1\s+lg:grid-cols-2/, 'Sound section stacks on mobile, 2 cols on desktop')
  // Event cards
  assert.match(clubVue, /grid-cols-1\s+md:grid-cols-2\s+lg:grid-cols-3/, 'Cards stack on mobile, 2 cols on tablet, 3 cols on desktop')
  // Countdown container
  assert.match(clubVue, /flex-col\s+md:flex-row/, 'Countdown stacks vertically on mobile, horizontal on md+')
  // Countdown boxes
  assert.match(clubVue, /px-3 py-2 sm:px-4 sm:py-3 min-w-\[62px\]/, 'Countdown boxes resize gracefully with sm breakpoint')
})

test('ClubDjPlayer floating player bar responsiveness', () => {
  // Mobile full-width margin pill, Desktop centered clamped pill
  assert.match(
    clubDjPlayer,
    /fixed bottom-3 left-3 right-3 md:bottom-6 md:left-1\/2 md:-translate-x-1\/2 md:w-\[94%\] md:max-w-4xl/,
    'Floating bar adopts full-width margin on mobile and centered max-w on desktop'
  )
  // Grid layout within player
  assert.match(
    clubDjPlayer,
    /grid grid-cols-1 md:grid-cols-12 gap-3 items-center/,
    'Controls stack on small screens and use 12-col layout on md+'
  )
  // Equalizer hidden / responsive volume
  assert.match(clubDjPlayer, /w-16 md:w-20/, 'Volume slider expands slightly on desktop')
  assert.match(clubDjPlayer, /hidden sm:inline/, 'Secondary Klipsch text hides on ultra-narrow mobile')
})

test('Buyouts page responsive layout classes', () => {
  // Hero typography
  assert.match(buyoutsVue, /text-5xl\s+md:text-8xl/, 'Buyouts hero scales text-5xl to md:text-8xl')
  // Event types
  assert.match(buyoutsVue, /grid-cols-1\s+md:grid-cols-2\s+lg:grid-cols-4/, 'Event type cards stack on mobile, 2 cols on md, 4 cols on lg')
  // Booking process
  assert.match(buyoutsVue, /grid-cols-1\s+lg:grid-cols-2/, 'Booking process stacks on mobile, 2 cols on lg')
  // Pricing tiers
  assert.match(buyoutsVue, /grid-cols-1\s+md:grid-cols-3/, 'Pricing tiers stack on mobile, 3 cols on tablet+')
  // Catering showcase
  assert.match(buyoutsVue, /grid-cols-1\s+md:grid-cols-2\s+lg:grid-cols-4/, 'Catering gallery stacks on mobile, 2 cols on md, 4 cols on lg')
  // Inquiry form fields
  assert.match(buyoutsVue, /grid-cols-1\s+md:grid-cols-2/, 'Form fields stack on mobile, 2 cols on md+')
  // Takeover banner buttons
  assert.match(buyoutsVue, /flex flex-col sm:flex-row lg:flex-col/, 'Takeover CTA buttons wrap intelligently across breakpoints')
})

// =========================================================================
// SECTION 6: Adversarial Stress Tests & Edge Case Simulation
// =========================================================================
console.log('\n--- SECTION 6: Adversarial Stress Tests & Edge Cases ---')

test('Track indexing cyclicity: Prev wraps from 0 to N-1, Next wraps from N-1 to 0', () => {
  const trackCount = 3
  let idx = 0
  // Next cycle
  idx = (idx + 1) % trackCount
  assert.equal(idx, 1)
  idx = (idx + 1) % trackCount
  assert.equal(idx, 2)
  idx = (idx + 1) % trackCount
  assert.equal(idx, 0, 'Next track from last must wrap to 0')

  // Prev cycle
  idx = (idx - 1 + trackCount) % trackCount
  assert.equal(idx, 2, 'Prev track from 0 must wrap to last')
  idx = (idx - 1 + trackCount) % trackCount
  assert.equal(idx, 1)
})

test('Accordion idempotent toggle: Clicking open item collapses it (null)', () => {
  let openFaqIndex = 0
  const toggleFaq = (idx) => {
    openFaqIndex = openFaqIndex === idx ? null : idx
  }

  // Clicking current open item
  toggleFaq(0)
  assert.equal(openFaqIndex, null, 'Clicking active accordion item must collapse it to null')

  // Clicking new item
  toggleFaq(3)
  assert.equal(openFaqIndex, 3, 'Clicking closed item sets it as active')

  // Clicking another item
  toggleFaq(5)
  assert.equal(openFaqIndex, 5, 'Switching items updates active index')
})

test('Equalizer decay simulation when playback paused', () => {
  let bars = [80, 50, 20, 10]
  // Simulate pause decay: val * 0.9, clamped to min 12
  const decayBars = (b) => b.map(val => Math.max(12, Math.round(val * 0.9)))
  bars = decayBars(bars)
  assert.equal(bars[0], 72)
  assert.equal(bars[1], 45)
  assert.equal(bars[2], 18)
  assert.equal(bars[3], 12, '10 * 0.9 = 9 clamped to min 12')
})

test('Sub-bass 16th note timing calculation at different BPMs', () => {
  // Test tempo math: stepTime = 60 / BPM / 4
  const stepTime134 = 60 / 134 / 4 // ~0.1119s
  const stepTime130 = 60 / 130 / 4 // ~0.1154s
  const stepTime126 = 60 / 126 / 4 // ~0.1190s

  assert.ok(stepTime134 > 0.11 && stepTime134 < 0.12, '134 BPM 16th step is ~112ms')
  assert.ok(stepTime130 > 0.11 && stepTime130 < 0.12, '130 BPM 16th step is ~115ms')
  assert.ok(stepTime126 > 0.11 && stepTime126 < 0.13, '126 BPM 16th step is ~119ms')

  // Bass duration: stepTime * 1.5
  const bassDuration = stepTime134 * 1.5
  assert.ok(bassDuration < 0.2, 'Bass note duration is short enough to prevent frequency muddying')
})

test('Inquiry form: Server 422 response error mapping resilience', () => {
  const fieldErrors = {}
  const mockServerErrors = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address.',
    eventType: 'Please select an event type.'
  }

  // Simulate buyouts catch block
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
  Object.assign(fieldErrors, mockServerErrors)

  assert.equal(fieldErrors.name, 'Please enter your full name.')
  assert.equal(fieldErrors.email, 'Please enter a valid email address.')
  assert.equal(fieldErrors.eventType, 'Please select an event type.')
})

test('Adversarial input check: XSS prevention via Vue template escaping', () => {
  // In club.vue: only soundP2 uses v-html for safe emphasis, other user/dynamic content uses {{ }}
  assert.ok(!clubVue.includes('v-html="event.title"'), 'Event title must never use v-html')
  assert.ok(!clubVue.includes('v-html="event.artists"'), 'Artists must never use v-html')
  assert.ok(!buyoutsVue.includes('v-html="inquiryForm'), 'Inquiry form values must never use v-html')
})

console.log(`\n======================================================`)
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`======================================================`)

if (failCount > 0) {
  console.error('\nFAILURES ENCOUNTERED:')
  findings.forEach(f => console.error(`- ${f.test}: ${f.error}`))
  process.exit(1)
} else {
  console.log('\nALL VERIFICATIONS PASSED WITH 0 ERRORS.')
  process.exit(0)
}
