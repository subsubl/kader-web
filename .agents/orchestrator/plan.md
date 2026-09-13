# Execution Plan: Kader Full-Site Audit, SEO/GEO & Dual-Language Backend

## Phase 1: Exploration & Forensic Mapping (Milestone 5)
- **Explorer 1 (UI, Components & Performance)**:
  - Working directory: `/home/ator/Kader/.agents/explorer_audit_1`
  - Scope: Inspect all public pages (`/`, `/pizzeria`, `/club`, `/buyouts`, `/shop`) and shared components (`Header.vue`, `Footer.vue`, modals, grids).
  - Check for broken links, responsive layout glitches (mobile/tablet/desktop), spacing inconsistencies.
  - Inspect asset loading, image lazy-loading attributes (`loading="lazy"`, `decoding="async"`), and font display (`font-display: swap`).
  - Output: `/home/ator/Kader/.agents/explorer_audit_1/ui_performance_audit.md`
- **Explorer 2 (SEO, Metadata & GEO Structured Data)**:
  - Working directory: `/home/ator/Kader/.agents/explorer_audit_2`
  - Scope: Audit current page title tags, meta descriptions, OpenGraph meta, Twitter cards, hreflang annotations, canonical URLs across all pages and `nuxt.config.ts`.
  - Design complete Schema.org JSON-LD structured data for `Restaurant`, `NightClub`, `Event`, and `LocalBusiness` featuring exact GEO coordinates (`46.0494, 14.5367` for Grad Kodeljevo, Ljubljana, Slovenia).
  - Output: `/home/ator/Kader/.agents/explorer_audit_2/seo_geo_schema_plan.md`
- **Explorer 3 (Backend Dual-Language API Architecture)**:
  - Working directory: `/home/ator/Kader/.agents/explorer_audit_3`
  - Scope: Inspect all backend API endpoints (`src/server/api/inquiries.post.ts`, `src/server/api/table-orders.post.ts`, `src/server/api/menu-config.get.ts`, `src/server/api/events.get.ts`, `src/server/api/ra-events.get.ts`, etc.).
  - Design query parameter (`?lang=sl|en`) and `Accept-Language` header resolution mechanism.
  - Map out localized validation error messages, status responses, and notes in Slovenian (`sl`) and English (`en`).
  - Output: `/home/ator/Kader/.agents/explorer_audit_3/backend_i18n_plan.md`

## Phase 2: Implementation (Milestone 6)
- **Worker (Full Implementation)**:
  - Working directory: `/home/ator/Kader/.agents/worker_audit_1`
  - Implement UI fixes, broken link repairs, responsive layout polish.
  - Implement SEO meta tags, OpenGraph, Twitter cards, canonicals, hreflang across all pages.
  - Implement rich Schema.org JSON-LD structured data with GEO coordinates (46.0494, 14.5367).
  - Implement backend localization helper and update API handlers (`inquiries.post.ts`, `table-orders.post.ts`, `menu-config.get.ts`, etc.) for dual-language sl & en responses.
  - Optimize client asset loading, image lazy-loading, and font display.
  - Run `npm run typecheck` and `npm run build`.
  - Output: `/home/ator/Kader/.agents/worker_audit_1/implementation_report.md`

## Phase 3: Multi-Dimensional Verification & Integrity Audit (Milestone 7)
- **Reviewer 1**: Code architecture, build integrity, SSR compliance, and performance verification.
- **Reviewer 2**: Requirements verification (R1 UI fixes, R2 SEO & GEO JSON-LD, R3 backend dual-language, R4 performance).
- **Challenger 1**: Adversarial API testing (query param `?lang=sl` vs `?lang=en`, Accept-Language header, fallback behavior, malformed payloads).
- **Challenger 2**: Adversarial SEO & JSON-LD validation (schema syntax, GEO coordinates precision, required Schema.org fields, SSR head rendering).
- **Forensic Auditor**: Authentic implementation verification, cheating checks, hardcoded response detection, facade checks.
- Gate evaluation: 100% checks passing -> Report Victory to Sentinel.
