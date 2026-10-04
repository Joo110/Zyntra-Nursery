import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionService } from '../services/subscriptionService';
import { subscriptionKeys } from './useSubscriptions';
import type { PagedResult } from '@/types/pagination.types';
import type { Period } from '@/types/enums.types';

const TAKE = 100;
const PERIODS = [0, 1] as Period[]; // الـ Backend بيفلتر بالـ period، فبنجيب الاتنين

async function fetchAll<T>(fetchPage: (page: number) => Promise<PagedResult<T>>): Promise<T[]> {
  const first = await fetchPage(1);
  const all = [...(first.items ?? [])];
  for (let p = 2; p <= (first.totalPages ?? 1); p++) {
    all.push(...((await fetchPage(p)).items ?? []));
  }
  return all;
}

const monthKey = (iso: string) => iso.slice(0, 7); // "2026-10"

async function runInBatches<T>(items: T[], size: number, fn: (item: T) => Promise<unknown>) {
  let failed = 0;
  for (let i = 0; i < items.length; i += size) {
    const results = await Promise.allSettled(items.slice(i, i + size).map(fn));
    failed += results.filter((r) => r.status === 'rejected').length;
  }
  return failed;
}

export interface GenerateResult {
  total: number;   // عدد الطلاب اللي رجعوا من الـ API
  created: number;
  failed: number;
  skipped: number;
}

export async function generateMonthlySubscriptions(branchId: string): Promise<GenerateResult> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const currentMonth = `${y}-${m}`;
  const monthStart = `${currentMonth}-01`;
  const lastDay = String(new Date(y, now.getMonth() + 1, 0).getDate()).padStart(2, '0');
  const monthEnd = `${currentMonth}-${lastDay}`;

  // 1) كل الطلاب + مبلغ اشتراكهم (بدون تكرار)
  const childrenRaw = (
    await Promise.all(
      PERIODS.map((period) =>
        fetchAll((p) => subscriptionService.getChildrenSubscriptionInfo(branchId, period, p, TAKE))
      )
    )
  ).flat();
  const children = [...new Map(childrenRaw.map((c) => [c.code, c])).values()];

  if (children.length === 0) {
    return { total: 0, created: 0, failed: 0, skipped: 0 };
  }

  // 2) اللي ليهم اشتراك غير مدفوع في الشهر ده
  const unpaid = (
    await Promise.all(
      PERIODS.map((period) =>
        fetchAll((p) => subscriptionService.getUnpaid(branchId, period, p, TAKE))
      )
    )
  ).flat();

  // 3) اللي دفعوا في الشهر ده
  const paid = await fetchAll((p) =>
    subscriptionService.getPaymentHistoryByDateRange(branchId, monthStart, monthEnd, p, TAKE)
  );

  const alreadyHave = new Set<string>([
    ...unpaid.filter((u) => u.date && monthKey(u.date) === currentMonth).map((u) => u.code),
    ...paid.map((h) => h.code),
  ]);

  // ⚠️ بافتراض إن code = childId
  const toCreate = children.filter((c) => !alreadyHave.has(c.code) && c.subscriptionAmount > 0);

  const failed = await runInBatches(toCreate, 5, (c) =>
    subscriptionService.add(branchId, {
      childId: c.code,
      amount: c.subscriptionAmount,
      monthSubscription: monthStart,
      dateOfPayment: null,
      isPaid: false,
    })
  );

  return {
    total: children.length,
    created: toCreate.length - failed,
    failed,
    skipped: children.length - toCreate.length,
  };
}

export function useGenerateMonthlySubscriptions(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => generateMonthlySubscriptions(branchId),
    onSuccess: ({ total, created, failed, skipped }) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      if (total === 0) toast.info('لا يوجد طلاب في هذا الفرع لإنزال اشتراكاتهم');
      else if (failed > 0) toast.warning(`تم إنشاء ${created} اشتراك، وفشل ${failed}`);
      else if (created === 0) toast.info('كل اشتراكات الشهر موجودة بالفعل');
      else toast.success(`تم إنزال ${created} اشتراك (تم تخطي ${skipped})`);
    },
    onError: () => toast.error('فشل إنزال الاشتراكات'),
  });
}