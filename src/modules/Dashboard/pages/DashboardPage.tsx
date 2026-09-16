import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Briefcase,
  UserCog,
  ClipboardCheck,
  PiggyBank,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
} from 'lucide-react';

import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/app/providers/authStore';
import { useBranchStore } from '@/app/providers/branchStore';

import { Period, TrunsactionType } from '@/types/enums.types';

import { childService } from '@/modules/Children/services/childService';
import { treasuryService } from '@/modules/Treasury/services/treasuryService';
import { subscriptionService } from '@/modules/Subscriptions/services/subscriptionService';
import { workerService } from '@/modules/Workers/services/workerService';
import { userService } from '@/modules/Users/services/userService';
import { attendanceService } from '@/modules/Attendance/services/attendanceService';
import { MemberType } from '@/types/enums.types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatMoney(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(value);
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'primary',
  isLoading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: 'primary' | 'secondary' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}) {
  const toneClasses: Record<string, string> = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    warning: 'bg-warning/20 text-neutral-800',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-neutral-500">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-6 w-16 animate-pulse rounded bg-neutral-200" />
        ) : (
          <p className="ltr-numerals mt-0.5 truncate text-xl font-bold text-neutral-900">{value}</p>
        )}
        {sub && <p className="mt-0.5 truncate text-[11px] text-neutral-500">{sub}</p>}
      </div>
    </Card>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const branchId = useBranchStore((s) => s.selectedBranch?.id ?? '');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  /* -------------------- Data fetching -------------------- */

  const childrenAmCount = useQuery({
    queryKey: ['dashboard', 'children-count', branchId, Period.AM],
    queryFn: () => childService.getNumberOfChildren(branchId, Period.AM),
    enabled: !!branchId,
    staleTime: 60_000,
  });

  const childrenPmCount = useQuery({
    queryKey: ['dashboard', 'children-count', branchId, Period.PM],
    queryFn: () => childService.getNumberOfChildren(branchId, Period.PM),
    enabled: !!branchId,
    staleTime: 60_000,
  });

  const monthlyReport = useQuery({
    queryKey: ['dashboard', 'monthly-report', branchId, year, month],
    queryFn: () => treasuryService.getMonthlyReport(branchId, year, month),
    enabled: !!branchId,
    staleTime: 30_000,
  });

  const departmentsReport = useQuery({
    queryKey: ['dashboard', 'departments-report', branchId],
    queryFn: () => treasuryService.getDepartmentsReport(branchId),
    enabled: !!branchId,
    staleTime: 30_000,
  });

  const unpaidAm = useQuery({
    queryKey: ['dashboard', 'unpaid', branchId, Period.AM],
    queryFn: () => subscriptionService.getUnpaid(branchId, Period.AM, 1, 5),
    enabled: !!branchId,
    staleTime: 30_000,
  });

  const unpaidPm = useQuery({
    queryKey: ['dashboard', 'unpaid', branchId, Period.PM],
    queryFn: () => subscriptionService.getUnpaid(branchId, Period.PM, 1, 5),
    enabled: !!branchId,
    staleTime: 30_000,
  });

  const workers = useQuery({
    queryKey: ['dashboard', 'workers', branchId],
    queryFn: () => workerService.getList(branchId, 1, 1),
    enabled: !!branchId,
    staleTime: 120_000,
  });

  const userStats = useQuery({
    queryKey: ['dashboard', 'user-stats'],
    queryFn: () => userService.getStatistics(),
    staleTime: 120_000,
  });

  const recentAttendance = useQuery({
    queryKey: ['dashboard', 'recent-attendance', branchId],
    queryFn: () => attendanceService.getHistory(branchId, MemberType.Child, 1, 6),
    enabled: !!branchId,
    staleTime: 0,
  });

  /* -------------------- Derived values -------------------- */

  const totalChildren = (childrenAmCount.data ?? 0) + (childrenPmCount.data ?? 0);
  const totalUnpaid = (unpaidAm.data?.totalCount ?? 0) + (unpaidPm.data?.totalCount ?? 0);

  const report = monthlyReport.data;
  const isLoadingCore =
    childrenAmCount.isLoading || childrenPmCount.isLoading || monthlyReport.isLoading;

  const maxDeptCollection = useMemo(() => {
    if (!departmentsReport.data?.length) return 0;
    return Math.max(...departmentsReport.data.map((d) => d.collectionPercentage), 1);
  }, [departmentsReport.data]);

  if (!branchId) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-neutral-900">اختر فرعًا أولًا</h2>
        <p className="max-w-md text-sm text-neutral-500">
          يرجى اختيار الفرع من الأعلى لعرض إحصائيات لوحة التحكم الخاصة به.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          مرحبًا{user ? `، ${user.userName}` : ''} 👋
        </h1>
        <p className="text-sm text-neutral-500">نظرة عامة على نظام إدارة الحضانة</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="إجمالي الأطفال"
          value={totalChildren}
          sub={`صباحي ${childrenAmCount.data ?? 0} · مسائي ${childrenPmCount.data ?? 0}`}
          tone="primary"
          isLoading={childrenAmCount.isLoading || childrenPmCount.isLoading}
        />
        <StatCard
          icon={Wallet}
          label="رصيد الشهر الحالي"
          value={report ? `${formatMoney(report.currentMonthBalance)} ج.م` : '—'}
          sub={report ? `نسبة التحصيل ${report.collectionRatePercentage?.toFixed(0)}%` : undefined}
          tone="secondary"
          isLoading={monthlyReport.isLoading}
        />
        <StatCard
          icon={AlertTriangle}
          label="مستحقات متأخرة"
          value={report ? `${formatMoney(report.overdueAmounts)} ج.م` : '—'}
          sub={report ? `${report.overduePaymentDetails?.length ?? 0} حالة متأخرة` : undefined}
          tone="warning"
          isLoading={monthlyReport.isLoading}
        />
        <StatCard
          icon={ClipboardCheck}
          label="اشتراكات غير مدفوعة"
          value={totalUnpaid}
          sub="صباحي + مسائي"
          tone="danger"
          isLoading={unpaidAm.isLoading || unpaidPm.isLoading}
        />
      </div>

      {/* Financial summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="إجمالي الدخل"
          value={report ? `${formatMoney(report.totalIncome)} ج.م` : '—'}
          tone="secondary"
          isLoading={monthlyReport.isLoading}
        />
        <StatCard
          icon={TrendingDown}
          label="الرواتب + المصروفات"
          value={
            report
              ? `${formatMoney(report.totalSalariesPaid + report.totalAdditionalExpenses)} ج.م`
              : '—'
          }
          tone="danger"
          isLoading={monthlyReport.isLoading}
        />
        <StatCard
          icon={PiggyBank}
          label="صافي الربح"
          value={report ? `${formatMoney(report.profit)} ج.م` : '—'}
          tone="primary"
          isLoading={monthlyReport.isLoading}
        />
        <StatCard
          icon={ArrowUpRight}
          label="إجمالي المسحوبات"
          value={report ? `${formatMoney(report.totalWithdrawals)} ج.م` : '—'}
          tone="info"
          isLoading={monthlyReport.isLoading}
        />
      </div>

      {/* Departments collection chart + workers/users */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="نسبة التحصيل حسب القسم" />
          {departmentsReport.isLoading ? (
            <div className="h-40 w-full animate-pulse rounded-lg bg-neutral-100" />
          ) : departmentsReport.data?.length ? (
            <div className="flex flex-col gap-4">
              {departmentsReport.data.map((d) => (
                <div key={d.departmentName} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800">{d.departmentName}</span>
                    <span className="ltr-numerals text-neutral-500">
                      {formatMoney(d.totalCollected)} / {formatMoney(d.expectedTotal)} ج.م
                      <span className="mr-2 font-semibold text-primary">
                        {d.collectionPercentage?.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, (d.collectionPercentage / maxDeptCollection) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex gap-3 text-[11px] text-neutral-500">
                    <span>{d.activeChildrenCount} طفل نشط</span>
                    <span>·</span>
                    <span className="text-secondary">{d.paidChildrenCount} مدفوع</span>
                    <span>·</span>
                    <span className="text-danger">{d.unpaidChildrenCount} غير مدفوع</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-neutral-500">لا توجد بيانات أقسام لعرضها</p>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <StatCard
            icon={Briefcase}
            label="عدد العاملين"
            value={workers.data?.totalCount ?? '—'}
            tone="info"
            isLoading={workers.isLoading}
          />
          <StatCard
            icon={UserCog}
            label="مستخدمو النظام"
            value={userStats.data ? userStats.data.total : '—'}
            sub={
              userStats.data
                ? `نشط ${userStats.data.active} · غير نشط ${userStats.data.inactive}`
                : undefined
            }
            tone="primary"
            isLoading={userStats.isLoading}
          />
          <Card className="p-5">
            <SectionHeader title="تفاصيل الأقسام هذا الشهر" />
            {monthlyReport.isLoading ? (
              <div className="h-24 w-full animate-pulse rounded-lg bg-neutral-100" />
            ) : report?.departmentDetails?.length ? (
              <ul className="flex flex-col gap-3">
                {report.departmentDetails.map((d) => (
                  <li key={d.departmentName} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800">{d.departmentName}</span>
                    <span className="ltr-numerals text-neutral-500">
                      {formatMoney(d.departmentIncome)} ج.م ·{' '}
                      <span className="text-secondary">{d.departmentCollectionPercentage?.toFixed(0)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-xs text-neutral-500">لا توجد بيانات</p>
            )}
          </Card>
        </div>
      </div>

      {/* Overdue payments + recent attendance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="أحدث المستحقات المتأخرة" />
          {monthlyReport.isLoading ? (
            <div className="h-40 w-full animate-pulse rounded-lg bg-neutral-100" />
          ) : report?.overduePaymentDetails?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-neutral-500">
                    <th className="pb-2 font-medium">الطفل</th>
                    <th className="pb-2 font-medium">الفصل / القسم</th>
                    <th className="pb-2 font-medium">الشهر</th>
                    <th className="pb-2 font-medium">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {report.overduePaymentDetails.slice(0, 6).map((o, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-neutral-800">{o.childName}</td>
                      <td className="py-2 text-neutral-600">
                        {o.className} / {o.departmentName}
                      </td>
                      <td className="ltr-numerals py-2 text-neutral-600">{o.originalMonth}</td>
                      <td className="ltr-numerals py-2 font-semibold text-danger">
                        {formatMoney(o.amount)} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-neutral-500">لا توجد مستحقات متأخرة 🎉</p>
          )}
        </Card>

        <Card className="p-5">
          <SectionHeader title="آخر سجلات الحضور" />
          {recentAttendance.isLoading ? (
            <div className="h-40 w-full animate-pulse rounded-lg bg-neutral-100" />
          ) : recentAttendance.data?.items?.length ? (
            <ul className="flex flex-col divide-y divide-neutral-100">
              {recentAttendance.data.items.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-800">{a.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      {a.class ?? a.department ?? '—'}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="ltr-numerals text-neutral-700">{a.date}</p>
                    <p className="ltr-numerals text-neutral-500">{a.time}</p>
                  </div>
                  {a.late > 0 && (
                    <span className="inline-flex items-center rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-medium text-neutral-800">
                      تأخير {a.late} د
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-neutral-500">لا توجد سجلات حضور بعد</p>
          )}
        </Card>
      </div>

      {isLoadingCore && (
        <p className="text-center text-[11px] text-neutral-400">جاري تحميل بيانات لوحة التحكم...</p>
      )}
    </div>
  );
}