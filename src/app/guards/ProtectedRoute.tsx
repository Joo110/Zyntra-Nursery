import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/providers/authStore';
import { ROUTES } from '@/app/router/routes.constants';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
