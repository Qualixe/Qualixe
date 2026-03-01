-- Create user_stats view if it doesn't exist
-- Run this in Supabase SQL Editor

CREATE OR REPLACE VIEW user_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users,
  COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d
FROM user_profiles;

-- Grant access to authenticated users
GRANT SELECT ON user_stats TO authenticated;
