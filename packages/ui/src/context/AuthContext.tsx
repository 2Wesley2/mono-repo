import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthentication } from '../services/auth';

const AuthContext = createContext<{ isAuthenticated: boolean | null }>({ isAuthenticated: null });

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuthentication();
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
