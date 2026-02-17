import Image from 'next/image'
import Link from 'next/link'

import { MiddleScreenContainer } from '@/components/containers'
import { RegisterForm } from '@/components/form'
import { Button } from '@jobpop/ui'

export default function RegisterPage() {
  return (
    <MiddleScreenContainer>
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

        {/* 登録フォーム */}
        <RegisterForm />

        {/* ログインボタン */}
        <div className="text-center -mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Already have an account?</Link>
          </Button>
        </div>
      </div>
    </MiddleScreenContainer>
  )
}
