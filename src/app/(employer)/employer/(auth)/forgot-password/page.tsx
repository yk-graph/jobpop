import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ForgotPasswordForm } from './forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-4/5 flex-col items-center gap-y-8 sm:max-w-sm">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>

        {/* パスワードリセットフォーム */}
        <ForgotPasswordForm />

        {/* Link */}
        <div className="flex flex-col justify-center -mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/login">Remember your password? Login</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/register">Don&apos;t have an account?</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
