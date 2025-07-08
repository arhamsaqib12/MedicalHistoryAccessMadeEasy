import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IDoctor extends Document {
  doctorId: string;
  licenseNumber: string;
  name: string;
  specialty?: string;
  description?: string;
  isVerified: boolean;
}

const DoctorSchema = new Schema<IDoctor>({
  doctorId: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  name: { type: String, required: true },
  specialty: { type: String },
  description: { type: String },
  isVerified: { type: Boolean, default: true },
});

export const Doctor = models.Doctor || model<IDoctor>('Doctor', DoctorSchema);
