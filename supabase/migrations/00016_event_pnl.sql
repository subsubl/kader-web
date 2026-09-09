-- Post-Event Profit & Loss Reports
-- Kader Grad Kodeljevo

create table if not exists event_pnl (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  event_label text not null,
  event_date date,
  -- Revenue
  ticket_revenue numeric(10,2) not null default 0,
  bar_revenue numeric(10,2) not null default 0,
  door_revenue numeric(10,2) not null default 0,
  other_revenue numeric(10,2) not null default 0,
  -- Costs
  staff_cost numeric(10,2) not null default 0,
  promoter_cost numeric(10,2) not null default 0,
  artist_fee numeric(10,2) not null default 0,
  venue_cost numeric(10,2) not null default 0,
  other_cost numeric(10,2) not null default 0,
  -- Computed (stored for fast queries)
  total_revenue numeric(10,2) generated always as (
    ticket_revenue + bar_revenue + door_revenue + other_revenue
  ) stored,
  total_cost numeric(10,2) generated always as (
    staff_cost + promoter_cost + artist_fee + venue_cost + other_cost
  ) stored,
  net_profit numeric(10,2) generated always as (
    (ticket_revenue + bar_revenue + door_revenue + other_revenue)
    - (staff_cost + promoter_cost + artist_fee + venue_cost + other_cost)
  ) stored,
  -- Meta
  attendance int,
  notes text,
  status text not null default 'draft'
    check (status in ('draft', 'final')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id)
);

alter table event_pnl enable row level security;

create policy "admin manage event_pnl" on event_pnl
  for all using (exists (select 1 from users_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'));

create trigger update_event_pnl_updated_at before update on event_pnl
  for each row execute function update_updated_at_column();
