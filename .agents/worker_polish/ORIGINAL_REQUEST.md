## 2026-09-12T09:44:59Z
You are Worker Polish applying targeted hardening improvements based on Challenger 2 and Reviewer findings.
Working directory: /home/ator/Kader/.agents/worker_polish
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. In /home/ator/Kader/src/pages/club.vue:
   - In `displayEvents` computed property: change `let list = (clubEvents.value && clubEvents.value.length > 0) ? clubEvents.value : curatedEvents` to use `events.value`:
     `let list = (events.value && events.value.length > 0) ? events.value : curatedEvents`
     This ensures that when a user selects 'All Events' or 'Live' or 'Pizzeria', all events loaded from RA API are evaluated, not just club/techno pre-filtered events.
   - In template line ~461 (lineup display in modal): change `v-html="cleanLineup(selectedEvent.lineup)"` to safe Vue text interpolation:
     `<p class="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-line">{{ cleanLineup(selectedEvent.lineup) }}</p>`
     This eliminates any potential XSS vulnerability from untrusted event text.
2. In /home/ator/Kader/src/pages/admin/events/index.vue:
   - Update line 6 editorial text from `kader.si/events` to `kader.si/club`.
3. Run verification:
   - `npm run typecheck`
   - `node scripts/verify_i18n_parity.mjs`
   - `node scripts/verify_club_consolidation.mjs`
   - `npm run build`
4. Document changes in /home/ator/Kader/.agents/worker_polish/changes.md and write a handoff to /home/ator/Kader/.agents/worker_polish/handoff.md. Send a completion message when finished.
