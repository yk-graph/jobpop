import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';

import { getUserByEmail } from '@/actions';
import { getAccountById, getUserById } from '@/actions';
import { loginSchema } from '@/lib/zod';
import { verifyPassword } from '@/utils';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
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
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect:', { url, baseUrl });

      // Facebook認証後のリダイレクト制御 -> #_=_を除去してクリーンなURLにリダイレクト
      if (url.includes('#_=_')) {
        return baseUrl + '/';
      }

      // デフォルトのリダイレクト処理
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
