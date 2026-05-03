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

// Called by the success page as a fallback when the webhook hasn't fired yet.
// Verifies the invoice with Paymently and creates the order + download token if COMPLETED.
export async function POST(req: NextRequest) {
  try {
    const { invoice_id } = await req.json();

    if (!invoice_id) {
      return NextResponse.json({ error: 'Missing invoice_id' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // If token already exists (webhook already ran), just return it
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', invoice_id)
      .single();

    if (existingOrder) {
      const { data: tokenRecord } = await supabase
        .from('download_tokens')
        .select('token')
        .eq('order_id', existingOrder.id)
        .single();

      if (tokenRecord?.token) {
        return NextResponse.json({ token: tokenRecord.token, source: 'existing' });
      }
    }

    // Verify with Paymently
    const verifyRes = await fetch(UDDOKTA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTA_API_KEY,
      },
      body: JSON.stringify({ invoice_id }),
    });

    const rawText = await verifyRes.text();
    console.log('verify-payment response:', verifyRes.status, rawText.slice(0, 400));

    let payment: any;
    try {
      payment = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: 'Gateway returned non-JSON', raw: rawText.slice(0, 120) }, { status: 502 });
    }

    if (!verifyRes.ok || payment.status !== 'COMPLETED') {
      // Not completed yet — tell the client to keep polling
      return NextResponse.json({ pending: true, status: payment.status ?? 'unknown' });
    }

    const { metadata } = payment;

    if (!metadata?.product_id || !metadata?.customer_email) {
      console.error('verify-payment: missing metadata', metadata);
      return NextResponse.json({ error: 'Payment metadata incomplete' }, { status: 500 });
    }

    // Idempotency — create order only if it doesn't exist
    let orderId: string;
    const { data: existingOrder2 } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', invoice_id)
      .single();

    if (existingOrder2) {
      orderId = existingOrder2.id;
    } else {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          payment_id: invoice_id,
          customer_email: metadata.customer_email,
          customer_name: metadata.customer_name,
          product_id: metadata.product_id,
          product_name: metadata.product_name,
          amount: payment.amount,
          currency: payment.currency ?? 'BDT',
          status: 'COMPLETED',
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('verify-payment order insert error:', orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
      orderId = order.id;
    }

    // Check if token already exists for this order
    const { data: existingToken } = await supabase
      .from('download_tokens')
      .select('token')
      .eq('order_id', orderId)
      .single();

    if (existingToken?.token) {
      return NextResponse.json({ token: existingToken.token, source: 'existing_token' });
    }

    // Create download token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase.from('download_tokens').insert({
      token,
      order_id: orderId,
      customer_email: metadata.customer_email,
      product_id: metadata.product_id,
      expires_at: expiresAt,
      download_limit: DOWNLOAD_LIMIT,
      download_count: 0,
    });

    if (tokenError) {
      console.error('verify-payment token insert error:', tokenError);
      return NextResponse.json({ error: 'Failed to create download token' }, { status: 500 });
    }

    // Increment sales_count best-effort
    try {
      await supabase.rpc('increment_sales_count', { product_id: metadata.product_id });
    } catch (e) {
      console.warn('Could not increment sales_count:', e);
    }

    return NextResponse.json({ token, source: 'verified' });
  } catch (err: any) {
    console.error('verify-payment error:', err?.message ?? err);
    return NextResponse.json({ error: `Internal error: ${err?.message ?? 'unknown'}` }, { status: 500 });
  }
}
