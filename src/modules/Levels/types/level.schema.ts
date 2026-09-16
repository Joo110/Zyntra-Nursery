import { z } from 'zod';

export const addLevelSchema = z.object({
  levelName: z.string().min(1, 'اسم المستوى مطلوب'),
  levelContent: z.string().optional(),
});
export type AddLevelFormValues = z.infer<typeof addLevelSchema>;
