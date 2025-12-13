import Link from 'next/link'
import { redirect } from 'next/navigation'

import { activateAccount } from '@/actions'
import { Button } from '@/components/ui/button'

export default async function EmployerActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  // tokenがない → login にリダイレクト
  if (!params.token) {
    redirect('/employer/login')
  }

  // tokenがある - 認証処理を実行
  const result = await activateAccount(params.token)

  // 成功時 → ログインページにリダイレクト
  if (result.success) {
    redirect('/employer/login?verified=true')
  }

  // 失敗時 - エラーメッセージを表示
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-4/5 flex-col items-center gap-y-8 sm:max-w-sm">
        <h1 className="text-2xl font-semibold">Verification Failed</h1>
        <p className="text-center text-red-700">{result.message}</p>

        {/* Link */}
        <div className="-mt-4 flex flex-col justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/login">Login</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/register">Register</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/resend-verification">Resend verification email</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
