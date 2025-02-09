import { ReactElement } from 'react';

export interface ProtectedRouteProps {
  element: ReactElement;
  isAuthenticated: boolean;
}
