import Link from 'next/link'

import { RegisterForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { RegisterFormProvider } from './register-form-provider'

export default function EmployerAdminRegisterPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <h1 className="text-2xl font-semibold">Employer Register</h1>
        {/* 登録フォーム */}
        <RegisterFormProvider>
          <RegisterForm />
        </RegisterFormProvider>

        {/* ログインボタン */}
        <div className="text-center -mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Already have an account?</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
