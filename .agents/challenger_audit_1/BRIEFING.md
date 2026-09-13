# BRIEFING — 2026-09-13T10:38:24Z

## Mission
Adversarially stress-test Kader's backend dual-language API endpoints against the production Nitro server.

## 🔒 My Identity
- Archetype: empirical challenger
- Roles: critic, specialist
- Working directory: /home/ator/Kader/.agents/challenger_audit_1
- Original parent: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Milestone: audit_backend_i18n
- Instance: 1 of 1

## 🔒 Key Constraints
- Review-only — do NOT modify implementation code
- Adversarial challenge: stress-test assumptions, find failure modes, propose counter-examples
- Must run verification code directly; do not trust worker's claims or logs
- Empirical reproduction required for bug reporting

## Current Parent
- Conversation ID: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Updated: not yet

## Review Scope
- **Files to review**: server/api/inquiries.post.ts, server/api/orders.post.ts, server/api/menu.get.ts, server/utils/*
- **Interface contracts**: /home/ator/Kader/.agents/orchestrator/PROJECT.md, /home/ator/Kader/.agents/worker_audit_1/implementation_report.md
- **Review criteria**: query params, Accept-Language RFC 9110 parsing, cookies, validation edge cases, bilingual error message localization, menu localization

## Key Decisions Made
- Authored and executed independent adversarial test harness `test_adversarial_api.mjs` running against the production Nitro server (`.output/server/index.mjs`) on dedicated port 3198.
- Tested 73 adversarial scenarios across 7 test suites covering query parameter variations, RFC 9110 Accept-Language q-factors, cookies, precedence, inquiries validation, table orders validation, menu config localization, image processing, and rate limiting.
- Empirically discovered 3 concrete implementation defects: RFC 9110 whitespace parsing in `locale.ts`, hardcoded English error wrapping / cross-language deduplication leak in `img.get.ts`, and hardcoded English rate limiting error in `rateLimit.ts`.

## Artifact Index
- `/home/ator/Kader/.agents/challenger_audit_1/test_adversarial_api.mjs` — Independent 73-test adversarial harness
- `/home/ator/Kader/.agents/challenger_audit_1/challenge_report.md` — Detailed challenge report with findings & metrics
- `/home/ator/Kader/.agents/challenger_audit_1/handoff.md` — 5-component self-contained handoff report
- `/home/ator/Kader/.agents/challenger_audit_1/progress.md` — Liveness heartbeat and milestone checklist

## Attack Surface
- **Hypotheses tested**:
  - Query parameter edge cases (uppercase `?lang=EN`, subtags `?lang=sl-SI`, `?lang=en-GB`, multiple params, unknown locales, whitespace padding). [CONFIRMED ROBUST]
  - Accept-Language RFC 9110 parsing with q-factors and precedence over default. [CONFIRMED ROBUST for standard format]
  - Accept-Language RFC 9110 whitespace around equals `q = 0.95`. [CONFIRMED VULNERABILITY: failed to parse q-factor due to lack of sub-token trimming]
  - Cookie preference (`kader-lang=en|sl`) and priority hierarchy (Query > Cookie > Accept-Language > Default). [CONFIRMED ROBUST]
  - Inquiries validation boundary stress (missing fields, 1-char name, bad emails, short phone, invalid event types, guests 0 & 501, past dates, non-dates). [CONFIRMED ROBUST & BILINGUAL]
  - Table orders validation stress (table 0 & 51, float tables, empty items, malformed item objects, bad qtys, negative prices, notes > 500 chars). [CONFIRMED ROBUST & BILINGUAL]
  - Menu config localization and cache key isolation under concurrent/interleaved access. [CONFIRMED ROBUST]
  - Auxiliary image endpoint error localization and rate limiting enforcement. [CONFIRMED VULNERABILITY in error wrapping & rate limit localization]
- **Vulnerabilities found**:
  1. RFC 9110 OWS whitespace parsing flaw in `locale.ts`: `param.trim().split('=')` leaves `'q '` in `k`, causing `k === 'q'` to fail and defaulting q to 1.0.
  2. Hardcoded English statusMessage wrapper in `src/server/api/img.get.ts` (`Could not process image: ...`) and shared inflight transformation promise without locale differentiation.
  3. Hardcoded English statusMessage in `src/server/utils/rateLimit.ts` (`Too Many Requests: Please wait before trying again.`) ignoring `common.rateLimitExceeded`.
  4. Non-integer guest count tolerance (`Number.isFinite(guests)`) in `inquiries.post.ts` permitting float guest counts (e.g. 10.5).
- **Untested angles**:
  - High concurrency (> 100 simultaneous requests) under heavy CPU load.
  - Multi-tenant database connection drop simulation during Supabase write operations.

## Loaded Skills
- None
