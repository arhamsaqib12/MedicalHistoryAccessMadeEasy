import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IPharmacy extends Document {
  pharmacyId: string;
  licenseNumber: string;
  name: string;
  address?: string;
  isVerified: boolean;
}

const PharmacySchema = new Schema<IPharmacy>({
  pharmacyId: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String },
  isVerified: { type: Boolean, default: true },
});

export const Pharmacy = models.Pharmacy || model<IPharmacy>('Pharmacy', PharmacySchema);
