import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';
import { ApprovedPharmacy } from '@/model/ApprovedPharmacy';
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const approvals = await ApprovedPharmacy.find({ pharmacyId: session.user.id });

  const patientIds = approvals.map((a) => a.patientId);

  const patients = await Patient.find({ patientId: { $in: patientIds } }).lean();

  return NextResponse.json(patients);
}
