# Handoff Report — Reviewer 2 (Milestones 3 & 4)
**Project**: Kader Frontend Elevation  
**Review Scope**: Milestones 3 & 4 (R3: Berlin Club Experience, R4: Buyouts / Private Hire)  
**Date**: 2026-09-10T17:26:00+02:00  
**Reviewer**: reviewer_2 (Objective & Adversarial Reviewer)  
**Verdict**: **PASS (APPROVE)**

---

## 1. Observation

Direct observations and evidence gathered from codebase inspection, DSP audio architecture analysis, template validation, and production build execution:

### Milestone 3: Berlin Club & Nightlife Experience (`src/pages/club.vue`, `src/components/ClubDjPlayer.vue`, `src/composables/useLocale.ts`)

1. **Web Audio API DSP Synthesis Engine (`ClubDjPlayer.vue:223-330`)**:
   - AudioContext initialization:
     ```ts
     const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
     if (AudioContextClass) {
       audioCtx = new AudioContextClass()
       masterGain = audioCtx.createGain()
       masterGain.gain.setValueAtTime(volume.value, audioCtx.currentTime)
       masterGain.connect(audioCtx.destination)
     }
     ```
   - Lookahead scheduling (`scheduleGroove:245-330`): Schedules notes into `audioCtx.currentTime + 0.15s` ahead of time on a 25ms timer cycle (`window.setTimeout(scheduleGroove, 25)`), eliminating main-thread jitter.
   - 4/4 Kick drum (`lines 257-272`): Synthesizes authentic pitch drop from 145 Hz to 38 Hz (`osc.frequency.exponentialRampToValueAtTime(38, t + 0.11)`) with exponential gain envelope decay (`kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)`).
   - Sub-bass rumble (`lines 274-296`): 16th-note sawtooth oscillator at 55 Hz (A1) filtered through a resonant lowpass BiquadFilter (`cutoff 115 Hz, Q 4`).
   - Hi-hat bursts (`lines 298-323`): White-noise buffer generated via `Math.random() * 2 - 1` through highpass BiquadFilter (`cutoff 7500 Hz`) with a 60ms decay envelope.
   - Zero facade: No dummy MP3/WAV links or simulated silent audio elements; 100% native Web Audio DSP synthesis.

2. **18-Bar Equalizer & Player Controls (`ClubDjPlayer.vue:125-175, 332-344`)**:
   - 18 bars dynamically bound: `waveformBars = ref<number[]>(Array(18).fill(15))` (`lines 220`).
   - Animation loop: `requestAnimationFrame(updateWaveform)` procedurally calculates sinusoidal and randomized heights with graceful decay to baseline (12%) when paused (`lines 332-344`).
   - Track switcher (`lines 185-207, 372-387`): 3 curated sets (134 BPM Hypnotic Techno, 130 BPM Industrial Minimal, 126 BPM Dub Techno) with next/prev cycling and duration calculation.
   - Volume/Mute (`lines 150-175, 393-412`): Full range slider (0–1.0) and toggle mute button caching previous volume, updating `masterGain.gain.setValueAtTime()`.
   - Floating minimize capsule (`lines 3-30`): Collapses into bottom-right capsule (`fixed bottom-6 right-6 z-50`) with pulsing indicator and 4 mini animated equalizer bars; clicking restores full controls.
   - Clean teardown (`lines 423-430`): `onBeforeUnmount` clears `timerId`, `progressInterval`, `animFrameId`, and explicitly calls `audioCtx.close()`.

