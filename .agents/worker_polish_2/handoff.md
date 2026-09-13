# Handoff Report: Polish & Edge-Case Hardening

**Agent**: Worker 3 (Polish & Edge-Case Worker)
**Target File**: `/home/ator/Kader/.agents/worker_polish_2/handoff.md`
**Type**: Hard Handoff (Task Complete)

---

## 1. Observation

1. In `src/composables/useLocale.ts`, the legacy address `"Ulica Carla Benza 20"` occurred 80 times (8 keys across 10 languages: `sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`). Additionally, `src/pages/pizzeria.vue` at line 451 contained `<a href="..." ...>Ulica Carla Benza 20</a>`.
   - In `test_adversarial_seo.mjs`, Assert #298 checked `pageHtml.includes('Carla Benza')` across all routes and locales, previously failing with 20 matches (`/?lang=...` and `/pizzeria?lang=...`).
2. In `src/server/utils/locale.ts` (`parseAcceptLanguage`):
   - Parameters were parsed with `const [k, v] = param.trim().split('=')`. Whitespace around `=` (e.g. `q = 0.9`) resulted in `k === 'q '` rather than `'q'`.
3. In `src/server/api/inquiries.post.ts`:
   - Guest count check was `if (!Number.isFinite(guests) || guests < 1 || guests > 500)`, which admitted fractional floats (e.g. `3.5`).
4. In `src/server/utils/rateLimit.ts`:
   - `checkRateLimit` threw `statusMessage: 'Too Many Requests: Please wait before trying again.'` with hardcoded English text.
5. In `src/server/api/img.get.ts`:
   - Catch block threw `statusMessage: `Could not process image: ${err?.message || 'Unknown error'}`` with hardcoded English prefix.
   - `inflightTransformations` used `hashKey` alone without locale, risking cross-locale error leakage.

---

## 2. Logic Chain

1. **Address Canonicalization**: By replacing all occurrences of `"Ulica Carla Benza 20"` with `"Koblarjeva ulica 34"` in `src/composables/useLocale.ts` and `src/pages/pizzeria.vue`:
   - The visible SSR body HTML on `/` and `/pizzeria` now precisely matches the Schema.org address (`Koblarjeva ulica 34, 1000 Ljubljana`).
   - Leaf key count remains exactly 938 across all 10 locales, and parameter templates in `home.visitP` (`{{food}}` and `{{table}}`) remain intact.
2. **Whitespace Tolerance in `parseAcceptLanguage`**: By splitting with `.split('=').map(s => s.trim())`, any spacing surrounding `=` (e.g., `q = 0.9` or `q= 0.8`) trims down to key `'q'` and value `'0.9'`, correctly parsing the q-factor.
3. **Guest Count Integer Validation**: Replacing `!Number.isFinite(guests)` with `!Number.isInteger(guests) || guests < 1 || guests > 500` ensures only whole-number guest counts between 1 and 500 pass validation, rejecting floats such as `3.5`.
4. **429 Rate Limit Localization**: Invoking `resolveApiLocale(event)` and pulling from `apiMessages[locale]?.common?.rateLimitExceeded` ensures Slovenian clients receive `"Preveč zahtev. Prosimo, počakajte trenutek in poskusite znova."` while English clients receive `"Too many requests. Please wait before trying again."`.
5. **Image Processing Error Localization & Deduplication Isolation**: Appending `:locale` to `hashKey` isolates inflight promises per locale, while `t('img.errProcessFailed', { error: err?.message || 'Unknown error' })` returns localized error descriptions for each language context.

---

## 3. Caveats

- In `src/composables/useLocale.ts`, pickup location values like `"Grad Kodeljevo (Benza 20)"` in takeaway options remain unchanged because they denote the specific delivery vehicle gate entrance for logistics drivers, as opposed to the primary castle address. This string does not trigger the `'Carla Benza'` adversarial check and accurately guides physical pickup customers.
- External production deployment requires environment variables (e.g. Supabase, Pretix) if live DB writes are invoked; when absent, deterministic fallbacks operate as intended.

---

## 4. Conclusion

All 5 assigned edge-case polish items are fully implemented, verified, and integrated into the project build:
- Address canonicalization to `Koblarjeva ulica 34` completed across all 10 locales with 100.0% key parity (938 keys per language).
- `parseAcceptLanguage` safely handles arbitrary whitespace in `Accept-Language` parameters.
- `inquiries.post.ts` strictly validates integer guest counts within 1–500.
- `rateLimit.ts` delivers fully localized 429 rate limit errors.
- `img.get.ts` isolates inflight transforms per locale and uses localized error messaging.
- All test suites (`verify_api_i18n.mjs`, `verify_seo_geo_schema.mjs`, `test_adversarial_seo.mjs`, `test_polish_edge_cases.mjs`, `verify_i18n_parity.mjs`) pass with 0 failures, and `npm run typecheck` + `npm run build` succeed with 0 errors.

---

## 5. Verification Method

To independently verify these changes:

```bash
# 1. Verify i18n dictionary key parity (938 keys per language across 10 locales)
node scripts/verify_i18n_parity.mjs

# 2. Verify backend dual-language API compliance (inquiries, table-orders, menu-config)
node scripts/verify_api_i18n.mjs

# 3. Verify SEO, GEO, and Schema.org structured data
node scripts/verify_seo_geo_schema.mjs

# 4. Verify adversarial SEO tests (298 assertions including 0 'Carla Benza' address leaks)
node .agents/challenger_audit_2/test_adversarial_seo.mjs

# 5. Verify Worker 3 polish edge cases
node scripts/test_polish_edge_cases.mjs

# 6. Verify TypeScript compilation
npm run typecheck

# 7. Verify full production build
npm run build
```

Files to inspect:
- `src/composables/useLocale.ts`: occurrences of `"Koblarjeva ulica 34"` (80 replacements) and 0 `"Ulica Carla Benza 20"`.
- `src/pages/pizzeria.vue`: line 451 address link text.
- `src/server/utils/locale.ts`: lines 26-32 (`split('=').map(s => s.trim())`).
- `src/server/api/inquiries.post.ts`: line 57 (`!Number.isInteger(guests)`).
- `src/server/utils/rateLimit.ts`: lines 2, 52-57 (`resolveApiLocale`, `apiMessages`).
- `src/server/api/img.get.ts`: lines 80, 219, 293 (`inflightKey = `${hashKey}:${locale}`` and `t('img.errProcessFailed', ...)`).
