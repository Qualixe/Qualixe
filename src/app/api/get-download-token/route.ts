import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  // Accept both order_id (new LS flow) and invoice_id (legacy param name)
  const orderId = req.nextUrl.searchParams.get('order_id') ?? req.nextUrl.searchParams.get('invoice_id');
  if (!orderId) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });

  const supabase = getServiceClient();

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_id', orderId)
    .single();

  if (!order) return NextResponse.json({ token: null }, { status: 200 });

  const { data: tokenRecord } = await supabase
    .from('download_tokens')
    .select('token')
    .eq('order_id', order.id)
    .single();

  return NextResponse.json({ token: tokenRecord?.token ?? null });
}
