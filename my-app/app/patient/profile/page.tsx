'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Doctor {
  _id: string;
  name: string;
  specialty?: string;
}

interface Pharmacy {
  _id: string;
  name: string;
  address?: string;
}

export default function PatientProfilePage() {
  const { data: session, status } = useSession();
  const [patient, setPatient] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', number: '', isVerified: false });
  const [approvedDoctors, setApprovedDoctors] = useState<Doctor[]>([]);
  const [approvedPharmacies, setApprovedPharmacies] = useState<Pharmacy[]>([]);

  const patientId = session?.user?.id;

  useEffect(() => {
    if (status !== 'authenticated' || !patientId) return;

    const fetchPatient = async () => {
      const res = await fetch(`/api/patient/me?patientId=${patientId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || 'Failed to fetch patient');
        return;
      }

      setPatient(data);
      setForm({
        name: data.name || '',
        number: data.number || '',
        isVerified: data.isVerified || false,
      });
    };

    const fetchApprovedDoctors = async () => {
      const res = await fetch(`/api/patient/approved-doctor?patientId=${patientId}`);
      const data = await res.json();
      if (res.ok) setApprovedDoctors(data);
      else console.error('Failed to fetch approved doctors');
    };

    const fetchApprovedPharmacies = async () => {
      const res = await fetch(`/api/patient/approved-pharmacy?patientId=${patientId}`);
      const data = await res.json();
      if (res.ok) setApprovedPharmacies(data);
      else console.error('Failed to fetch approved pharmacies');
    };

    fetchPatient();
    fetchApprovedDoctors();
    fetchApprovedPharmacies();
  }, [status, patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/patient/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        name: form.name,
        number: form.number,
      }),
    });

    const updated = await res.json();
    if (res.ok) {
      setPatient(updated);
      setEditing(false);
    } else {
      console.error(updated.error || 'Failed to update');
    }
  };

  if (status === 'loading') return <div className="p-6">Loading session...</div>;
  if (!session?.user) return <div className="p-6 text-red-600">Unauthorized</div>;
  if (!patient) return <div className="p-6">Loading patient...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Patient Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold">Name</label>
          {editing ? (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p>{patient.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Phone Number</label>
          {editing ? (
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p>{patient.number}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Verified</label>
          <p className="text-green-600">{patient.isVerified ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {editing ? (
          <>
            <button
              onClick={handleSubmit}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded text-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Approved Doctors */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-700">Approved Doctors</h2>
        {approvedDoctors.length === 0 ? (
          <p className="text-gray-600">No approved doctors.</p>
        ) : (
          <ul className="space-y-3">
            {approvedDoctors.map((doc) => (
              <li key={doc._id} className="border p-3 rounded bg-white shadow">
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-600">
                  Specialty: {doc.specialty || 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Approved Pharmacies */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-700">Approved Pharmacies</h2>
        {approvedPharmacies.length === 0 ? (
          <p className="text-gray-600">No approved pharmacies.</p>
        ) : (
          <ul className="space-y-3">
            {approvedPharmacies.map((pharm) => (
              <li key={pharm._id} className="border p-3 rounded bg-white shadow">
                <p className="font-medium">{pharm.name}</p>
                <p className="text-sm text-gray-600">
                  Address: {pharm.address || 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
