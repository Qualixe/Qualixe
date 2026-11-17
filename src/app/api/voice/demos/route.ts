import { NextResponse } from 'next/server';
import { clientIp, overLimit } from '@/lib/chatServer';
import { searchDemos } from '@/lib/demoCatalog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/voice/demos?q=baby shop&platform=laravel|shopify|any
 * Public (it only returns what's already on the website). Used by the voice
 * assistant's "find_demos" tool to suggest relevant demos to a visitor.
 */
export async function GET(req: Request) {
  if (overLimit(`demos:${clientIp(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const params = new URL(req.url).searchParams;
  const q = (params.get('q') || '').slice(0, 200);
  const p = params.get('platform');
  const platform = p === 'laravel' || p === 'shopify' ? p : 'any';
  try {
    const result = await searchDemos(q, platform);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[voice] demo search failed', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
