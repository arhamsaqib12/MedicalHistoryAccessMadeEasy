// /app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/model/Doctor';

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';

  try {
    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
      ],
    });

    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch doctors' }, { status: 500 });
  }
}
