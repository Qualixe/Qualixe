-- ============================================================
-- Service page CMS tables — Digital Marketing & UI/UX Design
-- Run this in your Supabase SQL editor
-- ============================================================

-- Digital Marketing page sections
create table if not exists digital_marketing_page (
  id          uuid primary key default gen_random_uuid(),
  section     text unique not null,  -- 'hero' | 'services' | 'process' | 'why_us' | 'faq' | 'cta'
  content     jsonb not null,
  updated_at  timestamptz default now()
);

alter table digital_marketing_page enable row level security;

create policy "Public can read digital marketing page"
  on digital_marketing_page for select using (true);

create policy "Admins can manage digital marketing page"
  on digital_marketing_page for all using (auth.role() = 'authenticated');

-- UI/UX Design page sections
create table if not exists uiux_service_page (
  id          uuid primary key default gen_random_uuid(),
  section     text unique not null,
  content     jsonb not null,
  updated_at  timestamptz default now()
);

alter table uiux_service_page enable row level security;

create policy "Public can read uiux page"
  on uiux_service_page for select using (true);

create policy "Admins can manage uiux page"
  on uiux_service_page for all using (auth.role() = 'authenticated');
