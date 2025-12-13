import Link from 'next/link'
import { redirect } from 'next/navigation'

import { activateAccount } from '@/actions/employer'

export default async function EmployerActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  // tokenがない → resend-verification にリダイレクト
  if (!params.token) {
    redirect('/employer/resend-verification')
  }

  // tokenがある - 認証処理を実行
  const result = await activateAccount(params.token)

  // 成功時
  if (result.success) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-6 text-2xl font-bold">Email Verification</h1>
        <div className="text-center">
          <p className="mb-4 text-green-600">{result.message}</p>
          <p className="mb-6 text-sm text-gray-600">You can now sign in to your account.</p>
          <Link
            href="/employer/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // 失敗時 - エラーメッセージを表示
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold">Email Verification</h1>
      <p className="text-red-700">{result.message}</p>
    </div>
  )
}
