'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FaFacebook } from 'react-icons/fa';

import { IconButton } from '@/components/button';

export function FacebookButton() {
  const [isPending, startTransition] = useTransition();

  const handleFacebookLogin = () => {
    startTransition(async () => {
      await signIn('facebook', {
        redirectTo: '/',
      });
    });
  };

  return (
    <IconButton
      variant="secondary"
      icon={FaFacebook}
      onClick={handleFacebookLogin}
      isPending={isPending}
      className="w-full"
    >
      Continue with Facebook
    </IconButton>
  );
}
