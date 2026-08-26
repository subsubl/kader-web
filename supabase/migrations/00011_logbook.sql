-- Manager Logbook: daily operational journal (handover, incidents, maintenance)
-- Kader Grad Kodeljevo

create table if not exists logbook_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  category text not null default 'general' check (category in ('handover','incident','maintenance','vip','general')),
  content text not null,
  event_id uuid references events(id) on delete set null,
  author_id uuid,
  author_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_logbook_date on logbook_entries(entry_date desc);

alter table logbook_entries enable row level security;

create policy "admin manage logbook" on logbook_entries
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
