import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IMedicalRecord extends Document {
  title: string;
  description?: string;
  datePublished?: Date;
  doctorId?: string;
  patientId?: string;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  title: { type: String, required: true },
  description: { type: String },
  datePublished: { type: Date, default: Date.now },
  doctorId: { type: String },
  patientId: { type: String },
});

export const MedicalRecord = models.MedicalRecord || model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
