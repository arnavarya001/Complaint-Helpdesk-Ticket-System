import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="navbar-container">
        <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/tickets') : '/login'} className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo-icon">🎧</div>
          <div className="brand-text">
            <span className="brand-title">HelpDesk</span>
            <span className="brand-sub">Ticket System</span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
          {user ? (
            <>
              {user.role === 'customer' && (
                <div className="nav-group">
                  <NavLink
                    to="/tickets"
                    end
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    My Tickets
                  </NavLink>
                  <NavLink
                    to="/tickets/new"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    + New Ticket
                  </NavLink>
                </div>
              )}

              {user.role === 'admin' && (
                <div className="nav-group">
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/tickets"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    Manage Tickets
                  </NavLink>
                  <NavLink
                    to="/admin/departments"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    Departments
                  </NavLink>
                </div>
              )}

              <div className="nav-user-panel">
                <div className="user-info-chip">
                  <div className="user-avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details-text">
                    <span className="user-name">{user.name}</span>
                    <span className={`user-role-tag role-${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="btn btn-logout"
                  title="Sign out of your account"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-group nav-auth-group">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
                onClick={closeMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
