'use client';

import { useEffect, useState, useRef } from 'react';
import { contactsAPI, Contact } from '../../lib/api/contacts';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch recent contact messages
      const contacts = await contactsAPI.getAll();
      const recentContacts = contacts?.slice(0, 5) || [];
      
      // Format as notifications
      const contactNotifications = recentContacts.map((contact: Contact) => ({
        id: contact.id,
        type: 'contact',
        title: 'New Contact Message',
        message: `${contact.full_name} sent a message`,
        time: getTimeAgo(contact.created_at!),
        icon: 'bi-envelope',
        link: '/dashboard/contacts',
        unread: isRecent(contact.created_at!),
      }));

      setNotifications(contactNotifications);
      setUnreadCount(contactNotifications.filter(n => n.unread).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const isRecent = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours < 24; // Consider messages from last 24 hours as unread
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = () => {
    setShowDropdown(false);
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
      <div 
        className="notification-badge" 
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.65rem', padding: '0.25em 0.5em' }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div 
          className="notification-dropdown-menu"
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: '350px',
            maxHeight: '500px',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          <div 
            style={{
              padding: '1rem',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h6 style={{ margin: 0, fontWeight: 600 }}>Notifications</h6>
            {unreadCount > 0 && (
              <span 
                className="badge bg-primary"
                style={{ fontSize: '0.75rem' }}
              >
                {unreadCount} new
              </span>
            )}
          </div>

          <div>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={handleNotificationClick}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f1f3f5',
                      cursor: 'pointer',
                      backgroundColor: notification.unread ? '#f8f9fa' : 'white',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f3f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.unread ? '#f8f9fa' : 'white';
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e7f1ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <i 
                          className={notification.icon}
                          style={{ color: '#0d4be1', fontSize: '1.1rem' }}
                        ></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          {notification.title}
                        </div>
                        <div 
                          style={{ 
                            fontSize: '0.8rem', 
                            color: '#6c757d',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {notification.message}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginTop: '0.25rem' }}>
                          {notification.time}
                        </div>
                      </div>
                      {notification.unread && (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#0d4be1',
                            flexShrink: 0,
                            marginTop: '0.5rem',
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div 
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6c757d',
                }}
              >
                <i className="bi bi-bell-slash" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No notifications</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/dashboard/contacts"
              onClick={handleNotificationClick}
              style={{
                display: 'block',
                padding: '0.75rem',
                textAlign: 'center',
                borderTop: '1px solid #e9ecef',
                color: '#0d4be1',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              View All Messages
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
