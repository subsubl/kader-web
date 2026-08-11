-- Kader — site settings (editable content via admin)
-- Stores the pizzeria menu image (must be an image by design) + optional branding overrides.
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

-- Anyone can read settings (public site needs the menu image)
create policy "public read settings" on site_settings
  for select using (true);

-- Only authenticated staff can change settings
create policy "staff write settings" on site_settings
  for insert with check (auth.uid() is not null);
create policy "staff update settings" on site_settings
  for update using (auth.uid() is not null) with check (auth.uid() is not null);