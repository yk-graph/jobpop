'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaInstagram } from 'react-icons/fa';
import { toast } from 'sonner';

import { IconButton } from '@/components/button';
import { Spinner } from '@/components/ui/spinner';

export function OAuthButtons() {
  const [isPending, startTransition] = useTransition();

  const handleSocialLogin = async (provider: 'google' | 'instagram') => {
    startTransition(async () => {
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (!result.ok) {
        toast.error('Login Failed', {
          description: 'Please try again or use a different sign-in method.',
          richColors: true,
        });
        return;
      }

      toast.success('Welcome back!', {
        description: 'You have been successfully signed in.',
        richColors: true,
      });
    });
  };

  return (
    <div className="w-full space-y-6">
      <IconButton icon={FaGoogle} onClick={() => handleSocialLogin('google')} loading={isPending}>
        {isPending ? <Spinner /> : 'Continue with Google'}
      </IconButton>

      <IconButton icon={FaInstagram} onClick={() => handleSocialLogin('instagram')} loading={isPending}>
        {isPending ? <Spinner /> : 'Continue with Instagram'}
      </IconButton>
    </div>
  );
}
