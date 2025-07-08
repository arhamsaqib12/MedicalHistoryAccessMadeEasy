import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/model/Doctor';
import { Patient } from '@/model/Patient';
import { Pharmacy } from '@/model/Pharmacy';

declare module 'next-auth' {
  interface Session { user: { id: string; role: string; name: string } }
  interface User { id: string; role: string; name: string }
}
declare module 'next-auth/jwt' {
  interface JWT { id?: string; role?: string; name?: string }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'ID or Phone Number', type: 'text' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const { id, role } = credentials ?? {};
        if (!id || !role) throw new Error('Missing credentials');

        await connectDB();
        let userDoc: any, customId: string;

        if (role === 'doctor') {
          userDoc = await Doctor.findOne({ doctorId: id });
          customId = userDoc?.doctorId;
        } else if (role === 'pharmacy') {
          userDoc = await Pharmacy.findOne({ pharmacyId: id });
          customId = userDoc?.pharmacyId;
        } else if (role === 'patient') {
          userDoc = await Patient.findOne({ patientId: id });
          customId = userDoc?.patientId;
        } else {
          throw new Error('Invalid role');
        }

        if (!userDoc) throw new Error('User not found');
        if (!userDoc.isVerified) throw new Error('Not verified by admin');

        return { id: customId, name: userDoc.name, role };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 86400, updateAge: 3600 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; token.name = user.name }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      return session;
    },
  },
  pages: { signIn: '/auth/login' },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
