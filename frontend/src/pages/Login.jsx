import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import Alert from '../components/Alert';

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);
      onLoginSuccess(data, data.token);

      // Redirect to intended page or role default
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (data.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/tickets', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-icon-badge">🔐</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage complaints and support tickets</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Test Credential Pills for Easy Demonstration */}
        <div className="test-credentials-box">
          <span className="test-credentials-title">Quick Demo Login:</span>
          <div className="test-btn-group">
            <button
              type="button"
              className="btn btn-chip"
              onClick={() => fillCredentials('admin@helpdesk.com', 'admin123')}
            >
              👑 Fill Admin (admin@helpdesk.com)
            </button>
            <button
              type="button"
              className="btn btn-chip"
              onClick={() => fillCredentials('john@example.com', 'user123')}
            >
              👤 Fill Customer (john@example.com)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
