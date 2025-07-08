'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PharmacyProfilePage() {
  const { data: session, status } = useSession();
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    address: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user || !session.user.id || session.user.role !== 'pharmacy') {
      setError('Unauthorized: not logged in as pharmacy');
      setPharmacy(null);
      return;
    }

    async function fetchPharmacy() {
      try {
        const userId = session?.user.id!; // assert non-null with !

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-user-role': 'pharmacy',
        };

        const res = await fetch('/api/pharmacy/me', { headers });

        if (!res.ok) {
          setError('Failed to fetch profile');
          setPharmacy(null);
          return;
        }

        const data = await res.json();
        setPharmacy(data);
        setForm({
          name: data.name || '',
          licenseNumber: data.licenseNumber || '',
          address: data.address || '',
        });
        setError('');
      } catch {
        setError('Network error');
        setPharmacy(null);
      }
    }

    fetchPharmacy();
  }, [session, status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!session || !session.user || !session.user.id || session.user.role !== 'pharmacy') {
      setError('Unauthorized');
      return;
    }

    try {
      const userId = session.user.id!;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        'x-user-role': 'pharmacy',
      };

      const res = await fetch('/api/pharmacy/me', {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError('Failed to update profile');
        return;
      }

      const updated = await res.json();
      setPharmacy(updated);
      setEditing(false);
      setError('');
    } catch {
      setError('Network error');
    }
  };

  if (status === 'loading') return <div className="p-6">Loading session...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!pharmacy) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Pharmacy Profile</h1>

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
            <p>{pharmacy.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">License Number</label>
          {editing ? (
            <input
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p>{pharmacy.licenseNumber}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold">Address</label>
          {editing ? (
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded p-2 min-h-[80px]"
            />
          ) : (
            <p>{pharmacy.address || '—'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Verified</label>
          <p className="text-green-600">{pharmacy.isVerified ? 'Yes' : 'No'}</p>
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
    </div>
  );
}
