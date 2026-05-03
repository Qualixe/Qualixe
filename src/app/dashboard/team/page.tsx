'use client';

import { useEffect, useRef, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ImageUploadField from '@/components/ImageUploadField';
import { teamAPI, TeamMember } from '../../../../lib/api/team';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyForm: TeamMember = {
  name: '',
  role: '',
  bio: '',
  image_url: '',
  linkedin_url: '',
  twitter_url: '',
  email: '',
  sort_order: 0,
  status: 'active',
};

export default function TeamDashboardPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMember>(emptyForm);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await teamAPI.getAllAdmin();
      setMembers(data || []);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.id) {
        await teamAPI.update(editing.id, formData);
        toast.success('Team member updated');
      } else {
        await teamAPI.create(formData);
        toast.success('Team member added');
      }
      setShowModal(false);
      resetForm();
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setFormData(member);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await teamAPI.delete(id);
      toast.success('Team member deleted');
      fetchMembers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === dropIndex) return;
    const reordered = [...members];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(dropIndex, 0, moved);
    dragIndex.current = null;
    setMembers(reordered);
    try {
      await teamAPI.updateOrder(
        reordered.map((m, i) => ({ id: m.id!, sort_order: i }))
      );
      toast.success('Order saved');
    } catch {
      toast.error('Failed to save order');
    }
  };

  const activeCount = members.filter((m) => m.status === 'active').length;
  const inactiveCount = members.filter((m) => m.status !== 'active').length;

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-people" title="Team" subtitle="members" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle"><i className="bi bi-people"></i></div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Total</span>
                      <h2 className="fw-bold mt-1 mb-0">{members.length}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle"><i className="bi bi-check-circle"></i></div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Active</span>
                      <h2 className="fw-bold mt-1 mb-0">{activeCount}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle"><i className="bi bi-dash-circle"></i></div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Inactive</span>
                      <h2 className="fw-bold mt-1 mb-0">{inactiveCount}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 className="mb-0">Team Members</h4>
                      <small className="text-muted">
                        <i className="bi bi-grip-vertical me-1"></i>Drag rows to reorder
                      </small>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => { resetForm(); setShowModal(true); }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add Member
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}></th>
                          <th>Photo</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4 text-muted">
                              No team members yet. Add your first one!
                            </td>
                          </tr>
                        ) : (
                          members.map((member, index) => (
                            <tr
                              key={member.id}
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop(index)}
                              style={{ cursor: 'grab' }}
                            >
                              <td style={{ color: '#aaa' }}>
                                <i className="bi bi-grip-vertical fs-5"></i>
                              </td>
                              <td>
                                {member.image_url ? (
                                  <img
                                    src={member.image_url}
                                    alt={member.name}
                                    style={{
                                      width: 48,
                                      height: 48,
                                      objectFit: 'cover',
                                      borderRadius: '50%',
                                      border: '2px solid #e8edf5',
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: '50%',
                                      background: '#e8f0ff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#0c3cc3',
                                      fontSize: 20,
                                    }}
                                  >
                                    <i className="bi bi-person" />
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="fw-semibold">{member.name}</span>
                              </td>
                              <td>{member.role}</td>
                              <td>{member.email || '—'}</td>
                              <td>
                                <span
                                  className={`badge px-3 py-2 rounded-pill ${
                                    member.status === 'active'
                                      ? 'bg-success bg-opacity-25 text-success'
                                      : 'bg-secondary bg-opacity-25 text-secondary'
                                  }`}
                                >
                                  {member.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEdit(member)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(member.id!)}
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
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? 'Edit Team Member' : 'Add Team Member'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Role / Position *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g. Lead Developer"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Short description about this team member..."
                    />
                  </div>

                  <ImageUploadField
                    label="Profile Photo"
                    currentImageUrl={formData.image_url}
                    onImageChange={(url) =>
                      setFormData((prev) => ({ ...prev, image_url: url }))
                    }
                    folder="team"
                  />

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">LinkedIn URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="linkedin_url"
                        value={formData.linkedin_url || ''}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Twitter / X URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="twitter_url"
                        value={formData.twitter_url || ''}
                        onChange={handleChange}
                        placeholder="https://twitter.com/..."
                      />
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
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : editing ? (
                      'Update Member'
                    ) : (
                      'Add Member'
                    )}
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
