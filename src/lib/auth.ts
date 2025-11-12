import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import authConfig from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';
import { getAccountById, getUserById } from '@/actions';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60, // 1 minute
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser.success || !existingUser.data) {
        return token;
      }

      const existingAccount = await getAccountById(token.sub);

      if (existingAccount.success && existingAccount.data) {
        token.isOauth = !!existingAccount.data;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth || false,
        },
      };
    },
  },
  ...authConfig,
});
