import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IAllergy extends Document {
  title: string;
  description?: string;
  dateDiagnosed?: Date;
  doctorId?: string;
  patientId: string;
}

const AllergySchema = new Schema<IAllergy>({
  title: { type: String, required: true },
  description: { type: String },
  dateDiagnosed: { type: Date },
  doctorId: { type: String },
  patientId: { type: String, required: true },
});

export const Allergy = models.Allergy || model<IAllergy>('Allergy', AllergySchema);
