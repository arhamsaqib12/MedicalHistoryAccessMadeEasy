// /app/api/doctor/my-patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';

export async function GET(req: NextRequest) {
  // Extract doctorId from headers
  const doctorId = req.headers.get('x-doctor-id');
  
  if (!doctorId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch patients approved by the doctor
    const patients = await Patient.find({
      isVerified: true,
      approvedDoctors: doctorId, // Use doctorId to get the approved patients
    })
      .select('name patientId number -_id') // Only return needed fields
      .lean();

    return NextResponse.json(patients);
  } catch (error) {
    console.error('[ERROR] /api/doctor/my-patients:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
