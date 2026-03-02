'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ImageUploadField from '@/components/ImageUploadField';
import { portfolioAPI, Portfolio } from '../../../../lib/api/portfolio';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState<Portfolio>({
    title: '',
    category: '',
    client: '',
    description: '',
    image_url: '',
    project_url: '',
    status: 'completed',
  });
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, total: 0 });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const data = await portfolioAPI.getAll();
      setPortfolios(data || []);
      
      const completed = data?.filter((p: Portfolio) => p.status === 'completed').length || 0;
      const inProgress = data?.filter((p: Portfolio) => p.status === 'in progress').length || 0;
      
      setStats({
        completed,
        inProgress,
        total: data?.length || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load portfolio');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPortfolio) {
        await portfolioAPI.update(editingPortfolio.id!, formData);
        toast.success('Portfolio updated successfully');
      } else {
        await portfolioAPI.create(formData);
        toast.success('Portfolio created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchPortfolios();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save portfolio');
      console.error(error);
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData(portfolio);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      await portfolioAPI.delete(id);
      toast.success('Portfolio deleted successfully');
      fetchPortfolios();
    } catch (error: any) {
      toast.error('Failed to delete portfolio');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      client: '',
      description: '',
      image_url: '',
      project_url: '',
      status: 'completed',
    });
    setEditingPortfolio(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-briefcase" title="Portfolio" subtitle="projects" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-lg-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-check-circle"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">completed</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.completed}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-hourglass-split"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">in progress</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.inProgress}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-briefcase"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">total</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Portfolio Projects</h4>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add New
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Project Name</th>
                          <th>Image</th>
                          <th>Category</th>
                          <th>Client</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolios.length > 0 ? (
                          portfolios.map((portfolio) => (
                            <tr key={portfolio.id}>
                              <td><span className="fw-semibold">{portfolio.title}</span></td>
                              <td>
                                {portfolio.image_url && (
                                  <img src={portfolio.image_url} alt={portfolio.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                )}
                              </td>
                              <td>{portfolio.category}</td>
                              <td>{portfolio.client || 'N/A'}</td>
                              <td>
                                <span className={`badge px-3 py-2 rounded-pill ${
                                  portfolio.status === 'completed' ? 'bg-success bg-opacity-25 text-success' :
                                  portfolio.status === 'in progress' ? 'bg-primary bg-opacity-25 text-primary' :
                                  'bg-warning bg-opacity-25 text-warning'
                                }`}>
                                  {portfolio.status}
                                </span>
                              </td>
                              <td>{new Date(portfolio.created_at!).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEdit(portfolio)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(portfolio.id!)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">No portfolio items found</td>
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
                <h5 className="modal-title">{editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Project Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
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
                        placeholder="e.g., E-commerce, Corporate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"
                        value={formData.client || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Project URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="project_url"
                        value={formData.project_url || ''}
                        onChange={handleChange}
                        placeholder="https://example.com"
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
                    label="Project Image"
                    currentImageUrl={formData.image_url}
                    onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    folder="portfolio"
                  />

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="completed">Completed</option>
                      <option value="in progress">In Progress</option>
                      <option value="planning">Planning</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPortfolio ? 'Update' : 'Create'}
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
