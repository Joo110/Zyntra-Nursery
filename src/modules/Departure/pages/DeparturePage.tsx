import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, UserCheck, AlertOctagon, Clock, Users, ClipboardList } from 'lucide-react';
import { useAttendanceByDepartment, useAddAttendance, useDeleteAttendance, useDeleteAllAttendance } from '../../Attendance/hooks/useAttendance';
import { useDepartmentChildren } from '@/modules/Children/hooks/useChildren';
import type { AttendanceHistoryDto } from '../../Attendance/types/attendance.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { DangerConfirmModal } from '@/components/modals/DangerConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;
const LATE_THRESHOLD_MINUTES = 15; // غيّرها حسب سياسة المدرسة


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

function LateBadge({ minutes }: { minutes: number }) {
  if (!minutes || minutes <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
        في الموعد
      </span>
    );
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

export function DeparturePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;
  const [selectedChildId, setSelectedChildId] = useState('');

  const [deleting, setDeleting] = useState<AttendanceHistoryDto | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const { data, isLoading, isError } = useAttendanceByDepartment(branchId ?? '', departmentId, pageNumber, PAGE_SIZE);
  const { data: children } = useDepartmentChildren(branchId ?? '', departmentId, period);
  const addAttendance = useAddAttendance(branchId ?? '');
  const deleteAttendance = useDeleteAttendance(branchId ?? '');
  const deleteAllAttendance = useDeleteAllAttendance(branchId ?? '');

  // استبعاد الطلاب اللي سجلوا حضورهم بالفعل من قائمة الاختيار
  const attendedIds = useMemo(
    () => new Set((data?.items ?? []).map((i: any) => i.memberId ?? i.id)),
    [data?.items]
  );
  const availableChildren = useMemo(
    () => (children ?? []).filter((c) => !attendedIds.has(c.id)),
    [children, attendedIds]
  );

  const lateCount = useMemo(() => (data?.items ?? []).filter((i) => (i.late ?? 0) > 0).length, [data?.items]);
  const onTimeCount = useMemo(() => (data?.items?.length ?? 0) - lateCount, [data?.items, lateCount]);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleRegisterAttendance = () => {
    if (!selectedChildId || !departmentId) return;
    addAttendance.mutate(
      { departmentId, childId: selectedChildId, dateTime: new Date().toISOString() },
      { onSuccess: () => setSelectedChildId('') }
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
      <div>
        <h1 className="text-xl font-bold text-neutral-900">الحضور</h1>
        <p className="text-sm text-neutral-500">تسجيل ومتابعة حضور الطلاب اليومي</p>
      </div>

      {departmentId && data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="إجمالي سجلات الحضور" value={data.totalCount} />
          <StatCard icon={<UserCheck className="h-5 w-5" />} label="في الموعد (بالصفحة)" value={onTimeCount} />
          <StatCard icon={<Clock className="h-5 w-5" />} label="متأخرون (بالصفحة)" value={lateCount} />
          <StatCard icon={<Users className="h-5 w-5" />} label="لم يسجلوا بعد" value={availableChildren.length} />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, page: '1' })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), page: '1' })} />
      </div>

      {!departmentId ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-surface p-14 text-center">
          <UserCheck className="h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">برجاء اختيار قسم لعرض/تسجيل الحضور</p>
          <p className="text-xs text-neutral-400">اختر القسم والفترة من القائمة أعلاه للبدء</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
              <div className="w-full max-w-xs">
                <Select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
                  <option value="">
                    {availableChildren.length === 0 ? 'كل الطلاب سجلوا حضورهم' : 'اختر طالب لتسجيل حضوره'}
                  </option>
                  {availableChildren.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Button
                icon={<UserCheck className="h-4 w-4" />}
                onClick={handleRegisterAttendance}
                isLoading={addAttendance.isPending}
                disabled={!selectedChildId || availableChildren.length === 0}
              >
                تسجيل حضور
              </Button>
            </div>

            <Button variant="danger" size="sm" icon={<AlertOctagon className="h-4 w-4" />} onClick={() => setDeletingAll(true)}>
              حذف كل السجلات
            </Button>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <DataTable
              columns={columns}
              data={data?.items ?? []}
              isLoading={isLoading}
              isError={isError}
              getRowId={(row) => row.id}
              emptyMessage="لا يوجد سجلات حضور اليوم لهذا القسم"
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
        </>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteAttendance.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف سجل الحضور"
        message={`هل أنت متأكد أنك تريد حذف سجل حضور "${deleting?.name}"؟`}
        isLoading={deleteAttendance.isPending}
      />

      <DangerConfirmModal
        isOpen={deletingAll}
        onClose={() => setDeletingAll(false)}
        onConfirm={() => deleteAllAttendance.mutate(undefined, { onSuccess: () => setDeletingAll(false) })}
        title="حذف جميع سجلات الحضور"
        message="هذا الإجراء سيحذف كل سجلات الحضور بكل الفروع نهائيًا ولا يمكن التراجع عنه."
        isLoading={deleteAllAttendance.isPending}
      />
    </div>
  );
}