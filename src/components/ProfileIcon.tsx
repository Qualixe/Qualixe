'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './ProfileIcon.css';

export default function ProfileIcon() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setLoggedIn(true);
        const name = data.session.user.user_metadata?.full_name || data.session.user.email || '';
        setInitials(name.slice(0, 2).toUpperCase());
      }
    });

    // Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoggedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.email || '';
        setInitials(name.slice(0, 2).toUpperCase());
      } else {
        setLoggedIn(false);
        setInitials('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loggedIn) {
    return (
      <Link href="/account/downloads" className="profile-icon-btn profile-icon-btn--active" aria-label="My downloads">
        <span className="profile-icon-initials">{initials}</span>
      </Link>
    );
  }

  return (
    <Link href="/account/login" className="profile-icon-btn" aria-label="Sign in">
      <User size={22} />
    </Link>
  );
}
