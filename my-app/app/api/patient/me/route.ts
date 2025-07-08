import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'Missing patientId' }, { status: 400 });
  }

  await connectDB();

  // Assuming patientId is a custom ID, stored as a field (not _id)
  const patient = await Patient.findOne({ patientId }).lean();

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const patientId = body.patientId;

  if (!patientId) {
    return NextResponse.json({ error: 'Missing patientId' }, { status: 400 });
  }

  await connectDB();

  const updated = await Patient.findOneAndUpdate(
    { patientId },  // fix typo here
    {
      name: body.name,
      number: body.number,
    },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
