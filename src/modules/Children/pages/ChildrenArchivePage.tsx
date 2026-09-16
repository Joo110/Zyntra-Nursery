import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRightCircle, ArrowRight } from 'lucide-react';
import { useChildrenArchive, useSetChildActive } from '../hooks/useChildren';
import type { ChildListDto } from '../types/child.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { GenderBadge } from '@/components/common/GenderBadge';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';
import { ROUTES } from '@/app/router/routes.constants';

const PAGE_SIZE = 10;

export function ChildrenArchivePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;

  const [restoring, setRestoring] = useState<ChildListDto | null>(null);

  const { data, isLoading, isError } = useChildrenArchive(branchId ?? '', departmentId, period, pageNumber, PAGE_SIZE);
  const setActive = useSetChildActive(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<ChildListDto>[] = [
    { key: 'name', header: 'اسم الطالب', render: (row) => row.name || '—' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'level', header: 'المستوى', render: (row) => row.level || '—' },
    { key: 'class', header: 'الفصل', render: (row) => row.class || '—' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.CHILDREN)} className="rounded-md p-2 hover:bg-neutral-200" aria-label="رجوع">
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">أرشيف الطلاب</h1>
          <p className="text-sm text-neutral-500">الطلاب غير النشطين حاليًا</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, page: '1' })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), page: '1' })} />
      </div>

      {!departmentId ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-surface p-10 text-center text-sm text-neutral-500">
          برجاء اختيار قسم لعرض الأرشيف
        </div>
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            getRowId={(row) => row.id}
            emptyMessage="لا يوجد طلاب بالأرشيف"
            rowActions={(row) => (
              <button onClick={() => setRestoring(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-secondary" aria-label="استرجاع">
                <ArrowRightCircle className="h-4 w-4" />
              </button>
            )}
          />
          {data && (
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        onConfirm={() => restoring && setActive.mutate({ id: restoring.id, isActive: true }, { onSuccess: () => setRestoring(null) })}
        title="استرجاع الطالب"
        message={`هل تريد استرجاع الطالب "${restoring?.name}" من الأرشيف؟`}
        confirmLabel="استرجاع"
        isLoading={setActive.isPending}
      />
    </div>
  );
}
