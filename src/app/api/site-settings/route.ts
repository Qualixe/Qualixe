import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public read — uses anon key (RLS allows SELECT for everyone)
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Write — uses service role (only called from dashboard, server-side)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/site-settings?key=cart_drawer_enabled
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  const supabase = getAnonClient();

  const query = supabase.from('site_settings').select('key, value');
  if (key) query.eq('key', key);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return as flat object: { cart_drawer_enabled: true, ... }
  const result: Record<string, any> = {};
  (data ?? []).forEach((row) => {
    result[row.key] = row.value;
  });

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

// POST /api/site-settings  body: { key, value }
export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
