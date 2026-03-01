# Quick Setup Instructions

## Database Setup (Required)

Run these SQL files in your Supabase SQL Editor **in this order**:

### 1. Main Database Schema
```sql
-- Run: lib/database.sql
-- Creates: portfolio, brands, clients, themes, contacts tables
```

### 2. Blog System
```sql
-- Run: lib/blog-schema.sql
-- Creates: blog_posts, blog_comments, blog_likes tables
```

### 3. Blog RLS Fix
```sql
-- Run: lib/blog-rls-complete-fix.sql
-- Fixes: Row Level Security policies for blog tables
```

### 4. Analytics System
```sql
-- Run: lib/analytics-schema.sql
-- Creates: page_views, analytics_events, analytics_sessions tables
```

### 5. User Management
```sql
-- Option A: If user_profiles table doesn't exist yet
-- Run: lib/users-schema.sql

-- Option B: If user_profiles table exists but has errors
-- Run: lib/fix-user-profiles.sql
-- This will add missing columns and fix the table structure
```

**OR** if you already ran `lib/users-schema.sql` but missing the view:
```sql
-- Run: lib/create-user-stats-view.sql
-- Creates: user_stats view only
```

## Common Database Errors

### "column email does not exist"
**Solution:** Run `lib/fix-user-profiles.sql` in Supabase SQL Editor
- This adds missing columns to existing user_profiles table
- Safe to run multiple times

### "user_stats view not found"
**Solution:** Run `lib/create-user-stats-view.sql` in Supabase SQL Editor

## Storage Setup (Required)

1. Go to Supabase → Storage
2. Create a bucket named `images`
3. Make it **public**
4. Create these folders inside:
   - `portfolio/`
   - `brands/`
   - `clients/`
   - `themes/`
   - `blog/`

## Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Make Yourself Admin

After signing up, run this SQL:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Start Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Common Issues

### "column email does not exist"
- Run `lib/fix-user-profiles.sql` in Supabase SQL Editor
- This adds all missing columns to user_profiles table

### "user_stats view not found"
- Run `lib/create-user-stats-view.sql` in Supabase SQL Editor

### "Cannot read properties of undefined (reading 'charAt')"
- This is fixed in the latest code
- Make sure you pulled the latest changes

### "Page views not tracking"
- Check that analytics tables exist
- Visit frontend pages (not dashboard)
- Check Supabase → Table Editor → page_views

### "Images not uploading"
- Verify storage bucket `images` exists and is public
- Check folders are created inside the bucket

## Production Deployment

```bash
npm run build
```

If build succeeds, you're ready to deploy to Vercel!
