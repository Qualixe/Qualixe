# Qualixe - IT Solutions & Services

A modern Next.js web application with a full-featured admin dashboard for managing portfolio, blog, clients, and analytics.

## Features

### Frontend
- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- 🎯 Portfolio showcase
- 📝 Blog with SEO optimization
- 💬 Comment system with moderation
- 🎨 Theme showcase
- 📧 Contact form
- 🔍 Search functionality

### Admin Dashboard
- 📊 Real-time analytics (Supabase-based)
- 👥 User management with role-based access
- 📁 Portfolio management
- 🏆 Brands & clients management
- 🎨 Theme management
- 📝 Blog post management
- 💬 Comment moderation
- 📧 Contact message inbox
- 📈 Traffic statistics
- 🔐 Secure authentication

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + Custom CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Charts**: Chart.js
- **Icons**: Bootstrap Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd qualixe
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up database

Run these SQL files in your Supabase SQL Editor (in order):
- `lib/database.sql` - Main database schema
- `lib/blog-schema.sql` - Blog system
- `lib/blog-rls-complete-fix.sql` - Blog RLS policies
- `lib/analytics-schema.sql` - Analytics system
- `lib/users-schema.sql` - User management

5. Create Supabase Storage bucket
- Go to Storage in Supabase
- Create a bucket named `images`
- Make it public
- Create folders: `portfolio/`, `brands/`, `clients/`, `themes/`, `blog/`

6. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

### First Time Setup

1. Sign up at `/signup` with your email
2. Go to Supabase → Authentication → Users
3. Find your user and copy the ID
4. Run this SQL to make yourself admin:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Admin Routes

- `/dashboard` - Main dashboard
- `/dashboard/portfolio` - Portfolio management
- `/dashboard/brands` - Brands management
- `/dashboard/clients` - Clients management
- `/dashboard/themes` - Themes management
- `/dashboard/blog` - Blog posts
- `/dashboard/blog/comments` - Comment moderation
- `/dashboard/contacts` - Contact messages
- `/dashboard/analytics` - Website analytics
- `/dashboard/users` - User management
- `/dashboard/settings` - Profile settings

## User Roles

- **Admin**: Full access to all features
- **Editor**: Can manage content, no user management
- **User**: Read-only access

## Database Schema

### Main Tables
- `portfolio` - Portfolio items
- `brands` - Brand logos
- `clients` - Client information
- `themes` - Theme showcase
- `contacts` - Contact form submissions
- `blog_posts` - Blog articles
- `blog_comments` - Blog comments
- `blog_likes` - Blog post likes
- `page_views` - Analytics page views
- `analytics_events` - Custom events
- `user_profiles` - Extended user data

## Analytics

The application includes a custom analytics system built with Supabase:
- Real-time page view tracking
- Unique visitor identification
- Session tracking
- Device, browser, OS detection
- Traffic source analysis
- Privacy-friendly (GDPR compliant)
- No external dependencies

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Project Structure

```
qualixe/
├── src/
│   ├── app/
│   │   ├── (main)/          # Frontend pages
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── components/          # React components
│   └── assets/              # Static assets
├── lib/
│   ├── api/                 # API functions
│   ├── *.sql                # Database schemas
│   ├── auth.ts              # Authentication
│   └── supabaseClient.ts    # Supabase client
├── public/                  # Public assets
└── package.json
```

## Key Features Explained

### Blog System
- SEO-optimized with meta tags
- Like button with IP tracking
- Comment system with moderation
- Social sharing buttons
- View counter
- Category filtering

### Analytics System
- Tracks all frontend pages automatically
- Excludes dashboard/admin pages
- Real-time active users
- Traffic sources breakdown
- Device analytics
- Top pages tracking

### User Management
- Create/edit/delete users
- Role-based access control
- Password reset functionality
- User search and filtering
- Status management (active/inactive/suspended)

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only routes protected
- Secure password hashing
- JWT-based authentication
- CORS configured properly

## Support

For issues or questions:
1. Check Supabase logs
2. Check browser console
3. Verify environment variables
4. Ensure database schemas are applied

## License

Private project - All rights reserved

---

Built with ❤️ by Qualixe Team
