import { supabase } from './supabaseClient';

export const uploadImage = async (file: File, folder: string = 'uploads'): Promise<string> => {
  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage (using 'images' bucket)
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/images/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return false;
  }
};
