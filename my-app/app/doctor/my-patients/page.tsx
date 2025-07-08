// /app/doctor/my-patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Patient {
  name: string;
  patientId: string;
  number: string; 
}

export default function MyPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Replace this with the actual doctorId that you want to pass to the backend
  const doctorId = 'doctor-id-here'; // this should be dynamically set from the session or other source

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/doctor/my-patients', {
          method: 'GET',
          headers: {
            'x-doctor-id': doctorId, // Send doctorId in the hea
          },
        });

        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]); // Re-run effect if doctorId changes

  if (loading) return <p className="p-6 text-center">Loading your patients...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Patients</h1>

      {patients.length === 0 && <p className="text-gray-500 text-center">No patients approved your access yet.</p>}

      <ul className="space-y-3">
        {patients.map((patient) => (
          <li
            key={patient.patientId}
            className="border p-4 rounded hover:shadow-md transition cursor-pointer"
          >
            <Link href={`/doctor/patient-report/${patient.patientId}`}>
              <h2 className="font-semibold text-lg">{patient.name}</h2>
              <p className="text-sm text-gray-600">Phone: {patient.number}</p>
              <p className="text-xs text-gray-400">ID: {patient.patientId}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
