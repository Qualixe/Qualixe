import { supabase } from '../supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  views: number;
  likes: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export const blogAPI = {
  // Get all published posts
  async getAllPublished() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all posts (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get post by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Get post by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create post
  async create(post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update post
  async update(id: string, post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete post
  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Increment views
  async incrementViews(id: string) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('id', id)
      .single();

    if (post == null) return;

    await supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id);
  },

  // Get posts by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Search posts
  async search(query: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const blogCommentsAPI = {
  // Get approved comments for a post
  async getByPostId(postId: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get all comments (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*, blog_posts(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create comment
  async create(comment: Partial<BlogComment>) {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert([comment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Approve comment
  async approve(id: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete comment
  async delete(id: string) {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};

export const blogLikesAPI = {
  // Check if user liked a post
  async hasLiked(postId: string, userIp: string) {
    const { data, error } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_ip', userIp)
      .single();

    return !!data;
  },

  // Like a post
  async like(postId: string, userIp: string) {
    // Insert like
    const { error: likeError } = await supabase
      .from('blog_likes')
      .insert([{ post_id: postId, user_ip: userIp }]);

    if (likeError) throw likeError;

    // Increment likes count
    const { data: post } = await supabase
      .from('blog_posts')
      .select('likes')
      .eq('id', postId)
      .single();

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('id', postId);

    if (updateError) throw updateError;
    return true;
  },

  // Unlike a post
  async unlike(postId: string, userIp: string) {
    // Delete like
    const { error: unlikeError } = await supabase
      .from('blog_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_ip', userIp);

    if (unlikeError) throw unlikeError;

    // Decrement likes count
    const { data: post } = await supabase
      .from('blog_posts')
      .select('likes')
      .eq('id', postId)
      .single();

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ likes: Math.max((post?.likes || 0) - 1, 0) })
      .eq('id', postId);

    if (updateError) throw updateError;
    return true;
  },
};
