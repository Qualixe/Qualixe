'use client';

import { useEffect, useState, useRef } from 'react';
import { contactsAPI, Contact } from '../../lib/api/contacts';
import Link from 'next/link';

interface NotificationItem {
  id?: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  link: string;
  unread: boolean;
}

function isRecent(dateString: string) {
  const diffHours = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60);
  return diffHours < 24; // messages from the last 24 hours count as "new"
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    contactsAPI.getAll()
      .then((contacts) => {
        if (!alive) return;
        const items: NotificationItem[] = ((contacts ?? []) as Contact[]).slice(0, 5).map((contact) => ({
          id: contact.id,
          type: 'contact',
          title: 'New Contact Message',
          message: `${contact.full_name} sent a message`,
          time: getTimeAgo(contact.created_at!),
          icon: 'bi-envelope',
          link: '/dashboard/contacts',
          unread: isRecent(contact.created_at!),
        }));
        setNotifications(items);
        setUnreadCount(items.filter((n) => n.unread).length);
      })
      .catch((error) => console.error('Failed to fetch notifications:', error));

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      alive = false;
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = () => {
    setShowDropdown(false);
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="notification-badge"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={showDropdown}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} new)` : ''}`}
      >
        <i className="bi bi-bell" aria-hidden="true"></i>
        {unreadCount > 0 && <span className="notif-dot" aria-hidden="true" />}
      </button>

      {showDropdown && (
        <div className="dash-menu dash-menu--wide" role="menu">
          <div className="dash-menu__title">
            <span>Notifications</span>
            {unreadCount > 0 && <span className="dash-pill">{unreadCount} new</span>}
          </div>

          <div className="notif-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={handleNotificationClick}
                  className={`notif-item${notification.unread ? ' is-unread' : ''}`}
                  role="menuitem"
                >
                  <span className="notif-item__icon" aria-hidden="true"><i className={notification.icon}></i></span>
                  <span className="notif-item__body">
                    <span className="notif-item__title">{notification.title}</span>
                    <span className="notif-item__text">{notification.message}</span>
                    <span className="notif-item__time">{notification.time}</span>
                  </span>
                  {notification.unread && <span className="notif-item__dot" aria-hidden="true" />}
                </Link>
              ))
            ) : (
              <div className="notif-empty">
                <i className="bi bi-bell-slash" aria-hidden="true"></i>
                <p>You&apos;re all caught up 🎉</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <Link href="/dashboard/contacts" onClick={handleNotificationClick} className="dash-menu__foot">
              View all messages
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
