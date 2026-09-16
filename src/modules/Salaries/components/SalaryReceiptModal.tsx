import { Modal } from '@/components/modals/Modal';
import { PageLoader } from '@/components/loading/PageLoader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useSalaryReceipt } from '../hooks/useSalaries';

interface Props {
  branchId: string;
  salaryId: string | null;
  onClose: () => void;
}

/** إيصال راتب — يستخدم GET /Salaries/receipt/{salaryId} الموجود بالفعل بالباك */
export function SalaryReceiptModal({ branchId, salaryId, onClose }: Props) {
  const { data: receipt, isLoading } = useSalaryReceipt(branchId, salaryId);

  return (
    <Modal isOpen={!!salaryId} onClose={onClose} title="إيصال الراتب" size="sm">
      {isLoading || !receipt ? (
        <PageLoader label="جاري تحميل الإيصال..." />
      ) : (
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">الموظف</span><span className="font-medium">{receipt.employeeName}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">النوع</span><span className="font-medium">{receipt.employeeType}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">شهر الراتب</span><span className="ltr-numerals font-medium">{receipt.salaryMonth}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">المبلغ</span><span className="ltr-numerals font-medium">{receipt.amount.toLocaleString('ar-EG')} ج.م</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">الحالة</span><StatusBadge status={receipt.isPaid ? 'paid' : 'unpaid'} /></div>
          <div className="flex justify-between"><span className="text-neutral-500">تاريخ الإصدار</span><span className="ltr-numerals font-medium">{receipt.generatedDate.slice(0, 10)}</span></div>
        </div>
      )}
    </Modal>
  );
}
