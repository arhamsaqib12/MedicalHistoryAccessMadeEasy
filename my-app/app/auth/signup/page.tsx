'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('doctor');
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: any = { role, name };
    if (role === 'doctor' || role === 'pharmacy') {
      payload.licenseNumber = licenseNumber;
    } else if (role === 'patient') {
      payload.number = number;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-200">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-6 tracking-wide">
          Sign Up
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium text-red-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 bg-white focus:ring-2 focus:ring-red-400"
              disabled={loading}
            >
              <option value="doctor">Doctor</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-red-700">Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 placeholder-red-300 bg-white focus:ring-2 focus:ring-red-400"
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>

          {(role === 'doctor' || role === 'pharmacy') && (
            <div>
              <label className="block text-sm mb-1 font-medium text-red-700">License Number</label>
              <input
                required
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 placeholder-red-300 bg-white focus:ring-2 focus:ring-red-400"
                disabled={loading}
                placeholder="Enter your license number"
              />
            </div>
          )}

          {role === 'patient' && (
            <div>
              <label className="block text-sm mb-1 font-medium text-red-700">Phone Number</label>
              <input
                required
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 placeholder-red-300 bg-white focus:ring-2 focus:ring-red-400"
                disabled={loading}
                placeholder="Enter your phone number"
              />
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-2 rounded-xl border border-red-600 hover:bg-red-700 transition"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-red-700">
          Already have an account?{' '}
          <a href="/auth/signin" className="underline font-semibold hover:text-red-800 cursor-pointer">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
