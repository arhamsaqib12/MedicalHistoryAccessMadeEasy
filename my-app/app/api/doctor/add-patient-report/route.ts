import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { connectDB } from '@/lib/db';
import { MedicalRecord } from '@/model/MedicalRecords';

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'doctor') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { title, description, patientId } = data;

  if (!title || !patientId) {
    return NextResponse.json({ message: 'Title and patient ID are required' }, { status: 400 });
  }

  try {
    const newRecord = await MedicalRecord.create({
      title,
      description,
      doctorId: session.user.id,
      patientId,
    });

    return NextResponse.json(newRecord);
  } catch (err) {
    return NextResponse.json({ message: 'Failed to add medical record' }, { status: 500 });
  }
}
