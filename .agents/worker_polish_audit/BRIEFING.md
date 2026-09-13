# BRIEFING — 2026-09-13T10:44:11Z

## Mission
Polish and fix edge cases identified by Challenger 1 and Challenger 2 across useLocale.ts, server locale parsing, inquiries validation, rate limiting localization, and image processing error messages.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /home/ator/Kader/.agents/worker_polish_audit
- Original parent: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Milestone: Polish & Edge Case Resolution

## 🔒 Key Constraints
- DO NOT CHEAT. All implementations must be genuine. No dummy or facade implementations.
- Replace all occurrences of "Ulica Carla Benza 20" with canonical address "Koblarjeva ulica 34" across all 10 language dictionaries, preserving 100% key parity.
- Ensure whitespace trimming in parseAcceptLanguage parameter parsing.
- Enforce integer validation and 1-500 range on inquiry guests.
- Localize rateLimit HTTP 429 error messages via resolveApiLocale and apiMessages.
- Localize image processing failure error in img.get.ts without hardcoded English prefixes and include locale in hashKey if applicable.
- All verification scripts, typecheck, and build must pass cleanly.

## Current Parent
- Conversation ID: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Updated: 2026-09-13T10:44:11Z

## Task Summary
- **What to build**: Polish 5 specific items in src/composables/useLocale.ts, src/server/utils/locale.ts, src/server/api/inquiries.post.ts, src/server/utils/rateLimit.ts, src/server/api/img.get.ts.
- **Success criteria**: Verifications pass, typecheck 0 errors, build succeeds into .output/server.
- **Interface contracts**: PROJECT.md
- **Code layout**: src/composables/useLocale.ts, src/server/utils/locale.ts, src/server/utils/rateLimit.ts, src/server/api/inquiries.post.ts, src/server/api/img.get.ts

## Key Decisions Made
- Starting investigation of target files to inspect exact lines and implementations before making edits.

## Artifact Index
- /home/ator/Kader/.agents/worker_polish_audit/polish_report.md — Polish audit and fixes report
- /home/ator/Kader/.agents/worker_polish_audit/handoff.md — 5-component handoff report

## Change Tracker
- **Files modified**: None yet
- **Build status**: Untested
- **Pending issues**: None

## Quality Status
- **Build/test result**: Pending verification
- **Lint status**: Pending
- **Tests added/modified**: Pending

## Loaded Skills
- None required for this server/composable backend task.
