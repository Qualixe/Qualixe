-- =====================================================
-- Admin Role Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Make sure user_profiles has the role column (already exists)
-- ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- 2. Set existing admin users by email
--    Replace with your actual admin emails
UPDATE user_profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'qualixe.info@gmail.com',
    'qualixe.hridoy@gmail.com'
  )
);

-- 3. Allow users to read their own role (needed by isAdmin() check)
--    This policy may already exist — use CREATE OR REPLACE pattern
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 4. To grant admin to a new user in the future, run:
--    UPDATE user_profiles SET role = 'admin' WHERE id = '<user-uuid>';
--
-- 5. To revoke admin:
--    UPDATE user_profiles SET role = 'user' WHERE id = '<user-uuid>';
