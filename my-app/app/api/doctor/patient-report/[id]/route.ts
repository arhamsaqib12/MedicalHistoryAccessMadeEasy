import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/option'; // adjust path if needed
import { connectDB } from '@/lib/db';
import { Allergy } from '@/model/Allergies';
import { Medication } from '@/model/Medication';
import { MedicalRecord } from '@/model/MedicalRecords';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || session.user.role !== 'doctor') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const patientId = req.query.id as string;

  if (!patientId) {
    return res.status(400).json({ message: 'Missing patient ID' });
  }

  try {
    const [allergies, medications, medicalRecords] = await Promise.all([
      Allergy.find({ patientId }),
      Medication.find({ patientId }),
      MedicalRecord.find({ patientId }),
    ]);

    return res.status(200).json({ allergies, medications, medicalRecords });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch report data' });
  }
}
