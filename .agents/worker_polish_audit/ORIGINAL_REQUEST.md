## 2026-09-13T10:44:06Z
You are Worker 2 (Polish Worker) for Kader.
Your working directory is /home/ator/Kader/.agents/worker_polish_audit.
Create your BRIEFING.md and progress.md in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT
hardcode test results, create dummy/facade implementations, or
circumvent the intended task. A Forensic Auditor will independently
verify your work. Integrity violations WILL be detected and your
work WILL be rejected.

Context:
Challenger 1 and Challenger 2 identified specific minor polish opportunities and edge cases:
1. In `src/composables/useLocale.ts`:
   - Challenger 2 found legacy address "Ulica Carla Benza 20" in `visitP`, `legalCompanyLine`, and `companyLine` across dictionary definitions.
   - Replace all occurrences of "Ulica Carla Benza 20" with the canonical address "Koblarjeva ulica 34" across all 10 language dictionaries, preserving 100% key parity.
2. In `src/server/utils/locale.ts`:
   - In `parseAcceptLanguage(header)`: Split parameter by '=' and trim both key and value (`const [k, v] = param.split('=').map(s => s.trim())`), so whitespace like `q = 0.9` correctly matches `k === 'q'`.
3. In `src/server/api/inquiries.post.ts`:
   - Enforce integer validation on guests: change `!Number.isFinite(guests)` to `!Number.isInteger(guests) || guests < 1 || guests > 500`.
4. In `src/server/utils/rateLimit.ts`:
   - Import `resolveApiLocale` and `apiMessages` from `./locale`.
   - Localize the HTTP 429 error message: `const locale = resolveApiLocale(event); const msg = apiMessages[locale]?.common?.rateLimitExceeded || 'Too Many Requests...'; throw createError({ statusCode: 429, statusMessage: msg })`.
5. In `src/server/api/img.get.ts`:
   - Ensure the image process failure error uses `t('img.errProcessFailed', { error: err.message })` without hardcoded English prefixes, and include locale in hashKey if applicable.
6. Run verification:
   - Run `node scripts/verify_api_i18n.mjs`
   - Run `node scripts/verify_seo_geo_schema.mjs`
   - Run `node .agents/challenger_audit_2/test_adversarial_seo.mjs`
   - Run `npm run typecheck` (must pass with 0 errors)
   - Run `npm run build` (must compile cleanly into `.output/server`)

Write your report to:
/home/ator/Kader/.agents/worker_polish_audit/polish_report.md
Write your handoff report to:
/home/ator/Kader/.agents/worker_polish_audit/handoff.md

Send a completion message back to parent when done.
