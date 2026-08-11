-- Kader — Add menu_items.created_at for admin ordering
alter table if exists menu_items add column if not exists created_at timestamptz default now();
create index if not exists menu_items_created_at_idx on menu_items (created_at desc);