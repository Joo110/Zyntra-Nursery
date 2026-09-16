import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { useWinnersCard, useWinnersHistory } from '../hooks/useEvaluations';
import type { WinnerCardDto, WinnerHistoryDto } from '../types/evaluation.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { GenderBadge } from '@/components/common/GenderBadge';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { ROUTES } from '@/app/router/routes.constants';

export function EvaluationsWinnersPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const navigate = useNavigate();

  const { data: winnersCard, isLoading: cardLoading, isError: cardError } = useWinnersCard(branchId ?? '');
  const { data: winnersHistory, isLoading: historyLoading, isError: historyError } = useWinnersHistory(branchId ?? '', 1, 20);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const cardColumns: ColumnDef<WinnerCardDto>[] = [
    { key: 'childName', header: 'الاسم' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    { key: 'degree', header: 'الدرجة', render: (row) => <span className="ltr-numerals font-bold">{row.degree}</span> },
  ];

  const historyColumns: ColumnDef<WinnerHistoryDto>[] = [
    { key: 'childName', header: 'الاسم' },
    { key: 'date', header: 'التاريخ', render: (row) => <span className="ltr-numerals">{row.date.slice(0, 10)}</span> },
    { key: 'degree', header: 'الدرجة', render: (row) => <span className="ltr-numerals font-bold">{row.degree}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.EVALUATIONS)} className="rounded-md p-2 hover:bg-neutral-200" aria-label="رجوع">
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Trophy className="h-5 w-5 text-warning" /> الفائزون
          </h1>
          <p className="text-sm text-neutral-500">فائزو اليوم والسجل التاريخي</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700">فائزو اليوم</h2>
        <DataTable
          columns={cardColumns}
          data={winnersCard?.items ?? []}
          isLoading={cardLoading}
          isError={cardError}
          getRowId={(row, i) => `${row.childName}-${i}`}
          emptyMessage="لا يوجد فائزون محفوظون لليوم بعد"
        />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700">السجل التاريخي</h2>
        <DataTable
          columns={historyColumns}
          data={winnersHistory?.items ?? []}
          isLoading={historyLoading}
          isError={historyError}
          getRowId={(row, i) => `${row.childName}-${row.date}-${i}`}
          emptyMessage="لا يوجد سجل فائزين سابق"
        />
      </div>
    </div>
  );
}