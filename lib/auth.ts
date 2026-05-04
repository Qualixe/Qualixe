import { supabase } from './supabaseClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  full_name?: string;
}

export const authAPI = {
  async signUp({ email, password, full_name }: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: full_name || '' } },
    });
    if (error) throw error;
    return data;
  },

  async signIn({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Check if the currently logged-in user is an admin.
  // Checks user_profiles.role first, falls back to NEXT_PUBLIC_ADMIN_EMAILS env var.
  async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // 1. Try user_profiles table first
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data?.role === 'admin') return true;

      // 2. Fallback: check NEXT_PUBLIC_ADMIN_EMAILS env var
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

      if (adminEmails.length > 0) {
        return adminEmails.includes((user.email || '').toLowerCase());
      }

      return false;
    } catch (err) {
      console.error('isAdmin error:', err);
      return false;
    }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return true;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  },

  async updateProfile({ full_name }: { full_name: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name },
    });
    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
    return data;
  },

  async signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
    return data;
  },
};
