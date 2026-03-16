-- Run this in Supabase SQL editor to add new contact fields
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS theme VARCHAR(255),
  ADD COLUMN IF NOT EXISTS budget VARCHAR(100),
  ADD COLUMN IF NOT EXISTS meeting_time VARCHAR(100);
