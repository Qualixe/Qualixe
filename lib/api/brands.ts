import { supabase } from '../supabaseClient';

export interface Brand {
  id?: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  industry?: string;
  projects_count?: number;
  status?: string;
  since_year?: number;
  created_at?: string;
  updated_at?: string;
}

export const brandsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(brand: Brand) {
    const { data, error } = await supabase
      .from('brands')
      .insert([brand])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, brand: Partial<Brand>) {
    const { data, error } = await supabase
      .from('brands')
      .update({ ...brand, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
