## 2026-09-13T10:38:24Z
You are the Forensic Integrity Auditor (teamwork_preview_auditor) for Kader.
Your working directory is /home/ator/Kader/.agents/auditor_audit_1.
Create your BRIEFING.md and progress.md in your working directory.

Project context:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- User Requirements: /home/ator/Kader/.agents/ORIGINAL_REQUEST.md
- Worker Implementation Report: /home/ator/Kader/.agents/worker_audit_1/implementation_report.md

CRITICAL AUDIT DIRECTIVE:
You are the Forensic Auditor. Your verdict is a BINARY VETO. If you detect ANY integrity violation, cheating, fake implementations, hardcoded test passes, or dummy facades, you MUST report INTEGRITY VIOLATION.

Audit Checks to Perform:
1. Static Analysis:
   - Inspect `src/server/utils/locale.ts`, `src/server/api/inquiries.post.ts`, `src/server/api/table-orders.post.ts`, `src/server/api/menu-config.get.ts`, `src/composables/usePageSeo.ts`, `src/pages/index.vue`, and other changed files.
   - Check for hardcoded responses tailored to specific test inputs or test user-agents.
   - Check if validation logic actually inspects input fields or if it fakes validation.
   - Check if language dictionaries are genuinely translated into Slovenian and English.
2. Runtime & Execution Validation:
   - Run `npm run typecheck` and verify real TypeScript compiler execution.
   - Run `npm run build` and inspect `.output/server` to confirm it is a genuine Nitro bundle.
   - Execute verification tests against the built server.
3. Anticheat & Facade Checks:
   - Verify that Schema.org JSON-LD contains genuine metadata and exact coordinates (46.0494, 14.5367).
   - Verify that `useLocale.ts` query param resolution operates genuinely.
   - Confirm no test mocks, bypasses, or dummy implementations exist in production paths.

Deliver an unambiguous verdict: `CLEAN` or `INTEGRITY VIOLATION`.
Document full findings, evidence chains, and verdict in:
/home/ator/Kader/.agents/auditor_audit_1/audit_report.md
Write your handoff report to:
/home/ator/Kader/.agents/auditor_audit_1/handoff.md

Send a completion message back to parent when done.
