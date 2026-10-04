import { useSearchParams } from 'react-router-dom';
import { History, Check, Minus } from 'lucide-react';
import { useEvaluationHistory } from '../hooks/useEvaluations';
import { DEGREE_KEYS, type EvaluationHistoryDto } from '../types/evaluation.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { ClassSelector } from '@/components/common/ClassSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { GenderBadge } from '@/components/common/GenderBadge';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

const toInputDate = (d: Date) => d.toISOString().slice(0, 10);

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 7);
  return { from: toInputDate(from), to: toInputDate(to) };
}

function TotalBadge({ total }: { total: number }) {
  const tone =
    total >= 6 ? 'bg-green-50 text-green-700' : total >= 3 ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-600';
  return <span className={`ltr-numerals inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>{total}</span>;
}

export function EvaluationsHistoryPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  const range = defaultRange();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const dateFrom = searchParams.get('dateFrom') ?? range.from;
  const dateTo = searchParams.get('dateTo') ?? range.to;
  const classId = searchParams.get('classId') ?? '';
  const periodParam = searchParams.get('period');
  const period = periodParam ? (Number(periodParam) as Period) : undefined;

  const { data, isLoading, isError } = useEvaluationHistory(branchId ?? '', {
    dateFrom,
    dateTo,
    classId: classId || undefined,
    period,
    pageNumber,
    take: PAGE_SIZE,
  });

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    if (!('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  const columns: ColumnDef<EvaluationHistoryDto>[] = [
    {
      key: 'date',
      header: 'التاريخ',
      render: (row) => <span className="ltr-numerals">{new Date(row.date).toLocaleDateString('ar-EG')}</span>,
    },
    { key: 'childName', header: 'الاسم' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    ...DEGREE_KEYS.map((key, idx) => ({
      key,
      header: `م${idx + 1}`,
      render: (row: EvaluationHistoryDto) =>
        row[key] ? <Check className="h-4 w-4 text-green-600" /> : <Minus className="h-4 w-4 text-neutral-300" />,
    })),
    { key: 'totalDegrees', header: 'الإجمالي', render: (row) => <TotalBadge total={row.totalDegrees} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
          <History className="h-5 w-5" /> سجل التقييمات اليومية
        </h1>
        <p className="text-sm text-neutral-500">استعراض تقييمات الطلاب السابقة حسب التاريخ</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          من تاريخ
          <input
            type="date"
            value={dateFrom}
            max={dateTo}
            onChange={(e) => updateParams({ dateFrom: e.target.value })}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          إلى تاريخ
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            onChange={(e) => updateParams({ dateTo: e.target.value })}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none"
          />
        </label>
        <div className="w-full max-w-xs">
          <ClassSelector branchId={branchId} value={classId} onChange={(v) => updateParams({ classId: v })} />
        </div>
        <PeriodSelector value={period ?? Period.AM} onChange={(p) => updateParams({ period: String(p) })} />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا توجد تقييمات في هذه الفترة"
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