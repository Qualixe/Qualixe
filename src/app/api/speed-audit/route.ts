import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const NOTIFY_EMAIL = 'qualixe.info@gmail.com';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, store_url, message } = await req.json();
    if (!name || !email || !store_url) {
      return NextResponse.json({ error: 'name, email and store_url are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error: dbError } = await supabase
      .from('speed_audit_requests')
      .insert([{ name, email, store_url, message: message || null }]);

    if (dbError) {
      console.error('speed-audit: db insert error', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Qualixe <onboarding@resend.dev>',
          to: NOTIFY_EMAIL,
          replyTo: email,
          subject: `New Speed Audit request — ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nStore URL: ${store_url}\nMessage: ${message || '(none)'}`,
        });
      } catch (emailError) {
        // Don't fail the request if only the email notification fails — the
        // lead is already saved in Supabase either way.
        console.error('speed-audit: email send error', emailError);
      }
    } else {
      console.warn('speed-audit: RESEND_API_KEY not configured, skipping email notification');
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (err: unknown) {
    console.error('speed-audit error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
