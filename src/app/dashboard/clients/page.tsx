'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { clientsAPI, Client } from '../../../../lib/api/clients';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadImage } from '../../../../lib/uploadImage';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Client>({
    name: '',
    logo_url: '',
    website_url: '',
    email: '',
    industry: '',
    projects_count: 0,
    status: 'active',
    joined_date: new Date().toISOString().split('T')[0],
  });
  const [stats, setStats] = useState({ total: 0, active: 0, newThisMonth: 0 });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data || []);
      
      const active = data?.filter((c: Client) => c.status === 'active').length || 0;
      const thisMonth = data?.filter((c: Client) => {
        const joinedDate = new Date(c.joined_date!);
        const now = new Date();
        return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
      }).length || 0;
      
      setStats({
        total: data?.length || 0,
        active,
        newThisMonth: thisMonth,
      });
    } catch (error: any) {
      toast.error('Failed to load clients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'clients');
      setFormData(prev => ({ ...prev, logo_url: imageUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id!, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsAPI.create(formData);
        toast.success('Client created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchClients();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save client');
      console.error(error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await clientsAPI.delete(id);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error: any) {
      toast.error('Failed to delete client');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      email: '',
      industry: '',
      projects_count: 0,
      status: 'active',
      joined_date: new Date().toISOString().split('T')[0],
    });
    setEditingClient(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'projects_count' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-people me-2"></i>Clients <span>/</span> management</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">total clients</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-check-circle"></i>
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
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">new this month</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.newThisMonth}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Client List</h4>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add Client
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr><th>Client Name</th><th>Logo</th><th>Email</th><th>Website</th><th>Projects</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <tr key={client.id}>
                              <td><span className="fw-semibold">{client.name}</span></td>
                              <td>
                                {client.logo_url ? (
                                  <img src={client.logo_url} alt={client.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                ) : (
                                  <span className="avatar-placeholder">
                                    {client.name.substring(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </td>
                              <td>{client.email || 'N/A'}</td>
                              <td>
                                {client.website_url ? (
                                  <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                                    <i className="bi bi-link-45deg"></i>
                                  </a>
                                ) : 'N/A'}
                              </td>
                              <td>{client.projects_count || 0}</td>
                              <td>
                                <span className={`badge px-3 py-2 rounded-pill ${
                                  client.status === 'active' ? 'bg-success bg-opacity-25 text-success' :
                                  'bg-warning bg-opacity-25 text-warning'
                                }`}>
                                  {client.status}
                                </span>
                              </td>
                              <td>{new Date(client.joined_date!).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEdit(client)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(client.id!)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center">No clients found</td>
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
                <h5 className="modal-title">{editingClient ? 'Edit Client' : 'Add New Client'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Client Name *</label>
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
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Industry</label>
                      <input
                        type="text"
                        className="form-control"
                        name="industry"
                        value={formData.industry || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Logo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <small className="text-muted">Uploading...</small>}
                    {formData.logo_url && (
                      <div className="mt-2">
                        <img src={formData.logo_url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '4px' }} />
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
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
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Joined Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="joined_date"
                        value={formData.joined_date || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingClient ? 'Update' : 'Create'}
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
