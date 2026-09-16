import { z } from 'zod';

export const addDepartmentSchema = z.object({
  departmentName: z.string().min(1, 'اسم القسم مطلوب'),
  subscriptionPrice: z.coerce.number().min(0, 'يجب أن يكون السعر رقمًا موجبًا'),
});

export type AddDepartmentFormValues = z.infer<typeof addDepartmentSchema>;
