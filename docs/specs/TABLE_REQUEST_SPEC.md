# Spec: Table Request feature (public form → admin approval)

> Shared contract for parallel agents. Follow EXACTLY. **Never use the word "VIP" anywhere in UI copy.**
> Feature name: **Table Request** (EN) / **Zahteva za mizo** (SL). Venue voice: understated, no emojis.

## Goal
Guests request a table for an upcoming club night from the public site. Staff review requests in the admin and approve them into the existing reservation board.

## 1. Database — migration `supabase/migrations/00013_table_requests.sql`
```sql
create table if not exists table_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  event_ra_id bigint,
  event_label text,
  requested_date date,
  party_size int not null default 2 check (party_size >= 1 and party_size <= 20),
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','converted')),
  admin_note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_table_requests_status on table_requests(status);
create index if not exists idx_table_requests_created on table_requests(created_at desc);
alter table table_requests enable row level security;
-- public may insert only; admins full access (mirror users_roles pattern from migration 00010/00012)
create policy "public insert table_requests" on table_requests
  for insert to anon, authenticated with check (true);
create policy "admin manage table_requests" on table_requests
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
```
Add matching rows to `src/types/database.ts` (`DbTable<Row, Insert, Update>` pattern — see `guests` entry).

## 2. Public API — `src/server/api/table-requests.post.ts`
Mirror `inquiries.post.ts` conventions exactly:
- Validate server-side: name ≥ 2 chars; valid email; party_size 1–20; optional phone (≥6 digits if present); optional message ≤ 1000 chars.
- If `event_ra_id` provided: look up title/date in `ra_events` (service client `getAdminSupabase()`), fill `event_label` as `${title} — ${sl-SI date}`; reject unknown ids silently → store without label.
- Insert via service-role client (RLS bypass, same as inquiries). Return `{ ok: true, id }`.
- On validation error return HTTP 422 `{ errors: { field: msg } }` (English messages, same tone as inquiries).
- Rate-limit guard: skip (parity with inquiries).

## 3. Admin API — two files
`src/server/api/admin/table-requests.get.ts` — admin-only (copy auth preamble from `analytics.get.ts`: session user → users_roles role check). Returns rows ordered created_at desc, limit 200. Optional `?status=pending`.
`src/server/api/admin/table-requests.patch.ts` — admin-only. Body `{ id, status, admin_note? }`; status ∈ pending/approved/rejected/converted. When status becomes `approved`, ALSO insert a row into `table_reservations` (status `'held'`, guest fields copied, event fields copied, party_size, min_spend NULL, bottles_note from message) and set request status to `'converted'`. Return `{ ok: true, reservation_id? }`.

## 4. Public page — `src/pages/tables.vue`
Route `/tables`. Style: match `events.vue` (dark gradient bg-gray-900→black, gray-800 cards, red-600 accents). NO "VIP".
- Header: EN "Table Reservations" / SL "Rezervacije miz"; subline: reserve a table for upcoming nights, min spend applies per event, our team confirms within 24h.
- Form fields: Full name*, Email*, Phone, Event (select from `GET /api/ra-events?scope=upcoming`, option label `title — date`, value ra_id; plus "— general evening —" empty option), Party size* (number 1–20, default 4), Message (textarea).
- Client validation mirroring server; success panel (green) like buyouts.vue with "Send another request"; inline field errors on 422.
- i18n: add `tables.*` section to BOTH sl/en dicts in `src/composables/useLocale.ts` (keys: pageTitle, pageDesc, fullName, email, phone, event, eventAny, partySize, message, submit, sending, successTitle, successText, sendAnother, errName, errEmail, errParty). Use `const { t } = useLocale()`.
- Add nav link in `src/components/Header.vue` desktop + mobile: `<NuxtLink to="/tables">` label key `nav.tables` (add to both dicts: en 'Tables', sl 'Mize'). Place after events link.

## 5. Admin tab — extend `src/pages/admin/vip.vue` ONLY
Add a 4th tab **Requests** (key `'requests'`, label EN 'Requests', badge = pending count) BEFORE Reservations in `tabsDef`.
- Fetch `GET /api/admin/table-requests` on mount (alongside existing Promise.all).
- Table list: name, contact (email/phone), event_label, party_size, message (truncated w/ title attr), created_at, actions: Approve (→ PATCH approved; on ok reload list + reservations), Reject (PATCH rejected), Delete none.
- Pending rows highlighted (border-yellow-600/40). Status shown as chip.
- Do NOT rename existing tabs; do NOT touch reservation kanban logic.

## Boundaries (to avoid merge conflicts)
- Agent BACKEND owns: `supabase/migrations/00013_table_requests.sql`, `src/types/database.ts` (append only), `src/server/api/table-requests.post.ts`, `src/server/api/admin/table-requests.get.ts`, `src/server/api/admin/table-requests.patch.ts`
- Agent PUBLIC owns: `src/pages/tables.vue`, `src/composables/useLocale.ts` (add `tables.*` + `nav.tables` to both dicts), `src/components/Header.vue` (nav links only)
- Agent ADMIN owns: `src/pages/admin/vip.vue` (tab addition only)
- Everyone: do NOT touch package.json, nuxt.config.ts, migrations < 00013, or other pages.
