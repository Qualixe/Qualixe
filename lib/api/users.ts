import { supabase } from '../supabaseClient';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  status: string;
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  bio: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Get all users
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create new user (admin function)
export async function createUser(userData: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  status?: string;
  phone?: string;
  department?: string;
}) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
      },
    });

    if (authError) throw authError;

    // Update user profile with additional data
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: userData.full_name,
          role: userData.role || 'user',
          status: userData.status || 'active',
          phone: userData.phone,
          department: userData.department,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;
    }

    return authData.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update user profile
export async function updateUser(
  id: string,
  updates: {
    full_name?: string;
    role?: string;
    status?: string;
    phone?: string;
    department?: string;
    bio?: string;
    avatar_url?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id: string) {
  try {
    // Delete from auth (this will cascade to user_profiles)
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) throw authError;

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Update user status
export async function updateUserStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

// Get user statistics
export async function getUserStats() {
  try {
    const { data, error } = await supabase.from('user_stats').select('*').single();

    if (error) {
      console.error('Error fetching user stats:', error);
      // Return default stats if view doesn't exist
      return {
        total_users: 0,
        active_users: 0,
        inactive_users: 0,
        suspended_users: 0,
        admin_users: 0,
        new_users_30d: 0,
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      total_users: 0,
      active_users: 0,
      inactive_users: 0,
      suspended_users: 0,
      admin_users: 0,
      new_users_30d: 0,
    };
  }
}

// Search users
export async function searchUsers(query: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

// Reset user password (admin function)
export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}
