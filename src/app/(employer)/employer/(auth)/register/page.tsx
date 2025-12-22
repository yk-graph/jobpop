import Link from 'next/link'

import { GoogleLogin } from '@/components/button'
import { DividerLine } from '@/components/common'
import { RegisterForm } from '@/components/form'
import { Button } from '@/components/ui/button'

export default function EmployerAdminRegisterPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <h1 className="text-2xl font-semibold">Employer Register</h1>

        {/* OAuthボタン */}
        <div className="w-full space-y-6">
          <GoogleLogin type="employer" />
        </div>

        {/* 区切り線 */}
        <DividerLine />

        {/* 登録フォーム */}
        <RegisterForm />

        {/* Link */}
        <div className="flex flex-col justify-center -mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/login">Already have an account?</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/resend-verification">Resend verification email</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
