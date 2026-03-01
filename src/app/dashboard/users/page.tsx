'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserStats,
  searchUsers,
  resetUserPassword,
  UserProfile,
} from '../../../../lib/api/users';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [stats, setStats] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    status: 'active',
    phone: '',
    department: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterStatus, filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, {
          full_name: formData.full_name,
          role: formData.role,
          status: formData.status,
          phone: formData.phone,
          department: formData.department,
          bio: formData.bio,
        });
        toast.success('User updated successfully');
      } else {
        // Create new user
        if (!formData.password || formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        await createUser(formData);
        toast.success('User created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateUserStatus(id, status);
      toast.success('User status updated');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await resetUserPassword(passwordData.userId, passwordData.newPassword);
      toast.success('Password reset successfully');
      setShowPasswordModal(false);
      setPasswordData({ userId: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error('Failed to reset password');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      department: user.department || '',
      bio: user.bio || '',
    });
    setShowModal(true);
  };

  const openViewModal = (user: UserProfile) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const openPasswordModal = (userId: string) => {
    setPasswordData({ userId, newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      status: 'active',
      phone: '',
      department: '',
      bio: '',
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'editor':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'inactive':
        return 'bg-secondary';
      case 'suspended':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-people" title="Users" subtitle="management" />

        {/* Stats Cards */}
        {stats && (
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-people"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">total users</span>
                    <h2 className="fw-bold mt-1 mb-0">{stats.total_users}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">active</span>
                    <h2 className="fw-bold mt-1 mb-0">{stats.active_users}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">admins</span>
                    <h2 className="fw-bold mt-1 mb-0">{stats.admin_users}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-person-plus"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">new (30d)</span>
                    <h2 className="fw-bold mt-1 mb-0">{stats.new_users_30d}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="card p-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-primary" onClick={openCreateModal}>
                <i className="bi bi-plus-circle me-2"></i>Add User
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card p-4">
          <div className="table-responsive">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox display-4 d-block mb-3"></i>
                <p>No users found</p>
              </div>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px', fontSize: '14px' }}
                          >
                            {(user.full_name && user.full_name.charAt(0).toUpperCase()) || 
                             (user.email && user.email.charAt(0).toUpperCase()) || 
                             'U'}
                          </div>
                          <span className="fw-semibold">{user.full_name || 'No name'}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.department || '-'}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openViewModal(user)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => openEditModal(user)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => openPasswordModal(user.id)}
                            title="Reset Password"
                          >
                            <i className="bi bi-key"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={!!editingUser}
                          />
                        </div>
                        {!editingUser && (
                          <div className="col-md-12">
                            <label className="form-label">Password *</label>
                            <input
                              type="password"
                              className="form-control"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required={!editingUser}
                              minLength={6}
                              placeholder="Minimum 6 characters"
                            />
                          </div>
                        )}
                        <div className="col-md-6">
                          <label className="form-label">Role</label>
                          <select
                            className="form-select"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          >
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <select
                            className="form-select"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          ></textarea>
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
                      <button type="submit" className="btn btn-primary">
                        {editingUser ? 'Update User' : 'Create User'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {/* View Modal */}
        {showViewModal && viewingUser && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">User Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowViewModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="text-center mb-4">
                      <div
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: '80px', height: '80px', fontSize: '32px' }}
                      >
                        {(viewingUser.full_name && viewingUser.full_name.charAt(0).toUpperCase()) ||
                          (viewingUser.email && viewingUser.email.charAt(0).toUpperCase()) ||
                          'U'}
                      </div>
                      <h5 className="mb-1">{viewingUser.full_name || 'No name'}</h5>
                      <p className="text-muted mb-2">{viewingUser.email}</p>
                      <div className="d-flex gap-2 justify-content-center">
                        <span className={`badge ${getRoleBadgeClass(viewingUser.role)}`}>
                          {viewingUser.role}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(viewingUser.status)}`}>
                          {viewingUser.status}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="row g-3">
                      <div className="col-6">
                        <small className="text-muted d-block">Phone</small>
                        <span>{viewingUser.phone || '-'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Department</small>
                        <span>{viewingUser.department || '-'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Joined</small>
                        <span>{new Date(viewingUser.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Last Updated</small>
                        <span>{new Date(viewingUser.updated_at).toLocaleDateString()}</span>
                      </div>
                      {viewingUser.bio && (
                        <div className="col-12">
                          <small className="text-muted d-block">Bio</small>
                          <p className="mb-0">{viewingUser.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowViewModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Password Reset Modal */}
        {showPasswordModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Reset Password</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowPasswordModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handlePasswordReset}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          required
                          minLength={6}
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowPasswordModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-warning">
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
