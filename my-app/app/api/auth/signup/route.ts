import { connectDB } from '@/lib/db';
import { Doctor } from '@/model/Doctor';
import { Patient } from '@/model/Patient';
import { Pharmacy } from '@/model/Pharmacy';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { role, name, licenseNumber, number } = body;

    if (!role || !name) {
      return NextResponse.json(
        { error: 'Role and name are required' },
        { status: 400 }
      );
    }

    if (role === 'doctor') {
      if (!licenseNumber)
        return NextResponse.json(
          { error: 'License number is required for doctors' },
          { status: 400 }
        );

      const existing = await Doctor.findOne({ doctorId: licenseNumber });
      if (existing)
        return NextResponse.json(
          { error: 'Doctor with this license already exists' },
          { status: 409 }
        );

      const newDoctor = new Doctor({
        doctorId: licenseNumber,
        licenseNumber,
        name,
        isVerified: false,
      });

      await newDoctor.save();
      return NextResponse.json(
        { message: 'Doctor registered. Awaiting admin verification.' },
        { status: 201 }
      );
    }

    if (role === 'pharmacy') {
      if (!licenseNumber)
        return NextResponse.json(
          { error: 'License number is required for pharmacies' },
          { status: 400 }
        );

      const existing = await Pharmacy.findOne({ pharmacyId: licenseNumber });
      if (existing)
        return NextResponse.json(
          { error: 'Pharmacy with this license already exists' },
          { status: 409 }
        );

      const newPharmacy = new Pharmacy({
        pharmacyId: licenseNumber,
        licenseNumber,
        name,
        isVerified: false,
      });

      await newPharmacy.save();
      return NextResponse.json(
        { message: 'Pharmacy registered. Awaiting admin verification.' },
        { status: 201 }
      );
    }

    if (role === 'patient') {
      if (!number)
        return NextResponse.json(
          { error: 'Phone number is required for patients' },
          { status: 400 }
        );

      const existing = await Patient.findOne({ number });
      if (existing)
        return NextResponse.json(
          { error: 'Patient with this number already exists' },
          { status: 409 }
        );

      const newPatient = new Patient({
        number,
        name,
        isVerified: false,
      });

      await newPatient.save();
      return NextResponse.json(
        { message: 'Patient registered. Awaiting admin verification.' },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: 'Invalid role provided' }, { status: 400 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
