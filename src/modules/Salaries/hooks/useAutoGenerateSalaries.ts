import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { salaryService } from '../services/salaryService';
import { salaryKeys } from './useSalaries';
import { MemberType } from '../types/enums.types';

const TYPES = [MemberType.Teacher, MemberType.Worker] as const;

export type LoadEmployees = (type: MemberType) => Promise<{ id: string }[]>;

const monthKey = (iso: string) => iso.slice(0, 7);

async function runInBatches<T>(items: T[], size: number, fn: (item: T) => Promise<unknown>) {
  let failed = 0;
  for (let i = 0; i < items.length; i += size) {
    const results = await Promise.allSettled(items.slice(i, i + size).map(fn));
    failed += results.filter((r) => r.status === 'rejected').length;
  }
  return failed;
}

export async function generateMonthlySalaries(branchId: string, loadEmployees: LoadEmployees) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const salaryMonth = `${currentMonth}-01`;

  let total = 0;
  let created = 0;
  let failed = 0;

  for (const type of TYPES) {
    const employees = await loadEmployees(type);
    total += employees.length;
    if (employees.length === 0) continue;

    const existing = await salaryService.getList(branchId, type);
    const alreadyHave = new Set(
      existing.filter((s) => monthKey(s.salaryMonth) === currentMonth).map((s) => s.employeeId)
    );

    const todo = employees.filter((e) => !alreadyHave.has(e.id));

    const failedNow = await runInBatches(todo, 5, async (e) => {
      const base = await salaryService.getBaseSalary(branchId, type, e.id);
      if (!base.amount || base.amount <= 0) throw new Error('no base salary');
      return salaryService.add(branchId, {
        employeeId: e.id,
        branchId,
        employeeType: type,
        amount: base.amount,
        salaryMonth,
        isPaid: false,
      });
    });

    failed += failedNow;
    created += todo.length - failedNow;
  }

  return { total, created, failed };
}

export function useGenerateMonthlySalaries(branchId: string, loadEmployees: LoadEmployees) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => generateMonthlySalaries(branchId, loadEmployees),
    onSuccess: ({ total, created, failed }) => {
      qc.invalidateQueries({ queryKey: salaryKeys.all });
      if (total === 0) toast.info('لا يوجد موظفين لإنزال رواتبهم');
      else if (failed > 0) toast.warning(`تم إنشاء ${created} راتب، وفشل ${failed}`);
      else if (created === 0) toast.info('رواتب الشهر موجودة بالفعل');
      else toast.success(`تم إنزال ${created} راتب`);
    },
    onError: () => toast.error('فشل إنزال الرواتب'),
  });
}