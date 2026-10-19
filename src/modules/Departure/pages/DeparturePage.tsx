import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, LogOut, AlertOctagon, Users, ClipboardList, UsersRound, Lock, Eye } from 'lucide-react';
import {
  useDepartureByDepartment,
  useAddBulkDeparture,
  useAddBulkDepartureToday,
  useDeleteDeparture,
  useDeleteAllDeparture,
} from '../hooks/useDeparture';
import { useSelectableChildren } from '@/modules/Children/hooks/useChildren';
import { useAttendanceWindow } from '@/modules/Settings/hooks/useScheduleRules';
import { ClassSelector } from '@/components/common/ClassSelector';
import type { DepartueHistoryDto } from '../types/departure.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { MultiSelect } from '@/components/forms/MultiSelect';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { DangerConfirmModal } from '@/components/modals/DangerConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;
const ALL_RECORDS_TAKE = 1000;

function formatDateTime(date: string, time?: string): string {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let hours: string;
  let minutes: string;

  if (time) {
    const parts = time.split(':');
    hours = (parts[0] ?? '00').padStart(2, '0');
    minutes = (parts[1] ?? '00').padStart(2, '0');
  } else {
    hours = String(d.getHours()).padStart(2, '0');
    minutes = String(d.getMinutes()).padStart(2, '0');
  }

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-lg font-bold text-neutral-900 ltr-numerals">{value}</p>
      </div>
    </div>
  );
}

function ClosedBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <Lock className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-900">تسجيل الانصراف مغلق حاليًا</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
          يمكنك مراجعة سجلات الانصراف فقط. التسجيل والحذف متاحان خلال مواعيد الانصراف.
        </p>
      </div>
    </div>
  );
}

