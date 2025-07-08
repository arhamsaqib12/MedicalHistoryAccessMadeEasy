import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IApprovedPharmacy extends Document {
  patientId: string;  // Could be ObjectId string referencing Patient
  pharmacyId: string;   // Could be ObjectId string referencing Doctor
  approvedAt: Date;   // Optional: track when approved\
}

const ApprovedPharmacySchema = new Schema<IApprovedPharmacy>({
  patientId: { type: String, required: true },
  pharmacyId: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now },
});

// Optional: To avoid duplicate approvals for same pair
ApprovedPharmacySchema.index({ patientId: 1, PharmacyId: 1 }, { unique: true });

export const ApprovedPharmacy = models.ApprovedPharmacy || model<IApprovedPharmacy>('ApprovedPharmacy', ApprovedPharmacySchema);
