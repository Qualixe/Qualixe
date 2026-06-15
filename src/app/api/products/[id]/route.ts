import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { matchesSlug } from '@/lib/slugify';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, tagline, description, price, badge, badge_color, preview_url, demo_url, features, active, file_path, buy_link')
    .eq('active', true);

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Match by slug derived from name, fall back to exact UUID match
  const product =
    data.find(p => matchesSlug(p.name, slug)) ??
    data.find(p => p.id === slug);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(product, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
