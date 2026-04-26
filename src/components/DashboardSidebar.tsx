'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '../../lib/auth';
import { toast } from 'react-toastify';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'AD';
    const fullName = user.user_metadata?.full_name || user.email || '';
    if (fullName.includes(' ')) {
      return fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Loading...';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img src="/assets/img/logo.png" alt="Qualixe Logo" style={{ width: '120px', height: 'auto' }} />
        </div>
        <div className="shopify-tag mt-2"><i className="bi bi-shop me-1"></i>shopify theme dev</div>
      </div>

      <div className="nav-sidebar">
        <div className="nav-item">
          <Link href="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> <span>Dashboard</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/portfolio" className={`nav-link ${isActive('/dashboard/portfolio') ? 'active' : ''}`}>
            <i className="bi bi-briefcase"></i> <span>Portfolio</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/brands" className={`nav-link ${isActive('/dashboard/brands') ? 'active' : ''}`}>
            <i className="bi bi-award"></i> <span>Brands</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/clients" className={`nav-link ${isActive('/dashboard/clients') ? 'active' : ''}`}>
            <i className="bi bi-people"></i> <span>Clients</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/team" className={`nav-link ${isActive('/dashboard/team') ? 'active' : ''}`}>
            <i className="bi bi-person-badge"></i> <span>Team</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/themes" className={`nav-link ${isActive('/dashboard/themes') ? 'active' : ''}`}>
            <i className="bi bi-palette"></i> <span>Themes</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/contacts" className={`nav-link ${isActive('/dashboard/contacts') ? 'active' : ''}`}>
            <i className="bi bi-envelope"></i> <span>Messages</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/blog" className={`nav-link ${isActive('/dashboard/blog') ? 'active' : ''}`}>
            <i className="bi bi-file-earmark-text"></i> <span>Blog</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/blog/comments" className={`nav-link ${isActive('/dashboard/blog/comments') ? 'active' : ''}`}>
            <i className="bi bi-chat-dots"></i> <span>Comments</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/analytics" className={`nav-link ${isActive('/dashboard/analytics') ? 'active' : ''}`}>
            <i className="bi bi-graph-up"></i> <span>Analytics</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/products" className={`nav-link ${isActive('/dashboard/products') ? 'active' : ''}`}>
            <i className="bi bi-box-seam"></i> <span>Products</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/files" className={`nav-link ${isActive('/dashboard/files') ? 'active' : ''}`}>
            <i className="bi bi-file-zip"></i> <span>Files</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/orders" className={`nav-link ${isActive('/dashboard/orders') ? 'active' : ''}`}>
            <i className="bi bi-receipt"></i> <span>Orders</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/media" className={`nav-link ${isActive('/dashboard/media') ? 'active' : ''}`}>
            <i className="bi bi-images"></i> <span>Media</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link href="/dashboard/users" className={`nav-link ${isActive('/dashboard/users') ? 'active' : ''}`}>
            <i className="bi bi-person-gear"></i> <span>Users</span>
          </Link>
        </div>
      </div>

      <div className="nav-sidebar" style={{ marginTop: 'auto', paddingTop: 0, paddingBottom: '0.5rem' }}>
        <div className="nav-item">
          <Link href="/dashboard/settings" className={`nav-link ${isActive('/dashboard/settings') ? 'active' : ''}`}>
            <i className="bi bi-gear"></i> <span>Settings</span>
          </Link>
        </div>
        <div className="nav-item">
          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}>
            <i className="bi bi-box-arrow-right"></i> <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#0c3cc3',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {loading ? '...' : getUserInitials()}
        </div>
        <div className="user-info">
          <div className="user-name">{getDisplayName()}</div>
          <div className="user-role">administrator</div>
        </div>
      </div>
    </div>
  );
}
