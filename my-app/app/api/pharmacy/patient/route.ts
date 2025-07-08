import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';
import { ApprovedPharmacy } from '@/model/ApprovedPharmacy';

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('search')?.toLowerCase() || '';

  const pharmacyId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');

  if (!pharmacyId || userRole !== 'pharmacy') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all approved patients for this pharmacy
    const approved = await ApprovedPharmacy.find({ pharmacyId });
    const approvedPatientIds = approved.map((entry) => entry.patientId);

    if (!approvedPatientIds.length) {
      return NextResponse.json([]);
    }

    const filter: any = {
      _id: { $in: approvedPatientIds },
    };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { number: { $regex: query, $options: 'i' } },
      ];
    }

    const patients = await Patient.find(filter).select('_id name number');

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
