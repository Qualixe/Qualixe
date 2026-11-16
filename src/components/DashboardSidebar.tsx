'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '../../lib/auth';
import { DASH_NAV, activeNavHref } from './dashboardNav';

type Profile = { role: string; status: string; full_name: string } | null;
type User = { email?: string; user_metadata?: { full_name?: string } } | null;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.all([authAPI.getCurrentUser(), authAPI.getUserProfile()])
      .then(([u, p]) => { setUser(u as User); setProfile(p as Profile); })
      .catch((err) => console.error('Error loading user:', err))
      .finally(() => setLoading(false));
  }, []);

  // Close the mobile drawer on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Lock page scroll + Escape to close while the drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open]);

  const active = activeNavHref(pathname);

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
    } finally {
      router.push('/login');
    }
  };

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
  const initials = name.split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';
  const role = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Administrator';

  return (
    <>
      {/* Mobile menu button (shown < 992px) */}
      <button
        type="button"
        className="dash-burger"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="dash-sidebar"
      >
        <i className="bi bi-list" aria-hidden="true" />
      </button>

      <div className={`dash-overlay${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside id="dash-sidebar" className={`sidebar${open ? ' is-open' : ''}`} aria-label="Dashboard navigation">
        <div className="sidebar-brand">
          <Link href="/dashboard" className="sidebar-logo" aria-label="Dashboard home">
            <Image src="/assets/img/logo.png" alt="Qualixe" width={118} height={40} priority style={{ height: 'auto' }} />
          </Link>
          <span className="sidebar-badge">Admin</span>
          <button type="button" className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <Link href="/" target="_blank" className="sidebar-site">
          <span className="sidebar-site__icon" aria-hidden="true"><i className="bi bi-globe2" /></span>
          <span>
            <strong>View website</strong>
            <small>qualixe.com</small>
          </span>
          <i className="bi bi-box-arrow-up-right sidebar-site__go" aria-hidden="true" />
        </Link>

        <nav className="nav-sidebar">
          {DASH_NAV.map((group) => (
            <div key={group.title} className="nav-group">
              <span className="nav-group__title">{group.title}</span>
              <ul>
                {group.items.map((item) => {
                  const isActive = item.href === active;
                  return (
                    <li key={item.href} className="nav-item">
                      <Link
                        href={item.href}
                        className={`nav-link${isActive ? ' active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <i className={`bi ${item.icon}`} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="sidebar-user__avatar" aria-hidden="true">{loading ? '…' : initials}</span>
          <div className="sidebar-user__info">
            <span className="user-name">{loading ? 'Loading…' : name}</span>
            <span className="user-role">{loading ? '' : role}</span>
          </div>
          <button type="button" className="sidebar-logout" onClick={handleLogout} aria-label="Log out" title="Log out">
            <i className="bi bi-box-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}
