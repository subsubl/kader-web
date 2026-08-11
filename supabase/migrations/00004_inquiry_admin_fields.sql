-- Kader — Add inquiries.created_at for CRM ordering
alter table if exists inquiries add column if not exists created_at timestamptz default now();
create index if not exists inquiries_created_at_idx on inquiries (created_at desc);