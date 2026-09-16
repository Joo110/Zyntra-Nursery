import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/providers/authStore';
import { ROUTES } from '@/app/router/routes.constants';

/**
 * ⚠️ راجع services/auth/authStorage.ts — هذا Guard يتحقق فقط من وجود جلسة محلية
 * (UX-level)، وليس حماية أمنية حقيقية، لأن الـ Backend لا يفرض أي Authorization فعلي حاليًا.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
