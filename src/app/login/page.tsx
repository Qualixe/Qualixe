'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/auth';
import { isAdminEmail } from '../../../lib/adminEmails';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADMIN_EMAILS = ['qualixe.info@gmail.com', 'qualixe.hridoy@gmail.com']; // kept for reference — no longer used

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authAPI.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (error) {
        // User not logged in, stay on login page
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (loading) return; // Prevent multiple submissions
    
    // Check if email is in admin list
    if (!isAdminEmail(email)) {
      toast.error('Access denied. Only admin accounts can access the dashboard.');
      return;
    }
    
    setLoading(true);

    try {
      const data = await authAPI.signIn({ email, password });
      
      if (data && data.session) {
        toast.success('Login successful!');
        
        // Wait a moment for session to be fully established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use router.push for client-side navigation
        router.push('/dashboard');
      } else {
        toast.error('Login failed - no session created');
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer position="top-right" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-icon">
              <img src="/assets/img/logo.png" alt="Qualixe Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your Qualixe dashboard</p>
          </div>

          {!showForgotPassword ? (
            <>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="form-control-wrapper">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      className="login-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="form-control-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      type="password"
                      className="login-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-options">
                  <div className="form-check">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <button 
                    type="button" 
                    className="forgot-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  {!loading && <i className="bi bi-arrow-right"></i>}
                </button>
              </form>

              <div className="login-footer">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
              </div>
            </>
          ) : (
            <div className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-control-wrapper">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="button" 
                className="login-btn" 
                onClick={handleForgotPassword}
                disabled={loading}
              >
                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
              </button>

              <div className="login-footer" style={{ marginTop: '20px' }}>
                <button 
                  type="button"
                  className="forgot-link"
                  onClick={() => setShowForgotPassword(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
