import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ApprovedDoctor } from '@/model/ApprovedDoctors';
import { approvedDoctorZod } from '@/schema/ApprovedDoctorSchema';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { doctorId, patientId } = body;

    const payload = {
      doctorId,
      patientId,
      approvedAt: new Date(),
    };

    const parsed = approvedDoctorZod.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', error: parsed.error },
        { status: 400 }
      );
    }

    await ApprovedDoctor.updateOne(
      { doctorId, patientId },
      { $setOnInsert: payload },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Doctor approved successfully' });
  } catch (err) {
    console.error('Error approving doctor:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
