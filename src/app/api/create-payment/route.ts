import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const LS_API_KEY   = process.env.LEMONSQUEEZY_API_KEY!;
const LS_STORE_ID  = process.env.LEMONSQUEEZY_STORE_ID!;
const BASE_URL     =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!LS_API_KEY)  return NextResponse.json({ error: 'LEMONSQUEEZY_API_KEY not configured' }, { status: 500 });
    if (!LS_STORE_ID) return NextResponse.json({ error: 'LEMONSQUEEZY_STORE_ID not configured' }, { status: 500 });
    if (!BASE_URL)    return NextResponse.json({ error: 'NEXT_PUBLIC_BASE_URL not configured' }, { status: 500 });

    const { name, email, productId } = await req.json();
    if (!name || !email || !productId) {
      return NextResponse.json({ error: 'name, email and productId are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, price, active, lemon_squeezy_variant_id')
      .eq('id', productId)
      .single();

    if (error || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (!product.active)  return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
    if (product.price === 0) return NextResponse.json({ error: 'Use /api/claim-free for free products' }, { status: 400 });

    if (!product.lemon_squeezy_variant_id) {
      return NextResponse.json({ error: 'This product has no Lemon Squeezy variant configured' }, { status: 400 });
    }

    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email,
            name,
            custom: {
              product_id:      product.id,
              product_name:    product.name,
              customer_email:  email,
              customer_name:   name,
            },
          },
          product_options: {
            // {order_id} is substituted by Lemon Squeezy on redirect
            redirect_url: `${BASE_URL}/shop/success?order_id={order_id}`,
          },
        },
        relationships: {
          store:   { data: { type: 'stores',   id: String(LS_STORE_ID) } },
          variant: { data: { type: 'variants', id: String(product.lemon_squeezy_variant_id) } },
        },
      },
    };

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${LS_API_KEY}`,
        'Content-Type':   'application/vnd.api+json',
        'Accept':         'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });

    const raw = await res.text();
    let data: any;
    try { data = JSON.parse(raw); } catch {
      console.error('LS non-JSON response:', res.status, raw.slice(0, 300));
      return NextResponse.json({ error: `Lemon Squeezy returned HTTP ${res.status}` }, { status: 502 });
    }

    if (!res.ok || !data?.data?.attributes?.url) {
      console.error('LS checkout error:', res.status, data);
      return NextResponse.json({ error: `Lemon Squeezy error: ${JSON.stringify(data?.errors ?? data)}` }, { status: 502 });
    }

    return NextResponse.json({ checkout_url: data.data.attributes.url });
  } catch (err: any) {
    console.error('create-payment error:', err?.message ?? err);
    return NextResponse.json({ error: `Internal error: ${err?.message ?? 'unknown'}` }, { status: 500 });
  }
}
