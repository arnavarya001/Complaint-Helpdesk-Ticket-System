import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ user }) {
  const homeTarget = user ? (user.role === 'admin' ? '/admin/dashboard' : '/tickets') : '/login';

  return (
    <div className="page-container notfound-container">
      <div className="notfound-card card">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          The page or ticket you are looking for doesn't exist, was removed, or you may not have permission to view it.
        </p>
        <Link to={homeTarget} className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
