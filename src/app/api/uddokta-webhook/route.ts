import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UDDOKTA_API_KEY = process.env.UDDOKTA_API_KEY!;
const UDDOKTA_VERIFY_URL = process.env.UDDOKTA_VERIFY_URL!;

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
    const body = await req.json();
    const { invoice_id } = body;

    if (!invoice_id) {
      return NextResponse.json({ error: 'Missing invoice_id' }, { status: 400 });
    }

    // Verify payment server-to-server
    const verifyRes = await fetch(UDDOKTA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTA_API_KEY,
      },
      body: JSON.stringify({ invoice_id }),
    });

    const payment = await verifyRes.json();

    if (!verifyRes.ok || payment.status !== 'COMPLETED') {
      console.warn('Payment not completed:', payment);
      return NextResponse.json({ message: 'Payment not completed' }, { status: 200 });
    }

    const { metadata } = payment;
    const supabase = getServiceClient();

    // Idempotency — skip if order already exists
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', invoice_id)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        payment_id: invoice_id,
        customer_email: metadata.customer_email,
        customer_name: metadata.customer_name,
        product_id: metadata.product_id,
        product_name: metadata.product_name,
        amount: payment.amount,
        currency: payment.currency ?? 'USD',
        status: 'COMPLETED',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create download token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    await supabase.from('download_tokens').insert({
      token,
      order_id: order.id,
      customer_email: metadata.customer_email,
      product_id: metadata.product_id,
      expires_at: expiresAt,
      download_limit: DOWNLOAD_LIMIT,
      download_count: 0,
    });

    // Increment sales_count
    try {
      await supabase.rpc('increment_sales_count', { product_id: metadata.product_id });
    } catch (e) {
      console.warn('Could not increment sales_count:', e);
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
