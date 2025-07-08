'use client';

import { useEffect, useState } from 'react';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    specialty: '',
    description: '',
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch('/api/doctor/me');
      const data = await res.json();
      setDoctor(data);
      setForm({
        name: data.name || '',
        licenseNumber: data.licenseNumber || '',
        specialty: data.specialty || '',
        description: data.description || '',
      });
    };

    fetchDoctor();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/doctor/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      setDoctor(updated);
      setEditing(false);
    }
  };

  if (!doctor) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Doctor Profile</h1>

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
            <p>{doctor.name}</p>
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
            <p>{doctor.licenseNumber}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Specialty</label>
          {editing ? (
            <input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p>{doctor.specialty || '—'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Verified</label>
          <p className="text-green-600">{doctor.isVerified ? 'Yes' : 'No'}</p>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold">Description</label>
          {editing ? (
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2 min-h-[80px]"
            />
          ) : (
            <p>{doctor.description || '—'}</p>
          )}
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
