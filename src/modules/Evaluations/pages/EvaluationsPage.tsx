import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, RotateCcw, Award, Star } from 'lucide-react';
import {
  useEvaluationInfo,
  useUpdateEvaluation,
  useResetDailyEvaluation,
  useSaveWinners,
} from '../hooks/useEvaluations';
import { DEGREE_KEYS, type EvaluationInfoDto, type DegreeKey } from '../types/evaluation.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { ClassSelector } from '@/components/common/ClassSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

function DegreeCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
        checked
          ? 'border-primary bg-primary text-white'
          : 'border-neutral-300 bg-white text-transparent hover:border-primary/50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <Star className="h-4 w-4 fill-current" />
    </button>
  );
}

function TotalBadge({ total }: { total: number }) {
  const tone =
    total >= 6 ? 'bg-green-50 text-green-700' : total >= 3 ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-600';
  return <span className={`ltr-numerals inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>{total}</span>;
}

export function EvaluationsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const classId = searchParams.get('classId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;

  const [resetting, setResetting] = useState(false);
  const [savingWinners, setSavingWinners] = useState(false);

  const { data, isLoading, isError } = useEvaluationInfo(branchId ?? '', classId, period, pageNumber, PAGE_SIZE);
  const updateEvaluation = useUpdateEvaluation(branchId ?? '');
  const resetDaily = useResetDailyEvaluation(branchId ?? '');
  const saveWinners = useSaveWinners(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

 const handleToggleDegree = (row: EvaluationInfoDto, key: DegreeKey, value: boolean) => {
  const newDegrees = DEGREE_KEYS.reduce(
    (sum: number, k: DegreeKey) => sum + (k === key ? (value ? 1 : 0) : row[k] ? 1 : 0),
    0
  );

  updateEvaluation.mutate({
    id: row.id,
    [key]: value,
    totalDegrees: newDegrees,
  });
};

  const columns: ColumnDef<EvaluationInfoDto>[] = [
    { key: 'childName', header: 'الاسم' },
    ...DEGREE_KEYS.map((key, idx) => ({
      key,
      header: `م${idx + 1}`,
      render: (row: EvaluationInfoDto) => (
        <DegreeCheckbox checked={row[key]} onChange={(v: boolean) => handleToggleDegree(row, key, v)} disabled={updateEvaluation.isPending} />
      ),
    })),
    { key: 'totalDegrees', header: 'الإجمالي', render: (row) => <TotalBadge total={row.totalDegrees} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">التقييم اليومي</h1>
          <p className="text-sm text-neutral-500">متابعة وتسجيل تقييم الطلاب اليومي</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Trophy className="h-4 w-4" />} onClick={() => setSavingWinners(true)}>
            حفظ فائزي اليوم
          </Button>
          <Button variant="danger" size="sm" icon={<RotateCcw className="h-4 w-4" />} onClick={() => setResetting(true)}>
            تصفير تقييم اليوم
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <ClassSelector branchId={branchId} value={classId} onChange={(v) => updateParams({ classId: v, page: '1' })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), page: '1' })} />
      </div>

      {!classId ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-surface p-14 text-center">
          <Award className="h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">برجاء اختيار فصل لعرض تقييمات الطلاب</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            getRowId={(row) => row.childId}
            emptyMessage="لا يوجد طلاب في هذا الفصل"
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
      )}

      <ConfirmModal
        isOpen={savingWinners}
        onClose={() => setSavingWinners(false)}
        onConfirm={() => saveWinners.mutate(undefined, { onSuccess: () => setSavingWinners(false) })}
        title="حفظ فائزي اليوم"
        message="سيتم حفظ الطلاب الحاصلين على أعلى درجة في كل فصل وفترة كفائزين لهذا اليوم. هل تريد المتابعة؟"
        confirmLabel="حفظ"
        isLoading={saveWinners.isPending}
      />

      <ConfirmModal
        isOpen={resetting}
        onClose={() => setResetting(false)}
        onConfirm={() => resetDaily.mutate(undefined, { onSuccess: () => setResetting(false) })}
        title="تصفير تقييم اليوم"
        message="سيتم حفظ درجات اليوم للسجل التراكمي وتصفير كل التقييمات استعدادًا ليوم جديد. تأكد من حفظ الفائزين أولًا إن أردت ذلك."
        confirmLabel="تصفير"
        isLoading={resetDaily.isPending}
      />
    </div>
  );
}