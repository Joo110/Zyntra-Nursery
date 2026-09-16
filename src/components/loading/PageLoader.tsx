import { Loader2 } from 'lucide-react';

export function PageLoader({ label = 'جاري التحميل...' }: { label?: string }) {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-neutral-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
