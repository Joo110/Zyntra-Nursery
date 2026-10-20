import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, UserCheck, AlertOctagon, Clock, Users, ClipboardList, Lock, Eye } from 'lucide-react';
import { useAttendanceByDepartment, useAddBulkAttendance, useDeleteAttendance, useDeleteAllAttendance } from '../hooks/useAttendance';
import { useSelectableChildren } from '@/modules/Children/hooks/useChildren';
import { useAttendanceWindow, useKidsLateMinutes } from '@/modules/Settings/hooks/useScheduleRules';
import { ClassSelector } from '@/components/common/ClassSelector';
import type { AttendanceHistoryDto } from '../types/attendance.types';
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
const LATE_THRESHOLD_MINUTES = 15;
const EGYPT_TZ = 'Africa/Cairo';

// يعتبر القيمة القادمة من السيرفر UTC حتى لو جت من غير Z
function parseUtc(date: string, time?: string): Date | null {
  if (!date) return null;
  const datePart = date.split('T')[0];

  let iso: string;
  if (time) {
    const [h = '00', m = '00', s = '00'] = time.split(':');
    iso = `${datePart}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.split('.')[0].padStart(2, '0')}Z`;
  } else {
    iso = /Z$|[+-]\d{2}:?\d{2}$/.test(date) ? date : `${date}Z`;
  }

  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(date: string, time?: string): string {
  const d = parseUtc(date, time);
  if (!d) return '—';

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: EGYPT_TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(d);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const period = get('dayPeriod').toUpperCase(); // AM / PM

  return `${get('day')}/${get('month')}/${get('year')} - ${get('hour')}:${get('minute')} ${period}`;
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

function LateBadge({ minutes }: { minutes: number }) {
  if (!minutes || minutes <= 0) {
    return <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">في الموعد</span>;
  }
  const isSevere = minutes >= LATE_THRESHOLD_MINUTES;
  return (
    <span
      className={`ltr-numerals inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isSevere ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <Clock className="h-3 w-3" />
      {minutes} د
    </span>
  );
}

function ClosedBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <Lock className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-900">تسجيل الحضور مغلق حاليًا</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
          يمكنك مراجعة سجلات الحضور فقط. التسجيل والحذف متاحان خلال مواعيد الحضور.
        </p>
      </div>
    </div>
  );
}

export function AttendancePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;
  const classroomId = searchParams.get('classroomId') ?? '';
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const [deleting, setDeleting] = useState<AttendanceHistoryDto | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  // الفترة (صباحي/مسائي) بتتبعت للسيرفر وبتدخل في الـ query key
  // عشان السجل يتحدّث ويعرض سجلات الفترة المختارة
  const { data, isLoading, isError } = useAttendanceByDepartment(branchId ?? '', departmentId, pageNumber, PAGE_SIZE, period);
  const { data: allAttendance } = useAttendanceByDepartment(branchId ?? '', departmentId, 1, ALL_RECORDS_TAKE, period);

  const { children, isPrimary, needsClassroom } = useSelectableChildren(branchId ?? '', departmentId, period, classroomId);
  const attendanceWindow = useAttendanceWindow('enter');
  const kidsLateMinutes = useKidsLateMinutes(period);
  const addBulkAttendance = useAddBulkAttendance(branchId ?? '');
  const deleteAttendance = useDeleteAttendance(branchId ?? '');
  const deleteAllAttendance = useDeleteAllAttendance(branchId ?? '');

  const isClosed = !attendanceWindow.isOpen;

  const attendedNames = useMemo(
    () => new Set((allAttendance?.items ?? data?.items ?? []).map((i) => i.name?.trim().toLowerCase()).filter(Boolean)),
    [allAttendance?.items, data?.items]
  );
  const availableChildren = useMemo(
    () => children.filter((c) => !attendedNames.has(c.name?.trim().toLowerCase())),
    [children, attendedNames]
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

  const lateCount = useMemo(() => (data?.items ?? []).filter((i) => (i.late ?? 0) > 0).length, [data?.items]);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleToggleAll = () => {
    setSelectedChildIds(allSelected ? [] : childOptions.map((o) => o.value));
  };

  const handleRegisterAttendance = () => {
    if (isClosed || validSelectedIds.length === 0 || !departmentId || addBulkAttendance.isPending) return;
    addBulkAttendance.mutate(
      {
        departmentId,
        childIds: validSelectedIds,
        dateTime: new Date().toISOString(),
        lateMinutes: kidsLateMinutes,
        period,
      },
      { onSuccess: () => setSelectedChildIds([]) }
    );
  };

  const columns: ColumnDef<AttendanceHistoryDto>[] = [
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
    { key: 'late', header: 'حالة الحضور', render: (row) => <LateBadge minutes={row.late} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الحضور</h1>
          <p className="text-sm text-neutral-500">
            {isClosed ? 'مراجعة سجلات حضور الطلاب' : 'تسجيل ومتابعة حضور الطلاب اليومي'}
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
        <div className={`grid grid-cols-1 gap-3 ${isClosed ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="إجمالي سجلات الحضور" value={data.totalCount} />
          <StatCard icon={<Clock className="h-5 w-5" />} label="متأخرون في هذه الصفحة" value={lateCount} />
          {!isClosed && (
            <StatCard icon={<Users className="h-5 w-5" />} label="طلاب متبقّون لم يسجلوا" value={availableChildren.length} />
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
          <UserCheck className="h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">
            {isClosed ? 'برجاء اختيار قسم لعرض الحضور' : 'برجاء اختيار قسم لعرض/تسجيل الحضور'}
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
                          ? 'كل الطلاب سجلوا حضورهم'
                          : 'اختر طالب أو أكثر لتسجيل حضورهم'
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
                  disabled={needsClassroom || childOptions.length === 0 || addBulkAttendance.isPending}
                >
                  {allSelected ? 'إلغاء تحديد الكل' : `تحديد الكل (${childOptions.length})`}
                </Button>

                <Button
                  icon={<UserCheck className="h-4 w-4" />}
                  onClick={handleRegisterAttendance}
                  isLoading={addBulkAttendance.isPending}
                  disabled={validSelectedIds.length === 0 || addBulkAttendance.isPending}
                >
                  {validSelectedIds.length > 1 ? `تسجيل حضور (${validSelectedIds.length})` : 'تسجيل حضور'}
                </Button>
              </div>

              <Button variant="danger" size="sm" icon={<AlertOctagon className="h-4 w-4" />} onClick={() => setDeletingAll(true)}>
                حذف كل السجلات
              </Button>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <DataTable
              columns={columns}
              data={data?.items ?? []}
              isLoading={isLoading}
              isError={isError}
              getRowId={(row) => row.id}
              emptyMessage="لا يوجد سجلات حضور اليوم لهذا القسم"
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
        isOpen={!isClosed && !!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteAttendance.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف سجل الحضور"
        message={`هل أنت متأكد أنك تريد حذف سجل حضور "${deleting?.name}"؟`}
        isLoading={deleteAttendance.isPending}
      />

      <DangerConfirmModal
        isOpen={!isClosed && deletingAll}
        onClose={() => setDeletingAll(false)}
        onConfirm={() => deleteAllAttendance.mutate(undefined, { onSuccess: () => setDeletingAll(false) })}
        title="حذف جميع سجلات الحضور"
        message="هذا الإجراء سيحذف كل سجلات الحضور بكل الفروع نهائيًا ولا يمكن التراجع عنه."
        isLoading={deleteAllAttendance.isPending}
      />
    </div>
  );
}