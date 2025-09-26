import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication status
  if (isLoading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login with the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render the protected component
  return children;
};

export default ProtectedRoute;