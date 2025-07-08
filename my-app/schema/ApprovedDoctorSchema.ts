import { z } from 'zod';

export const approvedDoctorZod = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  approvedAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
});
