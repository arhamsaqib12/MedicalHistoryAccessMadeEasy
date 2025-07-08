'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Patient {
  _id: string;
  name: string;
  number: string;
}

export default function PharmacyApprovedPatients() {
  const { data: session, status } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    if (!session?.user?.id || session.user.role !== 'pharmacy') {
      setError('You must be logged in as a pharmacy');
      return;
    }
    if (!searchQuery.trim()) {
      setPatients([]);
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery, session]);

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) return <p>Please log in to continue.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Your Approved Patients</h2>
      <input
        type="text"
        placeholder="Enter patient name or number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : patients.length === 0 ? (
        <p>No approved patients found.</p>
      ) : (
        <ul className="space-y-3">
          {patients.map((patient) => (
            <li
              key={patient._id}
              className="border p-3 rounded-md flex justify-between items-center bg-white shadow"
            >
              <div>
                <strong>{patient.name}</strong> — {patient.number}
              </div>
              <Link href={`/pharmacy/medication/${patient._id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm">
                  View Medications
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
