import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/file-action?action=sign&name=filename.zip&expires=3600
// GET /api/file-action?action=delete&name=filename.zip
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const name = searchParams.get('name');

  if (!name) return NextResponse.json({ error: 'Missing file name' }, { status: 400 });

  const filePath = `products/${name}`;

  if (action === 'sign') {
    const expires = parseInt(searchParams.get('expires') ?? '3600');
    const { data, error } = await supabase.storage
      .from('digital-products')
      .createSignedUrl(filePath, expires);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ url: data.signedUrl });
  }

  if (action === 'delete') {
    const { error } = await supabase.storage
      .from('digital-products')
      .remove([filePath]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
