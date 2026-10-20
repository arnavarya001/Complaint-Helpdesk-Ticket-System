import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredRole, children }) {
  const location = useLocation();

  if (!user) {
    // Redirect to login page and preserve destination location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Role mismatch: redirect to their authorized role home
    const target = user.role === 'admin' ? '/admin/dashboard' : '/tickets';
    return <Navigate to={target} replace />;
  }

  return children;
}
