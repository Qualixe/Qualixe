# Admin Access Control

## Overview
The dashboard is now restricted to a single admin email address. Only the authorized admin can access the dashboard and perform CRUD operations.

## Admin Email
**Authorized Admin:** `qualixe.info@gmail.com`

## Security Features

### 1. Middleware Protection
- **File:** `src/middleware.ts`
- Checks every request to `/dashboard/*` routes
- Verifies user is logged in
- Verifies user email matches admin email
- Redirects unauthorized users to home page

### 2. Login Page Validation
- **File:** `src/app/login/page.tsx`
- After successful login, checks if email is admin
- Admin users → redirected to dashboard
- Non-admin users → signed out and redirected to home
- Shows error message: "Access denied. This dashboard is for administrators only."

### 3. Signup Restriction
- **File:** `src/app/signup/page.tsx`
- Only allows signup with admin email
- Shows error for other emails: "Signup is restricted. Please contact the administrator."
- Prevents unauthorized account creation

## How It Works

### For Admin User (qualixe.info@gmail.com):
1. ✅ Can signup with this email
2. ✅ Can login successfully
3. ✅ Gets redirected to dashboard
4. ✅ Can access all dashboard pages
5. ✅ Can perform all CRUD operations

### For Other Users:
1. ❌ Cannot signup (shows error message)
2. ❌ Can login but immediately signed out
3. ❌ Redirected to home page
4. ❌ Cannot access dashboard routes
5. ❌ Shows "Access denied" message

## Access Flow

```
User tries to access /dashboard
         ↓
Middleware checks authentication
         ↓
Is user logged in?
    ↓ No → Redirect to /login
    ↓ Yes
         ↓
Is email = qualixe.info@gmail.com?
    ↓ No → Redirect to / (home)
    ↓ Yes → Allow access to dashboard
```

## Protected Routes

All these routes are protected:
- `/dashboard`
- `/dashboard/portfolio`
- `/dashboard/brands`
- `/dashboard/clients`
- `/dashboard/themes`
- `/dashboard/contacts`
- `/dashboard/settings`
- `/dashboard/*` (any dashboard sub-route)

## Changing Admin Email

To change the admin email:

1. **Update Middleware** (`src/middleware.ts`):
   ```typescript
   const ADMIN_EMAIL = 'your-new-email@example.com';
   ```

2. **Update Login Page** (`src/app/login/page.tsx`):
   ```typescript
   if (data.user?.email === 'your-new-email@example.com') {
   ```

3. **Update Signup Page** (`src/app/signup/page.tsx`):
   ```typescript
   if (formData.email !== 'your-new-email@example.com') {
   ```

## Multiple Admins (Optional)

To allow multiple admin emails, change the check to use an array:

```typescript
// In middleware.ts
const ADMIN_EMAILS = [
  'qualixe.info@gmail.com',
  'admin2@example.com',
  'admin3@example.com'
];

// Change the check to:
if (!ADMIN_EMAILS.includes(user.email)) {
  return NextResponse.redirect(new URL('/', request.url));
}
```

## Testing

### Test Admin Access:
1. Login with `qualixe.info@gmail.com`
2. Should redirect to dashboard
3. Can access all pages
4. Can perform CRUD operations

### Test Non-Admin Access:
1. Try to signup with different email
2. Should show "Signup is restricted" error
3. If you login with different email (if account exists)
4. Should show "Access denied" and redirect to home
5. Try to access `/dashboard` directly
6. Should redirect to home page

## Security Notes

- ✅ Server-side protection via middleware
- ✅ Client-side validation in login/signup
- ✅ Automatic sign-out for unauthorized users
- ✅ All dashboard routes protected
- ✅ No way to bypass restrictions

## Troubleshooting

### "Access denied" but I'm using the admin email?
- Check for typos in email
- Verify email in Supabase Auth dashboard
- Clear browser cookies and try again
- Check middleware is running (restart dev server)

### Can't signup with admin email?
- Check if account already exists
- Try password reset instead
- Verify email is exactly: `qualixe.info@gmail.com`

### Middleware not working?
- Restart your development server
- Check `.env.local` has correct Supabase credentials
- Verify middleware.ts has no syntax errors

## Environment Variables

Make sure these are set in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Security

The middleware protects routes, but also ensure:
1. RLS policies are enabled on all tables
2. Only authenticated users can INSERT/UPDATE/DELETE
3. Public can only SELECT (read) public data like themes, portfolio

This provides defense in depth - even if someone bypasses the middleware, they can't modify data without proper authentication.
