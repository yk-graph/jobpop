import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { verifyActivateToken } from '@/utils'

import { ResetPasswordForm } from './reset-password-form'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  // tokenがない → forgot-password にリダイレクト
  if (!params.token) {
    redirect('/employer/forgot-password')
  }

  // tokenを検証（JWT部分のみ）
  const jwtResult = verifyActivateToken(params.token)

  if (!jwtResult.success) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-4/5 flex-col items-center gap-y-8 sm:max-w-sm">
          <h1 className="text-2xl font-semibold">Invalid Token</h1>
          <p className="text-center text-red-700">{jwtResult.error}</p>

          {/* Link */}
          <div className="-mt-4 flex flex-col justify-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/employer/forgot-password">Request new reset link</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/employer/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // トークンが有効な場合、フォームを表示
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-4/5 flex-col items-center gap-y-8 sm:max-w-sm">
        <h1 className="text-2xl font-semibold">Reset Password</h1>

        {/* パスワードリセットフォーム */}
        <ResetPasswordForm token={params.token} email={jwtResult.email} />

        {/* Link */}
        <div className="flex flex-col justify-center -mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/login">Remember your password? Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
