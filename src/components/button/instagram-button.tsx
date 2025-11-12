'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FaInstagram } from 'react-icons/fa';
import { toast } from 'sonner';

import { IconButton } from '@/components/button';

export function InstagramButton() {
  const [isPending, startTransition] = useTransition();

  const handleInstagramLogin = async () => {
    console.log('🔵 Instagram login started');

    startTransition(async () => {
      console.log('🔵 Before signIn call');

      const result = await signIn('instagram', {
        callbackUrl: '/',
        redirect: false,
      });

      console.log('🔵 SignIn result:', result);
      console.log('🔵 Result ok:', result?.ok);
      console.log('🔵 Result error:', result?.error);
      console.log('🔵 Result url:', result?.url);

      if (!result?.ok) {
        console.log('❌ Authentication failed');
        toast.error('Authentication Failed', {
          description: 'Please try again or use a different sign-in method.',
          richColors: true,
        });
        return;
      }

      // URLが返されている場合、Instagramへリダイレクト
      if (result?.url) {
        console.log('🔄 Redirecting to Instagram:', result.url);
        window.location.href = result.url;
        return;
      }

      console.log('✅ Authentication successful');
      toast.success('Welcome!', {
        description: 'Instagram authentication successful',
        richColors: true,
      });
    });
  };

  return (
    <IconButton
      variant="secondary"
      icon={FaInstagram}
      loading={isPending}
      className="w-full"
      onClick={handleInstagramLogin}
    >
      Continue with Instagram
    </IconButton>
  );
}
