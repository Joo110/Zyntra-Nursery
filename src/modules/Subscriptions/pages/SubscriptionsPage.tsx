import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Wallet } from 'lucide-react';
import { useUnpaidSubscriptions, useCreateSubscription } from '../hooks/useSubscriptions';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { PeriodSelector } from '../components/PeriodSelector';
import type { AddSubscriptionFormValues } from '../types/subscription.schema';
import type { PaymentSubscriptionInfoDto } from '../types/subscription.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { GenderBadge } from '@/components/common/GenderBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

export function SubscriptionsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? Period.AM) as Period;
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, isError } = useUnpaidSubscriptions(branchId ?? '', period, pageNumber, PAGE_SIZE);
  const createSubscription = useCreateSubscription(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    // أي تغيير في الفلاتر يرجعنا لصفحة 1
    if (!('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  // لازم ترجع true/false عشان الفورم يعرف الحفظ نجح ولا لأ، ويقرر يعرض مودال الطباعة ولا لأ
  const handleSubmit = async (values: AddSubscriptionFormValues): Promise<boolean> => {
    try {
      await createSubscription.mutateAsync({
        ...values,
        dateOfPayment: values.isPaid ? new Date().toISOString() : null,
      });
      // نسيب المودال مفتوح لو isPaid عشان يظهر تأكيد الطباعة جوه SubscriptionForm نفسه
      if (!values.isPaid) setIsFormOpen(false);
      return true;
    } catch {
      return false; // toast.error شغال أصلاً جوه useCreateSubscription onError
    }
  };

  const columns: ColumnDef<PaymentSubscriptionInfoDto>[] = [
    { key: 'name', header: 'اسم الطالب' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    { key: 'amount', header: 'المبلغ المستحق', render: (row) => <span className="ltr-numerals">{row.amount.toLocaleString('ar-EG')} ج.م</span> },
    { key: 'status', header: 'الحالة', render: () => <StatusBadge status="unpaid" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><Wallet className="h-5 w-5" /> الاشتراكات</h1>
          <p className="text-sm text-neutral-500">متابعة اشتراكات الطلاب غير المدفوعة وتسجيل الدفعات</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>تسجيل دفعة</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p) })} />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row, i) => `${row.code}-${i}`}
          emptyMessage="لا يوجد اشتراكات غير مدفوعة حاليًا"
        />
        {data && (
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="تسجيل دفعة اشتراك">
        <SubscriptionForm
          branchId={branchId}
          departmentId={departmentId}
          period={period}
          onSubmit={handleSubmit}
          isLoading={createSubscription.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}