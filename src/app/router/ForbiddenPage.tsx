import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from './routes.constants';

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100 px-4 text-center">
      <ShieldAlert className="h-16 w-16 text-warning" />
      <h1 className="text-2xl font-bold text-neutral-900">ليس لديك صلاحية</h1>
      <p className="text-sm text-neutral-500">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
