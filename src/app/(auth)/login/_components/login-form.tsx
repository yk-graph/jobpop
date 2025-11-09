'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaInstagram } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
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
    <div className={className}>
      {/* ソーシャルログイン */}
      <div className="space-y-4 mb-8">
        <Button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full flex items-center gap-3"
          variant="secondary"
        >
          <FaGoogle className="text-neutral-700" />
          Continue with Google
        </Button>

        <Button
          onClick={() => handleSocialLogin('instagram')}
          disabled={isLoading}
          className="w-full flex items-center gap-3"
          variant="secondary"
        >
          <FaInstagram className="text-neutral-700" />
          Continue with Instagram
        </Button>
      </div>
    </div>
  );
}
