import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ApprovedPharmacy } from '@/model/ApprovedPharmacy';
import { Pharmacy } from '@/model/Pharmacy';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ message: 'Missing patientId' }, { status: 400 });
    }

    const approvedEntries = await ApprovedPharmacy.find({ patientId });

    const pharmacyObjectIds = approvedEntries.map((entry) =>
      new mongoose.Types.ObjectId(entry.pharmacyId) // ✅ fix here (lowercase `pharmacyId`)
    );

    const pharmacies = await Pharmacy.find({
      _id: { $in: pharmacyObjectIds },
    }).select('_id name address');

    return NextResponse.json(pharmacies);
  } catch (err) {
    console.error('Error fetching approved pharmacies:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
