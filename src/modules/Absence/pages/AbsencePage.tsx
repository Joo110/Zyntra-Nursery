import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, AlertOctagon, UserX, Users, CalendarClock, ClipboardList } from 'lucide-react';
import { useAbsenceByDepartment, useProcessDepartmentAbsences, useDeleteAbsence, useDeleteAllAbsence } from '../hooks/useAbsence';
import type { AbsenceHistoryDto } from '../types/absence.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { DangerConfirmModal } from '@/components/modals/DangerConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

function StatCard({ icon, label, value, tone = 'default' }: { icon: React.ReactNode; label: string; value: string | number; tone?: 'default' | 'danger' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-lg font-bold text-neutral-900 ltr-numerals">{value}</p>
      </div>
    </div>
  );
}

function GenderBadge({ gender }: { gender?: string }) {
  if (!gender) return <span className="text-neutral-400">—</span>;
  const isMale = gender.toLowerCase().includes('male') && !gender.toLowerCase().includes('female');
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isMale ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
      }`}
    >
      {isMale ? 'ذكر' : 'أنثى'}
    </span>
  );
}

export function AbsencePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;

  const [deleting, setDeleting] = useState<AbsenceHistoryDto | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data, isLoading, isError } = useAbsenceByDepartment(branchId ?? '', departmentId, pageNumber, PAGE_SIZE);
  const processAbsences = useProcessDepartmentAbsences(branchId ?? '');
  const deleteAbsence = useDeleteAbsence(branchId ?? '');
  const deleteAllAbsence = useDeleteAllAbsence(branchId ?? '');

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (data?.items ?? []).filter((i) => i.date?.slice(0, 10) === today).length;
  }, [data?.items]);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<AbsenceHistoryDto>[] = [
    {
      key: 'memberName',
      header: 'الاسم',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
            {row.memberName?.charAt(0) ?? '?'}
          </div>
          <span className="font-medium text-neutral-800">{row.memberName}</span>
        </div>
      ),
    },
    { key: 'gender', header: 'الجنس', render: (row: any) => <GenderBadge gender={row.gender} /> },
    { key: 'date', header: 'التاريخ', render: (row) => <span className="ltr-numerals text-neutral-600">{row.date.slice(0, 10)}</span> },
    { key: 'className', header: 'الفصل', render: (row) => row.className || <span className="text-neutral-400">—</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-neutral-900">الغياب</h1>
        <p className="text-sm text-neutral-500">متابعة وتسجيل غياب الطلاب اليومي</p>
      </div>

      {departmentId && data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="إجمالي سجلات الغياب" value={data.totalCount} />
          <StatCard icon={<CalendarClock className="h-5 w-5" />} label="غياب اليوم في هذه الصفحة" value={todayCount} />
          <StatCard icon={<Users className="h-5 w-5" />} label="عدد الصفحات" value={data.totalPages} />
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-xs">
            <label className="mb-1 block text-xs font-medium text-neutral-500">القسم</label>
            <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, page: '1' })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">الفترة</label>
            <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), page: '1' })} />
          </div>
        </div>

        {departmentId && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={<UserX className="h-4 w-4" />} onClick={() => setProcessing(true)}>
              تسجيل غياب كل من لم يحضر اليوم
            </Button>
            <Button variant="danger" size="sm" icon={<AlertOctagon className="h-4 w-4" />} onClick={() => setDeletingAll(true)}>
              حذف كل السجلات
            </Button>
          </div>
        )}
      </div>

      {!departmentId ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-surface p-14 text-center">
          <Users className="h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">برجاء اختيار قسم لعرض سجلات الغياب</p>
          <p className="text-xs text-neutral-400">اختر القسم والفترة من القائمة أعلاه للبدء</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            getRowId={(row) => row.id}
            emptyMessage="لا يوجد سجلات غياب لهذا القسم"
            rowActions={(row) => (
              <button
                onClick={() => setDeleting(row)}
                className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-danger/10 hover:text-danger"
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
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
        isOpen={processing}
        onClose={() => setProcessing(false)}
        onConfirm={() => processAbsences.mutate({ departmentId, period }, { onSuccess: () => setProcessing(false) })}
        title="تسجيل غياب جماعي"
        message="سيتم تسجيل غياب لكل طالب لم يسجل حضوره اليوم بهذا القسم. هل تريد المتابعة؟"
        confirmLabel="تسجيل"
        isLoading={processAbsences.isPending}
      />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteAbsence.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف سجل الغياب"
        message={`هل أنت متأكد أنك تريد حذف سجل غياب "${deleting?.memberName}"؟`}
        isLoading={deleteAbsence.isPending}
      />

      <DangerConfirmModal
        isOpen={deletingAll}
        onClose={() => setDeletingAll(false)}
        onConfirm={() => deleteAllAbsence.mutate(undefined, { onSuccess: () => setDeletingAll(false) })}
        title="حذف جميع سجلات الغياب"
        message="هذا الإجراء سيحذف كل سجلات الغياب بكل الفروع نهائيًا ولا يمكن التراجع عنه."
        isLoading={deleteAllAbsence.isPending}
      />
    </div>
  );
}