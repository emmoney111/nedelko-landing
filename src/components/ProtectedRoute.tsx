import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AUTH_STORAGE_KEY } from '../config/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
