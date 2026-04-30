import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/my-orders?email=user@example.com
// Returns all orders + active download tokens for a given email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Fetch orders for this email
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, payment_id, product_id, product_name, amount, currency, status, created_at')
    .eq('customer_email', email)
    .eq('status', 'COMPLETED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('my-orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  // Fetch download tokens for each order
  const orderIds = orders.map(o => o.id);
  const { data: tokens } = await supabase
    .from('download_tokens')
    .select('order_id, token, download_count, download_limit, expires_at')
    .in('order_id', orderIds);

  // Merge tokens into orders
  const tokenMap: Record<string, any> = {};
  (tokens ?? []).forEach(t => { tokenMap[t.order_id] = t; });

  const result = orders.map(order => ({
    ...order,
    token: tokenMap[order.id] ?? null,
  }));

  return NextResponse.json({ orders: result });
}
