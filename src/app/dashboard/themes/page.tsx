'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { themesAPI, Theme } from '../../../../lib/api/themes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUploadField from '@/components/ImageUploadField';

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState<Theme>({
    name: '',
    category: '',
    description: '',
    image_url: '',
    price: 0,
    rating: 0,
    reviews_count: 0,
    features: [],
    demo_url: '',
    store_url: '',
    version: '',
    status: 'active',
  });
  const [featureInput, setFeatureInput] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, categories: 0 });

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const data = await themesAPI.getAll();
      setThemes(data || []);
      
      const active = data?.filter((t: Theme) => t.status === 'active').length || 0;
      const categories = new Set(data?.map((t: Theme) => t.category)).size;
      
      setStats({
        total: data?.length || 0,
        active,
        categories,
      });
    } catch (error: any) {
      toast.error('Failed to load themes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTheme) {
        await themesAPI.update(editingTheme.id!, formData);
        toast.success('Theme updated successfully');
      } else {
        await themesAPI.create(formData);
        toast.success('Theme created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchThemes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save theme');
      console.error(error);
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData(theme);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      await themesAPI.delete(id);
      toast.success('Theme deleted successfully');
      fetchThemes();
    } catch (error: any) {
      toast.error('Failed to delete theme');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image_url: '',
      price: 0,
      rating: 0,
      reviews_count: 0,
      features: [],
      demo_url: '',
      store_url: '',
      version: '',
      status: 'active',
    });
    setFeatureInput('');
    setEditingTheme(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'rating', 'reviews_count'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-palette" title="Themes" subtitle="overview" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-palette"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">total themes</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">active</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.active}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-grid-3x3-gap"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">categories</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.categories}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">All Themes</h4>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add Theme
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr><th>Theme Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Version</th><th>Status</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {themes.length > 0 ? (
                          themes.map((theme) => (
                            <tr key={theme.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {theme.image_url && (
                                    <img src={theme.image_url} alt={theme.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                  )}
                                  <span className="fw-semibold">{theme.name}</span>
                                </div>
                              </td>
                              <td>{theme.category || 'N/A'}</td>
                              <td>${theme.price || 0}</td>
                              <td>
                                <i className="bi bi-star-fill text-warning"></i> {theme.rating || 0} ({theme.reviews_count || 0})
                              </td>
                              <td>{theme.version || 'N/A'}</td>
                              <td>
                                <span className={`badge px-3 py-2 rounded-pill ${
                                  theme.status === 'active' ? 'bg-success bg-opacity-25 text-success' :
                                  'bg-warning bg-opacity-25 text-warning'
                                }`}>
                                  {theme.status}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEdit(theme)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(theme.id!)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">No themes found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingTheme ? 'Edit Theme' : 'Add New Theme'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Theme Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., E-commerce, Fashion"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <ImageUploadField
                    label="Theme Image"
                    currentImageUrl={formData.image_url}
                    onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    folder="themes"
                  />
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Demo URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="demo_url"
                        value={formData.demo_url || ''}
                        onChange={handleChange}
                        placeholder="https://demo.example.com"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Purchase URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="store_url"
                        value={formData.store_url || ''}
                        onChange={handleChange}
                        placeholder="https://store.example.com/theme"
                      />
                    </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Price ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price || 0}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Rating (0-5)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="rating"
                        value={formData.rating || 0}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Reviews Count</label>
                      <input
                        type="number"
                        className="form-control"
                        name="reviews_count"
                        value={formData.reviews_count || 0}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Version</label>
                      <input
                        type="text"
                        className="form-control"
                        name="version"
                        value={formData.version || ''}
                        onChange={handleChange}
                        placeholder="v1.0.0"
                      />
                    </div>
                  </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Features</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <button type="button" className="btn btn-outline-primary" onClick={addFeature}>
                        <i className="bi bi-plus"></i> Add
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.features?.map((feature, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center gap-1">
                          {feature}
                          <i className="bi bi-x" style={{ cursor: 'pointer' }} onClick={() => removeFeature(index)}></i>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTheme ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
