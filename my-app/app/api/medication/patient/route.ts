// /app/api/medications/patient/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { Medication } from '@/model/Medication';
import { connectDB } from '@/lib/db';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.role || session.user.role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const medications = await Medication.find({ patientId: session.user.id }).populate('doctorId');
  return NextResponse.json(medications);
}
