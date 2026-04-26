import { NextResponse } from 'next/server';

// TEMPORARY debug endpoint — DELETE after fixing
// Visit: https://your-domain.com/api/debug-env
export async function GET() {
  return NextResponse.json({
    UDDOKTA_API_KEY:        process.env.UDDOKTA_API_KEY        ? `set (${process.env.UDDOKTA_API_KEY.slice(0, 6)}...)` : 'MISSING',
    UDDOKTA_API_URL:        process.env.UDDOKTA_API_URL        ?? 'MISSING',
    UDDOKTA_VERIFY_URL:     process.env.UDDOKTA_VERIFY_URL     ?? 'MISSING',
    NEXT_PUBLIC_BASE_URL:   process.env.NEXT_PUBLIC_BASE_URL   ?? 'MISSING',
    SUPABASE_SERVICE_ROLE:  process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING',
    VERCEL_URL:             process.env.VERCEL_URL             ?? 'MISSING',
    NODE_ENV:               process.env.NODE_ENV,
  });
}
