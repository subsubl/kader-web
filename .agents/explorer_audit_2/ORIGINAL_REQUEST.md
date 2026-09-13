## 2026-09-13T10:18:18Z
You are Explorer 2 (SEO, Metadata & GEO Structured Data Explorer) for Kader.
Your working directory is /home/ator/Kader/.agents/explorer_audit_2.
Create your BRIEFING.md and progress.md in your working directory.

Project context:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- Plan: /home/ator/Kader/.agents/orchestrator/plan.md

Task:
Perform a thorough audit and design the optimization for SEO & GEO Structured Data across the site:
1. Inspect current SEO metadata across:
   - nuxt.config.ts
   - src/app.vue
   - src/pages/index.vue
   - src/pages/pizzeria.vue
   - src/pages/club.vue
   - src/pages/buyouts.vue
   - src/pages/shop.vue
2. Audit title tags, meta descriptions, OpenGraph tags (og:image, og:title, og:description, og:url, og:type), Twitter cards (summary_large_image), hreflang alternate links (for all supported locales), and canonical URLs.
3. Design rich Schema.org JSON-LD structured data for:
   - Restaurant (for Pizzeria: cuisine, priceRange, opening hours, address, geo)
   - NightClub (for Club: music, opening hours, address, geo)
   - Event (for club events: event status, location, offers, start/end dates)
   - LocalBusiness / EventVenue (for Grad Kodeljevo & Buyouts: address, geo, amenities)
   - Ensure EXACT GEO coordinates: Latitude 46.0494, Longitude 14.5367 (Grad Kodeljevo, Koblarjeva ulica 34, 1000 Ljubljana, Slovenia).
4. Recommend the cleanest implementation pattern (e.g. useHead script tag with type="application/ld+json", or a dedicated SchemaOrg component/composable).

Write your full findings to:
/home/ator/Kader/.agents/explorer_audit_2/seo_geo_schema_plan.md
Write your handoff report to:
/home/ator/Kader/.agents/explorer_audit_2/handoff.md

Send a completion message back to parent when done.
