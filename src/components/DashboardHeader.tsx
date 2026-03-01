'use client';

import DashboardSearch from './DashboardSearch';
import NotificationDropdown from './NotificationDropdown';
import UserAvatar from './UserAvatar';

interface DashboardHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode; // Custom actions like filters, buttons, etc.
}

export default function DashboardHeader({ icon, title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="top-bar">
      <h5 className="page-title">
        <i className={`${icon} me-2`}></i>
        {title}
        {subtitle && (
          <>
            {' '}
            <span>/</span> {subtitle}
          </>
        )}
      </h5>
      <div className="top-bar-right">
        {actions}
        <DashboardSearch />
        <NotificationDropdown />
        <UserAvatar />
      </div>
    </div>
  );
}
