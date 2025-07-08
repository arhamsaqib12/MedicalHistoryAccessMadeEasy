import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { connectDB } from '@/lib/db';
import { Allergy } from '@/model/Allergies';
import { Medication } from '@/model/Medication';
import { MedicalRecord } from '@/model/MedicalRecords';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'patient') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Use the patientId string from session.user.id
    const patientId = session.user.id;

    // Fetch all data by patientId (custom string, NOT MongoDB _id)
    const [allergies, medications, medicalRecords] = await Promise.all([
      Allergy.find({ patientId }).lean(),
      Medication.find({ patientId }).lean(),
      MedicalRecord.find({ patientId }).lean(),
    ]);

    return NextResponse.json({ allergies, medications, medicalRecords });
  } catch (error) {
    console.error('[ERROR] /api/patient/report:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
