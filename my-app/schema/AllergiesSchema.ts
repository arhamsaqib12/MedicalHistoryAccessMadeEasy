import { z } from 'zod';

export const allergyZod = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dateDiagnosed: z.string().datetime().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().min(1),
});

export type AllergyInput = z.infer<typeof allergyZod>;
