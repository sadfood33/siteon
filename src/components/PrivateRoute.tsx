import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
