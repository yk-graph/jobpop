import Link from 'next/link'

import { LoginForm, LoginProvider } from '@/components/form'
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
            <p className="text-green-700 text-center">{`Your email has been successfully verified.\nPlease log in to continue.`}</p>
          )}
        </div>

        {/* ログインフォーム */}
        <LoginProvider>
          <LoginForm />
        </LoginProvider>

        {/* Link */}
        <div className="-mt-4 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/register">Don&apos;t have an account?</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/employer/resend-verification">Resend verification email</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
