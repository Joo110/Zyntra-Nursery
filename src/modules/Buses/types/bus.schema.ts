import { z } from 'zod';

export const addBusSchema = z.object({
  name: z.string().min(1, 'اسم الباص مطلوب'),
  subFees: z.coerce.number().min(0, 'يجب أن يكون رقمًا موجبًا'),
  capacity: z.coerce.number().min(1, 'يجب أن تكون السعة رقمًا موجبًا'),
  driverId: z.string().min(1, 'برجاء اختيار السائق'),
});

export type AddBusFormValues = z.infer<typeof addBusSchema>;
