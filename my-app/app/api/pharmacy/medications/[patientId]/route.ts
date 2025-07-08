import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Medication } from '@/model/Medication';
import { ApprovedPharmacy } from '@/model/ApprovedPharmacy';

export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  await connectDB();

  const pharmacyId = req.headers.get('x-user-id');
  const { patientId } = params;

  try {
    // Check if patient has approved this pharmacy
    const approval = await ApprovedPharmacy.findOne({
      patientId,
      PharmacyId: pharmacyId,
    });

    if (!approval) {
      return NextResponse.json(
        { message: 'Access denied: Patient has not approved this pharmacy' },
        { status: 403 }
      );
    }

    // Fetch medications for this patient
    const medications = await Medication.find({ patientId }).select(
      'title description dosage doctorComment dateUploaded dateUpdated'
    );

    return NextResponse.json(medications);
  } catch (err) {
    console.error('Error fetching medications:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
