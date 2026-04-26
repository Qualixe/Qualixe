import { supabase } from '../supabaseClient';

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
  sort_order?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const teamAPI = {
  // Get all active team members (public)
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get all team members including inactive (admin)
  async getAllAdmin(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create a new team member
  async create(member: TeamMember): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a team member
  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a team member
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update sort order (drag & drop reorder)
  async updateOrder(items: { id: string; sort_order: number }[]): Promise<void> {
    const updates = items.map(({ id, sort_order }) =>
      supabase.from('team_members').update({ sort_order }).eq('id', id)
    );
    await Promise.all(updates);
  },
};
