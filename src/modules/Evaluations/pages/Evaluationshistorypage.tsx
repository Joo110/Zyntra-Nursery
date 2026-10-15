import { useSearchParams } from 'react-router-dom';
import { History } from 'lucide-react';
import { useWinnerHistory } from '../hooks/useEvaluations';
import type { WinnerHistoryDto } from '../types/evaluation.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function EvaluationsHistoryPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get('page') ?? '1');

  const { data, isLoading, isError } = useWinnerHistory(branchId ?? '', pageNumber, PAGE_SIZE);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<WinnerHistoryDto>[] = [
    {
      key: 'date',
      header: 'التاريخ',
      render: (row) => <span className="ltr-numerals">{new Date(row.date).toLocaleDateString('ar-EG')}</span>,
    },
    { key: 'childName', header: 'الاسم' },
    {
      key: 'degree',
      header: 'الدرجة',
      render: (row) => <span className="ltr-numerals font-bold">{row.degree}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
          <History className="h-5 w-5" /> سجل الفائزين
        </h1>
        <p className="text-sm text-neutral-500">استعراض الفائزين السابقين</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row, i) => `${row.childName}-${row.date}-${i}`}
          emptyMessage="لا يوجد سجل فائزين سابق"
        />
        {data && (
          <div className="border-t border-neutral-100 px-4 py-3">
            <Pagination
              pageNumber={data.pageNumber}
              totalPages={data.totalPages}
              hasNextPage={data.hasNextPage}
              hasPreviousPage={data.hasPreviousPage}
              totalCount={data.totalCount}
              onPageChange={(p) => updateParams({ page: String(p) })}
            />
          </div>
        )}
      </div>
    </div>
  );
}