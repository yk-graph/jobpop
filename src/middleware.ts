import { NextResponse } from 'next/server'
import NextAuth, { NextAuthRequest } from 'next-auth'

import authConfig from '@/lib/auth.config.edge'

const privateRoute = ['/mypage', '/applications', '/settings']
const authRoute = ['/login', '/register']

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req: NextAuthRequest) {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isPrivateRoute = privateRoute.includes(nextUrl.pathname)
  const isAuthRoute = authRoute.includes(nextUrl.pathname)

  // ログインしているのに認証ページ（/login, /register）にアクセス → ホームにリダイレクト
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ログインしていないのにプライベートルートにアクセス → /loginにリダイレクト
  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
