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
    const { name, email, productId } = await req.json();

    if (!name || !email || !productId) {
      return NextResponse.json({ error: 'name, email and productId are required' }, { status: 400 });
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

    const invoiceId = `free_${productId}_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Idempotency — return existing token if already claimed
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', invoiceId)
      .single();

    if (existingOrder) {
      const { data: existingToken } = await supabase
        .from('download_tokens')
        .select('token, download_count, download_limit')
        .eq('order_id', existingOrder.id)
        .single();
      if (existingToken) {
        // Reset if limit was previously hit so user can re-download
        if (existingToken.download_count >= existingToken.download_limit) {
          await supabase
            .from('download_tokens')
            .update({ download_count: 0, download_limit: DOWNLOAD_LIMIT })
            .eq('token', existingToken.token);
        }
        return NextResponse.json({ token: existingToken.token });
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        payment_id: invoiceId,
        customer_email: email,
        customer_name: name,
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
      customer_email: email,
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
    try {
      await supabase.rpc('increment_sales_count', { product_id: product.id });
    } catch (e) {
      console.warn('Could not increment sales_count:', e);
    }

    return NextResponse.json({ token });
  } catch (err) {
    console.error('claim-free error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
