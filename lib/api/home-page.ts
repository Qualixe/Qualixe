import { supabase } from '../supabaseClient';
import { FALLBACK } from '../../src/app/(main)/home/fallback';

export interface HomeHero {
  badge: string;
  heading_line1: string;
  heading_line2: string;
  description: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  proof: { value: string; label: string }[];
  float_top: string;
  float_bottom: string;
}

export interface HomeAbout {
  label: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_url: string;
  stats: { value: string; label: string }[];
  reasons: { icon: string; text: string }[];
}

export interface HomeService {
  icon: string;
  heading: string;
  content: string;
  href: string;
  color: string;
  accent: string;
}

export interface HomeServices {
  label: string;
  heading: string;
  subheading: string;
  items: HomeService[];
}

export interface HomePage {
  hero: HomeHero;
  about: HomeAbout;
  services: HomeServices;
}

export async function getHomePage(): Promise<HomePage> {
  const { data, error } = await supabase
    .from('home_page')
    .select('section, content');

  if (error || !data) return FALLBACK;

  const map: Record<string, any> = {};
  data.forEach((row) => { map[row.section] = row.content; });

  return {
    hero: map.hero ?? FALLBACK.hero,
    about: map.about ?? FALLBACK.about,
    services: map.services ?? FALLBACK.services,
  };
}

export async function upsertHomeSection(section: string, content: object): Promise<void> {
  const { error } = await supabase
    .from('home_page')
    .upsert({ section, content }, { onConflict: 'section' });
  if (error) throw error;
}
