## 2026-09-13T10:18:18Z
You are Explorer 3 (Backend Dual-Language API Explorer) for Kader.
Your working directory is /home/ator/Kader/.agents/explorer_audit_3.
Create your BRIEFING.md and progress.md in your working directory.

Project context:
- Project root: /home/ator/Kader
- Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
- Plan: /home/ator/Kader/.agents/orchestrator/plan.md

Task:
Perform a thorough audit and design the dual-language (sl & en) support across backend API endpoints:
1. Inspect all API routes in src/server/api/:
   - src/server/api/inquiries.post.ts
   - src/server/api/table-orders.post.ts
   - src/server/api/menu-config.get.ts
   - src/server/api/events.get.ts
   - src/server/api/ra-events.get.ts
   - src/server/api/site-images.get.ts
   - src/server/api/img.get.ts
2. Design language preference detection:
   - Accept ?lang=sl|en query parameter
   - Or parse Accept-Language header
   - Default to 'sl' (Slovenian)
   - Create a clean helper (e.g., src/server/utils/locale.ts or getRequestLocale(event))
3. Design localized validation error messages and status responses for:
   - Inquiries (missing required fields: name, email, phone, date, guests, eventType; invalid email; invalid phone; invalid date)
   - Table orders (missing required fields: tableNumber, items, total; empty items array; invalid item structure)
   - Menu config (localized labels or notes if applicable)
4. Ensure full TypeScript type-safety and consistency with Nuxt Nitro H3 event handling (createError, statusCode, statusMessage, data).

Write your full findings to:
/home/ator/Kader/.agents/explorer_audit_3/backend_i18n_plan.md
Write your handoff report to:
/home/ator/Kader/.agents/explorer_audit_3/handoff.md

Send a completion message back to parent when done.
