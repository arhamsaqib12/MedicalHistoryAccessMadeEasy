import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Pharmacy } from '@/model/Pharmacy';

export async function GET(req: NextRequest) {
  await connectDB();

  const id = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');

  if (!id || role !== 'pharmacy') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Find pharmacy by your custom string id (e.g. pharmacyId)
  const pharmacy = await Pharmacy.findOne({ pharmacyId: id }).lean();

  if (!pharmacy) {
    return NextResponse.json({ message: 'Pharmacy not found' }, { status: 404 });
  }

  return NextResponse.json(pharmacy);
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const id = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');

  if (!id || role !== 'pharmacy') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  // Update pharmacy by your custom string id (pharmacyId)
  const updatedPharmacy = await Pharmacy.findOneAndUpdate(
    { pharmacyId: id },
    {
      name: data.name,
      licenseNumber: data.licenseNumber,
      address: data.address,
    },
    { new: true }
  ).lean();

  if (!updatedPharmacy) {
    return NextResponse.json({ message: 'Pharmacy not found' }, { status: 404 });
  }

  return NextResponse.json(updatedPharmacy);
}
