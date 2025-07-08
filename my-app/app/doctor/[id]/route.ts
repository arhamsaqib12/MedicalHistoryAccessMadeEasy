import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/model/Doctor';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();

  try {
    const doctor = await Doctor.findByIdAndUpdate(id, body, { new: true });
    if (!doctor) return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });

    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update doctor' }, { status: 500 });
  }
}
