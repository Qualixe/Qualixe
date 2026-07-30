-- =====================================================
-- Speed Audit Requests (lead capture form on /shopify-headless)
-- Run this in your Supabase SQL editor
-- =====================================================

CREATE TABLE IF NOT EXISTS speed_audit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  store_url TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE speed_audit_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public lead capture form)
CREATE POLICY "Anyone can insert speed audit requests" ON speed_audit_requests
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view/update/delete
CREATE POLICY "Authenticated users can view speed audit requests" ON speed_audit_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update speed audit requests" ON speed_audit_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete speed audit requests" ON speed_audit_requests
  FOR DELETE USING (auth.role() = 'authenticated');
