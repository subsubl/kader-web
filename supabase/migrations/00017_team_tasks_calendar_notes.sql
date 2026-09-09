-- Migration 00017: Team Accounts, Calendar Notes, and Internal Tasks (Daily, One-time, Repeating)

-- 1. Calendar Notes Table (date-specific staff notes on calendar)
create table if not exists calendar_notes (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  event_id uuid references events(id) on delete cascade,
  title text not null,
  content text,
  category text not null default 'general'
    check (category in ('general', 'pizzeria', 'club', 'maintenance', 'vip', 'private_event')),
  author_id uuid,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_calendar_notes_date on calendar_notes(date);
create index idx_calendar_notes_event on calendar_notes(event_id);
alter table calendar_notes enable row level security;

create policy "authenticated read calendar_notes" on calendar_notes
  for select to authenticated using (true);
create policy "authenticated insert calendar_notes" on calendar_notes
  for insert to authenticated with check (true);
create policy "authenticated update calendar_notes" on calendar_notes
  for update to authenticated using (true);
create policy "authenticated delete calendar_notes" on calendar_notes
  for delete to authenticated using (true);


-- 2. Team Tasks Table (Admin-managed daily, one-time, and repeating tasks)
create table if not exists team_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'general'
    check (category in ('general', 'bar', 'door', 'kitchen', 'maintenance', 'security')),
  assigned_role text not null default 'all', -- 'all', 'admin', 'manager', 'door', 'bar', 'kitchen'
  assigned_user_id uuid,
  task_type text not null default 'daily'
    check (task_type in ('daily', 'one_time', 'repeating')),
  due_date date, -- required for one_time tasks
  recurrence_days jsonb default '[]'::jsonb, -- e.g. [1, 5, 6] (0=Sun, 1=Mon, ..., 6=Sat) for repeating tasks
  is_active boolean not null default true,
  created_by uuid,
  created_by_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_team_tasks_type on team_tasks(task_type);
create index idx_team_tasks_due on team_tasks(due_date);
create index idx_team_tasks_active on team_tasks(is_active);

alter table team_tasks enable row level security;

create policy "authenticated read team_tasks" on team_tasks
  for select to authenticated using (true);
create policy "admin write team_tasks" on team_tasks
  for all to authenticated using (
    exists (select 1 from users_roles ur where ur.user_id = auth.uid() and ur.role in ('admin', 'manager'))
  );


-- 3. Team Task Completions Table (tracks daily/repeating completion per date)
create table if not exists team_task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references team_tasks(id) on delete cascade not null,
  completion_date date not null,
  completed_by uuid,
  completed_by_name text,
  completed_at timestamptz not null default now(),
  unique(task_id, completion_date)
);

create index idx_task_completions_date on team_task_completions(completion_date);
alter table team_task_completions enable row level security;

create policy "authenticated read task_completions" on team_task_completions
  for select to authenticated using (true);
create policy "authenticated insert task_completions" on team_task_completions
  for insert to authenticated with check (true);
create policy "authenticated delete task_completions" on team_task_completions
  for delete to authenticated using (true);

-- Triggers for updated_at
create trigger update_calendar_notes_updated_at before update on calendar_notes
  for each row execute function update_updated_at_column();
create trigger update_team_tasks_updated_at before update on team_tasks
  for each row execute function update_updated_at_column();
