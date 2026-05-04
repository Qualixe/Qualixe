-- =====================================================
-- Admin Role Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Insert or update admin role for all admin users
-- This handles both new and existing accounts
INSERT INTO user_profiles (id, full_name, role)
SELECT 
  id,
  raw_user_meta_data->>'full_name',
  'admin'
FROM auth.users
WHERE email IN (
  'qualixe.info@gmail.com',
  'qualixe.hridoy@gmail.com',
  'qualixe.maruf@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify — should show role = 'admin' for all three
SELECT u.email, p.role, p.full_name
FROM auth.users u
JOIN user_profiles p ON p.id = u.id
WHERE u.email IN (
  'qualixe.info@gmail.com',
  'qualixe.hridoy@gmail.com',
  'qualixe.maruf@gmail.com'
);

-- =====================================================
-- To add a new admin in the future:
-- UPDATE user_profiles SET role = 'admin' WHERE id = '<user-uuid>';
--
-- To revoke admin:
-- UPDATE user_profiles SET role = 'user' WHERE id = '<user-uuid>';
-- =====================================================
