import { z } from 'zod';

export const addMessageArchiveSchema = z.object({
  memberId: z.string().min(1, 'برجاء اختيار العضو'),
  sentVia: z.coerce.number(),
  messageContant: z.string().optional(),
});
export type AddMessageArchiveFormValues = z.infer<typeof addMessageArchiveSchema>;
