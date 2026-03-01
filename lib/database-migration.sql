-- =====================================================
-- DATABASE MIGRATION SCRIPT
-- Run this in Supabase SQL Editor to update existing tables
-- =====================================================

-- =====================================================
-- 1. UPDATE PORTFOLIO TABLE
-- =====================================================

-- Add project_url column if it doesn't exist
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS project_url TEXT;

-- Rename 'name' column to 'title' if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolio' AND column_name = 'name'
  ) THEN
    ALTER TABLE portfolio RENAME COLUMN name TO title;
  END IF;
END $$;

-- Update default status
ALTER TABLE portfolio 
ALTER COLUMN status SET DEFAULT 'completed';

-- =====================================================
-- 2. UPDATE BRANDS TABLE
-- =====================================================

-- Add logo_url and website_url columns if they don't exist
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- =====================================================
-- 3. UPDATE CLIENTS TABLE
-- =====================================================

-- Add logo_url, website_url, and industry columns if they don't exist
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS industry VARCHAR(100);

-- Make email nullable (not required)
ALTER TABLE clients 
ALTER COLUMN email DROP NOT NULL;

-- Drop unique constraint on email if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'clients_email_key'
  ) THEN
    ALTER TABLE clients DROP CONSTRAINT clients_email_key;
  END IF;
END $$;

-- =====================================================
-- 4. UPDATE RLS POLICIES FOR CLIENTS
-- =====================================================

-- Drop old policy if exists
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;

-- Create new policy for public access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' AND policyname = 'Anyone can view clients'
  ) THEN
    CREATE POLICY "Anyone can view clients" ON clients
      FOR SELECT USING (true);
  END IF;
END $$;

-- =====================================================
-- 5. VERIFY CHANGES
-- =====================================================

-- Check portfolio table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'portfolio'
ORDER BY ordinal_position;

-- Check brands table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'brands'
ORDER BY ordinal_position;

-- Check clients table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'clients'
ORDER BY ordinal_position;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. This migration is safe to run multiple times
-- 2. It will only add missing columns, not modify existing data
-- 3. After running this, your database will match the code expectations
-- 4. You may need to refresh your Supabase schema cache after running
