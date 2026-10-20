import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ email, password });
      onLoginSuccess(data, data.token);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/tickets');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCreds = (eMail, pwd) => {
    setEmail(eMail);
    setPassword(pwd);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <h2 style={{ textAlign: 'center' }}>HelpDesk Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '13px' }}>
          <p>Demo Fill:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '5px' }}>
            <button type="button" onClick={() => fillCreds('admin@helpdesk.com', 'admin123')} className="btn btn-secondary btn-xs">Admin</button>
            <button type="button" onClick={() => fillCreds('john@example.com', 'user123')} className="btn btn-secondary btn-xs">Customer</button>
          </div>
        </div>

        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
