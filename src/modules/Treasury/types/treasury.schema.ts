import { z } from 'zod';

export const addTreasurySchema = z.object({
  amount: z.coerce.number().min(0, 'يجب أن يكون المبلغ رقمًا موجبًا'),
  trunsactionType: z.coerce.number(),
  memberId: z.string().min(1, 'برجاء اختيار العضو المرتبط بالحركة'),
});
export type AddTreasuryFormValues = z.infer<typeof addTreasurySchema>;
