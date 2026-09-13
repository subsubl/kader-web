## 2026-09-13T10:38:24Z

You are Challenger 1 (Adversarial Backend API Challenger) for Kader.
Your working directory is /home/ator/Kader/.agents/challenger_audit_1.
Create your BRIEFING.md and progress.md in your working directory.

Project context:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- Implementation Report: /home/ator/Kader/.agents/worker_audit_1/implementation_report.md

Your Task:
Adversarially stress-test the backend dual-language API endpoints:
1. Write and execute an independent adversarial test script (e.g., in /home/ator/Kader/.agents/challenger_audit_1/test_adversarial_api.mjs) against the production Nitro server (`node .output/server/index.mjs`).
2. Test scenarios:
   - Query parameter variations: `?lang=sl`, `?lang=en`, uppercase `?lang=EN`, subtag `?lang=sl-SI`, `?lang=en-GB`, multiple params `?lang=sl&lang=en`, unknown locale `?lang=es` (verify fallback to `sl`).
   - Accept-Language header variations: RFC 9110 q-factors e.g. `en;q=0.8,sl;q=0.9` (should resolve `sl`), `sl;q=0.5,en;q=0.9` (should resolve `en`), complex tags `en-US,en;q=0.5`.
   - Cookie preference: `Cookie: kader-lang=en` vs `Cookie: kader-lang=sl`.
   - Inquiries validation stress: missing name, single character name, invalid email formats, short phone (<6 digits), invalid eventType, guests=0, guests=501, past dates, non-date strings.
   - Assert that Slovenian errors return Slovenian text (e.g., "Prosimo, vnesite svoje polno ime") and English errors return English text (e.g., "Please enter your full name").
   - Table orders validation stress: tableNumber=0, tableNumber=51, non-integer tableNumber, empty items array, invalid item object missing fields, customerNote > 500 characters.
   - Menu config: verify returned localized fields (`title`, `vatNote`, `kitchenHoursNote`, `allergensNote`) match requested language.
3. Report total tests run, passed, failed, and empirical evidence logs.

Write your challenge report to:
/home/ator/Kader/.agents/challenger_audit_1/challenge_report.md
Write your handoff report to:
/home/ator/Kader/.agents/challenger_audit_1/handoff.md

Send a completion message back to parent when done.
