-- VIP & Guest relations: guest profiles, table inventory, bottle-service reservations
-- Kader Grad Kodeljevo

-- ── Guest profiles (CRM-lite: VIP history, tags, blacklist) ──
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  tags text[] not null default '{}',
  is_blacklisted boolean not null default false,
  blacklist_reason text,
  notes text,
  visit_count int not null default 0,
  last_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_guests_name on guests(name);
create index if not exists idx_guests_email on guests(email);

-- ── Physical VIP table inventory ──
create table if not exists vip_tables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  capacity int not null default 4,
  min_spend numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Table reservations per RA event (bottle service) ──
create table if not exists table_reservations (
  id uuid primary key default gen_random_uuid(),
  event_ra_id bigint,
  event_label text,
  guest_id uuid references guests(id) on delete set null,
  guest_name text not null,
  guest_phone text,
  table_id uuid references vip_tables(id) on delete set null,
  party_size int not null default 4,
  min_spend numeric(10,2),
  bottles_note text,
  status text not null default 'held' check (status in ('held','confirmed','seated','cancelled','no-show')),
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_reservations_event on table_reservations(event_ra_id);
create index if not exists idx_reservations_status on table_reservations(status);

-- ── RLS: admins manage everything ──
alter table guests enable row level security;
alter table vip_tables enable row level security;
alter table table_reservations enable row level security;

create policy "admin manage guests" on guests
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
create policy "admin manage vip_tables" on vip_tables
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
create policy "admin manage table_reservations" on table_reservations
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- guests.updated_at maintenance (function exists since 00010)
create trigger update_guests_updated_at before update on guests
  for each row execute function update_updated_at_column();
