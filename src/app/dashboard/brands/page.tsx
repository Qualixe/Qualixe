'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ImageUploadField from '@/components/ImageUploadField';
import { brandsAPI, Brand } from '../../../../lib/api/brands';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<Brand>({
    name: '',
    logo_url: '',
    website_url: '',
    industry: '',
    projects_count: 0,
    status: 'active',
    since_year: new Date().getFullYear(),
  });
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0 });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await brandsAPI.getAll();
      setBrands(data || []);
      
      const active = data?.filter((b: Brand) => b.status === 'active').length || 0;
      
      setStats({
        total: data?.length || 0,
        active,
        featured: active,
      });
    } catch (error: any) {
      toast.error('Failed to load brands');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBrand) {
        await brandsAPI.update(editingBrand.id!, formData);
        toast.success('Brand updated successfully');
      } else {
        await brandsAPI.create(formData);
        toast.success('Brand created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save brand');
      console.error(error);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData(brand);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      await brandsAPI.delete(id);
      toast.success('Brand deleted successfully');
      fetchBrands();
    } catch (error: any) {
      toast.error('Failed to delete brand');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      industry: '',
      projects_count: 0,
      status: 'active',
      since_year: new Date().getFullYear(),
    });
    setEditingBrand(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'projects_count' || name === 'since_year' ? parseInt(value) : value
    }));
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-award" title="Brands" subtitle="partners" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-building"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">total brands</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">featured</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.featured}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">active</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.active}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Brand Partners</h4>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add Brand
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr><th>Brand Name</th><th>Logo</th><th>Industry</th><th>Website</th><th>Projects</th><th>Status</th><th>Since</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {brands.length > 0 ? (
                          brands.map((brand) => (
                            <tr key={brand.id}>
                              <td><span className="fw-semibold">{brand.name}</span></td>
                              <td>
                                {brand.logo_url && (
                                  <img src={brand.logo_url} alt={brand.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                )}
                              </td>
                              <td>{brand.industry || 'N/A'}</td>
                              <td>
                                {brand.website_url ? (
                                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                                    <i className="bi bi-link-45deg"></i>
                                  </a>
                                ) : 'N/A'}
                              </td>
                              <td>{brand.projects_count || 0}</td>
                              <td>
                                <span className={`badge px-3 py-2 rounded-pill ${
                                  brand.status === 'active' ? 'bg-success bg-opacity-25 text-success' :
                                  'bg-warning bg-opacity-25 text-warning'
                                }`}>
                                  {brand.status}
                                </span>
                              </td>
                              <td>{brand.since_year || 'N/A'}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEdit(brand)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(brand.id!)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center">No brands found</td>
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Brand Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <ImageUploadField
                    label="Brand Logo"
                    currentImageUrl={formData.logo_url}
                    onImageChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                    folder="brands"
                  />

                  <div className="mb-3">
                    <label className="form-label">Website URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="website_url"
                      value={formData.website_url || ''}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      className="form-control"
                      name="industry"
                      value={formData.industry || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Projects Count</label>
                    <input
                      type="number"
                      className="form-control"
                      name="projects_count"
                      value={formData.projects_count || 0}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Since Year</label>
                    <input
                      type="number"
                      className="form-control"
                      name="since_year"
                      value={formData.since_year || new Date().getFullYear()}
                      onChange={handleChange}
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBrand ? 'Update' : 'Create'}
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
