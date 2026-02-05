import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'

import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/resend'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),

  // メール/パスワード認証を有効化
  emailAndPassword: {
    enabled: true, // 使用する場合は true に設定
    requireEmailVerification: true, // メール認証を必須にする場合は true に設定
  },

  // メール認証の設定
  emailVerification: {
    sendOnSignUp: true, // 会員登録時に自動でメール送信する場合は true に設定
    autoSignInAfterVerification: true, // 認証完了後に自動ログインする場合は true に設定

    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({
        to: user.email,
        verificationUrl: url,
        userName: user.name || user.email,
      })
    },
  },

  socialProviders: {
    google: {
      prompt: 'select_account', // アカウント選択を促す場合に設定
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // 同じメールアドレスで複数の認証方法を許可（メール/パスワード + Google など）
  account: {
    accountLinking: {
      enabled: true,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7日間
    updateAge: 60 * 60 * 24, // 1日ごとに更新
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // キャッシュ(JWT)の有効期間（60分）
      strategy: 'jwt', // JWT形式でCookieに保存
    },
  },

  plugins: [nextCookies()],
})
