# Blog System Guide

## Overview
A complete SEO-friendly blog system with like buttons, comments, and admin management.

## Features

### Frontend Features
- **Blog Listing Page** (`/blog`)
  - Grid layout with featured images
  - Search functionality
  - Category filtering
  - View counts and like counts
  - Responsive design

- **Single Blog Post** (`/blog/[slug]`)
  - SEO optimized with meta tags
  - Like button (IP-based tracking)
  - Comments system with moderation
  - Social sharing (Twitter, Facebook, LinkedIn)
  - Related post suggestions
  - Breadcrumb navigation
  - View counter

### Admin Features
- **Blog Management Dashboard** (`/dashboard/blog`)
  - Create, edit, delete posts
  - Image upload for featured images
  - Rich text content editor
  - SEO meta fields
  - Publish/draft status
  - Category and tags management
  - View and like statistics

### SEO Features
- Meta title, description, keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs
- Semantic HTML structure
- Alt tags for images
- Structured breadcrumbs

## Database Setup

### 1. Run the SQL Schema

Execute the SQL file to create all necessary tables:

```bash
# In Supabase SQL Editor, run:
lib/blog-schema.sql
```

This creates:
- `blog_posts` - Blog post content and metadata
- `blog_comments` - User comments
- `blog_likes` - Like tracking by IP
- Indexes for performance
- RLS policies for security

### 2. Fix RLS Policies (If Needed)

If you get "row-level security policy" errors, run this fix:

```bash
# In Supabase SQL Editor, run:
lib/blog-rls-fix.sql
```

This ensures public users can submit comments and likes.

### 3. Create Storage Bucket

In Supabase Storage, create a folder named `blog` inside your `images` bucket:
- Bucket: `images`
- Folder: `blog/`

### 4. Add View Counter Function

Run this SQL to create the view increment function:

```sql
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Usage

### Creating a Blog Post

1. Go to Dashboard → Blog
2. Click "Add New Post"
3. Fill in the form:
   - **Title**: Post title (required)
   - **Slug**: URL-friendly version (auto-generated if empty)
   - **Excerpt**: Short summary for listing page
   - **Content**: Full post content (supports HTML)
   - **Featured Image**: Upload an image
   - **Category**: Post category
   - **Tags**: Comma-separated tags
   - **SEO Fields**: Meta title, description, keywords
   - **Published**: Check to publish immediately

4. Click "Create Post"

### Managing Comments

Comments are submitted by visitors but require approval:

1. Comments are stored with `approved = false` by default
2. Admin can approve comments in the database or create a comments management page
3. Only approved comments appear on the frontend

### Like System

- Uses IP address to track likes (prevents duplicate likes)
- Users can like/unlike posts
- Like count updates in real-time
- Stored in `blog_likes` table with unique constraint

## File Structure

```
src/app/(main)/blog/
├── page.tsx              # Blog listing page
├── blog.css              # Blog listing styles
└── [slug]/
    ├── page.tsx          # Single post page
    └── post.css          # Single post styles

src/app/dashboard/blog/
└── page.tsx              # Admin blog management

lib/
├── blog-schema.sql       # Database schema
└── api/
    └── blog.ts           # Blog API functions
```

## API Functions

### Blog Posts API (`blogAPI`)

```typescript
// Get all published posts
await blogAPI.getAllPublished();

// Get all posts (admin)
await blogAPI.getAll();

// Get post by slug
await blogAPI.getBySlug('my-post-slug');

// Create post
await blogAPI.create(postData);

// Update post
await blogAPI.update(postId, postData);

// Delete post
await blogAPI.delete(postId);

// Search posts
await blogAPI.search('keyword');

// Get by category
await blogAPI.getByCategory('tutorials');
```

### Comments API (`blogCommentsAPI`)

```typescript
// Get approved comments for a post
await blogCommentsAPI.getByPostId(postId);

// Create comment
await blogCommentsAPI.create(commentData);

// Approve comment
await blogCommentsAPI.approve(commentId);

