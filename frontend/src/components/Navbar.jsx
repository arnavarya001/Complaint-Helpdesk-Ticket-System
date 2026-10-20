import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/tickets') : '/login'} className="navbar-brand">
          🎧 <strong>HelpDesk</strong>
        </Link>

        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'customer' ? (
                <>
                  <Link to="/tickets" className="nav-link">My Tickets</Link>
                  <Link to="/tickets/new" className="nav-link">+ New Ticket</Link>
                </>
              ) : (
                <>
                  <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/admin/tickets" className="nav-link">Manage Tickets</Link>
                  <Link to="/admin/departments" className="nav-link">Departments</Link>
                </>
              )}
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-xs">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-xs">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
