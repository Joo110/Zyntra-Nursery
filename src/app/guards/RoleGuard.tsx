import type { ReactNode } from 'react';
import { useAuthStore } from '@/app/providers/authStore';
import { UserRole } from '@/types/enums.types';

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
  const role = useAuthStore((s) => s.user?.role);
  if (role === undefined || !allow.includes(role)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
