import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPathname } from '@/utils'

import { auth } from './auth'

/**
 * 認証済みセッションを取得
 * 未認証の場合はログインページへリダイレクト
 */
export const getRequiredSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    const pathname = await getPathname()
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  return session
}
