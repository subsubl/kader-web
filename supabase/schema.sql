-- Kader Grad Kodeljevo - Supabase Schema (paste into Supabase SQL Editor)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  date timestamptz not null,
  type text default 'club',
  description text,
  image_url text,
  ra_link text,
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  price numeric not null,
  is_available boolean default true,
  created_at timestamptz default now()
);

create table if not exists guestlists (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  guest_name text not null,
  category text default 'standard',
  status text default 'pending',
  promoter_id uuid,
  created_at timestamptz default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  type text default 'buyout',
  party_size int,
  date timestamptz,
  status text default 'new',
  notes text,
  created_at timestamptz default now()
);

-- Pretix-synced orders (written only via service-role webhook)
create table if not exists pretix_orders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  order_code text unique not null,
  status text not null default 'pending',       -- pending | paid | cancelled | refunded
  email text,
  items jsonb default '[]'::jsonb,
  total numeric default 0,
  paid_at timestamptz,
  raw_payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- One row per purchasable ticket / check-inable person
create table if not exists pretix_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references pretix_orders(id) on delete cascade,
  event_id uuid references events(id),
  position_id text unique not null,             -- pretix position id (secret)
  name text,
  checkin_status text default 'unchecked',      -- unchecked | checked_in
  checked_in_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists internal_notes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  note_text text,
  author_id uuid,
  created_at timestamptz default now()
);

-- Editable site content (e.g. pizzeria menu image — must be an image per design)
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Synced Resident Advisor events (local mirror of RA club 78778)
create table if not exists ra_events (
  ra_id bigint primary key,
  title text not null,
  date timestamptz not null,
  start_time timestamptz,
  end_time timestamptz,
  cost numeric,
  flyer_url text,
  ra_url text,
  lineup text,
  artists jsonb default '[]'::jsonb,
  genres jsonb default '[]'::jsonb,
  pretix_event_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists users_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  role text check (role in ('admin', 'door', 'promoter'))
);

alter table events enable row level security;
alter table menu_items enable row level security;
alter table guestlists enable row level security;
alter table inquiries enable row level security;
alter table pretix_orders enable row level security;
alter table pretix_tickets enable row level security;
alter table internal_notes enable row level security;
alter table ra_events enable row level security;

-- RLS: public can read published events + menu
create policy "public read published events" on events
  for select using (status = 'published');
create policy "public read menu" on menu_items
  for select using (is_available = true);

-- RLS: public read synced RA events, service role writes
create policy "public read ra_events" on ra_events
  for select using (true);
create policy "service role manages ra_events" on ra_events
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- RLS: authenticated staff read/insert/update operations tables
create policy "staff manage guestlists" on guestlists
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "staff manage inquiries" on inquiries
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "staff manage internal_notes" on internal_notes
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- RLS: site_settings — public read, staff write
create policy "public read settings" on site_settings
  for select using (true);
create policy "staff insert settings" on site_settings
  for insert with check (auth.uid() is not null);
create policy "staff update settings" on site_settings
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

-- RLS: pretix tables are service-role only (authenticated staff may read for door ops)
create policy "staff read orders" on pretix_orders
  for select using (auth.uid() is not null);
create policy "staff read tickets" on pretix_tickets
  for select using (auth.uid() is not null);
-- RLS: users_roles — users read own role, service role manages
alter table users_roles enable row level security;
create policy "users read own role" on users_roles
  for select using (auth.uid() = user_id);
create policy "service role manages roles" on users_roles
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

