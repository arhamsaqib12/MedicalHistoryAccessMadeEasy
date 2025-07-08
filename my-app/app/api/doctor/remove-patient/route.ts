import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { Patient } from '@/model/Patient';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'doctor') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { patientId } = await req.json();

  if (!patientId) {
    return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
  }

  // Find patient
  const patient = await Patient.findOne({ patientId });
  if (!patient) {
    return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
  }

  // Remove doctor from patient's approvedDoctors array
 patient.approvedDoctors = patient.approvedDoctors.filter(
  (docId: string) => docId !== session.user.id
);

  await patient.save();

  return NextResponse.json({ message: 'Patient removed from your list' });
}
