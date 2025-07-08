import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { doctorId, query } = await req.json();

    if (!doctorId) {
      return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
    }

    const pipeline: any[] = [
      {
        $match: {
          approvedDoctors: doctorId,
          ...(query && {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { number: { $regex: query, $options: 'i' } },
            ],
          }),
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          number: 1,
          patientId: 1,
        },
      },
    ];

    const patients = await Patient.aggregate(pipeline);

    return NextResponse.json(patients);
  } catch (error) {
    console.error('[ERROR] /api/doctor/search-patient:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
