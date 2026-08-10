-- Kader Grad Kodeljevo - Supabase Schema (paste into Supabase SQL Editor)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  date timestamptz not null,
  description text,
  image_url text,
  ra_link text,
  status text default 'published'
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  price numeric not null,
  is_available boolean default true
);

create table if not exists guestlists (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  guest_name text not null,
  category text default 'standard',
  status text default 'pending',
  promoter_id uuid
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  type text default 'buyout',
  party_size int,
  date timestamptz,
  status text default 'new',
  notes text
);

create table if not exists internal_notes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  note_text text,
  author_id uuid,
  created_at timestamptz default now()
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
alter table internal_notes enable row level security;
