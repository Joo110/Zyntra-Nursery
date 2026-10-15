import { z } from 'zod';

export const manualTreasurySchema = z.object({
  trunsactionType: z.coerce.number(),
  amount: z.coerce.number().min(0.01, 'يجب أن يكون المبلغ أكبر من صفر'),
  dateTime: z.string().min(1, 'التاريخ مطلوب'),
  note: z.string().min(1, 'الملاحظة/سبب الحركة مطلوب'),
});

export type ManualTreasuryFormValues = z.infer<typeof manualTreasurySchema>;
