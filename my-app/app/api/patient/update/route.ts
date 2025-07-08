import { connectDB } from '@/lib/db';
import { Patient } from '@/model/Patient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { id, name, number } = await req.json();

    if (!id || !name || !number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await Patient.findByIdAndUpdate(
      id,
      { name, number },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient updated', patient: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
