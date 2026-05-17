-- ============================================================
-- Home page CMS table
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists home_page (
  id         uuid primary key default gen_random_uuid(),
  section    text unique not null,  -- 'hero' | 'about' | 'services'
  content    jsonb not null,
  updated_at timestamptz default now()
);

alter table home_page enable row level security;

create policy "Public can read home page"
  on home_page for select using (true);

create policy "Admins can manage home page"
  on home_page for all using (auth.role() = 'authenticated');
