-- Staff Scheduling: shifts, templates, assignments
-- Kader Grad Kodeljevo

-- Roles for staffing (extendable) — PG has no CREATE TYPE IF NOT EXISTS; guard manually
do $$
begin
  create type staff_role as enum ('bar', 'door', 'kitchen', 'floor', 'manager', 'security', 'cleanup');
exception
  when duplicate_object then null;
end $$;

-- Shared updated_at helper (created here once; safe to re-run)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Shift templates (recurring patterns, e.g. "Fri club night bar shift")
create table if not exists shift_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  day_of_week int not null check (day_of_week >= 0 and day_of_week <= 6), -- 0=Sun
  start_time time not null,
  end_time time not null,
  role staff_role not null,
  required_count int not null default 1,
  location text, -- e.g. "basement", "floor", "garden"
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Concrete shifts (instances for specific dates)
create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references shift_templates(id) on delete set null,
  date date not null,
  start_time time not null,
  end_time time not null,
  role staff_role not null,
  required_count int not null default 1,
  location text,
  status text not null default 'open' check (status in ('open','filled','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, start_time, end_time, role, location)
);

-- Staff assignments (who works which shift)
create table if not exists shift_assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references shifts(id) on delete cascade,
  user_id uuid not null, -- auth.users
  user_name text not null,
  user_email text not null,
  assigned_at timestamptz not null default now(),
  status text not null default 'confirmed' check (status in ('confirmed','pending','declined')),
  unique (shift_id, user_id)
);

-- Indexes
create index if not exists idx_shifts_date on shifts(date);
create index if not exists idx_shifts_role on shifts(role);
create index if not exists idx_shift_assignments_user on shift_assignments(user_id);
create index if not exists idx_shift_assignments_shift on shift_assignments(shift_id);

-- RLS: admins manage templates/shifts; staff can view their assignments
alter table shift_templates enable row level security;
alter table shifts enable row level security;
alter table shift_assignments enable row level security;

-- Admins: full access
create policy "admin manage shift_templates" on shift_templates
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
create policy "admin manage shifts" on shifts
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));
create policy "admin manage shift_assignments" on shift_assignments
  for all using (exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- Staff: view their own assignments
create policy "staff view own assignments" on shift_assignments
  for select using (user_id = auth.uid());

-- Staff: view shifts they're assigned to
create policy "staff view assigned shifts" on shifts
  for select using (exists (
    select 1 from shift_assignments sa 
    where sa.shift_id = shifts.id and sa.user_id = auth.uid()
  ));

-- Trigger for updated_at
create trigger update_shift_templates_updated_at before update on shift_templates
  for each row execute function update_updated_at_column();
create trigger update_shifts_updated_at before update on shifts
  for each row execute function update_updated_at_column();

-- Seed default shift templates for Kader
insert into shift_templates (name, description, day_of_week, start_time, end_time, role, required_count, location) values
  ('Friday Club Bar', 'Friday night club bar shift', 5, '21:00', '04:00', 'bar', 2, 'floor'),
  ('Friday Club Door', 'Friday night door/security', 5, '20:30', '04:30', 'door', 2, 'entrance'),
  ('Friday Club Floor', 'Friday night floor staff', 5, '21:00', '04:00', 'floor', 2, 'floor'),
  ('Saturday Club Bar', 'Saturday night club bar shift', 6, '21:00', '04:00', 'bar', 2, 'floor'),
  ('Saturday Club Door', 'Saturday night door/security', 6, '20:30', '04:30', 'door', 2, 'entrance'),
  ('Saturday Club Floor', 'Saturday night floor staff', 6, '21:00', '04:00', 'floor', 2, 'floor'),
  ('Sunday Brunch Kitchen', 'Sunday kitchen prep + service', 0, '10:00', '16:00', 'kitchen', 3, 'kitchen'),
  ('Sunday Brunch Floor', 'Sunday floor service', 0, '11:00', '17:00', 'floor', 2, 'garden'),
  ('Weekday Pizzeria Kitchen', 'Mon-Thu kitchen', 1, '11:00', '22:00', 'kitchen', 2, 'kitchen'),
  ('Weekday Pizzeria Kitchen', 'Tue kitchen', 2, '11:00', '22:00', 'kitchen', 2, 'kitchen'),
  ('Weekday Pizzeria Kitchen', 'Wed kitchen', 3, '11:00', '22:00', 'kitchen', 2, 'kitchen'),
  ('Weekday Pizzeria Kitchen', 'Thu kitchen', 4, '11:00', '22:00', 'kitchen', 2, 'kitchen'),
  ('Weekday Pizzeria Floor', 'Mon-Thu floor', 1, '11:00', '22:00', 'floor', 2, 'garden'),
  ('Weekday Pizzeria Floor', 'Tue floor', 2, '11:00', '22:00', 'floor', 2, 'garden'),
  ('Weekday Pizzeria Floor', 'Wed floor', 3, '11:00', '22:00', 'floor', 2, 'garden'),
  ('Weekday Pizzeria Floor', 'Thu floor', 4, '11:00', '22:00', 'floor', 2, 'garden')
on conflict do nothing;