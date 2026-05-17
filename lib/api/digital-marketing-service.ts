import { supabase } from '../supabaseClient';
import type { ShopifyServicePage } from './shopify-service';

// Reuses the same interface shape as shopify-service
export type DigitalMarketingPage = ShopifyServicePage;

export async function getDigitalMarketingPage(): Promise<DigitalMarketingPage | null> {
  const { data, error } = await supabase
    .from('digital_marketing_page')
    .select('section, content');

  if (error || !data || data.length === 0) return null;

  const map: Record<string, any> = {};
  data.forEach((row) => { map[row.section] = row.content; });

  return map as DigitalMarketingPage;
}

export async function upsertDigitalMarketingSection(section: string, content: object): Promise<void> {
  const { error } = await supabase
    .from('digital_marketing_page')
    .upsert({ section, content }, { onConflict: 'section' });

  if (error) throw error;
}
