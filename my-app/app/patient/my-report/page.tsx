'use client';

import { useState, useEffect } from 'react';

interface Allergy {
  _id: string;
  title: string;
  description?: string;
  dateDiagnosed?: string;
}

interface Medication {
  _id: string;
  title: string;
  description?: string;
  dosage?: string;
  doctorComment?: string;
  dateUploaded?: string;
}

interface MedicalRecord {
  _id: string;
  title: string;
  description?: string;
  datePublished?: string;
}

export default function PatientMedicalReportForSelf() {
  const [allergiesOpen, setAllergiesOpen] = useState(true);
  const [medicationsOpen, setMedicationsOpen] = useState(true);

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/patient/report');
        if (!res.ok) throw new Error('Failed to fetch your medical report');
        const data = await res.json();
        setAllergies(data.allergies);
        setMedications(data.medications);
        setMedicalRecords(data.medicalRecords);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading your report...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Medical Report</h2>

      {/* Allergies */}
      <section className="mb-6">
        <button
          onClick={() => setAllergiesOpen((o) => !o)}
          className="w-full text-left text-lg font-semibold bg-red-600 text-white rounded px-4 py-2"
        >
          Allergies {allergiesOpen ? '▲' : '▼'}
        </button>
        {allergiesOpen && (
          <div className="mt-3 border border-gray-300 rounded p-4">
            {allergies.length === 0 ? (
              <p className="text-gray-500">No allergies recorded.</p>
            ) : (
              allergies.map((a) => (
                <div key={a._id} className="mb-3 border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{a.title}</p>
                  {a.description && <p className="text-gray-700">{a.description}</p>}
                  {a.dateDiagnosed && (
                    <p className="text-sm text-gray-500">
                      Diagnosed on: {new Date(a.dateDiagnosed).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Medications */}
      <section className="mb-6">
        <button
          onClick={() => setMedicationsOpen((o) => !o)}
          className="w-full text-left text-lg font-semibold bg-red-600 text-white rounded px-4 py-2"
        >
          Medications {medicationsOpen ? '▲' : '▼'}
        </button>
        {medicationsOpen && (
          <div className="mt-3 border border-gray-300 rounded p-4">
            {medications.length === 0 ? (
              <p className="text-gray-500">No medications recorded.</p>
            ) : (
              medications.map((m) => (
                <div key={m._id} className="mb-3 border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{m.title}</p>
                  {m.description && <p className="text-gray-700">{m.description}</p>}
                  {m.dosage && <p className="text-sm text-gray-600">Dosage: {m.dosage}</p>}
                  {m.doctorComment && (
                    <p className="text-sm text-gray-600 italic">
                      Doctor Comment: {m.doctorComment}
                    </p>
                  )}
                  {m.dateUploaded && (
                    <p className="text-xs text-gray-400">
                      Uploaded: {new Date(m.dateUploaded).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Medical Records */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Medical History</h3>
        {medicalRecords.length === 0 ? (
          <p className="text-gray-500">No medical history available.</p>
        ) : (
          <ul className="space-y-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
            {medicalRecords.map((r) => (
              <li key={r._id} className="border-b last:border-b-0 pb-2">
                <p className="font-semibold">{r.title}</p>
                {r.description && <p className="text-gray-700">{r.description}</p>}
                {r.datePublished && (
                  <p className="text-xs text-gray-400">
                    Published: {new Date(r.datePublished).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
