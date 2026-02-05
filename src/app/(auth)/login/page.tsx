import Image from 'next/image'
import Link from 'next/link'

import { GoogleLogin } from '@/components/button'
import { DividerLine } from '@/components/common'
import { FullScreenContainer } from '@/components/containers'
import { LoginForm } from '@/components/form'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const hasError = (await searchParams).error
  const errorMessage =
    hasError === 'token_expired'
      ? 'Your session has expired. Please log in again.'
      : hasError === 'invalid_token'
        ? 'Invalid token. Please log in again.'
        : null

  return (
    <FullScreenContainer>
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

        {hasError && (
          <div className="w-full p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        {/* OAuthボタン */}
        <div className="w-full space-y-6">
          <GoogleLogin />
        </div>

        {/* 区切り線 */}
        <DividerLine />

        {/* ログインフォーム */}
        <LoginForm />

        {/* 新規登録ボタン */}
        <div className="text-center -mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/register">if you don&apos;t have an account, create one</Link>
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  )
}
