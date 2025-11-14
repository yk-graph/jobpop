import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'

import { getAccountById, getUserByEmail, getUserById } from '@/actions'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/zod'
import { verifyPassword } from '@/utils'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true, // Tips: ホストヘッダーを信頼する設定
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser.success || !existingUser.data) {
        return token
      }

      const existingAccount = await getAccountById(token.sub)

      if (existingAccount.success && existingAccount.data) {
        token.isOauth = !!existingAccount.data
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth || false,
        },
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      authorize: async (credentials) => {
        // Tips: parse -> エラーが発生した場合にZodErrorがthrowされる
        // Tips: safeParse -> successプロパティとdataプロパティを持つオブジェクトを返す
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const { data: user } = await getUserByEmail(email)
          if (!user || !user.hashedPassword) return null

          const passwordsMatch = await verifyPassword(password, user.hashedPassword)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
})
