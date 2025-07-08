import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IApprovedDoctor extends Document {
  patientId: string;  // Could be ObjectId string referencing Patient
  doctorId: string;   // Could be ObjectId string referencing Doctor
  approvedAt: Date;   // Optional: track when approved
}

const ApprovedDoctorSchema = new Schema<IApprovedDoctor>({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now },
});

// Optional: To avoid duplicate approvals for same pair
ApprovedDoctorSchema.index({ patientId: 1, doctorId: 1 }, { unique: true });

export const ApprovedDoctor = models.ApprovedDoctor || model<IApprovedDoctor>('ApprovedDoctor', ApprovedDoctorSchema);