3. **Berlin Door Policy Accordion (`club.vue:187-266`, `useLocale.ts:181-207, 476-502`)**:
   - 6 items fully translated in Slovenian and English with custom badges:
     1. `photo`: *No Photo Policy* (Sticker on camera lens tape at door, dancefloor privacy).
     2. `dress`: *Come As You Are* (Dark/techno aesthetic, individual expressiveness, strict ban on hate symbols).
     3. `age`: *18+ Strictly Enforced* (Mandatory physical government ID, no phone photos).
     4. `safer`: *Safer Spaces & Awareness Team* ("No means no", zero tolerance for harassment, on-site awareness team).
     5. `payment`: *Cashless & Cloakroom* (Contactless NFC/card + cash, secure monitored cloakroom €2).
     6. `sound`: *Klipsch Sound System & Hearing Protection* (Klipsch La Scala AL6 horn system, free Alpine earplugs at all bars).
   - Smooth CSS grid animation:
     ```html
     <div
       :id="'faq-content-' + idx"
       class="grid transition-all duration-300 ease-out"
       :style="{ gridTemplateRows: openFaqIndex === idx ? '1fr' : '0fr' }"
     >
       <div class="overflow-hidden">...</div>
     </div>
     ```
     Provides fluid, non-blocking expansion without hardcoded heights or JavaScript height measuring.

4. **RA Integration & Real-Time Countdown (`club.vue:268-408, 572-640`)**:
   - Live Countdown Banner (`lines 289-326`): Calculates difference from `nextEvent.date` to client `Date.now()`, updating every 1000ms with double-digit padding (`days`, `hours`, `minutes`, `seconds`). `Math.max(0, diff)` prevents negative values on expired events.
   - Dark techno flyer card grid (`lines 342-407`): Displays event flyer with dark gradient vignettes, dynamic genre tags (`Industrial`, `Techno`, `Minimal`), lineup text, date chips, and direct `"Kupi Vstopnico na RA →"` external links (`rel="noopener noreferrer"`).
   - Robust fallback: If API `/api/ra-events?scope=upcoming` fails or is unreachable, the grid automatically displays 3 curated club nights with realistic local flyer paths.

---

### Milestone 4: Buyouts / Private Hire Polish (`src/pages/buyouts.vue`)

1. **Showcase Images Optimization (`buyouts.vue:7, 62, 175, 185, 195, 205`)**:
   - Hero background: `getOptImg(siteImages.buyouts_hero_bg, 1920, 85)`
   - Booking process image: `getOptImg(siteImages.buyouts_booking_bg, 1000, 80)`
   - All 4 showcase cards: `getOptImg('/images/instagram/ig_img_5.jpg', 600, 80)`, `ig_img_7.jpg`, `ig_img_13.jpg`, `ig_img_3.jpg`.
   - Zero unoptimized raw assets.

2. **Interactive Plan Selection & Pre-Fill (`buyouts.vue:85, 102, 120, 152, 380-387`)**:
   - Clicking tier buttons executes `selectPlan(tierName, guestCount)`:
     - Basic: Sets 100 guests, pre-fills inquiry message.
     - Premium: Sets 200 guests, pre-fills inquiry message.
     - Luxury: Sets 300 guests, pre-fills inquiry message.
     - Club Takeover: Sets 300 guests, sets `inquiryForm.eventType = 'private-party'`, tailored inquiry message.
     - Viewport smoothly scrolls to `#inquiry-form` (`scrollToForm()`).

3. **Club & Sound System Takeover Banner (`buyouts.vue:126-166`)**:
   - Displays dedicated Klipsch La Scala sound system specs, CDJ-3000 / DJM-A9 setup, private bar, security, and acoustic engineer.
   - Primary CTA pre-fills the buyout inquiry form.
   - Secondary cross-link CTA navigates to `/club` (`<NuxtLink to="/club"> Razišči Klub & Akustiko ↗ </NuxtLink>`).

4. **Form Accessibility & UX (`buyouts.vue:232-345, 396-427`)**:
   - Inputs include standard `autocomplete` attributes (`autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`).
   - Dynamic error binding with `:aria-invalid="!!fieldErrors[field]"` and `aria-describedby="[field]-error"`.
   - Error messages and banners rendered with `role="alert"`.
   - Date picker enforces future dates (`:min="todayString"`) and client-side validation prevents selecting past dates.

