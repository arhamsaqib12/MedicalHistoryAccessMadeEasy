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
  dateUpdated?: string;
}

interface MedicalRecord {
  _id: string;
  title: string;
  description?: string;
  datePublished?: string;
}

interface Props {
  patientId: string;
}

export default function PatientMedicalReport({ patientId }: Props) {
  const [allergiesOpen, setAllergiesOpen] = useState(true);
  const [medicationsOpen, setMedicationsOpen] = useState(true);

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // For adding new medical record
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addingError, setAddingError] = useState('');
  const [addingLoading, setAddingLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/doctor/patient-report/${patientId}`);
        if (!res.ok) throw new Error('Failed to fetch report data');
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
  }, [patientId]);

  const handleAddRecord = async () => {
    if (!newTitle.trim()) {
      setAddingError('Title is required');
      return;
    }

    setAddingError('');
    setAddingLoading(true);
    try {
      const res = await fetch('/api/doctor/add-medical-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          patientId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add medical record');
      }

      const newRecord = await res.json();
      setMedicalRecords((prev) => [newRecord, ...prev]);
      setNewTitle('');
      setNewDescription('');
      setAdding(false);
    } catch (err: any) {
      setAddingError(err.message || 'Failed to add medical record');
    } finally {
      setAddingLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading report...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Patient Medical Report</h2>

      {/* Allergies Section */}
      <section className="mb-6">
        <button
          onClick={() => setAllergiesOpen((open) => !open)}
          className="w-full text-left text-lg font-semibold bg-red-600 text-white rounded px-4 py-2"
        >
          Allergies {allergiesOpen ? '▲' : '▼'}
        </button>
        {allergiesOpen && (
          <div className="mt-3 border border-gray-300 rounded p-4">
            {allergies.length === 0 ? (
              <p className="text-gray-500">No allergies recorded.</p>
            ) : (
              allergies.map((allergy) => (
                <div key={allergy._id} className="mb-3 border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{allergy.title}</p>
                  {allergy.description && <p className="text-gray-700">{allergy.description}</p>}
                  {allergy.dateDiagnosed && (
                    <p className="text-sm text-gray-500">
                      Diagnosed on: {new Date(allergy.dateDiagnosed).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Medications Section */}
      <section className="mb-6">
        <button
          onClick={() => setMedicationsOpen((open) => !open)}
          className="w-full text-left text-lg font-semibold bg-red-600 text-white rounded px-4 py-2"
        >
          Medications {medicationsOpen ? '▲' : '▼'}
        </button>
        {medicationsOpen && (
          <div className="mt-3 border border-gray-300 rounded p-4">
            {medications.length === 0 ? (
              <p className="text-gray-500">No medications recorded.</p>
            ) : (
              medications.map((med) => (
                <div key={med._id} className="mb-3 border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{med.title}</p>
                  {med.description && <p className="text-gray-700">{med.description}</p>}
                  {med.dosage && <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>}
                  {med.doctorComment && (
                    <p className="text-sm text-gray-600 italic">Doctor Comment: {med.doctorComment}</p>
                  )}
                  {med.dateUploaded && (
                    <p className="text-xs text-gray-400">
                      Uploaded: {new Date(med.dateUploaded).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Medical History & Add Opinion Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Medical History & Doctor's Opinion</h3>

        {medicalRecords.length === 0 && (
          <p className="text-gray-500 mb-4">No medical history records available.</p>
        )}

        <ul className="mb-6 space-y-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
          {medicalRecords.map((record) => (
            <li key={record._id} className="border-b last:border-b-0 pb-2">
              <p className="font-semibold">{record.title}</p>
              {record.description && <p className="text-gray-700">{record.description}</p>}
              {record.datePublished && (
                <p className="text-xs text-gray-400">
                  Published: {new Date(record.datePublished).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Add new medical opinion */}
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Add Your Report
          </button>
        ) : (
          <div className="border border-gray-300 rounded p-4 bg-white shadow-sm">
            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="title">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Report title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 min-h-[80px]"
                placeholder="Details of your report"
              />
            </div>

            {addingError && <p className="text-red-600 mb-2">{addingError}</p>}

            <div className="flex gap-3">
              <button
                disabled={addingLoading}
                onClick={handleAddRecord}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {addingLoading ? 'Adding...' : 'Submit'}
              </button>
              <button
                disabled={addingLoading}
                onClick={() => {
                  setAdding(false);
                  setAddingError('');
                  setNewTitle('');
                  setNewDescription('');
                }}
                className="border px-4 py-2 rounded hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
