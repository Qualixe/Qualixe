-- ============================================================
-- Public read policies for frontend-facing tables
-- Run this in your Supabase SQL editor
-- ============================================================

-- Themes: public can read active themes
create policy "Public can read active themes"
  on themes for select
  using (status = 'active');

-- Portfolio: public can read all portfolio items
create policy "Public can read portfolio"
  on portfolio for select
  using (true);

-- Brands: public can read all brands
create policy "Public can read brands"
  on brands for select
  using (true);

-- Clients: public can read all clients
create policy "Public can read clients"
  on clients for select
  using (true);

-- Orders: authenticated users (admins) can read all orders
create policy "Admins can read orders"
  on orders for select
  using (auth.role() = 'authenticated');

-- Download tokens: authenticated users (admins) can read
create policy "Admins can read download tokens"
  on download_tokens for select
  using (auth.role() = 'authenticated');
