'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Check if email is admin email
    const adminEmails = ['qualixe.info@gmail.com', 'qualixe.hridoy@gmail.com'];
    if (!adminEmails.includes(formData.email)) {
      toast.error('Signup is restricted. Please contact the administrator.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });
      
      toast.success('Account created! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
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
            <h2>Create Account</h2>
            <p>Sign up to access Qualixe dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-control-wrapper">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  name="full_name"
                  className="login-input"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-control-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  name="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  className="login-input"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-control-wrapper">
                <i className="bi bi-lock-fill"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  className="login-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
              {!loading && <i className="bi bi-arrow-right"></i>}
            </button>
          </form>

          <div className="login-footer">
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
