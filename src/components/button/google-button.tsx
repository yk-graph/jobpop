'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';

import { IconButton } from '@/components/button';
import { googleAuthenticate } from '@/actions';

export function GoogleButton() {
  const router = useRouter();

  // Tips: useActionState(action *Promise関数, initialState) -> 実行状態 [state, formAction, isPending] の結果を返す
  const [response, formAction, isPending] = useActionState(googleAuthenticate, null);

  useEffect(() => {
    if (response) {
      if (response.success) {
        toast.success(response.message, {
          richColors: true,
        });
        router.push('/');
      } else {
        toast.error(response.message, {
          richColors: true,
        });
      }
    }
  }, [response, router]);

  return (
    <form action={formAction}>
      <IconButton variant="secondary" icon={FaGoogle} loading={isPending} className="w-full">
        Continue with Google
      </IconButton>
    </form>
  );
}