---

### Verification Execution

- `npm run build`:
  - Result: `✔ Client built`, `✔ Server built`, `✔ Generated public .output/public`, `✔ Nuxt Nitro server built`, `✨ Build complete!` with **0 errors**.
- `npm run typecheck`:
  - Result: `◆ Type check passed in 8766ms.` with **0 errors**.

---

## 2. Logic Chain

1. **Integrity & Authenticity Assessment**:
   - Checked whether `ClubDjPlayer.vue` used facade sound players (e.g., silent audio tags or dummy files). Code inspection at lines 245-330 reveals an actual Web Audio DSP synthesis engine generating sine/exponential frequency sweeps, noise buffers, and resonant lowpass filters. No hardcoded mock results or facade shortcuts exist.
   - Verified that RA countdown uses real-time date math rather than fixed timer constants. `Date.now()` is subtracted from target ISO dates every 1,000ms.
   - Confirmed all images pass through the server-side image resizer/CDN utility `getOptImg`.

2. **Quality & Standard Compliance**:
   - The Berlin club standards (Berghain/Tresor) call for stark visual aesthetics, uncompromising door policy clarity (no photos, camera stickers, safer spaces, hearing protection), and authentic sound engineering.
   - `club.vue` and `useLocale.ts` explicitly fulfill all 6 policy pillars with verbatim adherence to Berlin underground culture.
   - The CSS grid accordion technique (`grid-template-rows: 0fr -> 1fr`) delivers performant height animations without DOM reflow spikes or hardcoded heights.

3. **Buyouts & Commercial Workflow Integration**:
   - The inquiry form connects with the tiered pricing structure. Clicking packages directly transfers capacity and copy into the form, minimizing user friction.
   - Cross-linking between `/buyouts` and `/club` bridges the venue's daytime and nightlife business units.

---

## 3. Caveats

1. **Web Audio Autoplay Policy**: Modern browsers restrict `AudioContext` from producing sound before a user gesture. `ClubDjPlayer.vue` respects this by only initializing and resuming the context inside `togglePlay()`.
2. **Scrubber Behavior on Synthesizer**: Because the synthesizer generates endless procedural techno loops in real-time, the timeline scrubber updates the elapsed time indicator and beat phase rather than seeking into a recorded audio stream. If recorded DJ sets are added in the future, the player's gain graph can seamlessly accept an `AudioBufferSourceNode` or `<audio>` media element.

---

## 4. Conclusion

- **Verdict**: **PASS (APPROVE)**.
- Both Milestone 3 (Berlin Club & Nightlife Experience) and Milestone 4 (Buyouts / Private Hire Polish) satisfy all project requirements.
- Zero integrity violations, zero compilation errors, zero TypeScript errors.

---

## 5. Verification Method

To independently reproduce and verify this review:

1. **Compile & Typecheck**:
   ```bash
   npm run typecheck
   npm run build
   ```
   *Expected*: Typecheck passes cleanly; production build generates `.output/server` and `.output/public` with 0 errors.

2. **DSP Synthesis Inspection**:
   - Inspect `/home/ator/Kader/src/components/ClubDjPlayer.vue` lines 232–330 to verify `AudioContext`, kick oscillator frequency sweeps (`145Hz -> 38Hz`), sawtooth bassline (`55Hz`), and noise buffer hi-hat generation.

3. **Door Policy & Accordion Verification**:
   - Inspect `/home/ator/Kader/src/pages/club.vue` lines 187–266 and `/home/ator/Kader/src/composables/useLocale.ts` lines 181–207 to verify the 6 door policy items (photo stickers, dress code, 18+ ID, safer spaces, cashless, Klipsch audio & free earplugs).

4. **Buyouts Verification**:
   - Inspect `/home/ator/Kader/src/pages/buyouts.vue` lines 85, 102, 120, 152 to verify `selectPlan` pre-filling guest count and message, and lines 126–166 for the Club Takeover cross-link banner.
