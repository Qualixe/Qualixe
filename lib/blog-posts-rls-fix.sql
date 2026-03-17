-- Fix RLS policies for blog_posts table
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;

-- Re-enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow everyone (public) to read published posts
CREATE POLICY "allow_public_read_published" ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Allow authenticated users to read ALL posts (for dashboard)
CREATE POLICY "allow_authenticated_read_all" ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anon + authenticated to insert (dashboard may use anon key)
CREATE POLICY "allow_insert" ON blog_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anon + authenticated to update
CREATE POLICY "allow_update" ON blog_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anon + authenticated to delete
CREATE POLICY "allow_delete" ON blog_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);
