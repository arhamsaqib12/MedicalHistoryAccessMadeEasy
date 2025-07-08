'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Pharmacy {
  _id: string;
  name: string;
  address?: string;
}

export default function SearchPharmacies() {
  const { data: session, status } = useSession();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState<string[]>([]); // holds approved pharmacy IDs

  // Fetch pharmacies matching search input
  const fetchPharmacies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/pharmacy?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch pharmacies');
      const data = await res.json();
      setPharmacies(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pharmacies already approved by patient
  const fetchApprovedPharmacies = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/patient/approved-pharmacy?patientId=${session.user.id}`);
      if (!res.ok) throw new Error('Failed to fetch approved pharmacies');
      const approvedData = await res.json();
      const approvedIds = approvedData.map((pharm: Pharmacy) => pharm._id);
      setApproved(approvedIds);
    } catch (err) {
      console.error('Error fetching approved pharmacies:', err);
    }
  };

  // Handle approval
  const handleApprovePharmacy = async (pharmacyId: string) => {
    const patientId = session?.user?.id;
    if (!patientId) {
      alert('You must be logged in as a patient to approve a pharmacy.');
      return;
    }

    try {
      const res = await fetch('/api/patient/approve-pharmacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId, patientId }),
      });

      if (!res.ok) throw new Error('Failed to approve pharmacy');
      setApproved((prev) => [...prev, pharmacyId]);
    } catch (err) {
      alert('Could not approve pharmacy');
    }
  };

  // Fetch data when search input changes
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchPharmacies();
    } else {
      setPharmacies([]);
    }
  }, [searchQuery]);

  // Fetch approved pharmacies once user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchApprovedPharmacies();
    }
  }, [status]);

  if (status === 'loading') return <p className="p-4 text-center">Checking session...</p>;
  if (!session) return <p className="p-4 text-center text-red-600">Please log in to view pharmacies.</p>;

  // Optional: Sort approved pharmacies to show first
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    const aApproved = approved.includes(a._id);
    const bApproved = approved.includes(b._id);
    return aApproved === bApproved ? 0 : aApproved ? -1 : 1;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">Search Pharmacies</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or address..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 shadow-sm"
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : sortedPharmacies.length === 0 ? (
        <p className="text-center text-gray-500">No pharmacies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPharmacies.map((pharmacy) => {
            const isApproved = approved.includes(pharmacy._id);
            return (
              <div key={pharmacy._id} className="border p-4 rounded-xl shadow bg-white">
                <h3 className="text-xl font-semibold text-teal-700">{pharmacy.name}</h3>
                <p className="text-gray-600 mb-3">
                  Address: {pharmacy.address || 'N/A'}
                </p>

                {isApproved ? (
                  <button
                    className="bg-green-600 cursor-default text-white px-4 py-2 rounded"
                    disabled
                  >
                    ✅ Approved
                  </button>
                ) : (
                  <button
                    onClick={() => handleApprovePharmacy(pharmacy._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Approve Pharmacy
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
