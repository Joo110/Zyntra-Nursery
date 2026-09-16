import { z } from 'zod';

export const addBrotherSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
});
export type AddBrotherFormValues = z.infer<typeof addBrotherSchema>;
