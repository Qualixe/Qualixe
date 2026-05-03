import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// TEMPORARY — delete after fixing
// Visit: /api/debug-role while logged in
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role bypasses RLS
  );

  // Get all user_profiles with their auth email
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, role, full_name')
    .limit(20);

  // Also get auth users to cross-reference
  const { data: authUsers } = await supabase.auth.admin.listUsers();

  const merged = (data ?? []).map(profile => {
    const authUser = authUsers?.users?.find(u => u.id === profile.id);
    return {
      id: profile.id,
      email: authUser?.email,
      role: profile.role,
      full_name: profile.full_name,
    };
  });

  return NextResponse.json({ profiles: merged, error: error?.message });
}
