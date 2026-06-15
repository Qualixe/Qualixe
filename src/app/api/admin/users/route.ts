import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/admin/users — create user
export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, role, status, phone, department } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'email, password and full_name are required' }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    if (authData.user) {
      await supabase
        .from('user_profiles')
        .update({ full_name, role: role || 'user', status: status || 'active', phone, department })
        .eq('id', authData.user.id);
    }

    return NextResponse.json({ user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
