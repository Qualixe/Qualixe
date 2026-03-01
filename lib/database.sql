-- =====================================================
-- Qualixe Database Schema
-- Complete SQL for Supabase
-- =====================================================

-- =====================================================
-- 1. CONTACTS TABLE (Already exists from contact form)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  company_name VARCHAR(255),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PORTFOLIO TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  client VARCHAR(255),
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. BRANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  industry VARCHAR(100),
  projects_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  since_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CLIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  email VARCHAR(255),
  industry VARCHAR(100),
  projects_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. THEMES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  features JSONB,
  demo_url TEXT,
  version VARCHAR(50),
  store_url TEXT,
  status VARCHAR(50) DEFAULT 'live',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. USER PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR CONTACTS
-- =====================================================
-- Allow anyone to insert contacts (public contact form)
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view contacts
CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update contacts
CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete contacts
CREATE POLICY "Authenticated users can delete contacts" ON contacts
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR PORTFOLIO
-- =====================================================
-- Public can view portfolio (for frontend display)
CREATE POLICY "Anyone can view portfolio" ON portfolio
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert portfolio" ON portfolio
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update portfolio" ON portfolio
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete portfolio" ON portfolio
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR BRANDS
-- =====================================================
-- Public can view brands
CREATE POLICY "Anyone can view brands" ON brands
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert brands" ON brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update brands" ON brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete brands" ON brands
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR CLIENTS
-- =====================================================
-- Public can view clients (for frontend display)
CREATE POLICY "Anyone can view clients" ON clients
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR THEMES
-- =====================================================
-- Public can view themes (for frontend themes page)
CREATE POLICY "Anyone can view themes" ON themes
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert themes" ON themes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update themes" ON themes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete themes" ON themes
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR USER PROFILES
-- =====================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_themes_category ON themes(category);
CREATE INDEX IF NOT EXISTS idx_themes_status ON themes(status);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Portfolio Data
INSERT INTO portfolio (title, category, client, description, image_url, project_url, status) VALUES
('EcoFusion E-commerce', 'Web Development', 'EcoFusion Ltd.', 'Modern e-commerce platform for sustainable products', '/assets/img/portfolio-flemi.jpg', 'https://ecofusion.com', 'completed'),
('UrbanGear Mobile App', 'Mobile App', 'UrbanGear Inc.', 'Fashion mobile application', '/assets/img/portfolio-htbazar.jpg', 'https://urbangear.com', 'in progress'),
('Minimal Home Website', 'Web Design', 'Minimal Home', 'Clean home decor website', '/assets/img/portfolio-maralab.jpg', 'https://minimalhome.com', 'completed');

-- Sample Brands Data
INSERT INTO brands (name, logo_url, website_url, industry, projects_count, status, since_year) VALUES
('Crimson Cup', '/assets/img/crimsonCup1.png', 'https://crimsoncupbangladesh.com/', 'Food & Beverage', 3, 'active', 2024),
('Glenari', '/assets/img/glenari.png', 'https://www.glenari.com/', 'Fashion', 2, 'active', 2025),
('Jotey', '/assets/img/jotey.svg', 'https://www.jotey.com.bd', 'E-commerce', 4, 'active', 2023),
('Nilima', '/assets/img/nilima.svg', 'https://nilima.com.bd', 'Fashion', 2, 'active', 2024);

-- Sample Clients Data
INSERT INTO clients (name, logo_url, website_url, email, industry, projects_count, status, joined_date) VALUES
('Jotey', '/assets/img/jotey.svg', 'https://www.jotey.com.bd', 'contact@jotey.com.bd', 'E-commerce', 5, 'active', '2024-01-15'),
('Nilima', '/assets/img/nilima.svg', 'https://nilima.com.bd', 'info@nilima.com.bd', 'Fashion', 3, 'active', '2024-03-20'),
('Zuqo', '/assets/img/zuqo.webp', 'https://zuqo.shop', 'hello@zuqo.shop', 'E-commerce', 4, 'active', '2024-06-10'),
('Mara-Lab', '/assets/img/maralab.webp', 'https://mara-labs.com', 'support@mara-labs.com', 'Health', 2, 'active', '2025-02-15');

-- Sample Themes Data
INSERT INTO themes (name, category, description, image_url, price, rating, reviews_count, features, demo_url, version, status) VALUES
('EcoFusion', 'E-commerce', 'Modern and eco-friendly Shopify theme perfect for sustainable brands', '/assets/img/portfolio-flemi.jpg', 299.00, 4.9, 127, '["Responsive Design", "Fast Loading", "SEO Optimized", "Customizable"]'::jsonb, 'https://ecofusion-demo.qualixe.com', 'v2.1.3', 'live'),
('UrbanGear', 'Fashion', 'Bold and stylish theme designed for urban fashion stores', '/assets/img/portfolio-htbazar.jpg', 349.00, 4.8, 98, '["Mobile First", "Product Filters", "Quick View", "Wishlist"]'::jsonb, 'https://urbangear-demo.qualixe.com', 'v1.8.0', 'live'),
('Minimal Home', 'Home & Living', 'Clean and minimalist theme for home decor and furniture stores', '/assets/img/portfolio-maralab.jpg', 279.00, 4.7, 156, '["Clean Layout", "Gallery Mode", "Blog Ready", "Multi-currency"]'::jsonb, 'https://minimalhome-demo.qualixe.com', 'v3.0.1', 'live');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Make sure to enable Email authentication in Supabase Auth settings
-- 3. Configure OAuth providers (Google, GitHub) if needed
-- 4. Set up your environment variables:
--    NEXT_PUBLIC_SUPABASE_URL
--    NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 5. The sample data is optional and can be removed if not needed
