import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ResendForm } from './resend-form'

export default function ResendVerificationPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <h1 className="text-2xl font-semibold">Resend Verification Email</h1>

        {/* 再送信フォーム */}
        <ResendForm />

        {/* Link */}
        <div className="flex flex-col justify-center -mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/login">Already verified?</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/register">Don&apos;t have an account?</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
