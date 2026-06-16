import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const LS_API_KEY          = process.env.LEMONSQUEEZY_API_KEY!;
const TOKEN_EXPIRY_HOURS  = 48;
const DOWNLOAD_LIMIT      = 10;

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Fallback called by the success page when the webhook hasn't fired yet.
// Looks up the LS order directly and creates the order + download token if paid.
export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();
    if (!order_id) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });

    const supabase = getServiceClient();

    // If webhook already ran — return the existing token
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', String(order_id))
      .single();

    if (existingOrder) {
      const { data: tokenRecord } = await supabase
        .from('download_tokens')
        .select('token')
        .eq('order_id', existingOrder.id)
        .single();
      if (tokenRecord?.token) return NextResponse.json({ token: tokenRecord.token, source: 'existing' });
    }

    // Webhook hasn't run yet — verify directly with Lemon Squeezy
    if (!LS_API_KEY) return NextResponse.json({ pending: true, status: 'api_key_missing' });

    const lsRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${order_id}`, {
      headers: {
        'Authorization': `Bearer ${LS_API_KEY}`,
        'Accept':        'application/vnd.api+json',
      },
    });

    const raw = await lsRes.text();
    let lsData: any;
    try { lsData = JSON.parse(raw); } catch {
      return NextResponse.json({ error: 'LS returned non-JSON' }, { status: 502 });
    }

    if (!lsRes.ok) {
      console.error('verify-payment LS error:', lsRes.status, lsData);
      return NextResponse.json({ pending: true, status: 'ls_error' });
    }

    const attrs      = lsData?.data?.attributes ?? {};
    const customData = lsData?.data?.meta?.custom_data ?? {};

    if (attrs.status !== 'paid') {
      return NextResponse.json({ pending: true, status: attrs.status ?? 'unknown' });
    }

    const lsOrderId     = String(lsData.data.id);
    const productId     = customData.product_id;
    const customerEmail = customData.customer_email || attrs.user_email;
    const customerName  = customData.customer_name  || attrs.user_name;
    const productName   = customData.product_name   || '';
    const amount        = (attrs.total ?? 0) / 100;
    const currency      = attrs.currency ?? 'USD';

    if (!productId || !customerEmail) {
      console.error('verify-payment: missing productId/customerEmail in LS response', customData);
      return NextResponse.json({ error: 'Custom data missing from LS order' }, { status: 500 });
    }

    // Idempotency check (race with webhook)
    const { data: existing2 } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', lsOrderId)
      .single();

    let orderId: string;
    if (existing2) {
      orderId = existing2.id;
    } else {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          payment_id:     lsOrderId,
          customer_email: customerEmail,
          customer_name:  customerName,
          product_id:     productId,
          product_name:   productName,
          amount,
          currency,
          status: 'COMPLETED',
        })
        .select()
        .single();

      if (orderError || !newOrder) {
        console.error('verify-payment order insert error:', orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
      orderId = newOrder.id;
    }

    // Check if token already exists
    const { data: existingToken } = await supabase
      .from('download_tokens')
      .select('token')
      .eq('order_id', orderId)
      .single();

    if (existingToken?.token) {
      return NextResponse.json({ token: existingToken.token, source: 'existing_token' });
    }

    // Create download token
    const token     = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase.from('download_tokens').insert({
      token,
      order_id:       orderId,
      customer_email: customerEmail,
      product_id:     productId,
      expires_at:     expiresAt,
      download_limit: DOWNLOAD_LIMIT,
      download_count: 0,
    });

    if (tokenError) {
      console.error('verify-payment token insert error:', tokenError);
      return NextResponse.json({ error: 'Failed to create download token' }, { status: 500 });
    }

    const { error: rpcErr } = await supabase.rpc('increment_sales_count', { product_id: productId });
    if (rpcErr) console.warn('verify-payment: increment_sales_count failed', rpcErr.message);

    return NextResponse.json({ token, source: 'verified' });
  } catch (err: any) {
    console.error('verify-payment error:', err?.message ?? err);
    return NextResponse.json({ error: `Internal error: ${err?.message ?? 'unknown'}` }, { status: 500 });
  }
}
