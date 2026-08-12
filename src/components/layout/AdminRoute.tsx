import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute: React.FC = () => {
  const { currentUser, hasRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(['super_admin', 'department_admin'])) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
