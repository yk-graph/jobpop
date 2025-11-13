'use client';

import { useActionState } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { IconButton } from '@/components/button';
import { googleLogin } from '@/actions';

export function GoogleLogin() {
  const [errorMessage, formAction, isPending] = useActionState(googleLogin, null);

  return (
    <form action={formAction}>
      <IconButton variant="secondary" icon={FaGoogle} isPending={isPending} className="w-full">
        {errorMessage ? errorMessage : 'Continue with Google'}
      </IconButton>
    </form>
  );
}
