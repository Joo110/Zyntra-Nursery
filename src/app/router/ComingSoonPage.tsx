import { Construction } from 'lucide-react';
import { Card } from '@/components/common/Card';

interface ComingSoonPageProps {
  title: string;
}


export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <Construction className="h-10 w-10 text-neutral-400" />
        <p className="text-sm text-neutral-500">هذه الصفحة قيد التنفيذ حسب خطة العمل.</p>
      </Card>
    </div>
  );
}
