import { z } from 'zod';

export const addWorkerSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  personalCardNumber: z.string().optional(),
  gender: z.coerce.number(),
  salary: z.coerce.number().min(0, 'يجب أن يكون الراتب رقمًا موجبًا'),
  period: z.coerce.number(),
});
export type AddWorkerFormValues = z.infer<typeof addWorkerSchema>;
