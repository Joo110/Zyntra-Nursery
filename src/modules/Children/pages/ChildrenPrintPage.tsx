import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { childService } from '../services/childService';
import { departmentService } from '@/modules/Departments/services/departmentService';
import { useBranchStore } from '@/app/providers/branchStore';
import { Period } from '@/types/enums.types';
import type { PagedResult } from '@/types/pagination.types';
import type { ChildListDto } from '../types/child.types';

const TAKE = 100;
const genderLabel = (g: number) => (g === 1 ? 'ذكر' : 'أنثى');
const periodLabel = (p: Period) => (p === Period.AM ? 'صباحي' : 'مسائي');

async function fetchAll<T>(fetchPage: (page: number) => Promise<PagedResult<T>>): Promise<T[]> {
  const first = await fetchPage(1);
  const all = [...(first.items ?? [])];
  for (let p = 2; p <= (first.totalPages ?? 1); p++) {
    all.push(...((await fetchPage(p)).items ?? []));
  }
  return all;
}

interface DeptGroup {
  id: string;
  name: string;
  children: ChildListDto[];
}

async function loadAllByDepartment(
  branchId: string,
  onlyDepartmentId?: string,
  onlyPeriod?: Period,
  name?: string
): Promise<DeptGroup[]> {
  // dropdown بيرجّع كل الأقسام في طلب واحد
  const departments = (await departmentService.getDropdown(branchId)) as unknown as Record<string, string>[];

  const targets = onlyDepartmentId ? departments.filter((d) => d.id === onlyDepartmentId) : departments;
  const periods: Period[] = onlyPeriod !== undefined ? [onlyPeriod] : [0 as Period, 1 as Period];

  const groups = await Promise.all(
    targets.map(async (d) => {
      const lists = await Promise.all(
        periods.map((period) =>
          fetchAll((p) => childService.getList(branchId, d.id, period, p, TAKE, name))
        )
      );
      // إزالة التكرار لو الطالب ظهر في الفترتين
      const unique = [...new Map(lists.flat().map((c) => [c.id, c])).values()];
      // اسم القسم: جرّب أكتر من اسم حقل محتمل
      const deptName = d.name ?? d.departmentName ?? d.title ?? d.label ?? '—';
      return { id: d.id, name: deptName, children: unique };
    })
  );

  return groups.filter((g) => g.children.length > 0);
}

export function ChildrenPrintPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id) ?? '';
  const branchName = useBranchStore((s) => s.selectedBranch?.branchName) ?? '';
  const [searchParams] = useSearchParams();

  const departmentId = searchParams.get('departmentId') || undefined;
  const period = searchParams.get('period') ? (Number(searchParams.get('period')) as Period) : undefined;
  const name = searchParams.get('search') || undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['children', 'print-by-department', branchId, departmentId, period, name],
    queryFn: () => loadAllByDepartment(branchId, departmentId, period, name),
    enabled: !!branchId,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  if (!branchId) return <div className="p-8 text-center">برجاء اختيار فرع أولًا...</div>;
  if (isLoading) return <div className="p-8 text-center">جاري تجهيز التقرير...</div>;
  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        فشل تحميل الطلاب: {(error as { message?: string })?.message ?? 'خطأ غير معروف'}
      </div>
    );
  }

  const total = data?.reduce((sum, g) => sum + g.children.length, 0) ?? 0;

  return (
    <div className="print-page p-6">
      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          .no-print { display: none !important; }

          /* إخفاء الـ TopBar والـ Sidebar بتوع الـ layout */
          header, nav, aside { display: none !important; }

          .dept-block { break-inside: auto; page-break-after: auto; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; }
        }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #999; padding: 6px 8px; text-align: right; }
        th { background: #f0f0f0; }
      `}</style>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="rounded-md bg-primary px-4 py-2 text-white">
          طباعة
        </button>
      </div>

      <h1 className="mb-1 text-center text-xl font-bold">تقرير الطلاب — {branchName}</h1>
      <p className="mb-6 text-center text-sm text-neutral-500">
        تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')} — إجمالي الطلاب: {total} — عدد الأقسام:{' '}
        {data?.length ?? 0}
      </p>

      {data?.length === 0 && <p className="text-center text-neutral-500">لا يوجد طلاب</p>}

      {data?.map((group) => (
        <section key={group.id} className="dept-block mb-8">
          <h2 className="mb-2 text-lg font-bold">
            القسم: {group.name} ({group.children.length})
          </h2>
          <table>
            <thead>
              <tr>
                <th>م</th>
                <th>الاسم</th>
                <th>القسم</th>
                <th>النوع</th>
                <th>المستوى</th>
                <th>الفصل</th>
                <th>الفترة</th>
                <th>رقم التواصل</th>
              </tr>
            </thead>
            <tbody>
              {group.children.map((child, i) => (
                <tr key={child.id}>
                  <td>{i + 1}</td>
                  <td>{child.name || '—'}</td>
                  <td>{group.name}</td>
                  <td>{genderLabel(child.gender)}</td>
                  <td>{child.level || '—'}</td>
                  <td>{child.class || '—'}</td>
                  <td>{periodLabel(child.period)}</td>
                  <td className="ltr-numerals">{child.callPhoneNumber || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}