'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/auth';

const ADMIN_EMAILS = ['qualixe.info@gmail.com', 'qualixe.hridoy@gmail.com'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authAPI.getSession();
        const user = await authAPI.getCurrentUser();
        
        if (session && user) {
          // Check if user email is in admin list
          if (ADMIN_EMAILS.includes(user.email || '')) {
            setAuthenticated(true);
          } else {
            // User is logged in but not an admin
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

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
        color: '#0c3cc3'
      }}>
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
