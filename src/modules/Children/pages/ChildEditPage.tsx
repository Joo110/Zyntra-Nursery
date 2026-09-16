import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ChildForm } from '../components/ChildForm';
import { useChild, useUpdateChild } from '../hooks/useChildren';
import { useMarkAdvancePayment } from '@/modules/Treasury/hooks/useTreasury';
import type { AddChildFormValues } from '../types/child.schema';
import type { Gender, Period } from '@/types/enums.types';
import { Card } from '@/components/common/Card';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { ROUTES } from '@/app/router/routes.constants';

/**
 * ✅ تحديث: الباك أضاف GET /branches/{branchId}/Child/{id} (يرجع ChildDetailsDto)،
 * لذلك أصبح ممكنًا جلب بيانات الطالب مباشرة بمعرّفه بدل الاعتماد على Navigation State
 * كما كان معمولًا سابقًا (كانت هذه الشاشة تعرض رسالة "Endpoint غير موجود" قبل هذا التحديث).
 */
export function ChildEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const { data: childData, isLoading } = useChild(branchId ?? '', id);
  const updateChild = useUpdateChild(branchId ?? '');
  const markAdvancePayment = useMarkAdvancePayment(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;
  if (isLoading || !childData) return <PageLoader label="جاري تحميل بيانات الطالب..." />;

  const handleSubmit = (values: AddChildFormValues) => {
    if (!id) return;

    const previousDepartmentIds = childData.departmentIds ?? [];
    const removedDepartmentIds = previousDepartmentIds.filter((d) => !values.departmentId.includes(d));

    updateChild.mutate(
      {
        id,
        name: values.name,
        city: values.city,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
        levelId: values.levelId,
        classId: values.classId,
        departmentIds: values.departmentId,
        removedDepartmentIds,
        gender: values.gender as Gender,
        callPhoneNumber: values.callPhoneNumber,
        period: values.period as Period,
        messageNumber: values.messageNumber,
        email: values.email || null,
        busId: values.busId || null,
      },
      {
        onSuccess: () => {
          // المقدمة تُسجَّل عبر Endpoint منفصل تمامًا عن تعديل بيانات الطفل نفسها
          if (values.isAdvancePaymentMade && values.advancePaymentAmount && values.advancePaymentAmount > 0) {
            markAdvancePayment.mutate(
              { childId: id, amount: values.advancePaymentAmount },
              { onSuccess: () => navigate(ROUTES.CHILDREN) }
            );
          } else {
            navigate(ROUTES.CHILDREN);
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.CHILDREN)} className="rounded-md p-2 hover:bg-neutral-200" aria-label="رجوع">
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">تعديل بيانات الطالب</h1>
          <p className="text-sm text-neutral-500">{childData.name}</p>
        </div>
      </div>
      <Card className="max-w-3xl p-6">
        <ChildForm
          branchId={branchId}
          initialData={{
            name: childData.name ?? '',
            city: childData.city ?? '',
            address: childData.address ?? '',
            dateOfBirth: childData.dateOfBirth?.slice(0, 10) ?? '',
            gender: childData.gender,
            callPhoneNumber: childData.callPhoneNumber,
            messageNumber: childData.messageNumber ?? '',
            email: childData.email ?? '',
            period: childData.period,
            levelId: childData.levelId ?? '',
            classId: childData.classId ?? '',
            departmentId: childData.departmentIds ?? [],
            busId: childData.busId ?? '',
            isAdvancePaymentMade: childData.isAdvancePaymentMade ?? false,
            advancePaymentAmount: childData.advancePaymentAmount ?? 0,
          }}
          onSubmit={handleSubmit}
          isLoading={updateChild.isPending || markAdvancePayment.isPending}
          onCancel={() => navigate(ROUTES.CHILDREN)}
        />
      </Card>
    </div>
  );
}
