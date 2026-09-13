# BRIEFING — 2026-09-13T10:22:30Z

## Mission
Audit and design comprehensive SEO, OpenGraph/Twitter metadata, i18n hreflang/canonical links, and Schema.org GEO structured data for Kader.

## 🔒 My Identity
- Archetype: explorer
- Roles: SEO, Metadata & GEO Structured Data Explorer
- Working directory: /home/ator/Kader/.agents/explorer_audit_2
- Original parent: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Milestone: SEO & GEO Structured Data Audit and Architecture

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Write all findings to /home/ator/Kader/.agents/explorer_audit_2/seo_geo_schema_plan.md
- Write handoff to /home/ator/Kader/.agents/explorer_audit_2/handoff.md
- Exact GEO coordinates: Latitude 46.0494, Longitude 14.5367 (Grad Kodeljevo, Koblarjeva ulica 34, 1000 Ljubljana, Slovenia)
- CODE_ONLY network mode: no external web requests

## Current Parent
- Conversation ID: 8768b960-5620-43e9-a4ae-bff9d8ce63a3
- Updated: 2026-09-13T10:18:18Z

## Investigation State
- **Explored paths**: `nuxt.config.ts`, `src/app.vue`, `src/pages/index.vue`, `src/pages/pizzeria.vue`, `src/pages/club.vue`, `src/pages/buyouts.vue`, `src/pages/shop.vue`, `src/composables/useLocale.ts`, `src/public/robots.txt`, `src/public/sitemap.xml`, `scripts/`
- **Key findings**:
  1. `src/pages/index.vue` erroneously calls `seo.pizzeria.*` instead of `seo.home.*`.
  2. `nuxt.config.ts` hardcodes root `href: 'https://www.kader.si/'` for hreflang globally across all subpages.
  3. Outdated coordinates (`46.0515, 14.5361`) and misspelled street address (`Kobalarjeva ulica 20`) exist across `pizzeria.vue`, `club.vue`, and `buyouts.vue`.
  4. Rich schema definitions created for Restaurant, NightClub, Event, EventVenue/LocalBusiness, and Store with exact coordinates (`46.0494, 14.5367`) and address (`Koblarjeva ulica 34, 1000 Ljubljana`).
  5. Recommended cleanest implementation architecture: unified `src/composables/usePageSeo.ts` + query-param SSR resolution in `useLocale.ts` + dynamic `htmlAttrs.lang` in `app.vue`.
- **Unexplored areas**: None. Full scope audited and specified.

## Key Decisions Made
- Architected native Nuxt 3 composable `usePageSeo.ts` with zero new npm dependencies.
- Designed 10-locale per-route hreflang linking (`?lang=`) with `x-default` and canonicals.
- Formatted complete Schema.org JSON-LD models for all required entity types.
- Generated full deliverables: `seo_geo_schema_plan.md` and `handoff.md`.

## Artifact Index
- ORIGINAL_REQUEST.md — Original task prompt
- BRIEFING.md — Persistent context and situational awareness
- progress.md — Liveness heartbeat and milestone tracking
- seo_geo_schema_plan.md — Comprehensive SEO & GEO structured data plan
- handoff.md — 5-component handoff report
