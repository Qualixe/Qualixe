import { supabase } from '../supabaseClient';
import type { ShopifyServicePage } from './shopify-service';

export type UiUxPage = ShopifyServicePage;

export async function getUiUxPage(): Promise<UiUxPage | null> {
  const { data, error } = await supabase
    .from('uiux_service_page')
    .select('section, content');

  if (error || !data || data.length === 0) return null;

  const map: Record<string, any> = {};
  data.forEach((row) => { map[row.section] = row.content; });

  return map as UiUxPage;
}

export async function upsertUiUxSection(section: string, content: object): Promise<void> {
  const { error } = await supabase
    .from('uiux_service_page')
    .upsert({ section, content }, { onConflict: 'section' });

  if (error) throw error;
}
