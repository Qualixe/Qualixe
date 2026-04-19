-- ============================================================
-- Shop: Orders & Download Tokens
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  payment_id  text unique not null,          -- Uddokta invoice_id
  customer_email text not null,
  customer_name  text not null,
  product_id     text not null,
  product_name   text not null,
  amount         numeric(10,2) not null,
  currency       text not null default 'USD',
  status         text not null default 'COMPLETED',
  created_at     timestamptz default now()
);

create table if not exists download_tokens (
  id              uuid primary key default gen_random_uuid(),
  token           uuid unique not null default gen_random_uuid(),
  order_id        uuid not null references orders(id) on delete cascade,
  customer_email  text not null,
  product_id      text not null,
  expires_at      timestamptz not null,
  download_limit  int not null default 3,
  download_count  int not null default 0,
  created_at      timestamptz default now()
);

-- Indexes
create index if not exists idx_orders_payment_id on orders(payment_id);
create index if not exists idx_download_tokens_token on download_tokens(token);
create index if not exists idx_download_tokens_order_id on download_tokens(order_id);

-- RLS: these tables are only accessed server-side via service role key
-- so we disable RLS or restrict to service role only
alter table orders enable row level security;
alter table download_tokens enable row level security;

-- No public access — service role bypasses RLS automatically

-- ============================================================
-- Products table (managed from dashboard)
-- ============================================================

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  tagline      text not null default '',
  description  text not null default '',
  price        numeric(10,2) not null,
  badge        text,
  badge_color  text default '#0d6efd',
  file_path    text not null,   -- path in Supabase storage bucket "digital-products"
  file_name    text not null,
  file_size    bigint not null default 0,
  active       boolean not null default true,
  sales_count  int not null default 0,
  created_at   timestamptz default now()
);

-- RLS: allow authenticated users (admins) to manage products
alter table products enable row level security;

create policy "Admins can manage products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Public can read active products"
  on products for select
  using (active = true);

-- ============================================================
-- Supabase Storage: create a bucket named "digital-products"
-- Set it to PRIVATE (not public) in the Supabase dashboard.
-- Files are served only via signed URLs from the download API.
-- ============================================================

-- ============================================================
-- Add preview_url and features to products table
-- Run this if the products table already exists
-- ============================================================
alter table products
  add column if not exists preview_url  text,
  add column if not exists features     text[] not null default '{}';

-- ============================================================
-- Add demo_url to products table
-- Run this if the products table already exists
-- ============================================================
alter table products
  add column if not exists demo_url text;