export function DeparturePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;
  const classroomId = searchParams.get('classroomId') ?? '';
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [confirmingAll, setConfirmingAll] = useState(false);

  const [deleting, setDeleting] = useState<DepartueHistoryDto | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  // سجلات الصفحة الحالية (للجدول)
  const { data, isLoading, isError } = useDepartureByDepartment(branchId ?? '', departmentId, pageNumber, PAGE_SIZE);
  // كل سجلات القسم (لاستبعاد اللي انصرفوا من القائمة على كل الصفحات)
  const { data: allDepartures } = useDepartureByDepartment(branchId ?? '', departmentId, 1, ALL_RECORDS_TAKE);

  const { children, isPrimary, needsClassroom } = useSelectableChildren(branchId ?? '', departmentId, period, classroomId);
  const departureWindow = useAttendanceWindow('leave');
  const addBulkDeparture = useAddBulkDeparture(branchId ?? '');
  const addBulkDepartureToday = useAddBulkDepartureToday(branchId ?? '');
  const deleteDeparture = useDeleteDeparture(branchId ?? '');
  const deleteAllDeparture = useDeleteAllDeparture(branchId ?? '');

  const isClosed = !departureWindow.isOpen;

  const departedNames = useMemo(
    () => new Set((allDepartures?.items ?? data?.items ?? []).map((i) => i.name?.trim().toLowerCase()).filter(Boolean)),
    [allDepartures?.items, data?.items]
  );
  const availableChildren = useMemo(
    () => children.filter((c) => !departedNames.has(c.name?.trim().toLowerCase())),
    [children, departedNames]
  );

  const childOptions = useMemo(
    () => availableChildren.map((c) => ({ value: String(c.id), label: c.name })),
    [availableChildren]
  );

  const validSelectedIds = useMemo(() => {
    const ids = new Set(childOptions.map((o) => o.value));
    return selectedChildIds.filter((id) => ids.has(id));
  }, [selectedChildIds, childOptions]);

  const allSelected = childOptions.length > 0 && validSelectedIds.length === childOptions.length;

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleToggleAll = () => {
    setSelectedChildIds(allSelected ? [] : childOptions.map((o) => o.value));
  };

  const handleRegisterDeparture = () => {
    if (isClosed || validSelectedIds.length === 0 || !departmentId || addBulkDeparture.isPending) return;
    addBulkDeparture.mutate(
      { departmentId, childIds: validSelectedIds, dateTime: new Date().toISOString() },
      { onSuccess: () => setSelectedChildIds([]) }
    );
  };

  const columns: ColumnDef<DepartueHistoryDto>[] = [
    {
      key: 'name',
      header: 'الاسم',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
            {row.name?.charAt(0) ?? '?'}
          </div>
          <span className="font-medium text-neutral-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'التاريخ والوقت',
      render: (row) => <span className="ltr-numerals text-neutral-600">{formatDateTime(row.date, row.time)}</span>,
    },
    { key: 'department', header: 'القسم', render: (row) => row.department || <span className="text-neutral-400">—</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الانصراف</h1>
          <p className="text-sm text-neutral-500">
            {isClosed ? 'مراجعة سجلات انصراف الطلاب' : 'تسجيل ومتابعة انصراف الطلاب اليومي'}
          </p>
        </div>
        {isClosed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
            <Eye className="h-3.5 w-3.5" />
            عرض فقط
          </span>
        )}
      </div>

      {isClosed && <ClosedBanner />}

      {departmentId && data && (
        <div className={`grid grid-cols-1 gap-3 ${isClosed ? '' : 'sm:grid-cols-2'}`}>
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="إجمالي سجلات الانصراف" value={data.totalCount} />
          {!isClosed && (
            <StatCard icon={<Users className="h-5 w-5" />} label="طلاب متبقّون لم ينصرفوا" value={availableChildren.length} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector
            branchId={branchId}
            value={departmentId}
            workingTodayOnly
            onChange={(v) => {
              setSelectedChildIds([]);
              updateParams({ departmentId: v, classroomId: '', page: '1' });
            }}
          />
        </div>
        {departmentId && isPrimary && !isClosed && (
          <div className="w-full max-w-xs">
            <ClassSelector
              branchId={branchId}
              value={classroomId}
              onChange={(v) => {
                setSelectedChildIds([]);
                updateParams({ classroomId: v, page: '1' });
              }}
            />
          </div>
        )}
        <PeriodSelector
          value={period}
          onChange={(p) => {
            setSelectedChildIds([]);
            updateParams({ period: String(p), page: '1' });
          }}
        />
      </div>

      {!departmentId ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-surface p-14 text-center">
          <LogOut className="h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">
            {isClosed ? 'برجاء اختيار قسم لعرض الانصراف' : 'برجاء اختيار قسم لعرض/تسجيل الانصراف'}
          </p>
          <p className="text-xs text-neutral-400">اختر القسم والفترة من القائمة أعلاه للبدء</p>
        </div>
      ) : (
        <>
          {!isClosed && (
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="w-full max-w-sm">
                  <MultiSelect
                    options={childOptions}
                    value={validSelectedIds}
                    onChange={setSelectedChildIds}
                    placeholder={
                      needsClassroom
                        ? 'اختر الفصل أولًا'
                        : availableChildren.length === 0
                          ? 'كل الطلاب سجلوا انصرافهم'
                          : 'اختر طالب أو أكثر لتسجيل انصرافهم'
                    }
                    searchPlaceholder="ابحث باسم الطالب..."
                    emptyMessage="لا يوجد طالب بهذا الاسم"
                    disabled={needsClassroom || availableChildren.length === 0}
                  />
                </div>

                <Button
                  variant="outline"
                  icon={<Users className="h-4 w-4" />}
                  onClick={handleToggleAll}
                  disabled={needsClassroom || childOptions.length === 0 || addBulkDeparture.isPending}
                >
                  {allSelected ? 'إلغاء تحديد الكل' : `تحديد الكل (${childOptions.length})`}
                </Button>

                <Button
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={handleRegisterDeparture}
                  isLoading={addBulkDeparture.isPending}
                  disabled={validSelectedIds.length === 0 || addBulkDeparture.isPending}
                >
                  {validSelectedIds.length > 1 ? `تسجيل انصراف (${validSelectedIds.length})` : 'تسجيل انصراف'}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" icon={<UsersRound className="h-4 w-4" />} onClick={() => setConfirmingAll(true)}>
                  انصراف كل الحاضرين اليوم
                </Button>
                <Button variant="danger" size="sm" icon={<AlertOctagon className="h-4 w-4" />} onClick={() => setDeletingAll(true)}>
                  حذف كل السجلات
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <DataTable
              columns={columns}
              data={data?.items ?? []}
              isLoading={isLoading}
              isError={isError}
              getRowId={(row) => row.id}
              emptyMessage="لا يوجد سجلات انصراف اليوم لهذا القسم"
              rowActions={
                isClosed
                  ? undefined
                  : (row) => (
                      <button
                        onClick={() => setDeleting(row)}
                        className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-danger/10 hover:text-danger"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )
              }
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
        </>
      )}

      <ConfirmModal
        isOpen={!isClosed && confirmingAll}
        onClose={() => setConfirmingAll(false)}
        onConfirm={() => addBulkDepartureToday.mutate(new Date().toISOString(), { onSettled: () => setConfirmingAll(false) })}
        title="انصراف جماعي"
        message="سيتم تسجيل انصراف كل من حضر اليوم ولم ينصرف بعد، في كل الأقسام وليس القسم المختار فقط. هل تريد المتابعة؟"
        confirmLabel="تسجيل الانصراف"
        isLoading={addBulkDepartureToday.isPending}
      />

      <ConfirmModal
        isOpen={!isClosed && !!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteDeparture.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف سجل الانصراف"
        message={`هل أنت متأكد أنك تريد حذف سجل انصراف "${deleting?.name}"؟`}
        isLoading={deleteDeparture.isPending}
      />

      <DangerConfirmModal
        isOpen={!isClosed && deletingAll}
        onClose={() => setDeletingAll(false)}
        onConfirm={() => deleteAllDeparture.mutate(undefined, { onSuccess: () => setDeletingAll(false) })}
        title="حذف جميع سجلات الانصراف"
        message="هذا الإجراء سيحذف كل سجلات الانصراف بكل الفروع نهائيًا ولا يمكن التراجع عنه."
        isLoading={deleteAllDeparture.isPending}
      />
    </div>
  );
}