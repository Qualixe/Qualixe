'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '../../lib/auth';

export default function UserAvatar() {
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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'AD';
    const fullName = user.user_metadata?.full_name || user.email || '';
    if (fullName.includes(' ')) {
      return fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="avatar-small">...</div>;
  }

  return <div className="avatar-small">{getUserInitials()}</div>;
}
