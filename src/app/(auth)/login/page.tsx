import Image from 'next/image';
import Link from 'next/link';

import { OAuthButtons } from './_components/oauth-buttons';
import { LoginForm, LoginProvider } from '@/components/form';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <Image src="/images/jobpop-logo.png" alt="Logo" width={200} height={200} />

        {/* OAuthボタン */}
        <OAuthButtons />

        {/* 区切り線 */}
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">or</span>
          </div>
        </div>

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
