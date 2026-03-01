-- Analytics Schema for Supabase
-- Track page views, visitors, and user behavior

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  os TEXT,
  session_id TEXT,
  visitor_id TEXT, -- unique visitor identifier (cookie-based)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_page_views_device_type ON page_views(device_type);

-- Events Table (for tracking custom events like button clicks, form submissions)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value INTEGER,
  page_path TEXT,
  visitor_id TEXT,
  session_id TEXT,
  metadata JSONB, -- store additional event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON analytics_events(visitor_id);

-- Sessions Table (aggregate session data)
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  page_views_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor_id ON analytics_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);

-- RLS Policies (allow anonymous users to insert, only authenticated admins can read)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert page views
CREATE POLICY "Allow anonymous insert page_views"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all page views
CREATE POLICY "Allow authenticated read page_views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to insert events
CREATE POLICY "Allow anonymous insert analytics_events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all events
CREATE POLICY "Allow authenticated read analytics_events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to insert/update sessions
CREATE POLICY "Allow anonymous insert analytics_sessions"
  ON analytics_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update analytics_sessions"
  ON analytics_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to read all sessions
CREATE POLICY "Allow authenticated read analytics_sessions"
  ON analytics_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to clean old analytics data (optional - run monthly)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Delete page views older than 1 year
  DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete events older than 1 year
  DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete sessions older than 1 year
  DELETE FROM analytics_sessions WHERE started_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for daily stats (makes queries faster)
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as page_views,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(DISTINCT page_path) as unique_pages
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON daily_stats TO authenticated;
