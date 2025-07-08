import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('auth/signin'); // Not signed in? → go to sign-in page
  }

  // Role-based redirect
  const role = session.user.role;

  if (role === 'doctor') {
    redirect('/doctor/profile');
  } else if (role === 'patient') {
    redirect('/patient/profile');
  } else if (role === 'pharmacy') {
    redirect('/pharmacy/profile');
  } else {
    // fallback for undefined roles
    redirect('/unauthorized');
  }
}
