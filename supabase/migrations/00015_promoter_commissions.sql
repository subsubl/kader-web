-- Promoter Performance & Commission Tracking
-- Kader Grad Kodeljevo

-- Commission config per event (optional override; falls back to site default €2/checkin)
create table if not exists promoter_commission_rates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  rate_per_checkin numeric(10,2) not null default 2.00,
  rate_type text not null default 'per_checkin'
    check (rate_type in ('per_checkin', 'percentage')),
  created_at timestamptz not null default now(),
  unique (event_id)
);

-- Promoter payout ledger (generated on demand, exportable)
create table if not exists promoter_payouts (
  id uuid primary key default gen_random_uuid(),
  promoter_id uuid not null,
  promoter_name text not null,
  event_id uuid references events(id) on delete set null,
  event_label text,
  verified_checkins int not null default 0,
  commission_rate numeric(10,2) not null,
  total_payout numeric(10,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid')),
  period_start date,
  period_end date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_payouts_promoter on promoter_payouts(promoter_id);
create index if not exists idx_payouts_event on promoter_payouts(event_id);

alter table promoter_commission_rates enable row level security;
alter table promoter_payouts enable row level security;

create policy "admin manage commission_rates" on promoter_commission_rates
  for all using (exists (select 1 from users_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'));

create policy "admin manage payouts" on promoter_payouts
  for all using (exists (select 1 from users_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'));
