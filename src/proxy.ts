import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const { nextUrl } = request

  const cookies = getSessionCookie(request)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // 未ログイン
  if (!cookies) {
    // 公開ページはそのまま通す
    if (isPublicRoute) {
      return NextResponse.next()
    }
    // それ以外はトップへリダイレクト
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
