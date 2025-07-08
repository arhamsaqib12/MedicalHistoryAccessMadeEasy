import { z } from 'zod';

export const patientZod = z.object({
  name: z.string().min(1),
  patientId: z.string().min(1),
  number: z.string().min(1),
  isVerified: z.boolean().default(true),
});
