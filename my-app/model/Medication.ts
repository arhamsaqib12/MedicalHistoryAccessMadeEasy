import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IMedication extends Document {
  title: string;
  description?: string;
  dosage?: string;
  doctorComment?: string;
  dateUploaded?: Date;
  dateUpdated?: Date;
  patientId?: string;
  doctorId?: string;
}

const MedicationSchema = new Schema<IMedication>({
  title: { type: String, required: true },
  description: { type: String },
  dosage: { type: String },
  doctorComment: { type: String },
  dateUploaded: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  patientId: { type: String },
  doctorId: { type: String},
});

export const Medication = models.Medication || model<IMedication>('Medication', MedicationSchema);
