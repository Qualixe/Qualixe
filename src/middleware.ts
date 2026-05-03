import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_EMAILS = ['qualixe.info@gmail.com', 'qualixe.hridoy@gmail.com','qualixe.maruf@gmail.com'];

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to test login
  return NextResponse.next();
  
  /* COMMENTED OUT FOR TESTING
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Check if trying to access dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If not logged in, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If logged in but not admin email, redirect to home
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If trying to access login and already logged in as admin, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && user?.email && ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
  */
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
