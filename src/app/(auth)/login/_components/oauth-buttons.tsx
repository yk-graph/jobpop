'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaInstagram } from 'react-icons/fa';

import { IconButton } from '@/components/button';

export const OAuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'instagram') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <IconButton icon={FaGoogle} onClick={() => handleSocialLogin('google')} loading={isLoading}>
        Continue with Google
      </IconButton>

      <IconButton icon={FaInstagram} onClick={() => handleSocialLogin('instagram')} loading={isLoading}>
        Continue with Instagram
      </IconButton>
    </div>
  );
};
