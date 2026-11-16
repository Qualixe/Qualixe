-- =====================================================
-- Laravel Projects (showcase / case studies)
-- Run this in your Supabase SQL Editor.
-- Depends on: update_updated_at_column() (database.sql / blog-schema.sql)
--             user_profiles (users-schema.sql)
-- =====================================================

CREATE TABLE IF NOT EXISTS laravel_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  client_name VARCHAR(255),
  category VARCHAR(120),                 -- e.g. SaaS, ERP, E-commerce, CRM
  industry VARCHAR(120),                 -- e.g. Healthcare, Logistics
  short_description TEXT,                -- one-line summary for cards
  description TEXT,                      -- long overview (paragraphs separated by blank lines)
  challenge TEXT,
  solution TEXT,
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',        -- e.g. Laravel 11, Livewire, MySQL, Redis
  features TEXT[] DEFAULT '{}',
  results JSONB DEFAULT '[]'::jsonb,     -- [{ "value": "3x", "label": "Faster checkout" }]
  live_url TEXT,
  year VARCHAR(10),
  duration VARCHAR(60),                  -- e.g. "12 weeks"
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published', -- published | draft
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE laravel_projects ENABLE ROW LEVEL SECURITY;

-- Public: only published projects are readable
CREATE POLICY "Public can view published laravel projects" ON laravel_projects
  FOR SELECT USING (status = 'published');

-- Admins: full access (including drafts)
CREATE POLICY "Admins can view all laravel projects" ON laravel_projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert laravel projects" ON laravel_projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update laravel projects" ON laravel_projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete laravel projects" ON laravel_projects
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER update_laravel_projects_updated_at
  BEFORE UPDATE ON laravel_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_laravel_projects_status ON laravel_projects(status);
CREATE INDEX IF NOT EXISTS idx_laravel_projects_sort_order ON laravel_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_laravel_projects_slug ON laravel_projects(slug);
