import { z } from 'zod';

export const addGraduationSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  dateOfJoin: z.string().min(1, 'تاريخ الالتحاق مطلوب'),
  dateOfGraduation: z.string().min(1, 'تاريخ التخرج مطلوب'),
  gender: z.coerce.number(),
});
export type AddGraduationFormValues = z.infer<typeof addGraduationSchema>;
