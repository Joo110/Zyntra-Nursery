import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Cake } from 'lucide-react';
import { useChildrenBirthdays } from '../hooks/useChildren';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';
import { ROUTES } from '@/app/router/routes.constants';
import type { ChildBirthDateNotificationDto } from '../types/child.types';

export function ChildrenBirthdaysPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;

  const { data, isLoading, isError } = useChildrenBirthdays(branchId ?? '', departmentId, period, 1, 50);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<ChildBirthDateNotificationDto>[] = [
    { key: 'name', header: 'اسم الطالب', render: (row) => row.name || '—' },
    { key: 'messageNumber', header: 'رقم التواصل', render: (row) => <span className="ltr-numerals">{row.messageNumber}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.CHILDREN)} className="rounded-md p-2 hover:bg-neutral-200" aria-label="رجوع">
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Cake className="h-5 w-5 text-warning" /> أعياد ميلاد اليوم
          </h1>
          <p className="text-sm text-neutral-500">الطلاب الذين يوافق تاريخ ميلادهم اليوم</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p) })} />
      </div>

      {!departmentId ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-surface p-10 text-center text-sm text-neutral-500">
          برجاء اختيار قسم
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد أعياد ميلاد اليوم بهذا القسم"
        />
      )}
    </div>
  );
}
