'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

import { IconButton } from '@/components/button';

export function GoogleButton() {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signIn('google', {
        redirectTo: '/',
      });
    });
  };

  return (
    <IconButton
      variant="secondary"
      icon={FaGoogle}
      onClick={handleGoogleLogin}
      isPending={isPending}
      className="w-full"
    >
      Continue with Google
    </IconButton>
  );
}
