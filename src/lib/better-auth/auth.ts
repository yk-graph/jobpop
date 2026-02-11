import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { customSession } from 'better-auth/plugins'

import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/resend'
import { getRolesByUserId } from '@/services'

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
    sendOnSignIn: true, // 未認証ユーザーがログイン試行時に認証メールを再送する場合は true に設定
    autoSignInAfterVerification: true, // 認証完了後に自動ログインする場合は true に設定
    expiresIn: 60 * 60 * 24, // 認証メールの有効期限（24時間）
    callbackURL: '/', // 認証完了後のリダイレクト先URL（エラー時はproxy.tsで/loginにリダイレクト）

    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({
        to: user.email,
        verificationUrl: url,
        userName: user.name,
      })
    },
  },

  socialProviders: {
    google: {
      prompt: 'select_account', // アカウント選択を促す場合に設定
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Tips: GoogleプロファイルからUserテーブルの追加フィールドにマッピング FYI: https://www.better-auth.com/docs/concepts/oauth#mapprofiletouser
      mapProfileToUser: (profile) => ({
        firstName: profile.given_name,
        lastName: profile.family_name,
      }),
    },
  },

  // Tips: Userテーブルの追加フィールド FYI: https://www.better-auth.com/docs/concepts/typescript#additional-fields
  user: {
    modelName: 'user', // Prismaクライアントのアクセサ名（prisma.user）を指定。DBテーブル名（users）ではない
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
        fieldName: 'firstName',
      },
      lastName: {
        type: 'string',
        required: true,
        fieldName: 'lastName',
      },
    },
  },

  // セッション管理
  session: {
    modelName: 'session',
    expiresIn: 60 * 60 * 24 * 7, // セッションの有効期限（7日間）
    updateAge: 60 * 60 * 24, // セッションの更新間隔（1日ごとに更新）
    cookieCache: {
      enabled: true, // CookieにJWTキャッシュを保存
      maxAge: 60 * 60, // JWTキャッシュの有効期限（60分）
      strategy: 'jwt', // JWT形式で保存
    },
  },

  // 同じメールアドレスで複数の認証方法を許可（メール/パスワード + Google など）
  account: {
    modelName: 'account',
    accountLinking: {
      enabled: true,
    },
  },

  verification: {
    modelName: 'verification', // Prismaクライアントのアクセサ名（prisma.verification）を指定。DBテーブル名（verifications）ではない
  },

  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const roles = await getRolesByUserId(session.userId)
      return {
        user: {
          ...user,
          roles,
        },
        session,
      }
    }),
  ],
})
