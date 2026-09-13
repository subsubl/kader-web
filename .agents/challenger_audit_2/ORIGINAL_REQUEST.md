## 2026-09-13T10:38:24Z

You are Challenger 2 (Adversarial SEO, GEO & Schema Challenger) for Kader.
Your working directory is /home/ator/Kader/.agents/challenger_audit_2.
Create your BRIEFING.md and progress.md in your working directory.

Project context:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- Implementation Report: /home/ator/Kader/.agents/worker_audit_1/implementation_report.md

Your Task:
Adversarially stress-test the SEO metadata, GEO coordinates, and Schema.org structured data:
1. Write and execute an independent adversarial test script (e.g. in /home/ator/Kader/.agents/challenger_audit_2/test_adversarial_seo.mjs) against the production Nitro server (`node .output/server/index.mjs`).
2. Test scenarios:
   - SSR HTML inspection of all public routes: `/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`.
   - Extract and `JSON.parse()` all Schema.org `<script type="application/ld+json">` tags. Verify 0 syntax errors.
   - Assert that every entity with a `geo` property has EXACT coordinates: `latitude === 46.0494` and `longitude === 14.5367`.
   - Grep the entire source and built output for any occurrence of the outdated coordinates (`46.0515` or `14.5361`) or misspelled street name (`Kobalarjeva`). Assert ZERO occurrences.
   - Verify street address is strictly `"Koblarjeva ulica 34"` in postal addresses.
   - Check canonical tags and 10 hreflang alternate tags per page. Verify that subpages (e.g. `/pizzeria`) have `/pizzeria?lang=...` and do NOT inherit `/` from `nuxt.config.ts`.
   - Test dynamic HTML lang attribute: verify `<html lang="en">` on `/?lang=en` and `<html lang="sl">` on `/?lang=sl`.
   - Verify `X-Robots-Tag: noindex, nofollow` on `/admin` and `/api` routes.
3. Report total assertions, passed, failed, and empirical evidence logs.

Write your challenge report to:
/home/ator/Kader/.agents/challenger_audit_2/challenge_report.md
Write your handoff report to:
/home/ator/Kader/.agents/challenger_audit_2/handoff.md

Send a completion message back to parent when done.
