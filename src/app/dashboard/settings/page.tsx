'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import { authAPI } from '../../../../lib/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Account info
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || '');
        setFullName(currentUser.user_metadata?.full_name || '');
        
        // Format member since date
        if (currentUser.created_at) {
          const date = new Date(currentUser.created_at);
          setMemberSince(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update user metadata (full name)
      await authAPI.updateProfile({ full_name: fullName });
      
      toast.success('Profile updated successfully!');
      await loadUserData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      await authAPI.updatePassword(newPassword);
      toast.success('Password updated successfully!');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <DashboardSidebar />
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-gear me-2"></i>Settings <span>/</span> Profile</h5>
          <div className="top-bar-right">
            <NotificationDropdown />
            <div className="avatar-small">
              {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Profile Settings */}
            <div className="card p-4 mb-4">
              <h5 className="mb-4">Profile Settings</h5>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    disabled
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Role</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value="Administrator"
                    disabled
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="card p-4 mb-4">
              <h5 className="mb-4">Change Password</h5>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving || !newPassword || !confirmPassword}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="card p-4 border-danger">
              <h5 className="mb-3 text-danger">Danger Zone</h5>
              <p className="text-muted mb-3">Sign out from your account</p>
              <button 
                className="btn btn-outline-danger"
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Account Info */}
            <div className="card p-4 mb-4">
              <h5 className="mb-4">Account Info</h5>
              <div className="mb-3">
                <p className="text-secondary small mb-1">Account Type</p>
                <p className="fw-semibold">Administrator</p>
              </div>
              <div className="mb-3">
                <p className="text-secondary small mb-1">Member Since</p>
                <p className="fw-semibold">{memberSince || 'N/A'}</p>
              </div>
              <div className="mb-3">
                <p className="text-secondary small mb-1">Email</p>
                <p className="fw-semibold text-break">{email}</p>
              </div>
              <div className="mb-3">
                <p className="text-secondary small mb-1">User ID</p>
                <p className="fw-semibold small text-break" style={{ fontSize: '0.75rem' }}>
                  {user?.id?.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-4">
              <h5 className="mb-4">Quick Stats</h5>
              <div className="mb-3">
                <p className="text-secondary small mb-1">Last Login</p>
                <p className="fw-semibold">
                  {user?.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
