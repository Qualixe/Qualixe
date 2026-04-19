import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('products')
    .select('id, name, tagline, description, price, badge, badge_color, preview_url, demo_url, features, active')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json([], { status: 500 });

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
