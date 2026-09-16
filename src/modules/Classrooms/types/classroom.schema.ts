import { z } from 'zod';

export const addClassroomSchema = z.object({
  class: z.string().min(1, 'اسم الفصل مطلوب'),
});
export type AddClassroomFormValues = z.infer<typeof addClassroomSchema>;
