import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const loggedInUser = (() => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  })();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = loggedInUser.role ? loggedInUser.role.toLowerCase() : '';
    const hasRole = allowedRoles.some(r => r.toLowerCase() === userRole);
    if (!hasRole) {
      // Redirect unauthorized user to home page
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
