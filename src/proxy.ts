import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const { nextUrl } = request

  const hasErrorParams = nextUrl.searchParams.get('error')
  // メール認証エラー時は/loginにリダイレクト
  if (hasErrorParams === 'invalid_token') {
    const loginUrl = new URL('/login', request.url) // /loginの完全なURLを生成 | /?error=invalid_token -> /login に変更
    loginUrl.searchParams.set('error', 'invalid_token') // エラー情報をクエリパラメータに付与 | /login?error=invalid_token を生成
    return NextResponse.redirect(loginUrl)
  }

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
