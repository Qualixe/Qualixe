import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UDDOKTA_API_KEY = process.env.UDDOKTA_API_KEY!;
const UDDOKTA_API_URL = process.env.UDDOKTA_API_URL!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

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

    // Fetch the real product from DB so price/name can't be tampered client-side
    const supabase = getServiceClient();
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, price, active')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.active) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
    }

    const payload = {
      full_name: name,
      email,
      amount: product.price,
      metadata: {
        product_id: product.id,
        product_name: product.name,
        customer_email: email,
        customer_name: name,
      },
      redirect_url: `${BASE_URL}/shop/success`,
      cancel_url: `${BASE_URL}/shop/cancel`,
      webhook_url: `${BASE_URL}/api/uddokta-webhook`,
    };

    const response = await fetch(UDDOKTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTA_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_url) {
      console.error('Uddokta Pay error:', data);
      return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 502 });
    }

    return NextResponse.json({ payment_url: data.payment_url });
  } catch (err) {
    console.error('create-payment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
