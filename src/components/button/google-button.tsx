'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

import { IconButton } from '@/components/button';

export function GoogleButton() {
  const handleGoogleLogin = () => {
    signIn('google', {
      redirectTo: '/',
    });
  };

  return (
    <IconButton variant="secondary" icon={FaGoogle} onClick={handleGoogleLogin} className="w-full">
      Continue with Google
    </IconButton>
  );
}
