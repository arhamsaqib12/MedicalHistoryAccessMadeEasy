'use client';

import { useEffect, useState } from 'react';

export default function PharmacyMyPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch('/api/pharmacy/my-patient');
      const data = await res.json();
      setPatients(data);
      setLoading(false);
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">My Approved Patients</h1>

      {patients.length === 0 ? (
        <p className="text-gray-600">No patients have approved this pharmacy yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="border p-4 rounded-lg shadow bg-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{patient.name}</h2>
              <p className="text-sm text-gray-600">Patient ID: {patient.patientId}</p>
              <p className="text-sm text-gray-600">Phone: {patient.number}</p>
              <p className="text-sm text-green-700">
                Verified: {patient.isVerified ? 'Yes' : 'No'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
