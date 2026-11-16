'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardSearch from './DashboardSearch';
import NotificationDropdown from './NotificationDropdown';
import UserAvatar from './UserAvatar';
import { activeNavHref, navGroupFor } from './dashboardNav';

interface DashboardHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode; // Custom actions like filters, buttons, etc.
}

export default function DashboardHeader({ icon, title, subtitle, actions }: DashboardHeaderProps) {
  const pathname = usePathname();
  const group = navGroupFor(activeNavHref(pathname));
  const iconClass = icon.startsWith('bi ') ? icon : `bi ${icon}`;

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <nav className="dash-crumbs" aria-label="Breadcrumb">
          <Link href="/dashboard">Dashboard</Link>
          {group && group.title !== 'Overview' && (
            <>
              <i className="bi bi-chevron-right" aria-hidden="true" />
              <span>{group.title}</span>
            </>
          )}
          {subtitle && (
            <>
              <i className="bi bi-chevron-right" aria-hidden="true" />
              <span className="dash-crumbs__current">{subtitle}</span>
            </>
          )}
        </nav>
        <h1 className="page-title">
          <span className="page-title__icon" aria-hidden="true"><i className={iconClass} /></span>
          {title}
        </h1>
      </div>

      <div className="top-bar-right">
        {actions}
        <DashboardSearch />
        <Link href="/" target="_blank" className="top-bar-btn" title="View website" aria-label="View website">
          <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
        </Link>
        <NotificationDropdown />
        <UserAvatar />
      </div>
    </header>
  );
}
