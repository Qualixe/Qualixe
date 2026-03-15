import { supabase } from '../supabaseClient';

export interface Theme {
  id?: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  price?: number;
  rating?: number;
  reviews_count?: number;
  features?: string[];
  demo_url?: string;
  version?: string;
  store_url?: string;
  sort_order?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const themesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(theme: Theme) {
    const { data, error } = await supabase
      .from('themes')
      .insert([theme])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, theme: Partial<Theme>) {
    const { data, error } = await supabase
      .from('themes')
      .update({ ...theme, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('themes').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateOrder(items: { id: string; sort_order: number }[]) {
    const updates = items.map(({ id, sort_order }) =>
      supabase.from('themes').update({ sort_order }).eq('id', id)
    );
    await Promise.all(updates);
  }
};
