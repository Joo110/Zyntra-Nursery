import type { ReactNode } from 'react';
import { useAuthStore } from '@/app/providers/authStore';
import { UserRole } from '@/types/enums.types';

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * يخفي/يعرض عناصر UI حسب دور المستخدم الحالي — تحسين UX فقط (راجع Master Prompt بند 17).
 * ⚠️ Backend هو المصدر النهائي للصلاحيات؛ هذا الـ Guard ليس حدود أمان حقيقية لأن
 * الـ Backend لا يفرض [Authorize(Roles=...)] فعليًا حاليًا (راجع BACKEND_ISSUES.md - Issue #6).
 */
export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
  const role = useAuthStore((s) => s.user?.role);
  if (role === undefined || !allow.includes(role)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
