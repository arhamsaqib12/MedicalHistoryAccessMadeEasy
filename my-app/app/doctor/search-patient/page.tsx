'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function SearchPatients() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchPatients = async () => {
      if (query.trim() === '') {
        setPatients([]);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const res = await fetch('/api/doctor/search-patient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctorId: session?.user?.id, // Use ID from session
            query: query,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(data);
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchPatients, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, session]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Search Patients</h2>

      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Search by name or phone number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-blue-500">Loading...</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {!loading && !errorMsg && patients.length > 0 && (
        <ul className="space-y-3">
          {patients.map((patient: any) => (
            <li
              key={patient.patientId}
              className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition-all"
            >
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-gray-600">Phone: {patient.number}</p>
              <p className="text-sm text-gray-500">Patient ID: {patient.patientId}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && !errorMsg && query && patients.length === 0 && (
        <p className="text-gray-500 text-center">No patients found.</p>
      )}
    </div>
  );
}
