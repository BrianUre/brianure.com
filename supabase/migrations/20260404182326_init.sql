-- ============================================================
-- admins
-- ============================================================
create table public.admins (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Users can check their own admin status
create policy "admins: self read"
  on public.admins for select
  using (auth.uid() = user_id);

-- Write (insert/delete) is service-role only — no permissive policy = blocked for anon/authed


-- ============================================================
-- availability_schedule
-- ============================================================
create table public.availability_schedule (
  day_of_week smallint primary key check (day_of_week between 0 and 6),
  -- 0 = Monday ... 6 = Sunday
  enabled     boolean  not null default true,
  from_time   time     not null default '11:00',
  to_time     time     not null default '17:00',
  timezone    text     not null default 'America/New_York'
);

alter table public.availability_schedule enable row level security;

-- Public read (booking page needs this to show availability)
create policy "availability: public read"
  on public.availability_schedule for select
  using (true);

-- Admin-only insert (needed because saveAvailability uses upsert,
-- and PostgREST routes upsert through INSERT ... ON CONFLICT).
create policy "availability: admin insert"
  on public.availability_schedule for insert
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- Admin-only update
create policy "availability: admin write"
  on public.availability_schedule for update
  using  (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- Seed default weekly schedule (Mon–Fri enabled, Sat–Sun disabled)
insert into public.availability_schedule (day_of_week, enabled, from_time, to_time)
values
  (0, true,  '11:00', '17:00'), -- Monday
  (1, true,  '11:00', '17:00'), -- Tuesday
  (2, true,  '11:00', '17:00'), -- Wednesday
  (3, true,  '11:00', '17:00'), -- Thursday
  (4, true,  '11:00', '17:00'), -- Friday
  (5, false, '11:00', '17:00'), -- Saturday
  (6, false, '11:00', '17:00'); -- Sunday
