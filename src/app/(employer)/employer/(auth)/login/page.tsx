import Link from 'next/link'

import { GoogleLogin } from '@/components/button'
import { DividerLine } from '@/components/common'
import { LoginForm } from '@/components/form'
import { Button } from '@/components/ui/button'

export default async function EmployerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-4/5 flex-col items-center gap-y-8 sm:max-w-sm">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-2xl font-semibold">Employer Login</h1>
          {params.verified === 'true' && (
            <p className="text-center text-green-700">{`Your email has been successfully verified.\nPlease log in to continue.`}</p>
          )}
          {params.reset === 'true' && (
            <p className="text-center text-green-700">{`Your password has been reset successfully.\nPlease log in with your new password.`}</p>
          )}
        </div>

        {/* OAuthボタン */}
        <div className="w-full space-y-6">
          <GoogleLogin type="employer" />
        </div>

        {/* 区切り線 */}
        <DividerLine />

        {/* ログインフォーム */}
        <LoginForm type="employer" />

        {/* Link */}
        <div className="flex flex-col justify-center -mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/register">Don&apos;t have an account?</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/forgot-password">Forgot password?</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
