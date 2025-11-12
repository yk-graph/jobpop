import Image from 'next/image';
import Link from 'next/link';

import { FacebookButton, GoogleButton } from '@/components/button';
import { DividerLine } from '@/components/common';
import { LoginForm, LoginProvider } from '@/components/form';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

        {/* OAuthボタン */}
        <div className="w-full space-y-6">
          <GoogleButton />
          <FacebookButton />
        </div>

        {/* 区切り線 */}
        <DividerLine />

        {/* ログインフォーム */}
        <LoginProvider>
          <LoginForm />
        </LoginProvider>

        {/* 新規登録ボタン */}
        <div className="text-center -mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/register">if you don&apos;t have an account, create one</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
