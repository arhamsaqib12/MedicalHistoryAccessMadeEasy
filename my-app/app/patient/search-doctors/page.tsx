'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Doctor {
  _id: string;
  name: string;
  specialty?: string;
}

export default function SearchDoctors() {
  const { data: session, status } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState<string[]>([]); // list of approved doctor IDs

  // Fetch doctors based on search query
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved doctors IDs for logged-in patient
  const fetchApprovedDoctors = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/patient/approved-doctor?patientId=${session.user.id}`);
      if (!res.ok) throw new Error('Failed to fetch approved doctors');
      const approvedDoctorsData = await res.json();
      // approvedDoctorsData is array of doctor objects,
      // map to array of doctor _id strings:
      const approvedIds = approvedDoctorsData.map((doc: Doctor) => doc._id);
      setApproved(approvedIds);
    } catch (err: any) {
      console.error('Error fetching approved doctors:', err);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApprovedDoctors();
    }
  }, [status]);

  // Approve a doctor
  const handleApproveDoctor = async (doctorId: string) => {
    const patientId = session?.user?.id;
    if (!patientId) {
      alert('You must be logged in as a patient to approve a doctor.');
      return;
    }

    try {
      const res = await fetch('/api/patient/approve-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, patientId }),
      });

      if (!res.ok) throw new Error('Failed to approve doctor');

      // Add doctorId to approved list so UI updates immediately
      setApproved((prev) => [...prev, doctorId]);
    } catch {
      alert('Could not approve doctor');
    }
  };

  if (status === 'loading') return <p className="p-4 text-center">Checking session...</p>;
  if (!session) return <p className="p-4 text-center text-red-600">Please log in to view doctors.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Search Doctors</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or specialty..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 shadow-sm"
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => {
            const isApproved = approved.includes(doctor._id);
            return (
              <div key={doctor._id} className="border p-4 rounded-xl shadow bg-white">
                <h3 className="text-xl font-semibold text-teal-700">{doctor.name}</h3>
                <p className="text-gray-600 mb-3">Specialty: {doctor.specialty || 'N/A'}</p>

                {isApproved ? (
                  <button
                    className="bg-green-600 cursor-default text-white px-4 py-2 rounded"
                    disabled
                  >
                    ✅ Approved
                  </button>
                ) : (
                  <button
                    onClick={() => handleApproveDoctor(doctor._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Approve Doctor
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}