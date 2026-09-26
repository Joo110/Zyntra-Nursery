import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChildrenReport } from '../hooks/useChildren';
import { useBranchStore } from '@/app/providers/branchStore';
import { Period } from '@/types/enums.types';

const genderLabel = (g: number) => (g === 1 ? 'ذكر' : 'أنثى');
const periodLabel = (p: Period) => (p === Period.AM ? 'صباحي' : 'مسائي');

export function ChildrenPrintPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id) ?? '';
  const branchName = useBranchStore((s) => s.selectedBranch?.name) ?? '';
  const [searchParams] = useSearchParams();

  const departmentId = searchParams.get('departmentId') ?? undefined;
  const period = searchParams.get('period') ? (Number(searchParams.get('period')) as Period) : undefined;
  const name = searchParams.get('search') ?? undefined;

  const { data, isLoading } = useChildrenReport(branchId, departmentId, period, name);

  useEffect(() => {
    if (!isLoading && data) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  if (isLoading) return <div className="p-8 text-center">جاري تجهيز التقرير...</div>;

  return (
    <div className="print-page p-6">
      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          .no-print { display: none !important; }
        }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #999; padding: 6px 8px; text-align: right; }
        th { background: #f0f0f0; }
      `}</style>

      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={() => window.print()}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          طباعة
        </button>
      </div>

      <h1 className="mb-1 text-center text-xl font-bold">تقرير الطلاب — {branchName}</h1>
      <p className="mb-4 text-center text-sm text-neutral-500">
        تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')} — إجمالي الطلاب: {data?.length ?? 0}
      </p>

      <table>
        <thead>
          <tr>
            <th>م</th>
            <th>الاسم</th>
            <th>النوع</th>
            <th>المستوى</th>
            <th>الفصل</th>
            <th>الفترة</th>
            <th>رقم التواصل</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((child, i) => (
            <tr key={child.id}>
              <td>{i + 1}</td>
              <td>{child.name || '—'}</td>
              <td>{genderLabel(child.gender)}</td>
              <td>{child.level || '—'}</td>
              <td>{child.class || '—'}</td>
              <td>{periodLabel(child.period)}</td>
              <td className="ltr-numerals">{child.callPhoneNumber || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}