// Delete comment
await blogCommentsAPI.delete(commentId);
```

### Likes API (`blogLikesAPI`)

```typescript
// Check if user liked
await blogLikesAPI.hasLiked(postId, userIp);

// Like post
await blogLikesAPI.like(postId, userIp);

// Unlike post
await blogLikesAPI.unlike(postId, userIp);
```

## SEO Best Practices

### Meta Tags
Every blog post includes:
- Title tag (60 characters max)
- Meta description (160 characters max)
- Meta keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URL

### Content Structure
- Semantic HTML (article, header, section)
- Proper heading hierarchy (h1, h2, h3)
- Alt text for images
- Internal linking with breadcrumbs
- Clean, readable URLs (slugs)

### Performance
- Lazy loading images
- Optimized database queries with indexes
- Caching strategies (can be added)
- Responsive images

## Customization

### Styling
Edit the CSS files to match your brand:
- `blog.css` - Listing page styles
- `post.css` - Single post styles

### Content Editor
Currently uses a textarea. You can integrate:
- TinyMCE
- CKEditor
- Quill
- Markdown editor

### Comment Moderation
Create a comments management page:
```typescript
// Get all comments (including unapproved)
const comments = await blogCommentsAPI.getAll();

// Approve comment
await blogCommentsAPI.approve(commentId);
```

### Categories and Tags
Add category/tag management:
- Create separate tables for categories/tags
- Add relationships
- Create category/tag pages

## Security

### Row Level Security (RLS)
- Public can read published posts
- Public can read approved comments
- Public can submit comments (pending approval)
- Only authenticated users can manage posts
- IP-based like tracking prevents spam

### Content Sanitization
- Sanitize HTML content before rendering
- Validate user inputs
- Use parameterized queries (Supabase handles this)

## Future Enhancements

1. **Rich Text Editor**: Replace textarea with WYSIWYG editor
2. **Comment Moderation Dashboard**: Admin page to approve/reject comments
3. **Related Posts**: Show similar posts based on tags/category
4. **Reading Time**: Calculate and display estimated reading time
5. **Author Profiles**: Multiple authors with profiles
6. **Newsletter Integration**: Subscribe to blog updates
7. **RSS Feed**: Generate RSS feed for subscribers
8. **Analytics**: Track popular posts, user engagement
9. **Draft Preview**: Preview posts before publishing
10. **Scheduled Publishing**: Schedule posts for future dates

## Troubleshooting

### Posts not showing
- Check `published = true` in database
- Verify RLS policies are enabled
- Check Supabase connection

### Images not uploading
- Verify storage bucket exists
- Check bucket permissions
- Ensure `blog/` folder exists

### Comments not appearing
- Comments need `approved = true`
- Check RLS policies (run `blog-rls-fix.sql` if needed)
- Verify post_id is correct

### "Row-level security policy" error
- Run `lib/blog-rls-fix.sql` in Supabase SQL Editor
- This fixes policies to allow public comment/like submission
- Verify RLS is enabled on tables

### Likes not working
- Check IP detection is working
- Verify unique constraint on blog_likes
- Check RLS policies

## Testing

### Test Blog Post Creation
1. Create a test post in dashboard
2. Set published = true
3. Visit `/blog` to see it listed
4. Click to view single post

### Test Comments
1. Submit a comment on a post
2. Check database - should be `approved = false`
3. Manually set `approved = true`
4. Refresh page - comment should appear

### Test Likes
1. Click like button on a post
2. Check database - entry in blog_likes
3. Click unlike - entry should be removed
4. Try liking from different IP - should work

## Production Checklist

- [ ] Run database schema in production
- [ ] Create storage bucket and folders
- [ ] Set up proper RLS policies
- [ ] Configure environment variables
- [ ] Test all CRUD operations
- [ ] Test comment submission and approval
- [ ] Test like/unlike functionality
- [ ] Verify SEO meta tags
- [ ] Test social sharing links
- [ ] Check mobile responsiveness
- [ ] Set up comment moderation workflow
- [ ] Add sitemap generation
- [ ] Configure caching if needed
- [ ] Set up analytics tracking
