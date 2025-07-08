'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient' | 'pharmacy'>('doctor');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!['doctor', 'patient', 'pharmacy'].includes(role)) {
      setError('Invalid role selected');
      return;
    }

    setIsSubmitting(true);

    const res = await signIn('credentials', {
      id: identifier, // must match your NextAuth provider credentials
      role,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid credentials or user not verified');
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setJustLoggedIn(true);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user && justLoggedIn) {
      if (session.user.role === 'patient') {
        router.push('/patient/profile');
      } else if (session.user.role === 'doctor') {
        router.push('/doctor/profile');
      } else {
        router.push('/pharmacy/profile');
      }
    }
  }, [status, session, router, justLoggedIn]);

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-200">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-6 tracking-wide">
          Welcome Back
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="identifier" className="block text-sm mb-1 font-medium text-red-700">
              {role === 'patient' ? 'Phone Number' : 'License ID'}
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 placeholder-red-300 bg-white focus:ring-2 focus:ring-red-400"
              placeholder={role === 'patient' ? 'Enter your phone number' : 'Enter your license ID'}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm mb-1 font-medium text-red-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl border border-red-300 outline-none text-red-600 bg-white focus:ring-2 focus:ring-red-400"
              disabled={isSubmitting}
            >
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white font-bold py-2 rounded-xl border border-red-600 hover:bg-red-700 transition"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-red-700">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="underline font-semibold hover:text-red-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
