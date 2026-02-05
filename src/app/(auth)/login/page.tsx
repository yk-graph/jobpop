import Image from 'next/image'
import Link from 'next/link'

import { GoogleLogin } from '@/components/button'
import { DividerLine } from '@/components/common'
import { MiddleScreenContainer } from '@/components/containers'
import { LoginForm } from '@/components/form'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const hasError = (await searchParams).error
  const hasRedirect = (await searchParams).redirectTo

  let errorMessage: string | null
  switch (hasError) {
    case 'invalid_credentials':
      errorMessage = 'Invalid email or password. Please try again.'
      break
    case 'authentication_required':
      errorMessage = 'You must be logged in to access that page.'
      break
    case 'authentication_required':
      errorMessage = 'You must be logged in to access that page.'
      break
    default:
      errorMessage = null
  }

  return (
    <MiddleScreenContainer>
      <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

      {hasError && (
        <div className="w-full p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      {/* OAuthボタン */}
      <div className="w-full space-y-6">
        <GoogleLogin redirectTo={hasRedirect as string} />
      </div>

      {/* 区切り線 */}
      <DividerLine />

      {/* ログインフォーム */}
      <LoginForm redirectTo={hasRedirect as string} />

      {/* 新規登録ボタン */}
      <div className="text-center -mt-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/register">if you don&apos;t have an account, create one</Link>
        </Button>
      </div>
    </MiddleScreenContainer>
  )
}
