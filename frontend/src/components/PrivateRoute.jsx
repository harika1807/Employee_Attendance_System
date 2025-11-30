// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// roleProp can be 'employee' or 'manager' or omitted for any authenticated user
export default function PrivateRoute({ children, role: requiredRole }) {
  const { token, user } = useSelector(state => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // unauthorized role
    return <div className="p-6 text-center">You don't have permission to view this page.</div>;
  }

  return children;
}
