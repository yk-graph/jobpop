import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Instagram from 'next-auth/providers/instagram';

import { getUserByEmail } from '@/actions';
import { loginSchema } from '@/lib/zod';
import { verifyPassword } from '@/utils';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Instagram({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    Credentials({
      authorize: async (credentials) => {
        // Tips: parse -> エラーが発生した場合にZodErrorがthrowされる
        // Tips: safeParse -> successプロパティとdataプロパティを持つオブジェクトを返す
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: user } = await getUserByEmail(email);
          if (!user || !user.hashedPassword) return null;

          const passwordsMatch = await verifyPassword(password, user.hashedPassword);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔵 SignIn callback triggered');
      console.log('🔵 User:', user);
      console.log('🔵 Account:', account);
      console.log('🔵 Profile:', profile);

      if (account?.provider === 'instagram') {
        console.log('🔵 Instagram signIn callback');
        console.log('🔵 Instagram profile:', profile);
      }

      return true;
    },
    async session({ session, token }) {
      console.log('🔵 Session callback');
      console.log('🔵 Session:', session);
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('🔵 JWT callback');
      console.log('🔵 Token:', token);
      console.log('🔵 User:', user);
      console.log('🔵 Account:', account);
      return token;
    },
  },
} satisfies NextAuthConfig;
