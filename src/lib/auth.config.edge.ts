import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

// Edge Runtime対応のため、データベースアクセスを含まない軽量設定
export default {
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
      authorize: () => {
        // middleware用の軽量設定では認証処理は無効化
        // 実際の認証は通常のauth.tsで処理
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
