import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import Alert from '../components/Alert';

export default function Register({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      onLoginSuccess(data, data.token);
      if (data.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/tickets', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-icon-badge">📝</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join HelpDesk to submit and monitor your support tickets</p>
        </div>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name <span className="required">*</span></label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Arnav Arya"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address <span className="required">*</span></label>
            <input
              id="reg-email"
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
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password <span className="required">*</span></label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm Password <span className="required">*</span></label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-role" className="form-label">Account Role</label>
            <select
              id="reg-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="customer">Customer (Submit & track complaints)</option>
              <option value="admin">Support / Admin (Manage tickets & departments)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}
