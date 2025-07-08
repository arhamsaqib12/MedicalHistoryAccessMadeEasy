// pages/api/pharmacy/index.ts (or app/api/pharmacy/route.ts if using Next.js 13+)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Pharmacy } from '@/model/Pharmacy';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search')?.trim() || '';

    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { address: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const pharmacies = await Pharmacy.find(filter).select('_id name address');

    return NextResponse.json(pharmacies);
  } catch (err) {
    console.error('Error fetching pharmacies:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
