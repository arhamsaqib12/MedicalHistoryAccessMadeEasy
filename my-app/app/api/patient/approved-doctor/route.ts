import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ApprovedDoctor } from '@/model/ApprovedDoctors';
import { Doctor } from '@/model/Doctor';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ message: 'Missing patientId' }, { status: 400 });
    }

    const approvedDocs = await ApprovedDoctor.find({ patientId });
    const doctorObjectIds = approvedDocs.map((entry) => new mongoose.Types.ObjectId(entry.doctorId));
    const doctors = await Doctor.find({ _id: { $in: doctorObjectIds } }).select('_id name specialty');

    return NextResponse.json(doctors);
  } catch (err) {
    console.error('Error fetching approved doctors:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
