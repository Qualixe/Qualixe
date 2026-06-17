import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TOKEN_EXPIRY_HOURS = 48;
const DOWNLOAD_LIMIT = 10;

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Verify product is free and active server-side
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, price, active')
      .eq('id', productId)
      .single();

    if (error || !product) {
      console.error('Product lookup error:', error);
      return NextResponse.json({ error: error?.message || 'Product not found' }, { status: 404 });
    }
    if (!product.active) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
    }
    if (Number(product.price) !== 0) {
      return NextResponse.json({ error: 'Product is not free' }, { status: 400 });
    }

    // No email collected — each claim gets its own anonymous order + token.
    const invoiceId = `free_${productId}_${crypto.randomUUID()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        payment_id: invoiceId,
        customer_email: 'anonymous@qualixe.com',
        customer_name: 'Anonymous',
        product_id: product.id,
        product_name: product.name,
        amount: 0,
        currency: 'USD',
        status: 'COMPLETED',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
    }

    // Create download token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase.from('download_tokens').insert({
      token,
      order_id: order.id,
      customer_email: 'anonymous@qualixe.com',
      product_id: product.id,
      expires_at: expiresAt,
      download_limit: DOWNLOAD_LIMIT,
      download_count: 0,
    });

    if (tokenError) {
      console.error('Token insert error:', tokenError);
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    // Increment sales_count (best-effort)
    const { error: salesErr } = await supabase.rpc('increment_sales_count', { product_id: product.id });
    if (salesErr) console.warn('Could not increment sales_count:', salesErr.message);

    return NextResponse.json({ token });
  } catch (err) {
    console.error('claim-free error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
