import { supabase } from '../supabaseClient';

export interface Contact {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  country: string;
  state?: string;
  zip_code?: string;
  company_name?: string;
  business_name?: string;
  business_type?: string;
  theme?: string;
  budget?: string;
  meeting_time?: string;
  note?: string;
  created_at?: string;
}

export const contactsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async markAsRead(id: string) {
    // You can add a 'read' column to the contacts table if needed
    // For now, this is a placeholder
    return true;
  }
};
