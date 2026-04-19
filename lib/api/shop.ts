import { createClient } from '@supabase/supabase-js';

// Use service role for server-side operations (webhook, download)
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export interface Order {
  id?: string;
  payment_id: string;
  customer_email: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
}

export interface DownloadToken {
  id?: string;
  token: string;
  order_id: string;
  customer_email: string;
  product_id: string;
  expires_at: string;
  download_limit: number;
  download_count: number;
  created_at?: string;
}

export const shopAPI = {
  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  async getOrderByPaymentId(paymentId: string) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    if (error) return null;
    return data as Order;
  },

  async createDownloadToken(token: Omit<DownloadToken, 'id' | 'created_at'>) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('download_tokens')
      .insert(token)
      .select()
      .single();
    if (error) throw error;
    return data as DownloadToken;
  },

  async getDownloadToken(token: string) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .single();
    if (error) return null;
    return data as DownloadToken;
  },

  async getDownloadTokenByOrderId(orderId: string) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('download_tokens')
      .select('*')
      .eq('order_id', orderId)
      .single();
    if (error) return null;
    return data as DownloadToken;
  },

  async incrementDownloadCount(token: string, currentCount: number) {
    const supabase = getServiceClient();
    const { error } = await supabase
      .from('download_tokens')
      .update({ download_count: currentCount + 1 })
      .eq('token', token);
    if (error) throw error;
  },
};
