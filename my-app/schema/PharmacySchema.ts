import { z } from 'zod';

export const pharmacyZod = z.object({
  pharmacyId: z.string().min(1),
  licenseNumber: z.string().min(1),
  name: z.string().min(1),
  address: z.string().optional(),
  isVerified: z.boolean().default(true),
});
