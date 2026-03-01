-- Complete fix for blog RLS policies to allow anonymous comment submission
-- Run this in Supabase SQL Editor

-- ============================================
-- BLOG COMMENTS TABLE
-- ============================================

-- Disable RLS temporarily
ALTER TABLE blog_comments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can view all comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can update comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can delete comments" ON blog_comments;

-- Re-enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow EVERYONE (including anonymous) to view approved comments
CREATE POLICY "allow_public_read_approved" ON blog_comments
  FOR SELECT 
  TO anon, authenticated
  USING (approved = true);

-- Policy 2: Allow authenticated users to view ALL comments (for admin)
CREATE POLICY "allow_authenticated_read_all" ON blog_comments
  FOR SELECT 
  TO authenticated
  USING (true);

-- Policy 3: CRITICAL - Allow ANONYMOUS users to insert comments
CREATE POLICY "allow_anon_insert" ON blog_comments
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 4: Allow authenticated users to update (for approval)
CREATE POLICY "allow_authenticated_update" ON blog_comments
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow authenticated users to delete
CREATE POLICY "allow_authenticated_delete" ON blog_comments
  FOR DELETE 
  TO authenticated
  USING (true);

-- ============================================
-- BLOG LIKES TABLE
-- ============================================

-- Disable RLS temporarily
ALTER TABLE blog_likes DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view likes" ON blog_likes;
DROP POLICY IF EXISTS "Anyone can insert likes" ON blog_likes;
DROP POLICY IF EXISTS "Anyone can delete likes" ON blog_likes;
DROP POLICY IF EXISTS "Anyone can delete their own likes" ON blog_likes;

-- Re-enable RLS
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow everyone to view likes
CREATE POLICY "allow_public_read_likes" ON blog_likes
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Policy 2: Allow everyone to insert likes (with unique constraint preventing duplicates)
CREATE POLICY "allow_public_insert_likes" ON blog_likes
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 3: Allow everyone to delete likes (for unlike functionality)
CREATE POLICY "allow_public_delete_likes" ON blog_likes
  FOR DELETE 
  TO anon, authenticated
  USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that policies are created correctly
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies
WHERE tablename IN ('blog_comments', 'blog_likes')
ORDER BY tablename, policyname;

-- Test that RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables
WHERE tablename IN ('blog_comments', 'blog_likes');
