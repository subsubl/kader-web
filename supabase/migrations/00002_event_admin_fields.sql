-- Kader — Add event fields used by the admin dashboard + form
-- Adds `type`, `created_at`, `updated_at` to events.

alter table if exists events add column if not exists type text default 'club';
alter table if exists events add column if not exists created_at timestamptz default now();
alter table if exists events add column if not exists updated_at timestamptz default now();

-- index for admin filtering/ordering by date + created_at
create index if not exists events_date_idx on events (date desc);
create index if not exists events_created_at_idx on events (created_at desc);