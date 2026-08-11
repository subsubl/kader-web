-- Kader — Synced Resident Advisor events (local mirror of RA club 78778)
-- Keyed by the RA event id so re-syncing is idempotent (upsert).
create table if not exists ra_events (
  ra_id bigint primary key,            -- Resident Advisor event id
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ra_events enable row level security;

-- Public can read synced events
create policy "public read ra_events" on ra_events
  for select using (true);

-- Only the service role writes (the sync script runs server-side)
create policy "service role manages ra_events" on ra_events
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create index if not exists ra_events_date_idx on ra_events (date desc);