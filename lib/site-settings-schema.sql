-- =====================================================
-- Site Settings Table
-- Run in Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed by CartContext on the public site)
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Only authenticated admins can write
CREATE POLICY "Authenticated users can upsert site settings" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update site settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Seed default value
INSERT INTO site_settings (key, value)
VALUES ('cart_drawer_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
