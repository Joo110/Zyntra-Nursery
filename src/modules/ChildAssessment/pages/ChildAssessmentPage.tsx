import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useAssessmentHistory, useCreateAssessment } from '../hooks/useChildAssessment';
import { ChildAssessmentForm } from '../components/ChildAssessmentForm';
import type { AddAssessmentFormValues } from '../types/childAssessment.schema';
import type { ChildAssessmentDto } from '../types/childAssessment.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period, PeriodLabels } from '@/types/enums.types';

/**
 * شاشة تقييم الطلاب (Child Assessment) — تستخدم ChildAssessmentController الجاهز بالكامل بالباك.
 * تدفّق الاستخدام: اختيار القسم → الفترة → الطالب → عرض تاريخ التقييمات + زرار تسجيل تقييم جديد.
 */
export function ChildAssessmentPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [departmentId, setDepartmentId] = useState('');
  const [period, setPeriod] = useState<Period>(Period.AM);
  const [childId, setChildId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: history, isLoading, isError } = useAssessmentHistory(branchId ?? '', childId, departmentId);
  const createAssessment = useCreateAssessment(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handleSubmit = (values: AddAssessmentFormValues) => {
    createAssessment.mutate(
      {
        childId: values.childId,
        departmentId: values.departmentId,
        currentLevel: values.currentLevel,
        progress: values.progress || null,
        workbook: values.workbook || null,
        pageReached: values.pageReached ?? null,
        notes: values.notes || null,
        assessmentDate: values.assessmentDate,
      },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  const columns: ColumnDef<ChildAssessmentDto>[] = [
    { key: 'assessmentDate', header: 'التاريخ', render: (row) => <span className="ltr-numerals">{row.assessmentDate.slice(0, 10)}</span> },
    { key: 'currentLevel', header: 'المستوى' },
    { key: 'progress', header: 'التقدم', render: (row) => row.progress ?? '—' },
    { key: 'workbook', header: 'الكراسة', render: (row) => row.workbook ?? '—' },
    { key: 'pageReached', header: 'الصفحة', render: (row) => <span className="ltr-numerals">{row.pageReached ?? '—'}</span> },
    { key: 'notes', header: 'ملاحظات', render: (row) => row.notes ?? '—' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><ClipboardList className="h-5 w-5" /> تقييم الطلاب</h1>
          <p className="text-sm text-neutral-500">متابعة مستوى وتقدّم كل طالب في الأقسام المشترك بها</p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsFormOpen(true)}
          disabled={!childId || !departmentId}
        >
          تسجيل تقييم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => { setDepartmentId(v); setChildId(''); }} />
        <Select value={period} onChange={(e) => { setPeriod(Number(e.target.value) as Period); setChildId(''); }}>
          {Object.values(Period).filter((v) => typeof v === 'number').map((p) => (
            <option key={p} value={p}>{PeriodLabels[p as Period]}</option>
          ))}
        </Select>
        <ChildDropdown branchId={branchId} departmentId={departmentId} period={period} value={childId} onChange={setChildId} />
      </div>

      {!childId || !departmentId ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-surface p-10 text-center text-sm text-neutral-500">
          برجاء اختيار القسم والطالب أولًا لعرض تاريخ التقييمات
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={history ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد تقييمات مسجّلة لهذا الطالب في هذا القسم بعد"
          emptyActionLabel="تسجيل تقييم جديد"
          onEmptyAction={() => setIsFormOpen(true)}
        />
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="تسجيل تقييم جديد">
        <ChildAssessmentForm
          childId={childId}
          departmentId={departmentId}
          onSubmit={handleSubmit}
          isLoading={createAssessment.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
