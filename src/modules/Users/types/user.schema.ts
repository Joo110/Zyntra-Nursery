import { z } from 'zod';

export const addUserSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  userName: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  role: z.coerce.number(),
  gender: z.coerce.number(),
  jopName: z.string().optional(),
});
export type AddUserFormValues = z.infer<typeof addUserSchema>;
