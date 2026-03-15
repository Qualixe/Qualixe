import { supabase } from '../supabaseClient';

export interface Portfolio {
  id?: string;
  title: string;
  category: string;
  client?: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  status?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export const portfolioAPI = {
  // Get all portfolio items
  async getAll() {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });
    
    if (error) throw error;
    return data;
  },

  // Get single portfolio item
  async getById(id: string) {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create portfolio item
  async create(portfolio: Portfolio) {
    const { data, error } = await supabase
      .from('portfolio')
      .insert([portfolio])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update portfolio item
  async update(id: string, portfolio: Partial<Portfolio>) {
    const { data, error } = await supabase
      .from('portfolio')
      .update({ ...portfolio, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete portfolio item
  async delete(id: string) {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async updateOrder(items: { id: string; sort_order: number }[]) {
    const updates = items.map(({ id, sort_order }) =>
      supabase.from('portfolio').update({ sort_order }).eq('id', id)
    );
    await Promise.all(updates);
  }
};
