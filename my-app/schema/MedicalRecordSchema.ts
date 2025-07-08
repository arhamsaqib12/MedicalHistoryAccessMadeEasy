import { z } from 'zod';

export const medicalRecordZod = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  datePublished: z.string().datetime().optional(),
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
});
