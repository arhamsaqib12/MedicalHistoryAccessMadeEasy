import { z } from 'zod';

export const doctorZod = z.object({
  doctorId: z.string().min(1),
  licenseNumber: z.string().min(1),
  name: z.string().min(1),
  specialty: z.string().optional(),
  description: z.string().optional(),
  isVerified: z.boolean().default(true),
});
