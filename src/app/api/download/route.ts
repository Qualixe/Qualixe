import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Validate download token
  const { data: record, error: tokenErr } = await supabase
    .from('download_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenErr || !record) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
  if (new Date(record.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 403 });
  }
  if (record.download_count >= record.download_limit) {
    return NextResponse.json({ error: 'Download limit reached' }, { status: 403 });
  }

  // Get product file info
  const { data: product, error: productErr } = await supabase
    .from('products')
    .select('file_path, file_name')
    .eq('id', record.product_id)
    .single();

  if (productErr || !product?.file_path) {
    console.error('Product not found or no file_path:', productErr, record.product_id);
    return NextResponse.json({ error: 'File not available' }, { status: 404 });
  }

  // Download file bytes from private Supabase Storage using service role
  const { data: fileData, error: storageErr } = await supabase
    .storage
    .from('digital-products')
    .download(product.file_path);

  if (storageErr || !fileData) {
    console.error('Storage error:', storageErr?.message, '| path:', product.file_path);
    return NextResponse.json({ error: `Storage error: ${storageErr?.message ?? 'unknown'}` }, { status: 404 });
  }

  // Increment download count
  await supabase
    .from('download_tokens')
    .update({ download_count: record.download_count + 1 })
    .eq('token', token);

  const fileBuffer = Buffer.from(await fileData.arrayBuffer());
  const fileName = product.file_name || 'download.zip';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileBuffer.byteLength.toString(),
      'Cache-Control': 'no-store',
    },
  });
}
