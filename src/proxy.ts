import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const { nextUrl } = request

  // メール認証エラー時は/loginにリダイレクト（ルートパスの場合のみ）
  const errorParam = nextUrl.searchParams.get('error')
  const authErrors = ['invalid_token', 'token_expired'] // Better Authが返すエラーパラメータ
  if (nextUrl.pathname === '/' && errorParam && authErrors.includes(errorParam)) {
    const loginUrl = new URL('/login', request.url) // /loginの完全なURLを生成 | /?error=invalid_token -> /login に変更
    loginUrl.searchParams.set('error', errorParam) // エラー情報をクエリパラメータに付与 | /login?error=invalid_token もしくは /login?error=token_expired に変更
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
