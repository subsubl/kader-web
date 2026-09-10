## 2026-09-10T15:12:38Z

You are Worker Frontend.
Your working directory is /home/ator/Kader/.agents/worker_frontend.
Your mission is to implement Milestones 1, 2, 3, and 4 for the Kader Frontend Elevation project:
"Redesign and elevate the Kader frontend (`index.vue`, `pizzeria.vue`, `club.vue`, `buyouts.vue`) to match the standards of top world-class Pizzerias (50 Top Pizza) and iconic Berlin Techno Clubs (Berghain, Tresor, Watergate, RSO)."

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed specifications and prepared blueprints from our 3 Explorers:
1. Milestone 1 (Day/Night ambient mode switcher & Gallery Lightbox Modal):
   - Read /home/ator/Kader/.agents/explorer_front_1/handoff.md
   - Create `/home/ator/Kader/src/components/ImageLightboxModal.vue`
   - Update `/home/ator/Kader/src/pages/index.vue` with Day/Night toggle (auto time detection + user toggle + smooth color/lighting shifts + dual messaging spotlight) and gallery image lightbox modal triggering upon clicking any photo.
2. Milestone 2 (World-Class Neapolitan Pizzeria Showcase):
   - Read /home/ator/Kader/.agents/explorer_front_2/handoff.md
   - Inspect components ready in /home/ator/Kader/.agents/explorer_front_2/:
     * `proposed_useReservationModal.ts` -> implement as `/home/ator/Kader/src/composables/useReservationModal.ts`
     * `proposed_ProvenanceBadge.vue` -> implement as `/home/ator/Kader/src/components/ProvenanceBadge.vue`
     * `proposed_ReservationModal.vue` -> implement as `/home/ator/Kader/src/components/ReservationModal.vue`
     * `proposed_PizzeriaCraft.vue` -> implement as `/home/ator/Kader/src/components/PizzeriaCraft.vue`
   - Update `/home/ator/Kader/src/pages/pizzeria.vue` to integrate these badges, the craft & oven section, and the quick-reservation/takeaway modal triggers.
3. Milestone 3 (Berlin Club & Nightlife Experience):
   - Read /home/ator/Kader/.agents/explorer_front_3/handoff.md
   - Create `/home/ator/Kader/src/components/ClubDjPlayer.vue` (floating/embedded DJ mix sound preview player powered by Web Audio API synthesizer loop, animated waveform equalizer bars, track switcher, scrub timeline, volume/mute toggle, minimizable capsule).
   - Update `/home/ator/Kader/src/composables/useLocale.ts` to add required translation strings for club door policy, player, and countdowns.
   - Update `/home/ator/Kader/src/pages/club.vue`:
     * Integrate `ClubDjPlayer.vue`
     * Replace flat upcoming events list with dark techno card grid with flyer imagery, genre tags (`Techno`, `Industrial`, `Minimal`, `Electro`, `Live`), dynamic live countdown timer banner (`[DNI] [UR] [MIN] [SEK]`), and direct "Kupi Vstopnico na RA →" ticket CTAs.
     * Add interactive 6-item Berlin Door Policy & Venue FAQ accordion with smooth CSS grid transitions (`grid-template-rows: 0fr -> 1fr`).
4. Milestone 4 (Buyouts Polish & Cross-Linking):
   - Update `/home/ator/Kader/src/pages/buyouts.vue`:
     * Use `getOptImg` on all showcase images
     * Add interactive plan selection pre-filling guest count and message on contact click
     * Add Club & Sound System Takeover banner
     * Add accessibility attributes (`autocomplete`, `aria-invalid`) to form inputs.
5. Verification:
   - Run `npm run build` to confirm 0 compilation, TypeScript, or Vue errors.
   - Test that pages build cleanly and are responsive across viewports.
   - Write your comprehensive handoff report to `/home/ator/Kader/.agents/worker_frontend/handoff.md` documenting all files changed, features implemented, and `npm run build` output.
   - Send a message back to the orchestrator when complete.
