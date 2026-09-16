import { useNavigate } from 'react-router-dom';
import { ChildForm } from '../components/ChildForm';
import { useCreateChild } from '../hooks/useChildren';
import type { AddChildFormValues } from '../types/child.schema';
import type { Gender, Period } from '@/types/enums.types';
import { Card } from '@/components/common/Card';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { ROUTES } from '@/app/router/routes.constants';
import { toast } from 'sonner';

export function ChildCreatePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const navigate = useNavigate();
  const createChild = useCreateChild(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handleSubmit = (values: AddChildFormValues) => {
    // ⚠️ busId غير مدعوم بـ AddChildDto حاليًا بالباك (راجع تعليق ChildForm) — لا يُرسل هنا عمدًا.
    createChild.mutate(
      { ...values, gender: values.gender as Gender, period: values.period as Period, email: values.email || null },
      {
        onSuccess: () => {
          // AddChildAsync بالباك يرجّع رسالة نجاح فقط بدون Id الطالب الجديد، لذلك لا يمكن
          // نداء Treasury/child/{childId}/advance-payment من هنا مباشرة — راجع البلاغ في خطة الفرونت.
          if (values.isAdvancePaymentMade && values.advancePaymentAmount && values.advancePaymentAmount > 0) {
            toast.info('برجاء الدخول لتعديل بيانات الطالب لتسجيل مقدمة الحجز، لأن الباك لا يرجّع معرّف الطالب الجديد بعد الإضافة');
          }
          navigate(ROUTES.CHILDREN);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">إضافة طالب جديد</h1>
        <p className="text-sm text-neutral-500">أدخل بيانات الطالب الجديد</p>
      </div>
      <Card className="max-w-3xl p-6">
        <ChildForm
          branchId={branchId}
          onSubmit={handleSubmit}
          isLoading={createChild.isPending}
          onCancel={() => navigate(ROUTES.CHILDREN)}
        />
      </Card>
    </div>
  );
}
