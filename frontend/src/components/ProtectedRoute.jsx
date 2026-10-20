import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredRole, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const target = user.role === 'admin' ? '/admin/dashboard' : '/tickets';
    return <Navigate to={target} replace />;
  }

  return children;
}
