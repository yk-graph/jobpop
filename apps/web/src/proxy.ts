import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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

  // 現在のパスをヘッダーに設定（Server Componentで取得可能にする）
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', nextUrl.pathname)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
