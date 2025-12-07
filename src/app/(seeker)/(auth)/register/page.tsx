import Image from 'next/image'
import Link from 'next/link'

import { RegisterForm, RegisterProvider } from '@/components/form'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

        {/* 登録フォーム */}
        <RegisterProvider>
          <RegisterForm />
        </RegisterProvider>

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
