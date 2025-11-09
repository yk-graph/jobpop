import Image from 'next/image';
import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center max-w-4/5 sm:max-w-sm w-full">
        <p className="text-4xl font-bold">Welcome</p>
        <Image src="/images/jobpop-logo.png" alt="Logo" width={240} height={240} />
        <LoginForm className="w-full" />
      </div>
    </div>
  );
}
