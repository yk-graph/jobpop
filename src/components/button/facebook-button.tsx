'use client';

import { signIn } from 'next-auth/react';
import { FaFacebook } from 'react-icons/fa';

import { IconButton } from '@/components/button';

export function FacebookButton() {
  const handleFacebookLogin = () => {
    signIn('facebook', {
      callbackUrl: '/',
    });
  };

  return (
    <IconButton variant="secondary" icon={FaFacebook} onClick={handleFacebookLogin} className="w-full">
      Continue with Facebook
    </IconButton>
  );
}
