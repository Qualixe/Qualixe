import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Use service role if available, fall back to anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, tagline, description, price, badge, badge_color, preview_url, demo_url, features, active')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Products fetch error:', error.message);
    return NextResponse.json([], { status: 200 }); // return empty array not 500 so UI shows "no products" not broken
  }

  return NextResponse.json(data ?? [], {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
