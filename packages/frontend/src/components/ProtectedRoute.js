'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import debug from '../debug/index';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        debug.logger.warn('Usuário não autenticado. Redirecionando...');
        router.push('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        debug.logger.warn(`Acesso negado. Role necessário: ${requiredRole}, Role do usuário: ${user.role}`);
        router.push('/unauthorized');
      } else {
        debug.logger.info(`Acesso autorizado para o usuário com role: ${user.role}`);
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) return <div>Carregando...</div>;

  return children;
}
