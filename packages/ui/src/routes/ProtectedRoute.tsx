import React, { ReactElement } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute: React.FC<{
  element: ReactElement;
  redirectPath?: string;
}> = ({ element, redirectPath = '/login', ...rest }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return <Route {...rest} element={isAuthenticated ? element : <Navigate to={redirectPath} />} />;
};

export default React.memo(ProtectedRoute);
