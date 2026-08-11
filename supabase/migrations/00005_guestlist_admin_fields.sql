-- Kader — Add guestlists.created_at for door dashboard ordering
alter table if exists guestlists add column if not exists created_at timestamptz default now();
create index if not exists guestlists_created_at_idx on guestlists (created_at asc);