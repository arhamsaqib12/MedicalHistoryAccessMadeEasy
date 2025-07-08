'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Medication {
  _id: string;
  title: string;
  description?: string;
  dosage?: string;
  doctorComment?: string;
  dateUploaded?: string;
  dateUpdated?: string;
}

interface Patient {
  _id: string;
  name: string;
  number: string;
}

export default function PharmacyApprovedPatients() {
  const { data: session, status } = useSession();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [error, setError] = useState('');

  // Fetch patients approved for this pharmacy
  const fetchPatients = async () => {
    if (!session?.user?.id) {
      setError('You must be logged in.');
      setPatients([]);
      return;
    }
    if (!searchQuery.trim()) {
      setPatients([]);
      return;
    }
    setLoadingPatients(true);
    setError('');
    try {
      const res = await fetch(`/api/pharmacy/patient?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
          'x-user-role': session.user.role,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPatients(false);
    }
  };

  // Fetch medications for selected patient
  const fetchMedications = async (patientId: string) => {
    if (!session?.user?.id) {
      setError('You must be logged in.');
      setMedications([]);
      return;
    }
    setLoadingMeds(true);
    setError('');
    try {
      const res = await fetch(`/api/pharmacy/medications/${patientId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
          'x-user-role': session.user.role,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch medications');
      }
      const data = await res.json();
      setMedications(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingMeds(false);
    }
  };

  // Fetch patients when searchQuery or session changes
  useEffect(() => {
    fetchPatients();
  }, [searchQuery, session]);

  // Fetch medications when selected patient changes
  useEffect(() => {
    if (selectedPatientId) {
      fetchMedications(selectedPatientId);
    } else {
      setMedications([]);
    }
  }, [selectedPatientId]);

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) return <p>Please log in to continue.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Your Approved Patients</h2>
      <input
        type="text"
        placeholder="Enter patient name or number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      {loadingPatients ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : patients.length === 0 ? (
        <p>No approved patients found.</p>
      ) : (
        <ul className="mb-6">
          {patients.map((patient) => (
            <li key={patient._id} className="border-b py-2 flex justify-between items-center">
              <div>
                <strong>{patient.name}</strong> — {patient.number}
              </div>
              <button
                onClick={() => setSelectedPatientId(patient._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                View Medications
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedPatientId && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Medications for Patient</h3>
          {loadingMeds ? (
            <p>Loading medications...</p>
          ) : medications.length === 0 ? (
            <p>No medications found for this patient.</p>
          ) : (
            <ul className="space-y-4">
              {medications.map((med) => (
                <li key={med._id} className="border rounded p-4 bg-white shadow">
                  <h4 className="font-bold">{med.title}</h4>
                  {med.description && <p><strong>Description:</strong> {med.description}</p>}
                  {med.dosage && <p><strong>Dosage:</strong> {med.dosage}</p>}
                  {med.doctorComment && <p><strong>Doctor's Comment:</strong> {med.doctorComment}</p>}
                  {med.dateUploaded && (
                    <p><em>Uploaded: {new Date(med.dateUploaded).toLocaleDateString()}</em></p>
                  )}
                  {med.dateUpdated && (
                    <p><em>Updated: {new Date(med.dateUpdated).toLocaleDateString()}</em></p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
