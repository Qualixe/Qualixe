import { supabase } from '../supabaseClient';

export interface ProjectResult {
  value: string;
  label: string;
}

export interface LaravelProject {
  id?: string;
  title: string;
  slug: string;
  client_name?: string;
  category?: string;
  industry?: string;
  short_description?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  cover_image?: string;
  gallery?: string[];
  tech_stack?: string[];
  features?: string[];
  results?: ProjectResult[];
  live_url?: string;
  year?: string;
  duration?: string;
  featured?: boolean;
  sort_order?: number;
  status?: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

const TABLE = 'laravel_projects';

export const laravelProjectsAPI = {
  /** Published projects for the public site (RLS also enforces this). */
  async getPublished(): Promise<LaravelProject[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as LaravelProject[];
  },

  async getBySlug(slug: string): Promise<LaravelProject | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return (data as LaravelProject) ?? null;
  },

  /** All projects including drafts — dashboard only (admin RLS). */
  async getAll(): Promise<LaravelProject[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as LaravelProject[];
  },

  async create(project: LaravelProject) {
    const { data, error } = await supabase.from(TABLE).insert([project]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<LaravelProject>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at, updated_at, ...rest } = project;
    const { data, error } = await supabase
      .from(TABLE)
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateOrder(items: { id: string; sort_order: number }[]) {
    await Promise.all(
      items.map(({ id, sort_order }) => supabase.from(TABLE).update({ sort_order }).eq('id', id))
    );
  },
};
