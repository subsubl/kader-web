# Orchestration Plan: Kader Backend Performance & Caching Optimization

## Objective
Research and optimize the Kader Nuxt 3 / Nitro backend architecture, API caching, response latency, and data persistence for peak production performance, verifying with automated benchmarks and passing 100% builds and tests.

---

## Phase 1: Deep Backend Architecture & Caching Audit (Milestone 1)
- [ ] Initialize Orchestrator environment, briefing, and heartbeat cron.
- [ ] Spawn 3 Explorers in parallel:
  - **Explorer 1**: Audit Nitro server routes in `src/server/api/` (focus: `/api/site-images`, `/api/events`, `/api/ra-events`, `/api/menu-config`).
  - **Explorer 2**: Audit data persistence layer (`.data/*.json` and Supabase integration), analyzing I/O bottlenecks and race conditions.
  - **Explorer 3**: Audit Sharp image optimization pipeline (`/api/img` or related), investigating memory usage, streaming, ETags, and 304 Not Modified handling.
- [ ] Synthesize findings into unified Architecture & Bottleneck Audit Report.

---

## Phase 2: High-Performance API Caching & Optimization Implementation (Milestone 2)
- [ ] Spawn 3 Explorers to propose concrete implementation plan based on M1 findings.
- [ ] Spawn Worker with Mandatory Integrity Warning to implement:
  - Memory / ETag / SWR caching for semi-static endpoints.
  - Sharp image stream caching and 304 Not Modified conditional GET handling.
  - Safe concurrent file I/O refactoring for `.data/*.json`.
- [ ] Spawn 2 Reviewers independently to verify code quality, zero regressions, and backward compatibility.
- [ ] Spawn 2 Challengers to adversarially test concurrency, cache invalidation, and edge cases.
- [ ] Spawn Forensic Auditor (`teamwork_preview_auditor`) for integrity verification.
- [ ] Evaluate Gate: build/test passing + Reviewer approval + Challenger confirmation + Auditor clean verdict.

---

## Phase 3: Automated Verification & Benchmark Suite (Milestone 3)
- [ ] Spawn Worker to develop automated benchmark & verification suite:
  - Measure response latency (< 50ms cached, < 100ms uncached).
  - Verify Cache-Control and ETag headers.
  - Verify 100% API correctness on all endpoints.
- [ ] Spawn Reviewers, Challengers, and Forensic Auditor to validate benchmark methodology and results.
- [ ] Gate evaluation.

---

## Phase 4: Final Milestone (E2E Verification & Adversarial Coverage Hardening)
- [ ] Execute full application build (`npm run build`) with 0 errors.
- [ ] Run full test suite to 100% pass rate.
- [ ] Phase 2 adversarial coverage hardening by Challengers.
- [ ] Final Forensic Auditor verification.
- [ ] Produce final handoff report and report to parent.
