import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

const WEBHOOK_SECRET  = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
const TOKEN_EXPIRY_HOURS = 48;
const DOWNLOAD_LIMIT     = 10;

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    // Read raw body first — needed for signature verification
    const rawBody = await req.text();

    // Verify Lemon Squeezy signature
    const signature = req.headers.get('x-signature') ?? '';
    if (!WEBHOOK_SECRET) {
      console.error('lemonsqueezy-webhook: LEMONSQUEEZY_WEBHOOK_SECRET not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    const digest = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
    if (digest !== signature) {
      console.warn('lemonsqueezy-webhook: invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;

    // Only process paid orders
    if (eventName !== 'order_created') {
      return NextResponse.json({ message: `Ignored event: ${eventName}` }, { status: 200 });
    }

    const order      = payload.data;
    const attrs      = order?.attributes ?? {};
    const customData = payload.meta?.custom_data ?? {};

    if (attrs.status !== 'paid') {
      console.log('lemonsqueezy-webhook: order not paid, status=', attrs.status);
      return NextResponse.json({ message: 'Order not paid' }, { status: 200 });
    }

    const lsOrderId      = String(order.id);
    const productId      = customData.product_id;
    const customerEmail  = customData.customer_email || attrs.user_email;
    const customerName   = customData.customer_name  || attrs.user_name;
    const productName    = customData.product_name   || '';
    const amount         = (attrs.total ?? 0) / 100;   // LS stores in cents
    const currency       = attrs.currency ?? 'USD';

    if (!productId || !customerEmail) {
      console.error('lemonsqueezy-webhook: missing productId or customerEmail', customData);
      return NextResponse.json({ error: 'Missing product_id or customer_email in custom_data' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Idempotency — skip if order already created
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', lsOrderId)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    // Create order
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
      console.error('lemonsqueezy-webhook: order insert error', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create download token
    const token     = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase.from('download_tokens').insert({
      token,
      order_id:       newOrder.id,
      customer_email: customerEmail,
      product_id:     productId,
      expires_at:     expiresAt,
      download_limit: DOWNLOAD_LIMIT,
      download_count: 0,
    });

    if (tokenError) {
      console.error('lemonsqueezy-webhook: token insert error', tokenError);
      return NextResponse.json({ error: 'Failed to create download token' }, { status: 500 });
    }

    // Increment sales count (best-effort)
    const { error: rpcErr } = await supabase.rpc('increment_sales_count', { product_id: productId });
    if (rpcErr) console.warn('lemonsqueezy-webhook: increment_sales_count failed', rpcErr.message);

    console.log('lemonsqueezy-webhook: processed order', lsOrderId, 'product', productId);
    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (err: any) {
    console.error('lemonsqueezy-webhook error:', err?.message ?? err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
