## 2026-09-13T13:49:00Z
You are Worker 3 (Polish Worker) for Kader.
Your working directory is /home/ator/Kader/.agents/worker_polish_2.
Create your BRIEFING.md and progress.md in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT
hardcode test results, create dummy/facade implementations, or
circumvent the intended task. A Forensic Auditor will independently
verify your work. Integrity violations WILL be detected and your
work WILL be rejected.

Context & Assigned Tasks:
Challenger 1 and Challenger 2 identified specific minor polish opportunities and edge cases:
1. In `src/composables/useLocale.ts`:
   - Challenger 2 found legacy address "Ulica Carla Benza 20" in dictionary definitions across all 10 locales.
   - Replace all occurrences of "Ulica Carla Benza 20" with the canonical address "Koblarjeva ulica 34" across all 10 language dictionaries (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`).
   - Preserve 100% key parity (exactly 938 leaf keys per language).
2. In `src/server/utils/locale.ts`:
   - In `parseAcceptLanguage(header)`: Split parameter by '=' and trim both key and value:
     `const [k, v] = param.split('=').map(s => s.trim())`
     so whitespace like `q = 0.9` correctly matches `k === 'q'`.
3. In `src/server/api/inquiries.post.ts`:
   - Enforce integer validation on guests: change `!Number.isFinite(guests)` to `!Number.isInteger(guests) || guests < 1 || guests > 500`.
4. In `src/server/utils/rateLimit.ts`:
   - Import `resolveApiLocale` and `apiMessages` from `./locale`.
   - Localize the HTTP 429 error message:
     `const locale = resolveApiLocale(event)`
     `const msg = apiMessages[locale]?.common?.rateLimitExceeded || 'Too Many Requests: Please wait before trying again.'`
     `throw createError({ statusCode: 429, statusMessage: msg })`
5. In `src/server/api/img.get.ts`:
   - Ensure the image process failure error uses `t('img.errProcessFailed', { error: err?.message || 'Unknown error' })` without hardcoded English prefixes.
   - In inflight transformations deduplication, include `locale` in `hashKey` (e.g. `${hashKey}:${locale}`) so error rejections do not leak across locales.
6. Run full verification suite:
   - Run `node scripts/verify_api_i18n.mjs`
   - Run `node scripts/verify_seo_geo_schema.mjs`
   - Run `node .agents/challenger_audit_2/test_adversarial_seo.mjs`
   - Run `npm run typecheck` (must pass with 0 errors)
   - Run `npm run build` (must compile cleanly into `.output/server`)

Deliverables:
- Write detailed implementation and verification report to:
  `/home/ator/Kader/.agents/worker_polish_2/polish_report.md`
- Write handoff report to:
  `/home/ator/Kader/.agents/worker_polish_2/handoff.md`
- Send a completion message back to parent when done.
