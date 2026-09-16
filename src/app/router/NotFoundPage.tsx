import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from './routes.constants';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100 px-4 text-center">
      <FileQuestion className="h-16 w-16 text-neutral-400" />
      <h1 className="text-2xl font-bold text-neutral-900">الصفحة غير موجودة</h1>
      <p className="text-sm text-neutral-500">عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
