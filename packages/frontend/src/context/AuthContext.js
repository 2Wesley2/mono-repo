import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/getRole');
        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
        }
      } catch (error) {
        console.error('Erro ao buscar role:', error);
      }
    };

    fetchRole();
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
