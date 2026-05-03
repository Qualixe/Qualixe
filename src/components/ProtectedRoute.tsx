'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading]           = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authAPI.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Single source of truth: user_profiles.role = 'admin'
        const admin = await authAPI.isAdmin();
        if (admin) {
          setAuthenticated(true);
        } else {
          // Logged in but not an admin — send home
          router.push('/');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#0c3cc3',
      }}>
        Loading...
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
