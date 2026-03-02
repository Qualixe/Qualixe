import { supabase } from '../supabaseClient';

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  folder: string;
}

export const mediaAPI = {
  // Get all images from storage
  async getAllImages(): Promise<MediaFile[]> {
    try {
      const folders = ['portfolio', 'brands', 'clients', 'themes', 'blog'];
      const allFiles: MediaFile[] = [];

      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from('images')
          .list(folder, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) {
          console.error(`Error fetching ${folder}:`, error);
          continue;
        }

        if (data) {
          const filesWithUrls = data
            .filter((file) => file.name !== '.emptyFolderPlaceholder')
            .map((file) => ({
              name: file.name,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${folder}/${file.name}`,
              size: file.metadata?.size || 0,
              created_at: file.created_at || '',
              folder: folder,
            }));

          allFiles.push(...filesWithUrls);
        }
      }

      // Sort by created_at descending
      allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return allFiles;
    } catch (error) {
      console.error('Error fetching all images:', error);
      return [];
    }
  },

  // Get images from specific folder
  async getImagesByFolder(folder: string): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      if (!data) return [];

      return data
        .filter((file) => file.name !== '.emptyFolderPlaceholder')
        .map((file) => ({
          name: file.name,
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${folder}/${file.name}`,
          size: file.metadata?.size || 0,
          created_at: file.created_at || '',
          folder: folder,
        }));
    } catch (error) {
      console.error(`Error fetching images from ${folder}:`, error);
      return [];
    }
  },

  // Delete image
  async deleteImage(folder: string, fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([`${folder}/${fileName}`]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};
