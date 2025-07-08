import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ApprovedPharmacy } from '@/model/ApprovedPharmacy';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { patientId, pharmacyId } = body;

    if (!patientId || !pharmacyId) {
      return NextResponse.json({ message: 'Missing patientId or pharmacyId' }, { status: 400 });
    }

    // Upsert: create if doesn't exist, ignore duplicates due to index
    await ApprovedPharmacy.updateOne(
  { patientId, pharmacyId: pharmacyId },
  {
    $setOnInsert: {
      patientId,
      pharmacyId: pharmacyId,
      approvedAt: new Date(),
    },
  },
  { upsert: true }
);


    return NextResponse.json({ message: 'Pharmacy approved' });
  } catch (err) {
    console.error('Error approving pharmacy:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
