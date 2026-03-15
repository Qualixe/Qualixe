'use client';

import { useEffect, useRef, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ImageUploadField from '@/components/ImageUploadField';
import { clientsAPI, Client } from '../../../../lib/api/clients';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Client>({
    name: '', logo_url: '', website_url: '', email: '', industry: '',
    projects_count: 0, status: 'active',
    joined_date: new Date().toISOString().split('T')[0],
    background_color: '#f0f9ff',
  });
  const [stats, setStats] = useState({ total: 0, active: 0, newThisMonth: 0 });
  const dragIndex = useRef<number | null>(null);

  useEffect(() => { fetchClients(); }, []);

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
      setStats({ total: data?.length || 0, active, newThisMonth: thisMonth });
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === dropIndex) return;
    const reordered = [...clients];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(dropIndex, 0, moved);
    dragIndex.current = null;
    setClients(reordered);
    try {
      await clientsAPI.updateOrder(
        reordered.map((c, i) => ({ id: c.id!, sort_order: i }))
      );
      toast.success('Order saved');
    } catch {
      toast.error('Failed to save order');
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
    } catch {
      toast.error('Failed to delete client');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', logo_url: '', website_url: '', email: '', industry: '',
      projects_count: 0, status: 'active',
      joined_date: new Date().toISOString().split('T')[0],
      background_color: '#f0f9ff',
    });
    setEditingClient(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'projects_count' ? parseInt(value) || 0 : value }));
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />
      <div className="main-content">
        <DashboardHeader icon="bi-people" title="Clients" subtitle="management" />
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle"><i className="bi bi-people-fill"></i></div>
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
                    <div className="stat-icon-circle"><i className="bi bi-check-circle"></i></div>
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
                    <div className="stat-icon-circle"><i className="bi bi-person-plus"></i></div>
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
                    <div>
                      <h4 className="mb-0">Client List</h4>
                      <small className="text-muted"><i className="bi bi-grip-vertical me-1"></i>Drag rows to reorder</small>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowModal(true); }}>
                      <i className="bi bi-plus-circle me-2"></i>Add Client
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}></th>
                          <th>Client Name</th><th>Logo</th><th>Email</th><th>Website</th><th>Projects</th><th>Status</th><th>Joined</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length > 0 ? clients.map((client, index) => (
                          <tr
                            key={client.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                            style={{ cursor: 'grab' }}
                          >
                            <td style={{ color: '#aaa' }}>
                              <i className="bi bi-grip-vertical fs-5"></i>
                            </td>
                            <td><span className="fw-semibold">{client.name}</span></td>
                            <td>
                              {client.logo_url ? (
                                <div style={{ width: '50px', height: '50px', backgroundColor: client.background_color || '#f0f9ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                                  <img src={client.logo_url} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                              ) : (
                                <span className="avatar-placeholder">{client.name.substring(0, 2).toUpperCase()}</span>
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
                              <span className={`badge px-3 py-2 rounded-pill ${client.status === 'active' ? 'bg-success bg-opacity-25 text-success' : 'bg-warning bg-opacity-25 text-warning'}`}>
                                {client.status}
                              </span>
                            </td>
                            <td>{new Date(client.joined_date!).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(client)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(client.id!)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={9} className="text-center">No clients found</td></tr>
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
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" name="email" value={formData.email || ''} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Website URL</label>
                      <input type="text" className="form-control" name="website_url" value={formData.website_url || ''} onChange={handleChange} placeholder="https://example.com" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Industry</label>
                      <input type="text" className="form-control" name="industry" value={formData.industry || ''} onChange={handleChange} />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Client Logo"
                    currentImageUrl={formData.logo_url}
                    onImageChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                    folder="clients"
                    backgroundColor={formData.background_color}
                  />
                  <div className="mb-3">
                    <label className="form-label">Background Color</label>
                    <div className="d-flex gap-2 align-items-center mb-2">
                      <input type="color" className="form-control form-control-color" name="background_color" value={formData.background_color || '#f0f9ff'} onChange={handleChange} style={{ width: '60px', height: '40px' }} />
                      <input type="text" className="form-control" name="background_color" value={formData.background_color || '#f0f9ff'} onChange={handleChange} placeholder="#f0f9ff" style={{ maxWidth: '120px' }} />
                    </div>
                    <div className="d-flex gap-1 flex-wrap">
                      {['#f0f9ff', '#fef3c7', '#fce7f3', '#dbeafe', '#e0e7ff', '#fef2f2', '#ecfccb', '#f3e8ff'].map(color => (
                        <button key={color} type="button" className="btn btn-sm" style={{ width: '35px', height: '35px', backgroundColor: color, border: formData.background_color === color ? '3px solid #0d4be1' : '1px solid #dee2e6', borderRadius: '6px', padding: 0 }} onClick={() => setFormData(prev => ({ ...prev, background_color: color }))} title={color} />
                      ))}
                    </div>
                    <small className="text-muted d-block mt-2">Choose a background color for the logo display</small>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Projects Count</label>
                      <input type="number" className="form-control" name="projects_count" value={formData.projects_count || 0} onChange={handleChange} min="0" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Joined Date</label>
                      <input type="date" className="form-control" name="joined_date" value={formData.joined_date || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingClient ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
