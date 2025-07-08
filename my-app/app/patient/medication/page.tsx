'use client';

import { useEffect, useState } from 'react';

interface Medication {
  _id: string;
  title: string;
  description?: string;
  dosage?: string;
  doctorComment?: string;
  dateUploaded?: string;
  dateUpdated?: string;
  doctorId?: {
    name?: string;
    _id: string;
  };
}

export default function PatientMedication() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await fetch('/api/medications/patient'); // endpoint must return meds for logged-in patient
        const data = await res.json();
        setMedications(data);
      } catch (err) {
        console.error('Failed to load medications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeds();
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Loading medications...</div>;

  if (!medications.length)
    return <div className="p-4 text-gray-500 italic">No medications found.</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4 text-red-600">My Medications</h1>
      <div className="space-y-4">
        {medications.map((med) => (
          <div
            key={med._id}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-800">{med.title}</h2>
              <span className="text-sm text-gray-500">
                {new Date(med.dateUploaded || '').toLocaleDateString()}
              </span>
            </div>

            {med.description && (
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Description:</span> {med.description}
              </p>
            )}

            {med.dosage && (
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Dosage:</span> {med.dosage}
              </p>
            )}

            {med.doctorComment && (
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Doctor's Comment:</span> {med.doctorComment}
              </p>
            )}

            {med.doctorId?.name && (
              <p className="text-sm mt-2 text-gray-500 italic">
                Prescribed by Dr. {med.doctorId.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
