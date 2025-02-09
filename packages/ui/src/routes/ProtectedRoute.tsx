import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRouteProps } from '../types/protected-route';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
