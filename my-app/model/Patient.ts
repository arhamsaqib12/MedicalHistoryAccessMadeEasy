import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  patientId: string;
  number: string;
  isVerified: boolean;
  // approvedDoctors removed
}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  patientId: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  // approvedDoctors field removed
});

export const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);
