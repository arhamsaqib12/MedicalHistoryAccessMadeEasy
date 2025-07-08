import { z } from 'zod';

export const medicationZod = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dosage: z.string().optional(),
  doctorComment: z.string().optional(),
  dateUploaded: z.string().datetime().optional(),
  dateUpdated: z.string().datetime().optional(),
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
});
