'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { blogAPI, BlogPost } from '../../../../lib/api/blog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadImage } from '../../../../lib/uploadImage';
import { authAPI } from '../../../../lib/auth';

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    tags: '',
    published: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'blog');
      setFormData({ ...formData, featured_image: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await authAPI.getCurrentUser();
      
      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        author_id: user?.id,
        author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
        published_at: formData.published ? new Date().toISOString() : undefined
      };

      if (editingPost) {
        await blogAPI.update(editingPost.id, postData);
        toast.success('Post updated successfully');
      } else {
        await blogAPI.create(postData);
        toast.success('Post created successfully');
      }

      setShowModal(false);
      resetForm();
      loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      published: post.published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogAPI.delete(id);
      toast.success('Post deleted successfully');
      loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: '',
      tags: '',
      published: false,
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
    setEditingPost(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-file-earmark-text" title="Blog" subtitle="posts" />

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="mb-0">Total Posts: {posts.length}</h6>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>Add New Post
              </button>
            </div>

            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No blog posts found. Create your first post!
                        </td>
                      </tr>
                    ) : (
                      posts.map(post => (
                        <tr key={post.id}>
                          <td>
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              <div style={{ width: '60px', height: '60px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="bi bi-image text-secondary"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{post.title}</strong>
                            <br />
                            <small className="text-muted">{post.slug}</small>
                          </td>
                          <td>
                            {post.category ? (
                              <span className="badge bg-info">{post.category}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {post.published ? (
                              <span className="badge bg-success">Published</span>
                            ) : (
                              <span className="badge bg-warning">Draft</span>
                            )}
                          </td>
                          <td>{post.views}</td>
                          <td>{post.likes}</td>
                          <td>{formatDate(post.created_at)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(post)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(post.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ overflowY: 'auto' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingPost ? 'Edit Post' : 'Add New Post'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <div className="mb-3">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Slug (URL)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Leave empty to auto-generate"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Excerpt</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Content *</label>
                      <textarea
                        className="form-control"
                        rows={8}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                      ></textarea>
                      <small className="text-muted">You can use HTML tags for formatting</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Featured Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && <small className="text-primary">Uploading...</small>}
                      {formData.featured_image && (
                        <img
                          src={formData.featured_image}
                          alt="Preview"
                          className="mt-2"
                          style={{ maxWidth: '200px', borderRadius: '8px' }}
                        />
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Category</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tags (comma-separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="shopify, ecommerce, tutorial"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">SEO Meta Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">SEO Meta Description</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">SEO Keywords</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.meta_keywords}
                        onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      />
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="published">
                        Publish immediately
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
