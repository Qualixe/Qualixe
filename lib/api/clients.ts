import { supabase } from '../supabaseClient';

export interface Client {
  id?: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  email?: string;
  industry?: string;
  projects_count?: number;
  status?: string;
  joined_date?: string;
  background_color?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export const clientsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(client: Client) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...client, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async updateOrder(items: { id: string; sort_order: number }[]) {
    const updates = items.map(({ id, sort_order }) =>
      supabase.from('clients').update({ sort_order }).eq('id', id)
    );
    await Promise.all(updates);
  }
};
