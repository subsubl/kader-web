-- QR Table Ordering: orders placed via phone at the table
-- Kader Grad Kodeljevo

create table if not exists table_orders (
  id uuid primary key default gen_random_uuid(),
  table_number int not null check (table_number >= 1 and table_number <= 50),
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending','preparing','ready','served','cancelled')),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_table_orders_status on table_orders(status);
create index if not exists idx_table_orders_created on table_orders(created_at desc);

alter table table_orders enable row level security;

-- Public can insert (place orders); admin full access
create policy "public insert table_orders" on table_orders
  for insert to anon, authenticated with check (true);

create policy "admin manage table_orders" on table_orders
  for all using (exists (select 1 from users_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'));

create trigger update_table_orders_updated_at before update on table_orders
  for each row execute function update_updated_at_column();
