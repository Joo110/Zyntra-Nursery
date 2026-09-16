import { useState } from 'react';
import { Button } from '@/components/common/Button';

interface Props {
  onSubmit: (values: { name: string; phoneNumber: string; isSmoking: boolean }) => void;
  isLoading?: boolean;
  onCancel: () => void;
  defaultValues?: { name: string; phoneNumber: string; isSmoking: boolean };
}

export function DriverForm({ onSubmit, isLoading, onCancel, defaultValues }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(defaultValues?.phoneNumber ?? '');
  const [isSmoking, setIsSmoking] = useState(defaultValues?.isSmoking ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phoneNumber, isSmoking });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">اسم السائق</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">رقم الهاتف</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 ltr-numerals"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" checked={isSmoking} onChange={(e) => setIsSmoking(e.target.checked)} />
        مدخن
      </label>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
          إلغاء
        </Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>
          حفظ
        </Button>
      </div>
    </form>
  );
}